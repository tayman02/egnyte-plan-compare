import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

// ─── TYPES: true = included, "optional" = paid add-on, "addon-included" = add-on bundled in plan, false/undefined = not available

const FEATURE_SECTIONS = [
  {
    id: "core",
    label: "Core Platform",
    color: "#037BBD",
    features: [
      { id: "encryption",       label: "Encryption at Rest and in Transit",            desc: "All files are encrypted using AES-256 while stored and TLS 1.2+ while in transit, keeping data secure at every point.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/218025867-Enterprise-Key-Management" },
      { id: "storage_per_user", label: "Storage Per Power User",                       desc: "The amount of cloud storage allocated per licensed power user on the account." },
      { id: "upload_limit",     label: "Upload File Size Limit",                       desc: "The maximum file size that can be uploaded to Egnyte in a single transfer." },
      { id: "domains",          label: "Account Domains",                              desc: "The number of Egnyte domain URLs included — useful for separating departments or subsidiaries." },
      { id: "max_users",        label: "Maximum Number of Users",                      desc: "The total number of licensed power users that can be active on the account." },
      { id: "sso",              label: "User Authentication (AD and SSO/SAML)",        desc: "Connect Egnyte to your identity provider (Okta, Azure AD, etc.) so users log in with their existing corporate credentials.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638364-Active-Directory-LDAP-Integration" },
      { id: "mfa",              label: "Multi-Factor Authentication",                  desc: "Require a second verification step at login to protect accounts from unauthorized access.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638344-Two-Factor-Authentication" },
      { id: "external_collab",  label: "External Collaborators",                       desc: "Invite people outside your organization to view or edit specific files and folders without a full license.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637744-Inviting-External-Users" },
      { id: "granular_perms",   label: "Granular Permissions",                         desc: "Set folder-level access controls (View, Edit, Full) for individual users or groups with full inheritance control.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637824-Setting-Folder-Permissions" },
      { id: "compliant_storage",label: "Compliant Storage (HIPAA, FINRA, SOC2, ISO 27001)", desc: "Storage infrastructure certified for major regulatory frameworks, with audit trails and controls required for compliance.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638124-Compliance-Overview" },
      { id: "audit",            label: "File & Login Auditing",                        desc: "Full logs of who accessed, modified, shared, or downloaded every file — searchable and exportable for audits.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637534-File-Audit-Report" },
      { id: "edge_caching",     label: "Edge Caching / Hybrid Caching",                desc: "A local cache appliance that accelerates file access for on-site users while keeping cloud as the source of truth.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000286631-Smart-Cache-Overview" },
      { id: "role_admin",       label: "Role-Based Administration",                    desc: "Assign admin privileges by role (Power User, Standard User, Admin) to delegate management without giving full control.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638124-Compliance-Overview" },
      { id: "device_controls",  label: "Device Controls for Mobile & Desktop",         desc: "Enforce policies on mobile and desktop apps — remote wipe, PIN lock, and restrict downloads on unmanaged devices.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638354-Mobile-Device-Management" },
      { id: "data_residency",   label: "Data Residency Options",                       desc: "Choose which cloud region (US, EU, etc.) stores your data to meet local data sovereignty laws.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/17391112602637-Customize-Your-Cloud-Storage-on-Egnyte" },
      { id: "encryption_keys",  label: "Encryption Key Management",                    desc: "Retain and manage your own encryption keys using AWS KMS or Azure Key Vault instead of Egnyte-managed keys.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/218025867-Enterprise-Key-Management" },
      { id: "link_throttling",  label: "Link Throttling Removal",                      desc: "Remove bandwidth limits on shared links, allowing recipients to download large files at full speed." },
      { id: "migration_tools",  label: "Migration Tools",                              desc: "Built-in tools to migrate content from file servers, SharePoint, Box, Dropbox, and other sources into Egnyte.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360001819831-Egnyte-Migration-App-Overview" },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence & Search",
    color: "#0BC5BA",
    features: [
      { id: "single_doc_qa",         label: "Single Document / Image Summary & Q&A",              desc: "Ask questions about or get a summary of any single file — works on PDFs, Word docs, images, and more.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/16949145831949-AI-Driven-Document-Summarization-Document-Q-A" },
      { id: "copilot",               label: "AI Assistant (Multi-Doc Q&A, Knowledge Bases, Content Generation)", desc: "Chat with multiple files at once, build searchable knowledge bases, and generate content like emails and summaries.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/28274380320397-Copilot-Overview" },
      { id: "ai_search",             label: "AI Search (Natural Language + AI-Generated Summary)", desc: "Search using plain English questions and get an AI-generated answer alongside the matching files.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/28274380320397-Copilot-Overview" },
      { id: "ai_workflows",          label: "AI Workflows (AI-Triggered & AI-Step Workflows)",    desc: "Trigger workflows automatically based on AI-detected metadata, or use AI as a step to classify or extract data.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18313846897549-Workflow-Templates-Overview" },
      { id: "text_search",           label: "Full-Text Search",                                   desc: "Search inside the content of all stored files, including documents, spreadsheets, and presentations.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637624-Searching-in-Egnyte" },
      { id: "ocr_search",            label: "OCR (Optical Character Recognition)",                desc: "Automatically extract and index text from scanned documents and images so they become fully searchable.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31323136131597-AI-Driven-Metadata-Tags-Trainable-Classifiers" },
      { id: "ai_classification",     label: "Document Type Classification",                       desc: "Automatically identify document types (contracts, invoices, resumes, etc.) using AI and apply tags accordingly.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31323136131597-AI-Driven-Metadata-Tags-Trainable-Classifiers" },
      { id: "trainable_classifiers", label: "Trainable Classifiers",                              desc: "Train a custom AI model on your own document samples so it can recognize and tag your organization's unique file types.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31323136131597-AI-Driven-Metadata-Tags-Trainable-Classifiers" },
    ],
  },
  {
    id: "collaboration",
    label: "Collaboration",
    color: "#6E49FF",
    features: [
      { id: "comments_tasks",    label: "Comments and Tasks",                           desc: "Leave inline comments on files and assign tasks with due dates — keeping feedback and action items in one place.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637764-Comments-and-Notes" },
      { id: "file_locking",      label: "Global File Locking",                          desc: "Lock a file while editing so no one else can modify it simultaneously — prevents version conflicts across all devices.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637884-File-Locking" },
      { id: "metadata",          label: "Metadata",                                     desc: "Add custom metadata fields to files and folders for better organization, search filtering, and workflow automation.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638074-Custom-Metadata" },
      { id: "desktop_apps",      label: "Desktop Apps (Mac and PC)",                    desc: "Native Mac and Windows apps that sync files locally and integrate directly with Office and other desktop applications.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638044-Desktop-App-Overview" },
      { id: "mobile_apps",       label: "Mobile Apps (iOS and Android)",                desc: "Full-featured iOS and Android apps for accessing, sharing, and editing files securely from any mobile device.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638054-Mobile-App-Overview" },
      { id: "external_accounts", label: "External User Accounts",                       desc: "Give external collaborators a limited Egnyte account with controlled access to specific folders.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637744-Inviting-External-Users" },
      { id: "link_sharing",      label: "Link Sharing / Password-Protected Links",      desc: "Share files via secure links — set passwords, expiration dates, and download restrictions for each link.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637714-Sharing-Files-and-Folders" },
      { id: "viewer_permission", label: '"Read-Only" Viewer Permission',                desc: "A permission level that allows users to view files in the browser but prevents downloading, editing, or forwarding.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/9302129964429-Viewer-Only-Permission" },
      { id: "email_sharing",     label: "Email-Validated Sharing",                      desc: "Restrict access to a shared link so only specific email addresses can open it — even if the link is forwarded." },
      { id: "pdf_handler",       label: "PDF Markup (Edit, Annotate, Compare, Redact)", desc: "Annotate, highlight, redact, and compare PDF files directly in the browser without downloading them.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/28618583088013-PDF-File-Handler-Add-On" },
      { id: "esignature",        label: "e-Signature",                                  desc: "Send documents for legally binding electronic signatures directly from Egnyte — no third-party tool needed.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/24075263159821-Egnyte-Sign-Overview-and-Administration" },
      { id: "watermarking",      label: "Dynamic Watermarking",                         desc: "Automatically stamp sensitive documents with the viewer's name or email when opened, deterring unauthorized sharing.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360056705352-Watermarking" },
      { id: "content_safeguards",label: "Content Safeguards",                           desc: "Policy-based controls that restrict how content can be shared, downloaded, or accessed based on sensitivity rules.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360056705352-Watermarking" },
      { id: "standard_workflows",label: "Standard Workflows",                           desc: "Simple ad hoc approval workflows to route documents to reviewers and capture sign-off in an auditable trail.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18313846897549-Workflow-Templates-Overview" },
      { id: "advanced_workflows",label: "Advanced (Multi-Step) Workflows",              desc: "Multi-step, template-based workflows with conditional logic, AI steps, automated actions, and webhook integrations.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18313846897549-Workflow-Templates-Overview" },
      { id: "advanced_video",    label: "Advanced Video Playback",                      desc: "Play back a broader range of video formats up to 2GB directly in the browser without downloading." },
      { id: "file_versioning",   label: "File Versioning",                              desc: "Automatically retain previous versions of every file so you can view history or restore an earlier version at any time.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637904-File-Versioning" },
      { id: "advanced_snapshot", label: "Snapshot & Recovery (30-day)",                 desc: "Create point-in-time snapshots of all data so you can identify and recover from ransomware or accidental deletions within 30 days.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/4417226750605-Ransomware-Recovery-Using-Egnyte-Secure-Govern" },
      { id: "snapshot_90",       label: "Advanced Snapshot & Recovery (90-day)",        desc: "Extended 90-day snapshot retention for deeper recovery windows — critical for regulated industries with longer incident timelines.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/4417226750605-Ransomware-Recovery-Using-Egnyte-Secure-Govern" },
    ],
  },
  {
    id: "governance",
    label: "Governance & Security",
    color: "#3D71EA",
    features: [
      { id: "lifecycle_reports",     label: "Content Lifecycle Analytics & Reports",              desc: "Dashboards showing how content is aging, accessed, and distributed — helping identify stale or at-risk files.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360034403532-Content-Lifecycle-Policies" },
      { id: "lifecycle_policies",    label: "Content Lifecycle (Retain, Archive, Delete) Policies", desc: "Automate retention schedules, archival, and deletion of content based on age, type, or custom rules.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360034403532-Content-Lifecycle-Policies" },
      { id: "unified_perms",         label: "Unified Permissions Viewer",                         desc: "A single view showing exactly who has access to what across the entire file system — simplifies access reviews.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360027511552-Issue-Types-and-Remediation" },
      { id: "suspicious_login",      label: "Suspicious Login Issue Detection",                   desc: "Detects anomalous login patterns (unusual location, time, or frequency) that may indicate a compromised account.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/7299778344077-Customizing-Suspicious-Login-Detections" },
      { id: "sharing_issues",        label: "Public Link / Open Access / Permission Issue Detection", desc: "Flags files that are publicly shared, over-permissioned, or exposed outside expected access boundaries.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360027511552-Issue-Types-and-Remediation" },
      { id: "unusual_access",        label: "Unusual Access Detection",                           desc: "Uses behavioral baselines to detect when a user is accessing far more files than normal — an early ransomware signal.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000723192-Analysis-Rules-Overview" },
      { id: "inactive_user",         label: "Inactive User Detection",                            desc: "Identifies licensed users who haven't logged in recently, helping clean up stale accounts and reduce risk.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000723192-Analysis-Rules-Overview" },
      { id: "malformed_perms",       label: "Malformed Permissions Detection",                    desc: "Catches broken or misconfigured permission inheritance that could inadvertently expose sensitive content.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000723192-Analysis-Rules-Overview" },
      { id: "ransomware_artifact",   label: "Probable Ransomware Detection (Artifact-Based)",    desc: "Monitors for known ransomware file extensions, encrypted file patterns, and ransom note indicators.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360059480351-Ransomware-FAQs" },
      { id: "ransomware_behavioral", label: "Probable Ransomware Detection (Behavioral-Based)",  desc: "Uses machine learning to detect ransomware by recognizing suspicious behavioral patterns before known signatures appear.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360057085752-Analysis-Rules-FAQs" },
      { id: "sensitive_data",        label: "Sensitive Data Discovery & Classification",          desc: "Scans all content automatically to find PII, financial data, PHI, and other sensitive data — then classifies and monitors it continuously.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000099332-Egnyte-Secure-Govern-Overview" },
      { id: "doc_labeling",          label: "Document Labeling",                                  desc: "Apply persistent sensitivity labels (e.g. Microsoft Purview labels) to documents for downstream DLP enforcement.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/32356780428045-Microsoft-Purview-and-Egnyte-Integration" },
      { id: "compliance_monitoring", label: "Privacy & Compliance Monitoring",                    desc: "Continuous monitoring against compliance frameworks (GDPR, HIPAA, CCPA) with dashboards showing exposure and risk.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000099332-Egnyte-Secure-Govern-Overview" },
      { id: "sensitive_mgmt",        label: "Sensitive Data Management & Reviews",                desc: "Workflow tools to assign owners, trigger reviews, and track the remediation of sensitive data findings.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000099332-Egnyte-Secure-Govern-Overview" },
      { id: "api_remediation",       label: "Manual & API-Based Remediation",                     desc: "Manually fix flagged issues through the UI or automate remediation at scale using the Egnyte API.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/13601376018829-Issue-Remediation-Best-Practices" },
      { id: "auto_remediation",      label: "Auto Issue Remediation & Delegation",                desc: "Automatically fix governance issues (revoke links, quarantine files) based on policy rules without manual intervention.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/23281081807245-Overview-Secure-Govern-Issue-Auto-Remediation" },
      { id: "legal_hold",            label: "Legal Hold",                                         desc: "Preserve specific content from deletion or modification during litigation or regulatory investigation.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360034403532-Content-Lifecycle-Policies" },
      { id: "rot_data",              label: "Redundant, Obsolete, and Trivial (ROT) Data Management", desc: "Identify and clean up duplicate, outdated, or unnecessary files to reduce storage costs and compliance risk.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360027511552-Issue-Types-and-Remediation" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations & API",
    color: "#00539A",
    features: [
      { id: "google_workspace", label: "Google Workspace Integration & Co-Editing",    desc: "Real-time co-editing of Google Docs, Sheets, and Slides stored in Egnyte — no need to sync to Google Drive.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638164-Google-Apps-Integration" },
      { id: "m365",             label: "M365 / MS Copilot & Co-Editing (Online & Desktop)", desc: "Co-edit Word, Excel, and PowerPoint files in real time using both the browser and desktop Office apps.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638174-Microsoft-Office-Integration" },
      { id: "dlp",              label: "DLP / Preventative Control Integrations",      desc: "Connect Egnyte to DLP tools like Microsoft Purview to enforce data loss prevention policies on labeled content.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/32356780428045-Microsoft-Purview-and-Egnyte-Integration" },
      { id: "app_integrations", label: "150+ Industry Application Integrations",       desc: "Pre-built connectors for Procore, Salesforce, Autodesk, Adobe, Bentley, Esri, and 150+ other industry applications.", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638984-Third-Party-Apps-That-Can-Be-Used-With-Egnyte" },
    ],
  },
  {
    id: "addons",
    label: "Optional Add-Ons",
    color: "#FFCA29",
    isAddons: true,
    features: [
      {
        id: "salesforce_integration",
        label: "Salesforce Integration",
        price: 6.00,
        mspPrice: 6.00,
        priceNote: "per user/mo · 1:1 with platform licenses",
        desc: "Embed Egnyte directly inside Salesforce so sales teams can access, upload, and share account files from within Leads, Opportunities, Contacts, and Cases. Files stay in Egnyte with full audit trails and permissions — no duplicate storage in Salesforce. Requires Salesforce Enterprise or Unlimited edition.",
        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638874-Egnyte-for-Salesforce",
      },
      {
        id: "specialized_file_handler",
        label: "Specialized File Handler (AEC)",
        price: 6.00,
        mspPrice: 4.80,
        priceNote: "per user/mo · 1:1 with platform licenses",
        desc: "Preview, annotate, and collaborate on AEC-specific file formats — CAD (.dwg, .dgn, .dxf), BIM (.rvt, .ifc, .nwd, .dwf), and 3D models (.stl, .stp, .obj) — directly in the browser without specialized software. Designed for architects, engineers, VDC teams, and field crews working with large design files.",
        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18744343055629-Specialized-File-Handler-Add-On",
      },
      {
        id: "project_hub",
        label: "Project Hub (AEC)",
        price: 6.00,
        mspPrice: 4.80,
        priceNote: "per user/mo · 1:1 with platform licenses",
        desc: "AI-powered project data infrastructure for AEC firms. Standardize project folder structures with templates, automate project setup and closeout, sync with Procore, Autodesk Construction Cloud, Newforma, and Bluebeam, and manage the full project lifecycle from kickoff through archival — all from a centralized Project Center.",
        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18743554145165-Project-Hub",
      },
      {
        id: "snapshot_addon",
        label: "Advanced Snapshot & Recovery (90-day)",
        price: 10.00,
        mspPrice: 8.00,
        priceNote: "per user/mo · 1:1 with platform licenses",
        desc: "Extends ransomware snapshot retention from 30 to 90 days. Point-in-time snapshots are captured automatically and can be mounted and browsed within 15–30 minutes. Admins can restore individual files or entire folder structures to a pre-attack state without involving IT support. Critical for cyber insurance requirements.",
        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/4416718848397-Snapshot-Based-Ransomware-Recovery",
      },
      {
        id: "doc_portal",
        label: "Document Portal",
        price: 10.00,
        mspPrice: 8.00,
        priceNote: "per user/mo · 1:1 with platform licenses",
        desc: "A branded, secure client-facing portal for requesting, collecting, and sharing sensitive documents. Ideal for financial services onboarding, legal due diligence, and healthcare intake. Clients can upload documents through a controlled interface without needing an Egnyte account, with full audit trails on every interaction.",
        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31085359026701-Document-Portal-Overview-and-using-Document-Portal",
      },
    ],
  },
];

// ─── PLAN DATA ────────────────────────────────────────────────────────────────

const PLANS = [
  // ── LEGACY ──
  {
    id: "legacy_office",
    name: "Legacy Office",
    family: "Legacy",
    gen: "Gen 1–2",
    summary: "Basic cloud file sharing with essential collaboration. No governance or advanced security.",
    pricing: { msrp: 8, msp: null },
    features: {
      encryption: true, storage_per_user: "Up to 200 GB", upload_limit: "10 GB", domains: "1",
      mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      single_doc_qa: true, text_search: true,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, standard_workflows: true,
      file_versioning: true,
    },
  },
  {
    id: "legacy_business",
    name: "Legacy Business",
    family: "Legacy",
    gen: "Gen 1–2",
    summary: "Small business collaboration with secure file sharing, basic administration and access governance.",
    pricing: { msrp: 15, msp: null },
    features: {
      encryption: true, storage_per_user: "Up to 200 GB", upload_limit: "10 GB", domains: "1",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, migration_tools: true,
      single_doc_qa: true, text_search: true,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, standard_workflows: true,
      file_versioning: true,
      google_workspace: true, m365: true, app_integrations: true,
    },
  },
  {
    id: "legacy_enterprise",
    name: "Legacy Enterprise",
    family: "Legacy",
    gen: "Gen 1–2",
    summary: "Medium business data governance with advanced compliance and threat management foundations.",
    pricing: { msrp: 30, msp: null },
    features: {
      encryption: true, storage_per_user: "Up to 200 GB", upload_limit: "10 GB", domains: "1",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true, migration_tools: true,
      suspicious_login: true,
      single_doc_qa: true, text_search: true, ocr_search: true, ai_classification: true,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, watermarking: true, content_safeguards: true,
      standard_workflows: true, advanced_workflows: true, file_versioning: true,
      lifecycle_reports: true, lifecycle_policies: true, unified_perms: true,
      sharing_issues: true, unusual_access: true, inactive_user: true, malformed_perms: true,
      ransomware_artifact: true, ransomware_behavioral: true, sensitive_data: true,
      doc_labeling: true, compliance_monitoring: true, sensitive_mgmt: true, api_remediation: true,
      legal_hold: true, rot_data: true,
      google_workspace: true, m365: true, app_integrations: true,
      pdf_handler: "optional", auto_remediation: "addon-included", copilot: "optional",
      project_hub: "optional", doc_portal: "optional",
      salesforce_integration: false, specialized_file_handler: false, snapshot_addon: false,
    },
  },
  // ── GEN 3 MSP ──
  {
    id: "cfs",
    name: "CFS",
    family: "Gen 3 MSP",
    gen: "Gen 3",
    summary: "Effective and secure collaboration to get your team up and running quickly and easily.",
    pricing: { msrp: 12, msp: 10 },
    features: {
      encryption: true, storage_per_user: "200 GB", upload_limit: "100 GB", domains: "1",
      mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      single_doc_qa: true, copilot: false, ai_search: false, ai_workflows: false,
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, standard_workflows: true,
      pdf_handler: false, esignature: false, advanced_video: false,
      file_versioning: true, advanced_snapshot: false, snapshot_90: false,
      google_workspace: true, m365: true, app_integrations: true,
    },
  },
  {
    id: "afs",
    name: "AFS",
    family: "Gen 3 MSP",
    gen: "Gen 3",
    summary: "Small business collaboration with secure file sharing, basic administration and access governance.",
    pricing: { msrp: 23, msp: 18 },
    features: {
      encryption: true, storage_per_user: "200 GB", upload_limit: "100 GB", domains: "1",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, link_throttling: "optional", migration_tools: true,
      single_doc_qa: true, copilot: "optional", ai_search: "optional", ai_workflows: false,
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, standard_workflows: true,
      pdf_handler: "optional", esignature: true, advanced_video: false,
      file_versioning: true, advanced_snapshot: "optional", snapshot_90: false,
      google_workspace: true, m365: true, app_integrations: true,
      project_hub: "optional", doc_portal: "optional",
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: "optional",
    },
  },
  {
    id: "enterprise_lite",
    name: "Enterprise Lite",
    family: "Gen 3 MSP",
    gen: "Gen 3",
    summary: "Organization-wide content collaboration with built-in access controls, lifecycle management and reporting.",
    pricing: { msrp: 35, msp: 28 },
    features: {
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB", domains: "1 Primary / 5 Secondary",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, link_throttling: true, migration_tools: true,
      single_doc_qa: true, copilot: "optional", ai_search: "optional", ai_workflows: false,
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, pdf_handler: "optional", esignature: true, advanced_video: true,
      watermarking: false, content_safeguards: false,
      standard_workflows: true, advanced_workflows: true,
      file_versioning: true, advanced_snapshot: "optional", snapshot_90: false,
      lifecycle_reports: true, lifecycle_policies: true, unified_perms: true,
      suspicious_login: true, sharing_issues: true, unusual_access: true,
      inactive_user: true, malformed_perms: true, ransomware_artifact: true,
      api_remediation: true, auto_remediation: "optional",
      google_workspace: true, m365: true, app_integrations: true,
      project_hub: "optional", doc_portal: "optional",
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: "optional",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    family: "Gen 3 MSP",
    gen: "Gen 3",
    summary: "Advanced data governance, including sensitive data discovery and classification, advanced compliance and threat management.",
    pricing: { msrp: 60, msp: 48 },
    features: {
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB", domains: "1 Primary / 5 Secondary",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, encryption_keys: true, link_throttling: true, migration_tools: true,
      single_doc_qa: true, copilot: "optional", ai_search: "optional", ai_workflows: false,
      text_search: true, ocr_search: true, ai_classification: true, trainable_classifiers: false,
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, pdf_handler: "optional", esignature: true, advanced_video: true,
      watermarking: true, content_safeguards: true,
      standard_workflows: true, advanced_workflows: true,
      file_versioning: true, advanced_snapshot: true, snapshot_90: false,
      lifecycle_reports: true, lifecycle_policies: true, unified_perms: true,
      suspicious_login: true, sharing_issues: true, unusual_access: true,
      inactive_user: true, malformed_perms: true, ransomware_artifact: true,
      ransomware_behavioral: true, sensitive_data: true, doc_labeling: true,
      compliance_monitoring: true, sensitive_mgmt: true, api_remediation: true,
      dlp: true, google_workspace: true, m365: true, app_integrations: true,
      auto_remediation: "addon-included", project_hub: "optional", doc_portal: "optional",
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: "optional",
    },
  },
  // ── GEN 4 MSP ──
  {
    id: "starter",
    name: "Starter",
    family: "Gen 4 MSP",
    gen: "Gen 4",
    summary: "Effective and secure collaboration solution to get your team up and running quickly and easily.",
    pricing: { msrp: 16, msp: 12.8 },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "200 GB", upload_limit: "100 GB", domains: "1",
      max_users: "100",
      sso: false, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: false, edge_caching: true, role_admin: false, device_controls: false,
      data_residency: false, encryption_keys: false, link_throttling: false, migration_tools: false,
      // Intelligence — only single doc Q&A included; no add-ons available
      single_doc_qa: true, copilot: false, ai_search: false, ai_workflows: false,
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration — no add-ons available on Starter
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: false,
      email_sharing: false, pdf_handler: false, esignature: false,
      watermarking: false, content_safeguards: false,
      standard_workflows: true, advanced_workflows: false, advanced_video: false,
      file_versioning: true, advanced_snapshot: false, snapshot_90: false,
      // Governance — none included in Starter
      lifecycle_reports: false, lifecycle_policies: false, unified_perms: false,
      suspicious_login: false, sharing_issues: false, unusual_access: false,
      inactive_user: false, malformed_perms: false, ransomware_artifact: false,
      ransomware_behavioral: false, sensitive_data: false, doc_labeling: false,
      compliance_monitoring: false, sensitive_mgmt: false, api_remediation: false,
      auto_remediation: false, legal_hold: false, rot_data: false,
      // Integrations
      google_workspace: true, m365: true, dlp: false, app_integrations: true,
      // No add-ons available on Starter
      project_hub: false, doc_portal: false,
      salesforce_integration: false, specialized_file_handler: false, snapshot_addon: false,
    },
  },
  {
    id: "ifs",
    name: "IFS",
    family: "Gen 4 MSP",
    gen: "Gen 4",
    summary: "Everything in Starter, plus AI Assistant, AI Search, AI Workflows, PDF markup, e-signature, advanced workflows, ransomware detection, and content lifecycle.",
    pricing: { msrp: 33, msp: 26.4 },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB",
      domains: "1 Primary / 5 Secondary",
      max_users: "Unlimited",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, encryption_keys: false, link_throttling: true, migration_tools: true,
      // Intelligence — AI Assistant, AI Search, AI Workflows all included in IFS
      single_doc_qa: true, copilot: true, ai_search: true, ai_workflows: true,
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, pdf_handler: true, esignature: true,
      watermarking: false, content_safeguards: false,
      standard_workflows: true, advanced_workflows: true, advanced_video: true,
      file_versioning: true,
      advanced_snapshot: "optional", snapshot_90: false,
      // Governance
      lifecycle_reports: true, lifecycle_policies: true, unified_perms: false,
      suspicious_login: true, sharing_issues: true, unusual_access: false,
      inactive_user: false, malformed_perms: false, ransomware_artifact: true,
      ransomware_behavioral: false, sensitive_data: false, doc_labeling: false,
      compliance_monitoring: false, sensitive_mgmt: false, api_remediation: true,
      auto_remediation: "optional", legal_hold: false, rot_data: false,
      // Integrations
      google_workspace: true, m365: true, dlp: false, app_integrations: true,
      // Add-ons
      project_hub: "optional", doc_portal: "optional",
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: "optional",
    },
  },
  {
    id: "elite",
    name: "Elite",
    family: "Gen 4 MSP",
    gen: "Gen 4",
    summary: "Everything in IFS, plus dynamic watermarking and auto-remediation.",
    pricing: { msrp: 46, msp: 36.8 },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB",
      domains: "1 Primary / 5 Secondary",
      max_users: "Unlimited",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, encryption_keys: false, link_throttling: true, migration_tools: true,
      // Intelligence — AI Assistant, AI Search, AI Workflows included (same as IFS); OCR, Doc Type Classification, Trainable Classifiers = Ultimate only
      single_doc_qa: true, copilot: true, ai_search: true, ai_workflows: true,
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration — PDF markup, e-sig, watermarking, advanced video all included
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, pdf_handler: true, esignature: true,
      watermarking: true, content_safeguards: true,
      standard_workflows: true, advanced_workflows: true, advanced_video: true,
      file_versioning: true,
      advanced_snapshot: "optional", snapshot_90: false,
      // Governance — auto-remediation included; behavioral ransomware and sensitive data NOT yet
      lifecycle_reports: true, lifecycle_policies: true, unified_perms: true,
      suspicious_login: true, sharing_issues: true, unusual_access: true,
      inactive_user: true, malformed_perms: true, ransomware_artifact: true,
      ransomware_behavioral: false, sensitive_data: false, doc_labeling: false,
      compliance_monitoring: false, sensitive_mgmt: false, api_remediation: true,
      auto_remediation: true, legal_hold: false, rot_data: false,
      // Integrations — DLP not until Ultimate
      google_workspace: true, m365: true, dlp: false, app_integrations: true,
      // Add-ons
      project_hub: "optional", doc_portal: "optional",
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: "optional",
    },
  },
  {
    id: "ultimate",
    name: "Ultimate",
    family: "Gen 4 MSP",
    gen: "Gen 4",
    summary: "Everything in Elite, plus behavioral ransomware detection, sensitive data classification, DLP, snapshot recovery, and encryption key management.",
    pricing: { msrp: 74, msp: 59.2 },
    features: {
      // Core Platform — encryption key management unlocked at Ultimate
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB",
      domains: "1 Primary / 5 Secondary",
      max_users: "Unlimited",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, encryption_keys: true, link_throttling: true, migration_tools: true,
      // Intelligence — full suite including OCR, doc type classification, trainable classifiers
      single_doc_qa: true, copilot: true, ai_search: true, ai_workflows: true,
      text_search: true, ocr_search: true, ai_classification: true, trainable_classifiers: true,
      // Collaboration — all included, plus 90-day advanced snapshot
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, pdf_handler: true, esignature: true,
      watermarking: true, content_safeguards: true,
      standard_workflows: true, advanced_workflows: true, advanced_video: true,
      file_versioning: true, advanced_snapshot: true, snapshot_90: true,
      // Governance — full suite
      lifecycle_reports: true, lifecycle_policies: true, unified_perms: true,
      suspicious_login: true, sharing_issues: true, unusual_access: true,
      inactive_user: true, malformed_perms: true, ransomware_artifact: true,
      ransomware_behavioral: true, sensitive_data: true, doc_labeling: true,
      compliance_monitoring: true, sensitive_mgmt: true, api_remediation: true,
      auto_remediation: true, legal_hold: true, rot_data: true,
      // Integrations — DLP/preventive control included
      google_workspace: true, m365: true, dlp: true, app_integrations: true,
      // Add-ons
      project_hub: "optional", doc_portal: "optional",
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: "optional",
    },
  },
];

const PLAN_ORDER = PLANS.map((p) => p.id);
const fmt = (v) => (typeof v === "number" ? `$${v.toFixed(2)}` : "—");

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const E = {
  teal:     "#0BC5BA",
  tealDim:  "rgba(11,197,186,0.3)",
  tealBg:   "rgba(11,197,186,0.08)",
  navy:     "#0C2340",
  navyMid:  "#14264A",
  navyCard: "#0F1E38",
  navySurf: "#0A1628",
  blue:     "#037BBD",
  blue2:    "#3D71EA",
  blue3:    "#00539A",
  purple:   "#6E49FF",
  yellow:   "#FFCA29",
  text:     "#F7F9FC",
  textSub:  "#76A2BC",
  textMut:  "#3A5A7A",
  border:   "rgba(11,197,186,0.13)",
  borderSub:"rgba(11,197,186,0.06)",
};

// ─── STATUS CELL ──────────────────────────────────────────────────────────────
const StatusCell = ({ value }) => {
  if (value === true) return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:E.teal, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={E.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
  if (value === "optional") return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <span style={{ padding:"2px 7px", borderRadius:4, background:"rgba(255,202,41,0.12)", border:`1px solid ${E.yellow}55`, color:E.yellow, fontSize:9, fontWeight:700, letterSpacing:"0.06em", whiteSpace:"nowrap" }}>ADD-ON</span>
    </div>
  );
  if (value === "addon-included") return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <span style={{ padding:"2px 7px", borderRadius:4, background:"rgba(11,197,186,0.12)", border:`1px solid ${E.teal}55`, color:E.teal, fontSize:9, fontWeight:700, letterSpacing:"0.06em", whiteSpace:"nowrap" }}>BUNDLED</span>
    </div>
  );
  if (typeof value === "string" && value !== "false") return (
    <div style={{ textAlign:"center", fontSize:11, color:E.textSub, whiteSpace:"nowrap" }}>{value}</div>
  );
  return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <div style={{ width:14, height:1.5, background:E.textMut, borderRadius:1, opacity:0.35 }} />
    </div>
  );
};

