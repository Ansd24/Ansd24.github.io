---
layout: project
title: "Self-Hosted Media & Remote Access Server"
date: 2025
published: true
labels:
  - Docker
  - Jellyfin
  - Tailscale
  - Ubuntu
  - SSH
  - Networking
  - Linux
  - Immich
  - KVM/QEMU
summary: "Repurposed a used Dell OptiPlex 3040 running Ubuntu as a dedicated home server, hosting a private Jellyfin media server in Docker with secure remote access via Tailscale — no ports exposed to the public internet, no subscriptions, no cloud dependency."
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
    <p style="line-height: 1.9;">Repurposed a used Dell OptiPlex 3040 running Ubuntu as a dedicated home server, hosting a private Jellyfin media server in Docker with secure remote access via Tailscale — no ports exposed to the public internet, no subscriptions, no cloud dependency.</p>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">The Build at a Glance</h4>
    <ul style="line-height: 1.9;">
      <li><strong>Hardware:</strong> Dell OptiPlex 3040, Ubuntu 24.04, upgraded to 16GB RAM</li>
      <li><strong>Media Server:</strong> Jellyfin running in a Docker container with persistent volume mounts for config, cache, and media storage</li>
      <li><strong>Remote Access:</strong> Tailscale mesh VPN providing encrypted access from any device via a stable 100.x.x.x address — chosen over port forwarding to keep the server invisible to the public internet</li>
      <li><strong>Management:</strong> Runs headless, managed over SSH. Container defined in a shell script (<code>jellyfin.sh</code>) for repeatable deployment</li>
      <li><strong>Also hosts:</strong> Immich (self-hosted Google Photos alternative) in Docker, and a KVM/QEMU pentest lab on an isolated virtual network — all on the same machine</li>
    </ul>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">What Went Wrong (and What I Learned)</h4>
    <ul style="line-height: 1.9;">
      <li><strong>Pulled the wrong Docker image</strong> (<code>parzServer/jellyfin</code> doesn't exist) — had to find and use the official <code>jellyfin/jellyfin</code> image</li>
      <li><strong>Used the wrong Docker flag syntax</strong> (<code>--type=bind</code> instead of <code>--volume</code>) — spent 30 minutes on a syntax error</li>
      <li><strong>Volume mount paths pointed to <code>/home/jellyfin/</code></strong> instead of <code>/home/a/jellyfin/</code> — paths must match the actual filesystem</li>
      <li><strong>Tried HTTPS locally and got "secure connection failed"</strong> — local access uses HTTP on port 8096</li>
      <li><strong>Movies weren't appearing in the library</strong> — file permissions from the external drive needed fixing with <code>chown</code></li>
      <li><strong>IP kept changing when switching between Ethernet and Wi-Fi</strong> — fixed with a DHCP reservation on the router</li>
      <li><strong>SCP file transfers failing silently</strong> — filenames with spaces need quoting, and there's no space after the colon in the destination path</li>
    </ul>
  </div>
</div>

<div class="card project-card mb-4 key-decision-callout" style="border: 1px solid var(--cine-accent); background: linear-gradient(135deg, var(--cine-accent-glow), rgba(170, 120, 255, 0.04)), #1e1e1e; opacity: 1 !important; visibility: visible !important;">
  <div class="card-body p-4" style="opacity: 1 !important; visibility: visible !important;">
    <p class="mb-2 kd-label" style="font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #a9c7ff !important; opacity: 1 !important; visibility: visible !important;">Key Decision</p>
    <h4 class="mb-3" style="color: #ffffff !important; opacity: 1 !important; visibility: visible !important;">Tailscale Over Port Forwarding</h4>
    <p style="line-height: 1.9; color: #ececf0 !important; opacity: 1 !important; visibility: visible !important;">Port forwarding would have exposed the Jellyfin login page to the entire internet — visible to any port scanner, vulnerable to brute force, and requiring ongoing maintenance (firewall rules, dynamic DNS, SSL certificates). Tailscale creates a WireGuard-encrypted mesh network where only my signed-in devices can see the server. No ports opened, no public exposure, no attack surface. For someone studying cybersecurity, building the convenient but insecure version would have been the wrong call.</p>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4 text-center">
    <p class="mb-2" style="line-height: 1.9;">I wrote a detailed step-by-step guide covering every command and every mistake.</p>
    <a href="https://medium.com/@ayaansayyad05/i-built-my-own-private-netflix-on-a-used-office-pc-heres-every-step-and-every-mistake-97546faa2c8f" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light">Read the Full Writeup on Medium &rarr;</a>
  </div>
</div>

<div class="card project-card mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid var(--cine-accent); padding-left: 12px;">Screenshots</h4>
    <div class="row g-3">
      <div class="col-md-6">
        <img src="{{ '/img/projects/docker-ps.png' | prepend: site.baseurl }}" alt="Terminal output of docker ps showing the running Jellyfin and Immich containers" class="img-fluid" style="border: 1px solid var(--bs-border-color); border-radius: 0.5rem;">
        <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">Terminal output of <code>docker ps</code> showing the running Jellyfin and Immich containers</p>
      </div>
      <div class="col-md-6">
        <img src="{{ '/img/projects/jellyfin-dashboard.png' | prepend: site.baseurl }}" alt="Jellyfin dashboard / media library view" class="img-fluid" style="border: 1px solid var(--bs-border-color); border-radius: 0.5rem;">
        <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">Jellyfin dashboard / media library view</p>
      </div>
      <div class="col-md-6">
        <img src="{{ '/img/projects/tailscale-device-list.png' | prepend: site.baseurl }}" alt="Tailscale device list showing the OptiPlex connected via its 100.x.x.x address" class="img-fluid" style="border: 1px solid var(--bs-border-color); border-radius: 0.5rem;">
        <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">Tailscale device list showing the OptiPlex connected via its 100.x.x.x address</p>
      </div>
      <div class="col-md-6">
        <img src="{{ '/img/projects/htop-ssh-session.png' | prepend: site.baseurl }}" alt="htop running over an SSH session into the OptiPlex" class="img-fluid" style="border: 1px solid var(--bs-border-color); border-radius: 0.5rem;">
        <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">htop running over an SSH session into the OptiPlex</p>
      </div>
    </div>
  </div>
</div>
