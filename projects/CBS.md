---
layout: project
type: project
image: img/cbs/cover.png
title: "Cybersecurity"
date: Sem 1
published: true
labels:
  - Wireshark
  - Risk Assessment
  - Threat Modelling
summary: "Developed and evaluated a secure dual-network infrastructure consisting of LAN, WLAN, and VPN environments. Conducted security verification of web services, performed packet analysis with Wireshark, assessed network and website risks, and applied threat modelling techniques to recommend effective security controls and mitigations."
---


<p class="lead text-muted mb-4">Below are the key tasks completed as part of this project.</p>

<hr class="mb-5">

<!-- Task 1 -->
<div class="card shadow-sm mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid #0d6efd; padding-left: 12px;">Dual Network Design, Secure Communications and Connection Verification</h4>
    <p style="line-height: 1.9; text-align: justify;">The objective of this task was to design and analyse a secure dual-network infrastructure for Company X. The network design consisted of two separate environments: Network A, which included a Local Area Network (LAN) and Wireless Local Area Network (WLAN) for office-based users, and Network B, which provided remote access through a Virtual Private Network (VPN). The task required the creation of a detailed network diagram with their IP addresses showing communication between computers, smartphones, and the company website.</p>
    <div class="row g-3 mt-2">
      <div class="col-md-6">
        <figure class="text-center mb-0">
          <img width="100%" src="../img/All/Dual network diagram.png" class="img-thumbnail rounded" loading="lazy">
          <figcaption class="text-muted fst-italic mt-1" style="font-size:0.85rem">Dual Network Diagram</figcaption>
        </figure>
      </div>
      <div class="col-md-6">
        <figure class="text-center mb-0">
          <img width="100%" src="../img/All/IP.png" class="img-thumbnail rounded" loading="lazy">
          <figcaption class="text-muted fst-italic mt-1" style="font-size:0.85rem">IP Address</figcaption>
        </figure>
      </div>
    </div>
  </div>
</div>

<!-- Task 2 -->
<div class="card shadow-sm mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid #0d6efd; padding-left: 12px;">Security Verification and Packet Analysis</h4>
    <p style="line-height: 1.9; text-align: justify;">Using the â€œtest-netConnectionâ€ command in windows PowerShell to verify that the website uses port 443 which ensures it is a secure connection. </p>
    <div class="row g-3 mt-2">
      <div class="col-md-12">
        <figure class="text-center mb-0">
          <img width="70%" src="../img/All/Test.png" class="img-thumbnail rounded" loading="lazy">
          <figcaption class="text-muted fst-italic mt-1" style="font-size:0.85rem">Testing Connection</figcaption>
        </figure>
      </div>
    </div>
  </div>
</div>

<!-- Task 3 -->
<div class="card shadow-sm mb-4">
  <div class="card-body p-4">
    <h4 class="mb-3" style="border-left: 4px solid #0d6efd; padding-left: 12px;">Risk Assessment and Threat Modelling</h4>
    <p style="line-height: 1.9; text-align: justify;">Using the Microsoft threat modelling tool, risks were analysed to determine how attackers could exploit the weaknesses in both the website and dual network. The tool identified risks such as spoofing and elevation of privileges. The tool also provided recommended mitigation for these threats. For spoofing, the tool suggestion was to use strong authentication such as certificate validation or HTTPS and for threats such as impersonation MFA was suggested by the tool. For VPN, suggestion was to use strong VPN authentication and modern protocols. Implementing these measures can reduce the likelihood of the risks. </p>
    <div class="row g-3 mt-2">
      <div class="col-md-6">
        <figure class="text-center mb-0">
          <img width="100%" src="../img/All/REM.jpg" class="img-thumbnail rounded" loading="lazy">
          <figcaption class="text-muted fst-italic mt-1" style="font-size:0.85rem">Model for Risk Evaluation</figcaption>
        </figure>
      </div>
      <div class="col-md-6">
        <figure class="text-center mb-0">
          <img width="100%" src="../img/All/Threat list.jpg" class="img-thumbnail rounded" loading="lazy">
          <figcaption class="text-muted fst-italic mt-1" style="font-size:0.85rem">Threat List</figcaption>
        </figure>
      </div>
    </div>
  </div>
</div>