// ─── FEATURE TOOLTIP ─────────────────────────────────────────────────────────
const FeatureTooltip = ({ feat }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top:0, left:0 });
  const btnRef = React.useRef(null);
  if (!feat.desc && !feat.helpUrl) return <div style={{width:18}}/>;

  const handleMouseEnter = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const tooltipW = 264;
      const goLeft = r.right + tooltipW + 12 > window.innerWidth;
      const left = goLeft ? r.left - tooltipW - 8 : r.right + 8;
      const top = r.top + r.height / 2;
      // Clamp vertically so it doesn't go off screen
      const clampedTop = Math.max(10, Math.min(top, window.innerHeight - 150));
      setCoords({ top: clampedTop, left });
    }
    setVisible(true);
  };

  const tooltip = visible ? (
    <div style={{
      position:"fixed", top:coords.top, left:coords.left,
      transform:"translateY(-50%)",
      width:264, zIndex:99999,
      background:"#0F1E38",
      border:`1px solid rgba(11,197,186,0.35)`,
      borderRadius:10, padding:"12px 14px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.7)",
      pointerEvents:"none",
    }}>
      <div style={{ fontSize:11, fontWeight:600, color:E.text, marginBottom:6, lineHeight:1.4 }}>{feat.label}</div>
      {feat.price != null && (
        <div style={{ marginBottom:8, padding:"8px 10px", background:"rgba(255,202,41,0.08)", border:"1px solid rgba(255,202,41,0.2)", borderRadius:6 }}>
          <div style={{ display:"flex", gap:16, alignItems:"baseline", marginBottom:4 }}>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>MSP</div>
              <span style={{ fontSize:18, fontWeight:800, color:E.yellow }}>${feat.mspPrice?.toFixed(2)}</span>
              <span style={{ fontSize:10, color:E.textMut }}>/user/mo</span>
            </div>
            {feat.price !== feat.mspPrice && (
              <>
                <div style={{ width:1, height:28, background:E.borderSub }}/>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>MSRP</div>
                  <span style={{ fontSize:18, fontWeight:800, color:`${E.yellow}77` }}>${feat.price.toFixed(2)}</span>
                  <span style={{ fontSize:10, color:E.textMut }}>/user/mo</span>
                </div>
              </>
            )}
          </div>
          <div style={{ fontSize:9, color:E.textMut }}>{feat.priceNote}</div>
        </div>
      )}
      {feat.desc && <p style={{ fontSize:11, color:E.textSub, lineHeight:1.65, margin:0, marginBottom: feat.helpUrl ? 10 : 0 }}>{feat.desc}</p>}
      {feat.helpUrl && (
        <div style={{ fontSize:10, color:E.teal, fontWeight:600, letterSpacing:"0.04em" }}>
          <a href={feat.helpUrl} target="_blank" rel="noreferrer"
            style={{ color:E.teal, textDecoration:"none" }}
            onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
            onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>
            Learn more →
          </a>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>
      <button ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
        style={{ width:18, height:18, borderRadius:4, background:E.navySurf, border:`1px solid ${visible ? E.teal : E.border}`, color: visible ? E.teal : E.textMut, fontSize:10, fontWeight:700, cursor:"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s", fontFamily:"'Inter',sans-serif" }}>?</button>
      {ReactDOM.createPortal(tooltip, document.body)}
    </div>
  );
};

// ─── FEATURE ROW (compare mode) ───────────────────────────────────────────────
const FeatureRow = ({ feat, value, compareValue, isVerticalHighlight }) => {
  const isGain = (value === true || value === "addon-included") && !compareValue;
  const isAddon = value === "optional";
  const highlightBg = isVerticalHighlight ? "rgba(61,113,234,0.07)" : isGain ? "rgba(11,197,186,0.08)" : "transparent";
  const leftBorder = isGain ? `3px solid ${E.teal}` : isVerticalHighlight ? `3px solid ${E.blue2}` : "3px solid transparent";
  return (
    <div className="feat-row" style={{
      display:"grid", gridTemplateColumns:"1fr 26px 120px 120px",
      padding:"10px 16px", alignItems:"center",
      borderBottom:`1px solid ${E.borderSub}`,
      borderLeft: leftBorder,
      background: highlightBg,
      transition:"background 0.15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
        {isGain && (
          <span style={{ flexShrink:0, fontSize:9, fontWeight:700, letterSpacing:"0.07em", color:E.navy, background:E.teal, borderRadius:3, padding:"2px 5px", lineHeight:1 }}>NEW</span>
        )}
        {!isGain && isVerticalHighlight && (
          <span style={{ flexShrink:0, fontSize:9, fontWeight:700, letterSpacing:"0.07em", color:E.blue2, background:"rgba(61,113,234,0.15)", border:`1px solid rgba(61,113,234,0.3)`, borderRadius:3, padding:"2px 5px", lineHeight:1 }}>KEY</span>
        )}
        <span style={{ fontSize:13, color: isGain ? E.text : isVerticalHighlight ? E.text : E.textSub, fontWeight: (isGain || isVerticalHighlight) ? 600 : 400, lineHeight:1.4 }}>{feat.label}</span>
        {feat.price != null && isAddon && (
          <span style={{ fontSize:10, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.08)", border:`1px solid rgba(255,202,41,0.2)`, borderRadius:4, padding:"1px 7px", letterSpacing:"0.02em" }}>
            MSP ${(feat.mspPrice ?? feat.price).toFixed(2)}/u · MSRP ${feat.price.toFixed(2)}/u
          </span>
        )}
      </div>
      <FeatureTooltip feat={feat} />
      <StatusCell value={compareValue} />
      <StatusCell value={value} />
    </div>
  );
};

// ─── HEXAGON BACKGROUND SVG ───────────────────────────────────────────────────
const HexBg = () => (
  <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.05 }}>
    <defs>
      <pattern id="hexpat" x="0" y="0" width="54" height="46" patternUnits="userSpaceOnUse">
        <polygon points="13,2 41,2 54,23 41,44 13,44 0,23" fill="none" stroke="#0BC5BA" strokeWidth="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexpat)"/>
  </svg>
);

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, label, isCurrent, families, selected, onChange }) {
  const accent = isCurrent ? E.textSub : E.teal;
  return (
    <div style={{ background:E.navyCard, border:`1px solid ${isCurrent ? "rgba(118,162,188,0.2)" : E.border}`, borderRadius:14, padding:"14px 16px", boxShadow: isCurrent ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(11,197,186,0.05)" }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color: isCurrent ? E.textMut : E.teal, marginBottom:8 }}>{label}</div>
      <div style={{ position:"relative", marginBottom:10 }}>
        <select value={selected} onChange={e=>onChange(e.target.value)}
          style={{ width:"100%", appearance:"none", background:E.navySurf, border:`1px solid ${isCurrent ? "rgba(118,162,188,0.15)" : E.border}`, borderRadius:8, padding:"9px 36px 9px 12px", color:E.text, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", outline:"none" }}>
          {Object.entries(families).map(([fam,ps])=>(
            <optgroup key={fam} label={fam}>
              {ps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
          ))}
        </select>
        <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:accent, pointerEvents:"none", fontSize:11 }}>▾</span>
      </div>
      <p style={{ fontSize:11, color:E.textSub, lineHeight:1.6, marginBottom:10 }}>{plan?.summary}</p>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        {[
          ["MSRP", plan?.pricing?.msrp != null ? fmt(plan.pricing.msrp) : "—"],
          ["MSP",  plan?.pricing?.msp  != null ? fmt(plan.pricing.msp)  : plan?.pricing ? "Contact" : "—"],
          ["Gen",  plan?.gen || "—"],
        ].map(([k,v])=>(
          <span key={k} style={{ fontSize:11, color:E.textMut }}>
            <span style={{ fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", fontSize:10 }}>{k} </span>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── VERTICAL KEY GAINS ───────────────────────────────────────────────────────
function VerticalKeyGains({ vertical, VERTICALS, isUp, fp, tp, E }) {
  const v = VERTICALS.find(x => x.id === vertical);
  if (!v) return null;
  const relevantGained = isUp ? FEATURE_SECTIONS.flatMap(s => s.features).filter(f => {
    const fv = fp?.features[f.id];
    const tv = tp?.features[f.id];
    return (tv === true || tv === "addon-included") && !fv && v.highlights.includes(f.id);
  }) : [];
  if (relevantGained.length === 0) return null;
  return (
    <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${E.borderSub}` }}>
      <div style={{ fontSize:10, color:E.textMut, marginBottom:8, fontWeight:600 }}>KEY GAINS FOR {v.label.toUpperCase()}</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {relevantGained.map(f=>(
          <span key={f.id} style={{ fontSize:11, background:"rgba(11,197,186,0.1)", border:`1px solid rgba(11,197,186,0.25)`, color:E.teal, borderRadius:6, padding:"3px 10px", fontWeight:500 }}>{f.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── PLAN BUILDER DATA ───────────────────────────────────────────────────────
const BUILDER_QUESTIONS = [
  {
    id: "infra",
    q: "How is the customer currently managing files and storage?",
    sub: "This helps us understand where they're starting from",
    options: [
      { id: "fileserver", icon: "🖥", label: "On-premises file servers or NAS devices", desc: "Still running Windows file servers, VPN for remote access, or hardware that's due for refresh", scores: { starter:5, ifs:3, elite:1, ultimate:0 } },
      { id: "sharepoint", icon: "📎", label: "Heavily reliant on SharePoint or OneDrive", desc: "Using Microsoft 365 but frustrated with SharePoint complexity or governance gaps", scores: { starter:3, ifs:4, elite:2, ultimate:0 } },
      { id: "scattered",  icon: "📂", label: "Files scattered across multiple tools and silos", desc: "Content split between email, Dropbox, local drives, and file servers with no single source of truth", scores: { starter:2, ifs:4, elite:3, ultimate:1 } },
      { id: "cloud",      icon: "☁", label: "Already on a cloud platform but outgrowing it", desc: "Current solution lacks governance, compliance controls, or security monitoring they now need", scores: { starter:0, ifs:2, elite:4, ultimate:3 } },
    ]
  },
  {
    id: "scale",
    q: "How many users need access, and how are they distributed?",
    sub: "Include staff, contractors, and regular external collaborators",
    options: [
      { id: "tiny",   icon: "👤", label: "Under 25 users — single location or small remote team", desc: "Small business standardizing on cloud file storage and basic collaboration", scores: { starter:5, ifs:2, elite:0, ultimate:0 } },
      { id: "small",  icon: "👥", label: "25–100 users — growing team, possibly multi-location", desc: "Mid-market company needing consistent access across offices and hybrid workers", scores: { starter:2, ifs:4, elite:2, ultimate:0 } },
      { id: "mid",    icon: "🏢", label: "100–500 users — multiple departments or job sites", desc: "Organization-wide deployment with role-based admin and advanced workflows", scores: { starter:0, ifs:2, elite:4, ultimate:2 } },
      { id: "large",  icon: "🏙", label: "500+ users — enterprise, multiple offices or countries", desc: "Enterprise scale requiring data residency, encryption key management, and full governance", scores: { starter:0, ifs:0, elite:3, ultimate:5 } },
    ]
  },
  {
    id: "collab",
    q: "What best describes their collaboration and workflow needs?",
    sub: "Think about how content moves through their organization day-to-day",
    options: [
      { id: "basic",     icon: "📧", label: "Basic sharing — teams need a clean shared drive with external link sharing", desc: "Replace email attachments and consumer tools with a secure, organized file platform", scores: { starter:5, ifs:2, elite:0, ultimate:0 } },
      { id: "workflows", icon: "✍",  label: "Structured workflows — approvals, e-signatures, and PDF editing", desc: "Contracts, proposals, and SOPs need repeatable review and sign-off with audit trails", scores: { starter:0, ifs:5, elite:3, ultimate:1 } },
      { id: "advanced",  icon: "⚙",  label: "Advanced workflows — multi-step, automated, integrated with other systems", desc: "Complex cross-department processes that trigger actions in CRM, ERP, or other tools", scores: { starter:0, ifs:2, elite:5, ultimate:2 } },
      { id: "lifecycle", icon: "🗂",  label: "Full lifecycle — retention policies, archiving, and defensible deletion", desc: "Legal, compliance, or records teams require structured retention and disposal of content", scores: { starter:0, ifs:0, elite:4, ultimate:4 } },
    ]
  },
  {
    id: "security",
    q: "What security and compliance requirements do they have?",
    sub: "Think about what their IT, legal, or security team is asking for",
    options: [
      { id: "standard",   icon: "🔒", label: "Standard — MFA, audit logs, file versioning, and secure link sharing", desc: "Core security controls every business needs. No advanced threat detection required", scores: { starter:5, ifs:2, elite:0, ultimate:0 } },
      { id: "ransomware", icon: "🚨", label: "Ransomware detection, unusual access alerts, and snapshot recovery", desc: "Cyber insurance or a past incident requires documented detection and fast recovery capabilities", scores: { starter:0, ifs:4, elite:4, ultimate:2 } },
      { id: "governance", icon: "🛡", label: "Full governance — issue remediation, insider risk, and compliance reporting", desc: "Security team needs visibility across all sharing, permissions, and access anomalies with auto-remediation", scores: { starter:0, ifs:1, elite:5, ultimate:3 } },
      { id: "regulated",  icon: "📋", label: "Regulated data — HIPAA, FINRA, GDPR, SOC 2, or contractual obligations", desc: "Must classify sensitive data, prove where it lives, support audits, and meet data residency requirements", scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
    ]
  },
  {
    id: "ai",
    q: "How important is AI and intelligence to this opportunity?",
    sub: "What level of AI capability is the customer ready to adopt?",
    options: [
      { id: "none",     icon: "➖", label: "Not a priority right now — focused on core file management", desc: "Customer wants a solid foundation before thinking about AI features", scores: { starter:3, ifs:1, elite:0, ultimate:0 } },
      { id: "search",   icon: "🤖", label: "AI Assistant and search — ask questions across documents, get summaries", desc: "Want to reduce time finding information and generate content from stored files", scores: { starter:0, ifs:5, elite:3, ultimate:1 } },
      { id: "classify", icon: "🧠", label: "AI classification — auto-tag document types and extract data at scale", desc: "Large volumes of unstructured content that need to be organized and acted on automatically", scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
      { id: "all",      icon: "⚡", label: "Full AI suite — search, assistant, classification, and AI-triggered workflows", desc: "AI is a core part of the business case and they want the most advanced capabilities available", scores: { starter:0, ifs:2, elite:3, ultimate:5 } },
    ]
  },
  {
    id: "budget",
    q: "How would you characterize the customer's investment approach?",
    sub: "This helps calibrate the recommendation to what will actually land",
    options: [
      { id: "essential",  icon: "💡", label: "Essential — get the basics right at the lowest cost", desc: "Budget-conscious. They want to solve the core problem without overbuying", scores: { starter:5, ifs:2, elite:0, ultimate:0 } },
      { id: "value",      icon: "📈", label: "Value — willing to invest more for meaningful capability upgrades", desc: "Will pay more if the ROI is clear. Open to a mid-tier plan with strong features", scores: { starter:1, ifs:4, elite:3, ultimate:0 } },
      { id: "strategic",  icon: "🚀", label: "Strategic — security and governance are a business priority", desc: "Leadership sees content security and compliance as competitive or regulatory differentiators", scores: { starter:0, ifs:1, elite:4, ultimate:3 } },
      { id: "enterprise", icon: "🏛", label: "Enterprise — needs the most comprehensive solution available", desc: "Has regulatory, insurance, or contractual requirements that demand an enterprise-grade platform", scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
    ]
  },
];

const PLAN_BUILDER_MAP = {
  starter: { id:"starter", name:"Starter", color:"#76A2BC", bg:"rgba(118,162,188,0.08)", border:"rgba(118,162,188,0.25)" },
  ifs:     { id:"ifs",     name:"IFS",     color:"#0BC5BA", bg:"rgba(11,197,186,0.08)",  border:"rgba(11,197,186,0.3)"  },
  elite:   { id:"elite",   name:"Elite",   color:"#3D71EA", bg:"rgba(61,113,234,0.08)",  border:"rgba(61,113,234,0.3)"  },
  ultimate:{ id:"ultimate",name:"Ultimate",color:"#6E49FF", bg:"rgba(110,73,255,0.08)",  border:"rgba(110,73,255,0.3)"  },
};

const scoreBuilder = (answers) => {
  const totals = { starter:0, ifs:0, elite:0, ultimate:0 };
  BUILDER_QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    const ids = Array.isArray(ans) ? ans : [ans];
    ids.forEach(id => {
      const opt = q.options.find(o => o.id === id);
      if (opt) Object.entries(opt.scores).forEach(([plan, pts]) => { totals[plan] += pts; });
    });
  });
  const ranked = Object.entries(totals).sort((a,b) => b[1] - a[1]);
  return { totals, winner: ranked[0][0], ranked };
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function EgnytePlanMatrix() {
  const [fromPlan, setFromPlan] = useState("afs");
  const [toPlan,   setToPlan]   = useState("ifs");
  const [mode, setMode] = useState("compare");
  const [expanded, setExpanded] = useState(
    Object.fromEntries(FEATURE_SECTIONS.map(s=>[s.id,true]))
  );

  // ── Plan Builder state ──
  const [builderStep, setBuilderStep] = useState(0);
  const [builderAnswers, setBuilderAnswers] = useState({});
  const [builderResult, setBuilderResult] = useState(null);
  const [builderShowFeatures, setBuilderShowFeatures] = useState(false);

  const fromIdx = PLAN_ORDER.indexOf(fromPlan);
  const toIdx   = PLAN_ORDER.indexOf(toPlan);
  const isUp    = toIdx > fromIdx;

  const fp = PLANS.find(p=>p.id===fromPlan);
  const tp = PLANS.find(p=>p.id===toPlan);

  const dMsrp = fp?.pricing?.msrp!=null && tp?.pricing?.msrp!=null ? tp.pricing.msrp - fp.pricing.msrp : null;
  const dMsp  = fp?.pricing?.msp !=null && tp?.pricing?.msp !=null ? tp.pricing.msp  - fp.pricing.msp  : null;

  // ── Calculator state ──
  const [userCount,  setUserCount]  = useState(25);
  const [fromPrice,  setFromPrice]  = useState(null);
  const [toPrice,    setToPrice]    = useState(null);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  // Sync prices when plans change
  React.useEffect(() => {
    setFromPrice(fp?.pricing?.msp ?? fp?.pricing?.msrp ?? null);
    setToPrice(tp?.pricing?.msp   ?? tp?.pricing?.msrp ?? null);
  }, [fromPlan, toPlan]);

  const calcFromPrice = fromPrice ?? (fp?.pricing?.msp ?? fp?.pricing?.msrp ?? 0);
  const calcToPrice   = toPrice   ?? (tp?.pricing?.msp ?? tp?.pricing?.msrp ?? 0);
  const monthlyDelta  = (calcToPrice - calcFromPrice) * userCount;
  const annualDelta   = monthlyDelta * 12;
  const currentMo     = calcFromPrice * userCount;
  const proposedMo    = calcToPrice   * userCount;
  const fmtD = v => v >= 0 ? `+$${v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}` : `-$${Math.abs(v).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

  const netNew = useMemo(()=>{
    if(!isUp) return 0;
    return FEATURE_SECTIONS.flatMap(s=>s.features).filter(f=>{
      const fv=fp?.features[f.id]; const tv=tp?.features[f.id];
      return (tv===true||tv==="addon-included") && !fv;
    }).length;
  },[fromPlan,toPlan,isUp]);

  const families = useMemo(()=>{
    const m={};
    PLANS.forEach(p=>{ if(!m[p.family]) m[p.family]=[]; m[p.family].push(p); });
    return m;
  },[]);

  const toggle = id => setExpanded(p=>({...p,[id]:!p[id]}));

  // ── Vertical filter ──
  const [vertical, setVertical] = useState(null); // null = all

  const VERTICALS = [
    { id:"aec",      label:"AEC",              icon:"🏗",
      desc:"Architecture, Engineering & Construction",
      highlights:["project_hub","advanced_video","file_locking","link_sharing","advanced_workflows","app_integrations","edge_caching","migration_tools"] },
    { id:"finserv",  label:"Financial Services",icon:"🏦",
      desc:"Banking, Wealth, Insurance",
      highlights:["doc_portal","sensitive_data","compliance_monitoring","lifecycle_policies","legal_hold","dlp","doc_labeling","suspicious_login","auto_remediation","audit","ransomware_artifact","ransomware_behavioral"] },
    { id:"lifesci",  label:"Life Sciences",     icon:"🧬",
      desc:"Pharma, Biotech, Medical Devices",
      highlights:["compliant_storage","lifecycle_policies","legal_hold","compliance_monitoring","audit","sensitive_data","advanced_workflows","ocr_search","ransomware_artifact"] },
    { id:"mssp",     label:"MSP / IT",          icon:"🖥",
      desc:"Managed Service Providers & IT Teams",
      highlights:["sso","device_controls","role_admin","ransomware_artifact","ransomware_behavioral","auto_remediation","suspicious_login","unusual_access","data_residency","encryption_keys","migration_tools","api_remediation"] },
  ];

  // ── AI Value Generation ──
  const [valuePoints, setValuePoints] = useState(null);
  const [objections, setObjections] = useState(null);
  const [valueLoading, setValueLoading] = useState(false);
  const [valueError, setValueError] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = React.useRef(null);
  const valueCache = React.useRef({});

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => t ? {...t, visible: false} : null), 2200);
  };

  // Reset when plans change
  React.useEffect(() => {
    setValuePoints(null);
    setObjections(null);
    setValueError(null);
  }, [fromPlan, toPlan]);


  const generateValue = () => {
    if (!isUp || !fp || !tp) return;
    const verticalInfo = vertical ? VERTICALS.find(v=>v.id===vertical) : null;
    const valueKey = `${fromPlan}→${toPlan}${vertical||""}`;
    if (valueCache.current[valueKey]) {
      const c = valueCache.current[valueKey];
      setValuePoints(c.points);
      setObjections(c.objections);
      return;
    }

    const gained = FEATURE_SECTIONS.flatMap(s =>
      s.features.filter(f => {
        const fv = fp.features[f.id]; const tv = tp.features[f.id];
        return (tv === true || tv === "addon-included") && !fv;
      }).map(f => ({ ...f, sectionLabel: s.label }))
    );

    // Group by section for context-rich prompt
    const gainedBySec = FEATURE_SECTIONS.map(s => {
      const feats = gained.filter(f => f.sectionLabel === s.label).map(f => f.label);
      return feats.length ? s.label + ": " + feats.join(", ") : null;
    }).filter(Boolean).join("\n");

    const verticalHighlights = verticalInfo
      ? gained.filter(f => verticalInfo.highlights.includes(f.id)).map(f => f.label)
      : [];

    const costLine = dMsp != null
      ? "MSP price uplift: +$" + dMsp.toFixed(2) + "/user/month (MSRP +$" + (dMsrp != null ? dMsrp.toFixed(2) : "—") + "/user/month)."
      : "Pricing available through the Egnyte partner team.";

    const verticalLine = verticalInfo
      ? " The customer is in the " + verticalInfo.desc + " industry." + (verticalHighlights.length > 0 ? " Prioritize outcomes around: " + verticalHighlights.join(", ") + "." : "")
      : "";

    setValueLoading(true);
    setValuePoints(null);
    setObjections(null);
    setValueError(null);

    const prompt = "You are a senior Egnyte partner sales engineer. A PAM needs specific, use-case-grounded talking points for a customer upgrading from " + fp.name + " (" + fp.family + ") to " + tp.name + " (" + tp.family + ").\n\n"
      + "Net-new capabilities gained, by category:\n" + gainedBySec + "\n\n"
      + costLine + verticalLine + "\n\n"
      + "Return ONLY valid JSON with exactly these two keys (no markdown, no preamble):\n"
      + '{"points":["...","...","...","...","..."],"objections":[{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]}\n\n'
      + 'For "points" — exactly 5 talking points:\n'
      + "- Each must tie to a SPECIFIC capability or category listed above\n"
      + "- Lead with the business outcome, not the feature name. Say what changes operationally, what risk is removed, what the customer can now do that they couldn't before\n"
      + "- Be concrete and direct. No filler phrases like 'improve productivity' or 'enhance collaboration'\n"
      + "- Cover at least 3 different categories from the list\n"
      + "- 1-2 sentences each\n"
      + (verticalInfo ? "- Weight outcomes relevant to " + verticalInfo.desc + " buyers\n" : "")
      + "\n"
      + 'For "objections" — 3 real pushbacks a customer would raise when moving from ' + fp.name + " to " + tp.name + ":\n"
      + '- "q": phrased exactly as the customer would say it (skeptical, direct, casual)\n'
      + '- "a": 1-2 sentences grounded in specific capability or ROI. No generic responses.';

    fetch("/api/value", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1600,
        messages: [{ role: "user", content: prompt }]
      })
    })
    .then(r => r.json())
    .then(data => {
      try {
        const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        valueCache.current[valueKey] = parsed;
        setValuePoints(parsed.points);
        setObjections(parsed.objections);
      } catch(e) { setValueError("Could not parse response. Try again."); }
    })
    .catch(() => setValueError("Request failed. Check your API key in Vercel environment variables."))
    .finally(() => setValueLoading(false));
  };

  const LEGEND = [
    { node:<div style={{width:18,height:18,borderRadius:"50%",background:E.teal,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={E.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>, label:"Included" },
    { node:<span style={{padding:"2px 8px",borderRadius:4,background:"rgba(255,202,41,0.12)",border:`1px solid ${E.yellow}55`,color:E.yellow,fontSize:9,fontWeight:700,letterSpacing:"0.06em"}}>ADD-ON</span>, label:"Paid add-on" },
    { node:<span style={{padding:"2px 8px",borderRadius:4,background:"rgba(11,197,186,0.12)",border:`1px solid ${E.teal}55`,color:E.teal,fontSize:9,fontWeight:700,letterSpacing:"0.06em"}}>BUNDLED</span>, label:"Add-on included in plan" },
    { node:<span style={{width:18,height:18,borderRadius:4,background:"#0A1628",border:"1px solid rgba(11,197,186,0.2)",color:"#76A2BC",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>?</span>, label:"Hover for feature details" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#0C2340;font-family:'Inter',sans-serif;}
        .feat-row:hover{background:rgba(11,197,186,0.04)!important;}
        .sec-hdr:hover{background:rgba(11,197,186,0.05)!important;cursor:pointer;}
        select{color-scheme:dark;}
        select option,select optgroup{background:#0F1E38;color:#F7F9FC;}
        select:focus{outline:none;border-color:#0BC5BA !important;box-shadow:0 0 0 3px rgba(11,197,186,0.15) !important;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#0C2340;}
        ::-webkit-scrollbar-thumb{background:rgba(11,197,186,0.25);border-radius:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes toastOut{from{opacity:1;transform:translateY(0) scale(1);}to{opacity:0;transform:translateY(8px) scale(0.95);}}
        .fade-up{animation:fadeUp 0.4s ease both;}
        .mode-btn{border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
        .mode-btn:hover{opacity:0.85;}
        @media print {
          body { background: white !important; color: #111 !important; }
          header, .no-print { display: none !important; }
          .print-only { display: block !important; }
          * { box-shadow: none !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:`linear-gradient(150deg,#0C2340 0%,#121F37 100%)`, color:E.text }}>

        {/* TOAST */}
        {toast && (
          <div style={{
            position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
            zIndex:9999, animation: toast.visible ? "toastIn 0.25s ease both" : "toastOut 0.2s ease both",
            pointerEvents:"none",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"#0F2A1A", border:"1px solid rgba(11,197,186,0.35)", borderRadius:999, padding:"10px 20px", boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:"#0BC5BA", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0C2340" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"#F7F9FC", whiteSpace:"nowrap" }}>{toast.msg}</span>
            </div>
          </div>
        )}

        {/* NAV */}
        <header style={{ position:"relative", overflow:"hidden", background:E.navyMid, borderBottom:`1px solid ${E.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}>
          <HexBg/>
          <div style={{ position:"relative", zIndex:1, maxWidth:1680, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center" }}>
              <svg width="666" height="101" style={{height:38,width:"auto"}} viewBox="0 0 666 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M47.2664 73.4907H16.6526V64.0171H43.8649C44.5518 64.0171 45.1078 63.4569 45.1078 62.7649V52.2038C45.1078 51.5118 44.5518 50.9517 43.8649 50.9517H16.6526V41.9064H46.8413C47.5281 41.9064 48.0841 41.3462 48.0841 40.6542V29.0716C48.0841 28.3796 47.5281 27.8194 46.8413 27.8194H1.64009C0.953237 27.8194 0.397217 28.3796 0.397217 29.0716V86.342C0.397217 87.034 0.953237 87.5941 1.64009 87.5941H47.2664C47.9533 87.5941 48.5093 87.034 48.5093 86.342V74.7429C48.5093 74.0509 47.9533 73.4907 47.2664 73.4907ZM112.092 52.6652H87.3817C86.6458 52.6652 86.057 53.2583 86.057 53.9997V63.4569C86.057 64.1983 86.6458 64.7914 87.3817 64.7914H97.7498V71.942C97.7498 72.0079 97.7171 72.0738 97.6517 72.1068C95.215 73.6885 92.1896 74.5287 88.2647 74.5287C78.8615 74.5287 72.1729 67.6088 72.1729 57.9539V57.7892C72.1729 48.645 78.7797 41.3956 87.3326 41.3956C92.7456 41.3956 96.7849 43.1585 100.726 46.2725C101.249 46.6844 102.002 46.5855 102.427 46.0748L110.506 36.2881C110.947 35.7608 110.882 34.97 110.342 34.5251C104.275 29.5494 97.1284 26.6167 87.2345 26.6167C68.8531 26.6167 55.296 40.2752 55.296 57.7068V57.8716C55.296 75.9786 69.0984 88.7804 87.5779 88.7804C98.0769 88.7804 106.63 84.958 112.86 79.9328C113.155 79.7022 113.318 79.3397 113.318 78.9608V53.9009C113.335 53.2253 112.779 52.6652 112.092 52.6652ZM177.228 27.8194H163.442C162.755 27.8194 162.199 28.3796 162.199 29.0716V59.4203L138.176 28.2972C137.947 28.0007 137.587 27.8194 137.195 27.8194H123.703C123.016 27.8194 122.46 28.3796 122.46 29.0716V86.342C122.46 87.034 123.016 87.5941 123.703 87.5941H137.489C138.176 87.5941 138.732 87.034 138.732 86.342V54.7906L163.687 87.0999C163.916 87.3964 164.276 87.5777 164.668 87.5777H177.228C177.915 87.5777 178.471 87.0175 178.471 86.3255V29.0716C178.454 28.3796 177.898 27.8194 177.228 27.8194ZM334.156 27.8194H284.638C283.951 27.8194 283.395 28.3796 283.395 29.0716V41.0826C283.395 41.7746 283.951 42.3347 284.638 42.3347H301.188V86.342C301.188 87.034 301.744 87.5941 302.431 87.5941H316.38C317.067 87.5941 317.623 87.034 317.623 86.342V42.4995C317.623 42.4006 317.705 42.3347 317.787 42.3347H334.156C334.843 42.3347 335.399 41.7746 335.399 41.0826V29.0716C335.399 28.3796 334.843 27.8194 334.156 27.8194ZM392.113 73.4907H361.5V64.0171H388.712C389.399 64.0171 389.955 63.4569 389.955 62.7649V52.2038C389.955 51.5118 389.399 50.9517 388.712 50.9517H361.5V41.9064H391.688C392.375 41.9064 392.931 41.3462 392.931 40.6542V29.0716C392.931 28.3796 392.375 27.8194 391.688 27.8194H346.487C345.8 27.8194 345.244 28.3796 345.244 29.0716V86.342C345.244 87.034 345.8 87.5941 346.487 87.5941H392.113C392.8 87.5941 393.356 87.034 393.356 86.342V74.7429C393.34 74.0509 392.784 73.4907 392.113 73.4907Z" fill="white"/>
<path fillRule="evenodd" clipRule="evenodd" d="M234.318 28.6103H227.499C227.041 28.6103 226.665 28.2313 226.665 27.77V1.35907C226.665 0.897745 227.041 0.518799 227.499 0.518799H234.318C234.776 0.518799 235.152 0.897745 235.152 1.35907V27.77C235.152 28.2313 234.776 28.6103 234.318 28.6103Z" fill="#0BC5BA"/>
<path fillRule="evenodd" clipRule="evenodd" d="M248.661 65.5327L252.062 59.5849C252.291 59.1894 252.798 59.0412 253.207 59.2718L275.906 72.469C276.298 72.6997 276.445 73.2105 276.216 73.6224L272.815 79.5702C272.586 79.9656 272.079 80.1139 271.67 79.8832L248.971 66.686C248.563 66.4389 248.432 65.9281 248.661 65.5327Z" fill="#0BC5BA"/>
<path fillRule="evenodd" clipRule="evenodd" d="M209.755 59.5854L213.157 65.5332C213.385 65.9286 213.255 66.4558 212.846 66.6865L190.147 79.8837C189.755 80.1144 189.231 79.9826 189.002 79.5707L185.601 73.6229C185.372 73.2274 185.503 72.7002 185.912 72.4695L208.61 59.2723C209.003 59.0417 209.526 59.1735 209.755 59.5854Z" fill="#0BC5BA"/>
<path fillRule="evenodd" clipRule="evenodd" d="M273.877 34.4424L266.829 22.1514C266.404 21.4264 265.488 21.1628 264.752 21.5912L230.9 41.2799L197.048 21.5912C196.329 21.1628 195.397 21.4264 194.971 22.1514L187.923 34.4424C187.498 35.1674 187.76 36.1065 188.479 36.5349L222.331 56.2236V95.6011C222.331 96.4414 223.001 97.1334 223.852 97.1334H237.932C238.766 97.1334 239.453 96.4579 239.453 95.6011V56.2236L273.305 36.5349C274.041 36.1065 274.286 35.1674 273.877 34.4424Z" fill="white"/>
<path d="M474.666 38.5954H467.413V50.6519H463.541V20.5597H474.666C477.705 20.5597 480.139 21.3275 481.969 22.8632C483.798 24.3988 484.713 26.637 484.713 29.5776C484.713 32.5182 483.798 34.7563 481.969 36.292C480.139 37.8276 477.705 38.5954 474.666 38.5954ZM474.617 35.1647C476.643 35.1647 478.195 34.6583 479.273 33.6454C480.351 32.5999 480.89 31.2439 480.89 29.5776C480.89 27.8785 480.351 26.5226 479.273 25.5097C478.195 24.4642 476.643 23.9414 474.617 23.9414H467.413V35.1647H474.617ZM498.785 25.3627L493.884 38.2033H503.735L498.785 25.3627ZM508.489 50.6519L505.009 41.585H492.61L489.179 50.6519H485.258L497.021 20.5597H500.647L512.41 50.6519H508.489ZM520.874 23.9414V34.6256H527.931C529.892 34.6256 531.427 34.1518 532.538 33.2043C533.649 32.2568 534.205 30.9498 534.205 29.2835C534.205 27.6172 533.649 26.3102 532.538 25.3627C531.427 24.4152 529.892 23.9414 527.931 23.9414H520.874ZM517.002 50.6519V20.5597H528.029C531.068 20.5597 533.486 21.3112 535.283 22.8142C537.113 24.2845 538.027 26.4409 538.027 29.2835C538.027 31.734 537.341 33.6781 535.969 35.1157C534.597 36.5533 532.734 37.4355 530.382 37.7623L539.253 50.6519H534.842L526.216 37.9093H520.874V50.6519H517.002ZM541.314 23.9904V20.5597H566.162V23.9904H555.674V50.6519H551.802V23.9904H541.314ZM594.607 20.5597V50.6519H591.764L574.954 26.735V50.6519H571.229V20.5597H574.905L590.931 43.4474V20.5597H594.607ZM601.765 20.5597H620.928V23.9904H605.588V33.4984H619.506V36.9291H605.588V47.1722H620.928V50.6519H601.765V20.5597ZM630.859 23.9414V34.6256H637.917C639.877 34.6256 641.413 34.1518 642.524 33.2043C643.635 32.2568 644.19 30.9498 644.19 29.2835C644.19 27.6172 643.635 26.3102 642.524 25.3627C641.413 24.4152 639.877 23.9414 637.917 23.9414H630.859ZM626.988 50.6519V20.5597H638.015C641.054 20.5597 643.471 21.3112 645.268 22.8142C647.098 24.2845 648.013 26.4409 648.013 29.2835C648.013 31.734 647.327 33.6781 645.955 35.1157C644.582 36.5533 642.72 37.4355 640.367 37.7623L649.238 50.6519H644.827L636.202 37.9093H630.859V50.6519H626.988Z" fill="white"/>
<path d="M472.807 76.6244H465.451V88.8512H461.525V58.334H472.807C475.889 58.334 478.357 59.1127 480.213 60.67C482.068 62.2273 482.996 64.4971 482.996 67.4792C482.996 70.4613 482.068 72.7311 480.213 74.2884C478.357 75.8458 475.889 76.6244 472.807 76.6244ZM472.757 73.1453C474.812 73.1453 476.386 72.6317 477.479 71.6045C478.573 70.5442 479.119 69.1691 479.119 67.4792C479.119 65.7562 478.573 64.3811 477.479 63.3539C476.386 62.2936 474.812 61.7634 472.757 61.7634H465.451V73.1453H472.757ZM492.147 61.7634V72.5985H499.304C501.292 72.5985 502.849 72.1181 503.976 71.1572C505.103 70.1963 505.666 68.8709 505.666 67.181C505.666 65.4911 505.103 64.1657 503.976 63.2048C502.849 62.2439 501.292 61.7634 499.304 61.7634H492.147ZM488.22 88.8512V58.334H499.403C502.485 58.334 504.937 59.0961 506.759 60.6203C508.615 62.1114 509.543 64.2983 509.543 67.181C509.543 69.6661 508.847 71.6376 507.455 73.0956C506.063 74.5535 504.175 75.4481 501.789 75.7795L510.785 88.8512H506.312L497.564 75.9286H492.147V88.8512H488.22ZM541.342 73.5926C541.342 78.1652 540.034 81.926 537.416 84.875C534.831 87.824 531.534 89.2985 527.525 89.2985C523.549 89.2985 520.252 87.824 517.634 84.875C515.05 81.926 513.758 78.1652 513.758 73.5926C513.758 68.9868 515.05 65.226 517.634 62.3102C520.252 59.3612 523.549 57.8867 527.525 57.8867C531.534 57.8867 534.831 59.3612 537.416 62.3102C540.034 65.226 541.342 68.9868 541.342 73.5926ZM537.416 73.5926C537.416 70.0472 536.505 67.1313 534.682 64.845C532.86 62.5587 530.474 61.4155 527.525 61.4155C524.609 61.4155 522.24 62.5587 520.418 64.845C518.595 67.1313 517.684 70.0472 517.684 73.5926C517.684 77.138 518.595 80.0539 520.418 82.3402C522.24 84.6265 524.609 85.7697 527.525 85.7697C530.474 85.7697 532.86 84.6265 534.682 82.3402C536.505 80.0539 537.416 77.138 537.416 73.5926ZM559.622 85.8194C561.014 85.8194 562.273 85.6371 563.4 85.2726C564.559 84.9081 565.636 84.3117 566.63 83.4833V76.2765H559.921V72.9962H570.259V84.9247C568.801 86.5483 567.111 87.6915 565.189 88.3542C563.3 88.9837 561.412 89.2985 559.523 89.2985C555.282 89.2985 551.836 87.8572 549.185 84.9744C546.567 82.0917 545.258 78.2977 545.258 73.5926C545.258 68.8543 546.667 65.0604 549.483 62.2108C552.3 59.328 555.795 57.8867 559.97 57.8867C561.76 57.8867 563.4 58.1352 564.891 58.6322C566.415 59.1292 567.707 59.7919 568.768 60.6203V64.7953C567.475 63.6356 566.1 62.7906 564.642 62.2605C563.184 61.6972 561.627 61.4155 559.97 61.4155C556.789 61.4155 554.188 62.5421 552.167 64.7953C550.179 67.0153 549.185 69.9478 549.185 73.5926C549.185 77.2374 550.129 80.1864 552.018 82.4396C553.907 84.6928 556.441 85.8194 559.622 85.8194ZM580.436 61.7634V72.5985H587.593C589.582 72.5985 591.139 72.1181 592.265 71.1572C593.392 70.1963 593.955 68.8709 593.955 67.181C593.955 65.4911 593.392 64.1657 592.265 63.2048C591.139 62.2439 589.582 61.7634 587.593 61.7634H580.436ZM576.51 88.8512V58.334H587.693C590.774 58.334 593.226 59.0961 595.049 60.6203C596.904 62.1114 597.832 64.2983 597.832 67.181C597.832 69.6661 597.136 71.6376 595.745 73.0956C594.353 74.5535 592.464 75.4481 590.079 75.7795L599.075 88.8512H594.601L585.854 75.9286H580.436V88.8512H576.51ZM615.067 63.2048L610.097 76.2268H620.087L615.067 63.2048ZM624.908 88.8512L621.379 79.6563H608.804L605.325 88.8512H601.349L613.278 58.334H616.955L628.884 88.8512H624.908ZM648.054 82.042H647.856L637.368 65.3917V88.8512H633.541V58.334H637.17L648.005 75.8789L658.79 58.334H662.22V88.8512H658.392V65.3917L648.054 82.042Z" fill="white"/>
<path d="M426.639 16.7934V94.8084" stroke="#0BC5BA" strokeWidth="4.6499" strokeLinecap="round"/>
</svg>
            </div>
            {/* Tabs */}
            <div style={{ display:"flex", gap:2, background:E.navySurf, borderRadius:9, padding:3, border:`1px solid ${E.border}` }}>
              {[{id:"compare",label:"Upgrade Compare"},{id:"matrix",label:"Full Matrix"},{id:"builder",label:"✦ Plan Builder"}].map(tab=>(
                <button key={tab.id} className="mode-btn" onClick={()=>{ setMode(tab.id); if(tab.id==="builder"){ setBuilderStep(0); setBuilderAnswers({}); setBuilderResult(null); setBuilderShowFeatures(false); } }} style={{
                  padding:"7px 20px", borderRadius:7, fontSize:12, fontWeight:600, letterSpacing:"0.01em",
                  background: mode===tab.id ? tab.id==="builder" ? `linear-gradient(135deg,${E.purple},${E.blue2})` : `linear-gradient(135deg,${E.teal},#0099A8)` : "transparent",
                  color: mode===tab.id ? "white" : E.textMut,
                  boxShadow: mode===tab.id ? tab.id==="builder" ? `0 2px 14px rgba(110,73,255,0.4)` : `0 2px 14px rgba(11,197,186,0.3)` : "none",
                }}>{tab.label}</button>
              ))}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: mode==="matrix" ? "none" : 980, margin:"0 auto", padding: mode==="matrix" ? "32px 24px 72px" : "32px 32px 72px" }}>

          {/* ── COMPARE ── */}
          {mode==="compare" && (
            <div className="fade-up">
              {/* Title */}
              <div style={{ marginBottom:32 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(11,197,186,0.08)", border:`1px solid rgba(11,197,186,0.2)`, borderRadius:999, padding:"5px 14px", marginBottom:16, boxShadow:"0 2px 12px rgba(11,197,186,0.08)" }}>
                  <div style={{ position:"relative", width:7, height:7 }}>
                    <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:E.teal, opacity:0.4, animation:"spin 2s linear infinite" }}/>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:E.teal }}/>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:E.teal, letterSpacing:"0.12em", textTransform:"uppercase" }}>Partner Upgrade Tool</span>
                </div>
                <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:"-0.03em", color:E.text, lineHeight:1.1, marginBottom:12 }}>
                  Plan Upgrade{" "}
                  <span style={{ background:`linear-gradient(90deg,${E.teal},#1CFFF1)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Comparison</span>
                </h1>
                <p style={{ fontSize:13, color:E.textSub, lineHeight:1.75, maxWidth:520 }}>
                  Select the customer's current plan and a proposed plan to see capabilities gained, pricing delta, and the full feature breakdown.
                </p>
              </div>

              {/* Plan selectors */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 52px 1fr", gap:12, alignItems:"stretch", marginBottom:20 }}>
                <PlanCard plan={fp} label="Current Plan" isCurrent families={families} selected={fromPlan} onChange={setFromPlan}/>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%",
                    background: isUp ? "rgba(11,197,186,0.1)" : "rgba(110,73,255,0.1)",
                    border:`1px solid ${isUp ? "rgba(11,197,186,0.4)" : "rgba(110,73,255,0.4)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:18, color: isUp ? E.teal : E.purple }}>→</div>
                </div>
                <PlanCard plan={tp} label="Proposed Plan" isCurrent={false} families={families} selected={toPlan} onChange={setToPlan}/>
              </div>

              {!isUp ? (
                <div style={{ background:"rgba(110,73,255,0.1)", border:`1px solid rgba(110,73,255,0.3)`, borderRadius:10, padding:"16px 20px", color:"#a78bfa", fontSize:14, fontWeight:500 }}>
                  ⚠ Select a higher-tier proposed plan to generate the upgrade comparison.
                </div>
              ) : (<>

                {/* ── Unified Summary Bar ── */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, marginBottom:12, display:"grid", gridTemplateColumns:"auto 1px auto 1px 1fr 1px auto", alignItems:"stretch", overflow:"hidden" }}>

                  {/* Net-new features */}
                  <div style={{ padding:"16px 24px", display:"flex", flexDirection:"column", justifyContent:"center", gap:4 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"rgba(110,73,255,0.7)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Net-New</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                      <span style={{ fontSize:36, fontWeight:800, color:E.purple, letterSpacing:"-0.04em", lineHeight:1 }}>{netNew}</span>
                      <span style={{ fontSize:11, color:E.textMut, fontWeight:500 }}>features</span>
                    </div>
                    <div style={{ fontSize:10, color:E.textMut }}>unlocked with {tp?.name}</div>
                  </div>

                  {/* Divider */}
                  <div style={{ background:E.border, margin:"12px 0" }}/>

                  {/* Per-user cost */}
                  <div style={{ padding:"16px 24px", display:"flex", flexDirection:"column", justifyContent:"center", gap:8 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:2 }}>Per User / Month</div>
                    <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:9, color:E.textMut, marginBottom:2, fontWeight:600, letterSpacing:"0.06em" }}>MSP</div>
                        <div style={{ fontSize:22, fontWeight:800, color:E.teal, letterSpacing:"-0.03em" }}>
                          {dMsp!=null ? `+${fmt(dMsp)}` : "—"}
                        </div>
                      </div>
                      {dMsrp!=null && <>
                        <div style={{ width:1, height:32, background:E.border }}/>
                        <div>
                          <div style={{ fontSize:9, color:E.textMut, marginBottom:2, fontWeight:600, letterSpacing:"0.06em" }}>MSRP</div>
                          <div style={{ fontSize:22, fontWeight:800, color:`${E.teal}77`, letterSpacing:"-0.03em" }}>{`+${fmt(dMsrp)}`}</div>
                        </div>
                      </>}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ background:E.border, margin:"12px 0" }}/>

                  {/* Calculator inputs */}
                  <div style={{ padding:"14px 20px", display:"flex", flexDirection:"column", justifyContent:"center", gap:10 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:E.teal, letterSpacing:"0.12em", textTransform:"uppercase" }}>Deal Calculator</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                      {/* Users */}
                      <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                        <span style={{ fontSize:9, color:E.textMut, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Users</span>
                        <input type="number" min="1" value={userCount}
                          onChange={e => setUserCount(Math.max(1, parseInt(e.target.value)||1))}
                          style={{ width:70, background:E.navySurf, border:`1px solid ${E.border}`, borderRadius:6, padding:"6px 8px", color:E.text, fontSize:13, fontWeight:700, fontFamily:"'Inter',sans-serif", outline:"none", textAlign:"center" }}/>
                      </div>
                      {/* From price */}
                      <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                        <span style={{ fontSize:9, color:E.textMut, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>{fp?.name} $/u</span>
                        <div style={{ position:"relative", width:80 }}>
                          <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:E.textMut, fontSize:11 }}>$</span>
                          <input type="number" min="0" step="0.01" value={calcFromPrice}
                            onChange={e => setFromPrice(parseFloat(e.target.value)||0)}
                            style={{ width:"100%", background:E.navySurf, border:`1px solid ${E.border}`, borderRadius:6, padding:"6px 8px 6px 18px", color:E.textSub, fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif", outline:"none" }}/>
                        </div>
                      </div>
                      <span style={{ color:E.textMut, fontSize:14, marginTop:14 }}>→</span>
                      {/* To price */}
                      <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                        <span style={{ fontSize:9, color:E.teal, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>{tp?.name} $/u</span>
                        <div style={{ position:"relative", width:80 }}>
                          <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:E.textMut, fontSize:11 }}>$</span>
                          <input type="number" min="0" step="0.01" value={calcToPrice}
                            onChange={e => setToPrice(parseFloat(e.target.value)||0)}
                            style={{ width:"100%", background:E.navySurf, border:`1px solid ${E.teal}44`, borderRadius:6, padding:"6px 8px 6px 18px", color:E.teal, fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif", outline:"none" }}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ background:E.border, margin:"12px 0" }}/>

                  {/* Totals */}
                  <div style={{ padding:"14px 20px", display:"flex", flexDirection:"column", justifyContent:"center", gap:8 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:2 }}>Deal Impact</div>
                    <div style={{ display:"flex", gap:16 }}>
                      <div>
                        <div style={{ fontSize:9, color:E.textMut, marginBottom:2, fontWeight:600, letterSpacing:"0.06em" }}>Monthly Δ</div>
                        <div style={{ fontSize:20, fontWeight:800, color:E.teal, letterSpacing:"-0.03em" }}>{fmtD(monthlyDelta)}</div>
                      </div>
                      <div style={{ width:1, height:32, background:E.border, alignSelf:"center" }}/>
                      <div>
                        <div style={{ fontSize:9, color:E.textMut, marginBottom:2, fontWeight:600, letterSpacing:"0.06em" }}>Annual Δ</div>
                        <div style={{ fontSize:20, fontWeight:800, color:E.purple, letterSpacing:"-0.03em" }}>{fmtD(annualDelta)}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:10, color:E.textMut }}>{userCount} users · ${currentMo.toFixed(2)} → ${proposedMo.toFixed(2)}/mo</div>
                  </div>
                </div>

                {/* ── Vertical Filter ── */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, padding:"16px 20px", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:2.5, height:14, borderRadius:2, background:E.blue2 }}/>
                      <span style={{ fontSize:10, fontWeight:700, color:E.blue2, textTransform:"uppercase", letterSpacing:"0.12em" }}>Customer Vertical</span>
                      <span style={{ fontSize:11, color:E.textMut }}>— highlights relevant features and tailors AI output</span>
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      <button onClick={()=>setVertical(null)}
                        style={{ padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                          background: vertical===null ? "rgba(118,162,188,0.15)" : "transparent",
                          border: `1px solid ${vertical===null ? E.textSub : E.borderSub}`,
                          color: vertical===null ? E.text : E.textMut }}>
                        All
                      </button>
                      {VERTICALS.map(v=>(
                        <button key={v.id} onClick={()=>setVertical(prev=>prev===v.id?null:v.id)}
                          style={{ padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                            background: vertical===v.id ? "rgba(11,197,186,0.12)" : "transparent",
                            border: `1px solid ${vertical===v.id ? E.teal+"88" : E.borderSub}`,
                            color: vertical===v.id ? E.teal : E.textMut }}>
                          {v.icon} {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {vertical && VerticalKeyGains({ vertical, VERTICALS, isUp, fp, tp, E })}
                </div>

                {/* ── Value + Emails section ── */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, padding:"20px 24px", marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: (valuePoints || valueLoading || valueError) ? 16 : 0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:2.5, height:14, borderRadius:2, background:E.teal }}/>
                      <span style={{ fontSize:10, fontWeight:700, color:E.teal, textTransform:"uppercase", letterSpacing:"0.12em" }}>Upgrade Value</span>
                      <span style={{ fontSize:10, color:E.textMut }}>— {fp.name} → {tp.name}</span>
                    </div>
                    <button onClick={generateValue} disabled={valueLoading}
                      style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 16px", borderRadius:7, border:`1px solid ${E.teal}55`, background: valueLoading ? "rgba(11,197,186,0.05)" : "rgba(11,197,186,0.1)", color: valueLoading ? E.textMut : E.teal, fontSize:12, fontWeight:600, cursor: valueLoading ? "not-allowed" : "pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
                      {valueLoading
                        ? <><div style={{ width:12, height:12, borderRadius:"50%", border:`2px solid ${E.teal}55`, borderTopColor:E.teal, animation:"spin 0.8s linear infinite" }}/> Generating…</>
                        : <>{valuePoints ? "↻ Regenerate" : "✦ Generate Value Summary"}{vertical ? ` · ${VERTICALS.find(v=>v.id===vertical)?.icon}${VERTICALS.find(v=>v.id===vertical)?.label}` : ""}</>}
                    </button>
                  </div>

                  {/* Value points */}
                  {valuePoints && (
                    <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: objections ? 20 : 0 }}>
                      {valuePoints.map((pt, i) => (
                        <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"10px 14px", background:E.navySurf, borderRadius:8, borderLeft:`3px solid ${E.teal}` }}>
                          <div style={{ width:22, height:22, borderRadius:6, background:"rgba(11,197,186,0.15)", border:`1px solid rgba(11,197,186,0.3)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                            <span style={{ fontSize:11, fontWeight:800, color:E.teal }}>{i+1}</span>
                          </div>
                          <p style={{ fontSize:13, color:E.text, lineHeight:1.7, margin:0, fontWeight:400 }}>{pt}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {valueError && (
                    <p style={{ fontSize:12, color:E.yellow, marginTop:8 }}>⚠ {valueError}</p>
                  )}

                  {/* Objection Handler */}
                  {objections && (
                    <div style={{ borderTop:`1px solid ${E.border}`, paddingTop:20, marginTop:20 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                        <div style={{ width:2.5, height:14, borderRadius:2, background:E.yellow }}/>
                        <span style={{ fontSize:10, fontWeight:700, color:E.yellow, textTransform:"uppercase", letterSpacing:"0.12em" }}>Common Objections</span>
                        <span style={{ fontSize:10, color:E.textMut }}>— {fp.name} → {tp.name}</span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {objections.map((obj, i) => (
                          <div key={i} style={{ background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:10, overflow:"hidden" }}>
                            <div style={{ padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start", borderBottom:`1px solid ${E.borderSub}` }}>
                              <span style={{ fontSize:10, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.1)", border:`1px solid rgba(255,202,41,0.25)`, borderRadius:4, padding:"2px 7px", flexShrink:0, marginTop:1 }}>Q</span>
                              <span style={{ fontSize:13, color:E.text, fontWeight:500, lineHeight:1.5 }}>{obj.q}</span>
                            </div>
                            <div style={{ padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
                              <span style={{ fontSize:10, fontWeight:700, color:E.teal, background:"rgba(11,197,186,0.1)", border:`1px solid rgba(11,197,186,0.25)`, borderRadius:4, padding:"2px 7px", flexShrink:0, marginTop:1 }}>A</span>
                              <span style={{ fontSize:13, color:E.textSub, lineHeight:1.65 }}>{obj.a}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Legend + Diff toggle + Print ── */}
                <div style={{ display:"flex", gap:16, marginBottom:14, alignItems:"center", flexWrap:"wrap", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.1em" }}>Legend</span>
                    {LEGEND.map((l,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                        {l.node}
                        <span style={{ fontSize:12, color:E.textSub }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {/* Diff toggle */}
                    <button onClick={()=>setShowDiffOnly(v=>!v)}
                      style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:7, border:`1px solid ${showDiffOnly ? E.teal+"88" : E.border}`, background: showDiffOnly ? "rgba(11,197,186,0.12)" : E.navyCard, color: showDiffOnly ? E.teal : E.textMut, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}>
                      <div style={{ width:12, height:12, borderRadius:2, border:`1.5px solid ${showDiffOnly ? E.teal : E.textMut}`, background: showDiffOnly ? E.teal : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {showDiffOnly && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke={E.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                      </div>
                      Show differences only
                    </button>
                    {/* Print button */}
                    <button onClick={()=>window.print()}
                      style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:7, border:`1px solid ${E.border}`, background:E.navyCard, color:E.textMut, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
                      className="no-print">
                      ⎙ Print / Save PDF
                    </button>
                  </div>
                </div>

                {/* Feature table */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:14, overflow:"visible" }}>
                  {/* Header row — sticky */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 26px 120px 120px", padding:"11px 16px", background:E.navyMid, borderBottom:`1px solid ${E.border}`, position:"sticky", top:0, zIndex:10, boxShadow:"0 3px 8px rgba(0,0,0,0.3)" }}>
                    {[["Feature","left"],["?","center"],[fp.name,"center"],[tp.name,"center"]].map(([h,a],i)=>(
                      <div key={i} style={{ fontSize:10, fontWeight:700, color: i===3 ? E.teal : E.textMut, letterSpacing:"0.1em", textTransform:"uppercase", textAlign:a }}>{h}</div>
                    ))}
                  </div>

                  {FEATURE_SECTIONS.map(section=>{
                    const isExp = expanded[section.id];
                    return (
                      <div key={section.id}>
                        <div className="sec-hdr" onClick={()=>toggle(section.id)}
                          style={{ display:"grid", gridTemplateColumns:"1fr 26px 120px 120px", padding:"9px 16px", background:E.navyMid, borderTop:`1px solid ${E.border}`, borderBottom:`1px solid ${E.border}`, transition:"background 0.15s" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:2.5, height:14, borderRadius:2, background:section.color }}/>
                            <span style={{ fontSize:10, fontWeight:700, color:section.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>{section.label}</span>
                            {section.isAddons && <span style={{ fontSize:9, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.1)", border:`1px solid ${E.yellow}40`, padding:"1px 7px", borderRadius:3, letterSpacing:"0.06em" }}>PAID OPTIONS</span>}
                          </div>
                          <div/><div/>
                          <div style={{ textAlign:"right", fontSize:11, color:E.textMut }}>{isExp?"▲":"▼"}</div>
                        </div>
                        {isExp && section.features.filter(feat => {
                    if(!showDiffOnly) return true;
                    const fv = fp.features[feat.id];
                    const tv = tp.features[feat.id];
                    const norm = v => v===false||v===undefined ? "none" : v===true ? "yes" : String(v);
                    return norm(fv) !== norm(tv);
                  }).map(feat=>{
                    const vertObj = vertical ? VERTICALS.find(v=>v.id===vertical) : null;
                    const isVerticalHighlight = vertObj ? vertObj.highlights.includes(feat.id) : false;
                    return (
                      <FeatureRow key={feat.id} feat={feat} value={tp.features[feat.id]} compareValue={fp.features[feat.id]} isVerticalHighlight={isVerticalHighlight}/>
                    );
                  })}
                      </div>
                    );
                  })}
                </div>

                {/* Add-Ons Pricing Card */}
                {(() => {
                  const addonSection = FEATURE_SECTIONS.find(s => s.isAddons);
                  const availableAddons = addonSection?.features.filter(f => tp.features[f.id] === "optional") || [];
                  if (!availableAddons.length) return null;
                  return (
                    <div style={{ marginTop:14, background:E.navyCard, border:`1px solid rgba(255,202,41,0.2)`, borderRadius:12, overflow:"hidden" }}>
                      <div style={{ padding:"14px 20px", background:"rgba(255,202,41,0.05)", borderBottom:`1px solid rgba(255,202,41,0.15)`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:2.5, height:14, borderRadius:2, background:E.yellow }}/>
                          <span style={{ fontSize:10, fontWeight:700, color:E.yellow, textTransform:"uppercase", letterSpacing:"0.12em" }}>Optional Add-Ons available on {tp.name}</span>
                        </div>
                        <span style={{ fontSize:11, color:E.textMut }}>Purchased separately · 1:1 with platform licenses</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:0 }}>
                        {availableAddons.map((f, i) => (
                          <div key={f.id} style={{ padding:"14px 20px", borderTop: i > 0 ? `1px solid ${E.borderSub}` : "none", display:"flex", alignItems:"flex-start", gap:12, borderRight: i % 2 === 0 ? `1px solid ${E.borderSub}` : "none" }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:700, color:E.text, marginBottom:3 }}>{f.label}</div>
                              <div style={{ fontSize:11, color:E.textMut, lineHeight:1.5 }}>{f.desc?.split(".")[0]}.</div>
                            </div>
                            <div style={{ flexShrink:0, textAlign:"right" }}>
                              <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>MSP</div>
                              <div style={{ fontSize:18, fontWeight:800, color:E.yellow, letterSpacing:"-0.02em" }}>${(f.mspPrice ?? f.price)?.toFixed(2)}</div>
                              {f.price !== f.mspPrice && <div style={{ fontSize:10, color:E.textMut, textDecoration:"line-through" }}>MSRP ${f.price?.toFixed(2)}</div>}
                              <div style={{ fontSize:9, color:E.textMut }}>per user / mo</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Footer */}
                <div style={{ marginTop:14, display:"flex", alignItems:"flex-start", gap:14, background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"rgba(11,197,186,0.1)", border:`1px solid rgba(11,197,186,0.25)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14 }}>↑</div>
                  <p style={{ fontSize:12, color:E.textSub, lineHeight:1.8 }}>
                    <span style={{ color:E.text, fontWeight:600 }}>{fp.name} → {tp.name}: </span>
                    {fp.pricing && tp.pricing
                      ? `MSP cost increases by ${fmt(dMsp??0)}/user/mo and unlocks ${netNew} net-new capabilities.`
                      : `Unlocks ${netNew} net-new capabilities inside Egnyte.`}
                    {" "}<span style={{ color:E.yellow, fontWeight:600 }}>ADD-ON</span> = paid separately.{" "}
                    <span style={{ color:E.teal, fontWeight:600 }}>BUNDLED</span> = included at no extra charge in this plan.
                  </p>
                </div>
              </>)}
            </div>
          )}

          {/* ── MATRIX ── */}
          {mode==="matrix" && (
            <div className="fade-up">
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(11,197,186,0.1)", border:`1px solid rgba(11,197,186,0.25)`, borderRadius:999, padding:"4px 14px", marginBottom:14 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:E.teal }}/>
                  <span style={{ fontSize:11, fontWeight:600, color:E.teal, letterSpacing:"0.1em", textTransform:"uppercase" }}>All Plans</span>
                </div>
                <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:"-0.03em", color:E.text, marginBottom:8 }}>
                  Full Feature{" "}
                  <span style={{ background:`linear-gradient(90deg,${E.teal},#1CFFF1)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Matrix</span>
                </h1>
                <p style={{ fontSize:13, color:E.textSub, lineHeight:1.7 }}>All plans and capabilities across Legacy, Gen 3 MSP, and Gen 4 MSP.</p>
              </div>

              <div style={{ display:"flex", gap:20, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontSize:10, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.1em" }}>Legend</span>
                {LEGEND.slice(0,3).map((l,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                    {l.node}<span style={{ fontSize:12, color:E.textSub }}>{l.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderRadius:14, border:`1px solid ${E.border}`, overflowX:"visible" }}>
                <table style={{ borderCollapse:"collapse", width:"100%", tableLayout:"fixed" }}>
                  <colgroup>
                    <col style={{ width:280 }}/>
                    {PLANS.map(p => <col key={p.id} style={{ width:110 }}/>)}
                  </colgroup>
                  <thead>
                    {/* Row 1: Generation group headers — sticky below nav */}
                    <tr>
                      <th style={{ padding:"12px 16px", textAlign:"left", position:"sticky", top:61, left:0, background:"#0B1D35", zIndex:30, borderBottom:`1px solid ${E.border}`, borderRight:`1px solid ${E.border}` }}>
                        <span style={{ fontSize:10, fontWeight:700, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase" }}>Feature</span>
                      </th>
                      {Object.entries(families).map(([fam,ps])=>{
                        const famAccent = fam==="Legacy" ? E.textSub : fam.includes("Gen 3") ? E.blue : E.teal;
                        const famBg = fam==="Legacy" ? "#0D1F33" : fam.includes("Gen 3") ? "#0B2040" : "#0B2238";
                        return (
                          <th key={fam} colSpan={ps.length} style={{ padding:"11px 12px", textAlign:"center", position:"sticky", top:61, background:famBg, zIndex:20, borderBottom:`2px solid ${famAccent}55`, borderLeft:`2px solid ${famAccent}44` }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                              <div style={{ width:6, height:6, borderRadius:"50%", background:famAccent, flexShrink:0 }}/>
                              <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:famAccent }}>{fam}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                    {/* Row 2: Plan names — sticky below row 1 */}
                    <tr>
                      <th style={{ padding:"10px 16px", position:"sticky", top:100, left:0, background:"#0C1E32", zIndex:30, borderBottom:`2px solid rgba(11,197,186,0.2)`, borderRight:`1px solid ${E.border}` }}>
                        <span style={{ fontSize:9, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase" }}>Docs</span>
                      </th>
                      {PLANS.map((p, pi)=>{
                        const famAccent = p.family==="Legacy" ? E.textSub : p.family.includes("Gen 3") ? E.blue : E.teal;
                        const famBg = p.family==="Legacy" ? "#0D1F33" : p.family.includes("Gen 3") ? "#0B2040" : "#0B2238";
                        const isFirstInFamily = pi===0 || PLANS[pi-1]?.family !== p.family;
                        return (
                          <th key={p.id} style={{ padding:"10px 8px", textAlign:"center", position:"sticky", top:100, background:famBg, zIndex:20, borderBottom:`2px solid ${famAccent}55`, borderLeft: isFirstInFamily ? `2px solid ${famAccent}44` : `1px solid ${E.borderSub}` }}>
                            <div style={{ fontSize:12, fontWeight:700, color:E.text, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                            {p.pricing?.msrp!=null && <div style={{ fontSize:10, color:famAccent, fontWeight:600 }}>${p.pricing.msrp.toFixed(2)}/mo</div>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURE_SECTIONS.map(section=>(
                      <React.Fragment key={section.id}>
                        <tr style={{ background:E.navyMid }}>
                          <td colSpan={PLANS.length+1} style={{ padding:"8px 16px", borderTop:`1px solid ${E.border}`, borderBottom:`1px solid ${E.border}` }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:2.5, height:12, borderRadius:2, background:section.color }}/>
                              <span style={{ fontSize:10, fontWeight:700, color:section.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>{section.label}</span>
                              {section.isAddons && <span style={{ fontSize:9, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.1)", border:`1px solid ${E.yellow}40`, padding:"1px 7px", borderRadius:3 }}>PAID OPTIONS BELOW</span>}
                            </div>
                          </td>
                        </tr>
                        {section.features.map((feat,fi)=>(
                          <tr key={feat.id} className="feat-row" style={{ background: fi%2===0 ? E.navyCard : E.navySurf, transition:"background 0.15s" }}>
                            <td style={{ padding:"9px 16px", fontSize:13, color:E.textSub, position:"sticky", left:0, background:"inherit", borderRight:`1px solid ${E.border}`, zIndex:5 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                                {feat.label}
                                {feat.price != null && <span style={{ fontSize:9, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.08)", border:`1px solid rgba(255,202,41,0.2)`, borderRadius:4, padding:"1px 6px" }}>MSP ${(feat.mspPrice ?? feat.price).toFixed(2)}/u</span>}
                                <FeatureTooltip feat={feat} />
                              </div>
                            </td>
                            {PLANS.map((p, pi)=>{
                              const famAccent = p.family==="Legacy" ? E.textSub : p.family.includes("Gen 3") ? E.blue : E.teal;
                              const famTint = p.family==="Legacy" ? "rgba(118,162,188,0.03)" : p.family.includes("Gen 3") ? "rgba(3,123,189,0.04)" : "rgba(11,197,186,0.04)";
                              const isFirstInFamily = pi===0 || PLANS[pi-1]?.family !== p.family;
                              return (
                                <td key={p.id} style={{ padding:"9px 8px", textAlign:"center", background:famTint, borderLeft: isFirstInFamily ? `2px solid ${famAccent}33` : `1px solid ${E.borderSub}` }}>
                                  <StatusCell value={p.features[feat.id]}/>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop:14, padding:"12px 18px", background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:10, fontSize:12, color:E.textSub, lineHeight:1.8 }}>
                <span style={{ color:E.yellow, fontWeight:600 }}>ADD-ON:</span> Available for purchase separately on top of the plan.{" "}
                <span style={{ color:E.teal, fontWeight:600 }}>BUNDLED:</span> Add-on package included at no extra cost.{" "}
                Legacy MSP pricing varies — contact your Egnyte partner team. Gen 3/4 pricing is MSRP per user/month.
              </div>
            </div>
          )}
          {/* ── PLAN BUILDER ── */}
          {mode==="builder" && (
            <div className="fade-up" style={{ maxWidth:720, margin:"0 auto" }}>

              {/* Header */}
              <div style={{ marginBottom:32 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(110,73,255,0.1)", border:`1px solid rgba(110,73,255,0.25)`, borderRadius:999, padding:"5px 14px", marginBottom:16 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:E.purple, letterSpacing:"0.12em", textTransform:"uppercase" }}>✦ Plan Builder</span>
                </div>
                <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:"-0.03em", color:E.text, lineHeight:1.1, marginBottom:12 }}>
                  Find the Right{" "}
                  <span style={{ background:`linear-gradient(90deg,${E.purple},${E.teal})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Gen 4 Plan</span>
                </h1>
                <p style={{ fontSize:13, color:E.textSub, lineHeight:1.75 }}>
                  Answer a few questions about the customer and we'll recommend the best fit — no Egnyte expertise required.
                </p>
              </div>

              {!builderResult ? (() => {
                const q = BUILDER_QUESTIONS[builderStep];
                const isMulti = q.type === "multi";
                const currentAns = builderAnswers[q.id];
                const hasAnswer = isMulti ? (currentAns?.length > 0) : !!currentAns;
                const progress = (builderStep / BUILDER_QUESTIONS.length) * 100;

                const selectOption = (optId) => {
                  if (isMulti) {
                    const prev = builderAnswers[q.id] || [];
                    const next = prev.includes(optId) ? prev.filter(x=>x!==optId) : [...prev, optId];
                    setBuilderAnswers(a => ({...a, [q.id]: next}));
                  } else {
                    setBuilderAnswers(a => ({...a, [q.id]: optId}));
                  }
                };

                const next = () => {
                  if (builderStep < BUILDER_QUESTIONS.length - 1) {
                    setBuilderStep(s => s+1);
                  } else {
                    setBuilderResult(scoreBuilder(builderAnswers));
                  }
                };

                const back = () => {
                  if (builderStep > 0) setBuilderStep(s => s-1);
                };

                return (
                  <div>
                    {/* Progress bar */}
                    <div style={{ marginBottom:24 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:11, color:E.textMut, fontWeight:600 }}>Question {builderStep+1} of {BUILDER_QUESTIONS.length}</span>
                        <span style={{ fontSize:11, color:E.textMut }}>{Math.round(progress)}% complete</span>
                      </div>
                      <div style={{ height:4, background:E.borderSub, borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${E.purple},${E.teal})`, borderRadius:2, transition:"width 0.4s ease" }}/>
                      </div>
                    </div>

                    {/* Question card */}
                    <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:16, padding:"28px 32px", marginBottom:20, boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
                      <div style={{ marginBottom:24 }}>
                        <h2 style={{ fontSize:20, fontWeight:800, color:E.text, marginBottom:6, lineHeight:1.3 }}>{q.q}</h2>
                        <p style={{ fontSize:13, color:E.textMut }}>{q.sub}</p>
                        {isMulti && <p style={{ fontSize:11, color:E.purple, marginTop:6, fontWeight:600 }}>Select all that apply — or skip if none apply</p>}
                      </div>

                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {q.options.map(opt => {
                          const selected = isMulti ? (currentAns||[]).includes(opt.id) : currentAns===opt.id;
                          return (
                            <button key={opt.id} onClick={()=>selectOption(opt.id)}
                              style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 18px", borderRadius:10, border:`1.5px solid ${selected ? E.purple : E.border}`, background: selected ? "rgba(110,73,255,0.1)" : E.navySurf, cursor:"pointer", textAlign:"left", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
                              <div style={{ width:36, height:36, borderRadius:8, background: selected ? "rgba(110,73,255,0.2)" : "rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, marginTop:2 }}>{opt.icon}</div>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:14, fontWeight:700, color: selected ? E.text : E.textSub, marginBottom:3 }}>{opt.label}</div>
                                <div style={{ fontSize:12, color:E.textMut, lineHeight:1.5 }}>{opt.desc}</div>
                              </div>
                              <div style={{ width:20, height:20, borderRadius: isMulti ? 4 : "50%", border:`2px solid ${selected ? E.purple : E.border}`, background: selected ? E.purple : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:8, transition:"all 0.15s" }}>
                                {selected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nav buttons */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <button onClick={back} disabled={builderStep===0}
                        style={{ padding:"10px 22px", borderRadius:8, border:`1px solid ${E.border}`, background:"transparent", color: builderStep===0 ? E.textMut+"44" : E.textMut, fontSize:13, fontWeight:600, cursor: builderStep===0 ? "not-allowed" : "pointer", fontFamily:"'Inter',sans-serif" }}>
                        ← Back
                      </button>
                      <button onClick={next} disabled={!hasAnswer && !isMulti}
                        style={{ padding:"10px 28px", borderRadius:8, border:"none", background: (hasAnswer||isMulti) ? `linear-gradient(135deg,${E.purple},${E.blue2})` : E.navySurf, color: (hasAnswer||isMulti) ? "white" : E.textMut, fontSize:13, fontWeight:700, cursor:(hasAnswer||isMulti) ? "pointer" : "not-allowed", fontFamily:"'Inter',sans-serif", boxShadow:(hasAnswer||isMulti) ? "0 4px 16px rgba(110,73,255,0.4)" : "none", transition:"all 0.15s" }}>
                        {builderStep === BUILDER_QUESTIONS.length - 1 ? "Get My Recommendation →" : "Next →"}
                      </button>
                    </div>
                  </div>
                );
              })() : (() => {
                const { winner, totals, ranked } = builderResult;
                const plan = PLANS.find(p=>p.id===winner);
                const meta = PLAN_BUILDER_MAP[winner];
                const maxScore = ranked[0][1];

                // Key reasons based on highest-scoring answers
                const reasons = [];
                BUILDER_QUESTIONS.forEach(q => {
                  const ans = builderAnswers[q.id];
                  const ids = Array.isArray(ans) ? ans : ans ? [ans] : [];
                  ids.forEach(id => {
                    const opt = q.options.find(o=>o.id===id);
                    if (opt && opt.scores[winner] >= 3) reasons.push(opt.label);
                  });
                });

                return (
                  <div>
                    {/* Result card */}
                    <div style={{ background:meta.bg, border:`1.5px solid ${meta.border}`, borderRadius:16, padding:"28px 32px", marginBottom:16, boxShadow:`0 8px 40px rgba(0,0,0,0.4)` }}>

                      {/* Plan name + badge */}
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, gap:16, flexWrap:"wrap" }}>
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:meta.color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>Recommended Plan</div>
                          <div style={{ fontSize:48, fontWeight:900, color:meta.color, letterSpacing:"-0.04em", lineHeight:1 }}>{meta.name}</div>
                        </div>
                        {/* Pricing block — clean */}
                        <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:12, padding:"14px 20px", textAlign:"center", flexShrink:0 }}>
                          <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>MSP Price</div>
                          {plan?.pricing?.msp != null ? (
                            <div style={{ display:"flex", alignItems:"baseline", gap:2, justifyContent:"center" }}>
                              <span style={{ fontSize:32, fontWeight:900, color:meta.color, letterSpacing:"-0.03em" }}>${plan.pricing.msp.toFixed(2)}</span>
                              <span style={{ fontSize:12, color:E.textMut, fontWeight:500 }}>/user/mo</span>
                            </div>
                          ) : <div style={{ fontSize:18, fontWeight:700, color:E.textMut }}>Contact Egnyte</div>}
                          {plan?.pricing?.msrp != null && (
                            <div style={{ fontSize:11, color:E.textMut, marginTop:4 }}>MSRP ${plan.pricing.msrp.toFixed(2)}/user/mo</div>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      <p style={{ fontSize:13, color:E.textSub, lineHeight:1.7, marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${meta.border}` }}>{plan?.summary}</p>

                      {/* Why this plan */}
                      {reasons.length > 0 && (
                        <div style={{ marginBottom:20 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:meta.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Why this plan fits</div>
                          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                            {reasons.slice(0,3).map((r,i) => (
                              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:18, height:18, borderRadius:"50%", background:meta.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke={E.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <span style={{ fontSize:13, color:E.textSub, lineHeight:1.5 }}>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Score bars */}
                      <div style={{ borderTop:`1px solid ${meta.border}`, paddingTop:16 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Plan fit scores</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                          {ranked.map(([planId, score]) => {
                            const m = PLAN_BUILDER_MAP[planId];
                            const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
                            return (
                              <div key={planId} style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:70, fontSize:11, fontWeight:700, color: planId===winner ? m.color : E.textMut, textAlign:"right", flexShrink:0 }}>{m.name}</div>
                                <div style={{ flex:1, height:8, background:E.borderSub, borderRadius:4, overflow:"hidden" }}>
                                  <div style={{ height:"100%", width:`${pct}%`, background: planId===winner ? m.color : E.textMut, borderRadius:4, opacity: planId===winner ? 1 : 0.25, transition:"width 0.6s ease" }}/>
                                </div>
                                <div style={{ width:24, fontSize:11, color: planId===winner ? m.color : E.textMut, fontWeight:600, flexShrink:0 }}>{score}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Feature toggle */}
                    <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, marginBottom:16, overflow:"hidden" }}>
                      <button onClick={()=>setBuilderShowFeatures(v=>!v)}
                        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:2.5, height:14, borderRadius:2, background:meta.color }}/>
                          <span style={{ fontSize:11, fontWeight:700, color:meta.color, textTransform:"uppercase", letterSpacing:"0.12em" }}>What's included in {meta.name}</span>
                        </div>
                        <span style={{ color:E.textMut, fontSize:12 }}>{builderShowFeatures ? "▲" : "▼"}</span>
                      </button>
                      {builderShowFeatures && (
                        <div style={{ borderTop:`1px solid ${E.border}` }}>
                          {FEATURE_SECTIONS.map(section => {
                            const sectionFeats = section.features.filter(f => {
                              const v = plan?.features[f.id];
                              return v === true || v === "addon-included" || v === "optional";
                            });
                            if (sectionFeats.length === 0) return null;
                            return (
                              <div key={section.id}>
                                <div style={{ padding:"8px 20px", background:E.navySurf, borderTop:`1px solid ${E.borderSub}`, display:"flex", alignItems:"center", gap:8 }}>
                                  <div style={{ width:2, height:12, borderRadius:1, background:section.color }}/>
                                  <span style={{ fontSize:9, fontWeight:700, color:section.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>{section.label}</span>
                                </div>
                                {sectionFeats.map(f => {
                                  const v = plan?.features[f.id];
                                  return (
                                    <div key={f.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 20px", borderTop:`1px solid ${E.borderSub}` }}>
                                      <span style={{ fontSize:12, color:E.textSub }}>{f.label}</span>
                                      {v === "optional" ? (
                                        <span style={{ fontSize:9, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.1)", border:`1px solid ${E.yellow}55`, borderRadius:3, padding:"2px 6px" }}>ADD-ON</span>
                                      ) : (
                                        <div style={{ width:16, height:16, borderRadius:"50%", background:meta.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke={E.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      <button onClick={()=>{ setToPlan(winner); setMode("compare"); }}
                        style={{ flex:1, minWidth:200, padding:"14px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${meta.color},${meta.color}cc)`, color: winner==="starter" ? E.navy : "white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", boxShadow:`0 4px 20px ${meta.color}44` }}>
                        Compare {meta.name} vs Current Plan →
                      </button>
                      <button onClick={()=>{ setBuilderStep(0); setBuilderAnswers({}); setBuilderResult(null); setBuilderShowFeatures(false); }}
                        style={{ padding:"14px 24px", borderRadius:10, border:`1px solid ${E.border}`, background:E.navyCard, color:E.textMut, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                        Start Over
                      </button>
                    </div>

                    <p style={{ fontSize:11, color:E.textMut, marginTop:16, lineHeight:1.7 }}>
                      This recommendation is based on the information provided. For complex or regulated environments, discuss with your Egnyte partner team to validate the best fit.
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </main>
      </div>
    </>
  );
}