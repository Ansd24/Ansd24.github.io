---
layout: project
type: project
image: img/sas/cover.png
title: "System Administration and Security"
date: Sem 2
published: true
labels:
  - CentOS
  - Linux 
  - Hardening 
  - Access Control
summary: "Configured and hardened a LAMP stack on CentOS, conducting vulnerability analysis across Apache, MariaDB, and firewall settings, then applying targeted hardening procedures to reduce the attack surface."
---


<p class="lead text-muted mb-4">Below are the key tasks completed as part of this project.</p>

<hr class="mb-5">

<!-- Task 1 -->
<div class="card shadow-sm mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid #0d6efd; padding-left: 12px;">Labs</h4>

    <div class="border-start border-2 ps-3 mb-4">
      <h6 class="fw-semibold mb-1">Web Service Management</h6>
      <p style="line-height: 1.9; text-align: justify;" class="mb-0">Installed and managed Apache on CentOS using Systemd, configuring key settings including DocumentRoot, listening ports, and user/group permissions. Verified successful operation through process inspection and reviewed included configuration files to understand how web services are structured and secured in a Linux environment.</p>
    </div>

    <div class="border-start border-2 ps-3 mb-4">
      <h6 class="fw-semibold mb-1">MariaDB Database Management</h6>
      <p style="line-height: 1.9; text-align: justify;" class="mb-0">Installed and administered a MariaDB server on Linux, managing database services, users, and access privileges. Explored security features including authentication, password hashing, and access control, demonstrating how proper database administration protects sensitive data from unauthorised access.</p>
    </div>

    <div class="border-start border-2 ps-3">
      <h6 class="fw-semibold mb-1">Firewall Management</h6>
      <p style="line-height: 1.9; text-align: justify;" class="mb-0">Studied and configured Linux firewall technologies including iptables and firewalld, implementing zone-based security rules to control inbound and outbound traffic. Applied NAT techniques and stateful firewall configurations, gaining practical experience restricting unauthorised access while maintaining legitimate service availability.</p>
    </div>
  </div>
</div>

<!-- Task 2 -->
<div class="card shadow-sm mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid #0d6efd; padding-left: 12px;">Security Analysis & Hardening Report</h4>
    <p style="line-height: 1.9; text-align: justify;">Conducted a full security assessment of a LAMP server by inspecting Apache configuration files and running Nmap scans to enumerate exposed services and open ports. Identified five key vulnerabilities: Apache worker processes running under root privileges, unrestricted directory access via "Require all granted", directory listing enabled exposing file structure to reconnaissance, service version disclosure revealing exact Apache and PHP versions to potential attackers, and multiple unnecessary open ports including MySQL (3306), SMTP (25), and SSH (22) increasing the attack surface.</p>
    <p style="line-height: 1.9; text-align: justify;">Each vulnerability was documented in a formal risk matrix, rated by likelihood and impact, with Apache running as root and the flat access control both rated Critical due to the potential for full system compromise.</p>
    <p style="line-height: 1.9; text-align: justify;">Hardening measures were then applied directly to the live server: "Require all denied" was enforced in httpd.conf to block unrestricted access, directory listing was disabled by removing the Indexes option, ServerTokens and ServerSignature directives were added to suppress version disclosure, and the MySQL port was removed from the firewall using firewall-cmd. Firewalld zones were reviewed and unnecessary access paths removed, with logging enabled for ongoing traffic monitoring. Each change was verified post-implementation to confirm services remained functional while unauthorised access paths were closed.</p>
  </div>
</div>
