---
layout: project
title: "Python Syslog Spoofer"
date: 2025
published: true
labels:
  - Python
  - Syslog
  - Wazuh
  - MITRE ATT&CK
  - Networking
  - Detection Engineering
summary: "A Python tool that generates RFC 3164 syslog traffic mimicking real attacks across a fleet of simulated endpoints, mapped to MITRE ATT&CK techniques, so detection rules in a SIEM can be tested and measured against known ground truth."
---

<p class="mb-4"><a href="{{ site.baseurl }}/#homelab" class="btn btn-outline-light btn-sm">&larr; Back to Projects &amp; Home Lab</a></p>

<div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
  <p class="lead mb-0">{{ page.summary }}</p>
  <span class="status-badge status-completed">Completed</span>
</div>

<p class="badge-stagger mb-4">
  {% for label in page.labels %}
  <span style="background-color: var(--tf-pill-bg)" class="badge rounded-pill">{{ label }}</span>
  {% endfor %}
</p>

<hr class="mb-4">

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">Overview</h4>
    <p style="line-height: 1.9;">Testing a SIEM needs log data that looks like an attack and is labelled as one. Waiting for real attackers is not an option in a lab. I wrote a Python script that sends spoofed syslog messages over UDP to a Wazuh manager, simulating 12 endpoints (domain controller, file server, web and database hosts, workstations, a jump host) under attack. Every message is recorded in a ground-truth CSV with the technique that produced it, so the SIEM's output can be scored afterwards.</p>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">The Tool at a Glance</h4>
    <ul style="line-height: 1.9;">
      <li><strong>Protocol:</strong> RFC 3164 syslog (<code>&lt;PRI&gt;TIMESTAMP HOSTNAME TAG: CONTENT</code>) sent over UDP to port 514, using only the Python standard library</li>
      <li><strong>Simulated fleet:</strong> 12 named hosts with fixed IPs on a lab subnet, plus a pool of external attacker IPs and a list of common usernames</li>
      <li><strong>Techniques covered:</strong>
        <ul>
          <li><strong>T1110</strong> Brute Force: bursts of failed SSH logins from one source IP</li>
          <li><strong>T1078</strong> Valid Accounts: suspicious <code>sudo</code> use such as reading <code>/etc/shadow</code> or adding a user</li>
          <li><strong>T1046</strong> Network Service Discovery: one netfilter-style line per probed port</li>
          <li><strong>T1059</strong> Command and Scripting Interpreter: PowerShell, bash and Python one-liners in process-creation events</li>
          <li><strong>T1021</strong> Remote Services: lateral movement over RDP, SMB, WinRM and SSH between hosts</li>
        </ul>
      </li>
      <li><strong>Two run modes:</strong> a continuous stream with a configurable interval and count, and a balanced <code>--experiment</code> mode that runs N shuffled instances of each technique with a gap between them</li>
      <li><strong>Ground truth:</strong> every sent line goes into a CSV with timestamp, technique, host, tag, message and a unique event ID</li>
    </ul>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">Making the Logs Realistic</h4>
    <ul style="line-height: 1.9;">
      <li><strong>Brute force has to match the rule chain.</strong> Wazuh's SSH brute-force alert (rule 5712) only counts events that first matched rule 5710, which needs the literal text <code>invalid user</code>. It then needs 8 failures from the same source IP within 120 seconds. The generator uses the exact OpenSSH wording, puts the PID in the syslog tag where real <code>sshd</code> puts it, and sends 12 failures per burst from one pinned IP so the threshold is cleared.</li>
      <li><strong>A port scan is never labelled as one.</strong> A real kernel logs each packet separately and never writes "scan detected". The generator emits one raw iptables-style line per port (<code>SRC</code>, <code>DST</code>, <code>DPT</code>, <code>SYN</code> and so on), and the SIEM has to infer the scan from the volume and spread of lines.</li>
      <li><strong>Bursts are sent tightly, attacks are spaced out.</strong> Packets inside one attack go out 0.15 seconds apart so they fall inside the correlation window. The longer gap comes between attacks, never inside one.</li>
      <li><strong>Timestamps follow RFC 3164.</strong> Single-digit days are space-padded rather than zero-padded.</li>
    </ul>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">Designing the Experiment Mode</h4>
    <ul style="line-height: 1.9;">
      <li><strong>Shuffled order.</strong> If every brute force ran first and every port scan last, any drift in the SIEM or model over the run would be confused with the effect of the technique. Shuffling the schedule removes that order effect, and an optional <code>--seed</code> makes a run reproducible.</li>
      <li><strong>A fresh attacker IP per brute-force burst.</strong> With a short gap, reusing one IP lets Wazuh merge two bursts inside its 120 second window. The script never reuses the previous burst's IP unless <code>--pin-t1110-ip</code> is set.</li>
      <li><strong>An opaque event ID on every line.</strong> A short hex <code>msgid</code> is appended to each message and recorded in the ground-truth CSV. It carries no information about the technique, and it gives an exact join key for matching scored alerts back to what was sent, instead of fuzzy string comparison.</li>
    </ul>
  </div>
</div>

<div class="card project-card mb-4 key-decision-callout" style="border: 1px solid var(--cine-accent); background: linear-gradient(135deg, var(--cine-accent-glow), rgba(170, 120, 255, 0.04)), #1e1e1e; opacity: 1 !important; visibility: visible !important;">
  <div class="card-body p-4" style="opacity: 1 !important; visibility: visible !important;">
    <p class="mb-2 kd-label" style="font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #a9c7ff !important; opacity: 1 !important; visibility: visible !important;">Key Decision</p>
    <h4 class="mb-3" style="color: #ffffff !important; opacity: 1 !important; visibility: visible !important;">No Hints in the Logs</h4>
    <p style="line-height: 1.9; color: #ececf0 !important; opacity: 1 !important; visibility: visible !important;">It would have been easy to write messages like "port scan detected" and watch the SIEM catch them. That would only test string matching. Each generator instead produces what the real system would log, with no narration, so a detection only counts if the SIEM works it out from the data. The ground-truth CSV then lets me score hits and misses honestly.</p>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4 text-center">
    <p class="mb-2" style="line-height: 1.9;">The full source is on GitHub.</p>
    <a href="https://github.com/Ansd24/Python/blob/main/syslog_spoofer.py" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light">View the Code on GitHub &rarr;</a>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">Example Usage</h4>
<pre style="background:#111; padding:1rem; border-radius:0.5rem; overflow-x:auto;"><code># continuous stream, one message every 2 seconds
python3 syslog_spoofer.py --ip 192.168.64.129

# only brute force and port scans, 100 messages
python3 syslog_spoofer.py --techniques T1110 T1046 --count 100

# balanced, shuffled, reproducible experiment: 30 attacks per technique
python3 syslog_spoofer.py --experiment --per-technique 30 --gap 15 --seed 42</code></pre>
  </div>
</div>
