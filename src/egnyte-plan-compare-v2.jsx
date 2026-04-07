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
        label: "Snapshot & Recovery Add-On",
        price: 10.00,
        mspPrice: 8.00,
        priceNote: "per user/mo · 1:1 with platform licenses",
        desc: "Adds point-in-time snapshot recovery to your plan. Provides a 30-day lookback window on IFS and Elite, allowing admins to restore individual files or entire folder structures to a pre-attack state. 90-day coverage is natively included in Ultimate and is not available as a separate add-on. Critical for cyber insurance requirements.",
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
    summary: "Effective and secure collaboration solution to get your team up and running quickly and easily.",
    pricing: { msrp: 8, msp: null },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "Variable", upload_limit: "10 GB", domains: "1",
      sso: false, mfa: false, granular_perms: true, compliant_storage: true,
      audit: false,
      edge_caching: false, role_admin: false, device_controls: false,
      data_residency: false, encryption_keys: false, link_throttling: false, migration_tools: false,
      // Intelligence — none
      single_doc_qa: false, copilot: false, ai_search: false, ai_workflows: false,
      text_search: false, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: false, link_sharing: false,
      viewer_permission: false, email_sharing: false,
      pdf_handler: false, esignature: false, watermarking: false, content_safeguards: false,
      standard_workflows: false, advanced_workflows: false, advanced_video: false,
      file_versioning: false, advanced_snapshot: false, snapshot_90: false,
      // Governance — none
      lifecycle_reports: false, lifecycle_policies: false, unified_perms: false,
      suspicious_login: false, sharing_issues: false, unusual_access: false,
      inactive_user: false, malformed_perms: false, ransomware_artifact: false,
      ransomware_behavioral: false, sensitive_data: false, doc_labeling: false,
      compliance_monitoring: false, sensitive_mgmt: false, api_remediation: false,
      auto_remediation: false, legal_hold: false, rot_data: false,
      // Integrations
      google_workspace: false, m365: true, dlp: false, app_integrations: true,
      // Add-ons
      project_hub: false, doc_portal: false,
      salesforce_integration: "optional", specialized_file_handler: false, snapshot_addon: false,
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
      // Core Platform
      encryption: true, storage_per_user: "Variable", upload_limit: "10 GB", domains: "1",
      sso: true, mfa: false, granular_perms: true, compliant_storage: true,
      audit: false,
      edge_caching: false, role_admin: false, device_controls: false,
      data_residency: false, encryption_keys: false, link_throttling: false, migration_tools: false,
      // Intelligence — none
      single_doc_qa: false, copilot: false, ai_search: false, ai_workflows: false,
      text_search: false, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: false, link_sharing: false,
      viewer_permission: false, email_sharing: false,
      pdf_handler: false, esignature: false, watermarking: false, content_safeguards: false,
      standard_workflows: false, advanced_workflows: false, advanced_video: false,
      file_versioning: false, advanced_snapshot: false, snapshot_90: false,
      // Governance — none
      lifecycle_reports: false, lifecycle_policies: false, unified_perms: false,
      suspicious_login: false, sharing_issues: false, unusual_access: false,
      inactive_user: false, malformed_perms: false, ransomware_artifact: false,
      ransomware_behavioral: false, sensitive_data: false, doc_labeling: false,
      compliance_monitoring: false, sensitive_mgmt: false, api_remediation: false,
      auto_remediation: false, legal_hold: false, rot_data: false,
      // Integrations
      google_workspace: false, m365: true, dlp: false, app_integrations: true,
      // Add-ons
      project_hub: false, doc_portal: false,
      salesforce_integration: "optional", specialized_file_handler: false, snapshot_addon: false,
    },
  },
  {
    id: "legacy_enterprise",
    name: "Legacy Enterprise",
    family: "Legacy",
    gen: "Gen 1–2",
    summary: "Medium business data governance, advanced compliance and threat management.",
    pricing: { msrp: 30, msp: null },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "Variable", upload_limit: "10 GB", domains: "1",
      sso: true, mfa: false, granular_perms: true, compliant_storage: true,
      audit: false,
      edge_caching: true, role_admin: true, device_controls: false,
      data_residency: false, encryption_keys: false, link_throttling: false, migration_tools: false,
      // Intelligence — none
      single_doc_qa: false, copilot: false, ai_search: false, ai_workflows: false,
      text_search: false, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: false, link_sharing: false,
      viewer_permission: false, email_sharing: false,
      pdf_handler: false, esignature: false, watermarking: false, content_safeguards: false,
      standard_workflows: false, advanced_workflows: false, advanced_video: false,
      file_versioning: false, advanced_snapshot: false, snapshot_90: false,
      // Governance — none
      lifecycle_reports: false, lifecycle_policies: false, unified_perms: false,
      suspicious_login: false, sharing_issues: false, unusual_access: false,
      inactive_user: false, malformed_perms: false, ransomware_artifact: false,
      ransomware_behavioral: false, sensitive_data: false, doc_labeling: false,
      compliance_monitoring: false, sensitive_mgmt: false, api_remediation: false,
      auto_remediation: false, legal_hold: false, rot_data: false,
      // Integrations
      google_workspace: false, m365: true, dlp: false, app_integrations: true,
      // Add-ons
      project_hub: false, doc_portal: false,
      salesforce_integration: "optional", specialized_file_handler: false, snapshot_addon: false,
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
      encryption: true, storage_per_user: "100 GB", upload_limit: "100 GB", domains: "1",
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
    pricing: { msrp: 25, msp: 20 },
    features: {
      encryption: true, storage_per_user: "200 GB", upload_limit: "100 GB", domains: "1",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true, link_throttling: "optional", migration_tools: true,
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
      salesforce_integration: "optional", specialized_file_handler: "optional", snapshot_addon: false,
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
  const hideTimer = React.useRef(null);
  if (!feat.desc && !feat.helpUrl) return <div style={{width:18}}/>;

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 150);
  };
  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const handleMouseEnter = () => {
    cancelHide();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const tooltipW = 280;
      const goLeft = r.right + tooltipW + 12 > window.innerWidth;
      const left = goLeft ? r.left - tooltipW - 8 : r.right + 8;
      const top = r.top + r.height / 2;
      const clampedTop = Math.max(10, Math.min(top, window.innerHeight - 180));
      setCoords({ top: clampedTop, left });
    }
    setVisible(true);
  };

  const tooltip = visible ? (
    <div
      onMouseEnter={cancelHide}
      onMouseLeave={scheduleHide}
      style={{
        position:"fixed", top:coords.top, left:coords.left,
        transform:"translateY(-50%)",
        width:280, zIndex:99999,
        background:"#0F1E38",
        border:`1px solid rgba(11,197,186,0.35)`,
        borderRadius:10, padding:"12px 14px",
        boxShadow:"0 8px 32px rgba(0,0,0,0.7)",
        pointerEvents:"auto",
        cursor:"default",
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
        onMouseLeave={scheduleHide}
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
// Checklist model: MSP checks all requirements that apply, scored against Gen 4 plans.
const BUILDER_QUESTIONS = [
  {
    id: "infra",
    q: "How is the customer currently managing files and storage?",
    sub: "This helps us understand where they're starting from",
    options: [
      { id: "fileserver", icon: "🖥", label: "On-premises file servers or NAS devices",          desc: "Still running Windows file servers, VPN for remote access, or hardware due for refresh",          scores: { starter:5, ifs:3, elite:1, ultimate:0 } },
      { id: "sharepoint", icon: "📎", label: "Heavily reliant on SharePoint or OneDrive",          desc: "Using Microsoft 365 but frustrated with SharePoint complexity or governance gaps",                scores: { starter:3, ifs:4, elite:2, ultimate:0 } },
      { id: "scattered",  icon: "📂", label: "Files scattered across multiple tools and silos",    desc: "Content split between email, Dropbox, local drives, and file servers — no single source of truth",scores: { starter:2, ifs:4, elite:3, ultimate:1 } },
      { id: "cloud",      icon: "☁",  label: "Already on a cloud platform but outgrowing it",     desc: "Current solution lacks governance, compliance controls, or security monitoring they now need",     scores: { starter:0, ifs:2, elite:4, ultimate:3 } },
    ]
  },
  {
    id: "scale",
    q: "How many users need access, and how are they distributed?",
    sub: "Include staff, contractors, and regular external collaborators",
    options: [
      { id: "tiny",  icon: "👤", label: "Under 25 users — single location or small remote team", desc: "Small business standardizing on cloud file storage and basic collaboration",                        scores: { starter:5, ifs:2, elite:0, ultimate:0 } },
      { id: "small", icon: "👥", label: "25–100 users — growing team, possibly multi-location",   desc: "Mid-market company needing consistent access across offices and hybrid workers",                   scores: { starter:2, ifs:4, elite:2, ultimate:0 } },
      { id: "mid",   icon: "🏢", label: "100–500 users — multiple departments or job sites",      desc: "Organization-wide deployment with role-based admin and advanced workflows",                       scores: { starter:0, ifs:2, elite:4, ultimate:2 } },
      { id: "large", icon: "🏙", label: "500+ users — enterprise, multiple offices or countries", desc: "Enterprise scale requiring data residency, encryption key management, and full governance",        scores: { starter:0, ifs:0, elite:3, ultimate:5 } },
    ]
  },
  {
    id: "collab",
    q: "What best describes their collaboration and workflow needs?",
    sub: "Select all that apply — someone can need both approvals and lifecycle policies",
    type: "multi",
    options: [
      { id: "basic",     icon: "📧", label: "Basic sharing — teams need a clean shared drive with external link sharing", desc: "Replace email attachments and consumer tools with a secure, organized file platform", scores: { starter:4, ifs:2, elite:0, ultimate:0 } },
      { id: "workflows", icon: "✍",  label: "Structured workflows — approvals, e-signatures, and PDF editing",          desc: "Contracts, proposals, and SOPs need repeatable review and sign-off with audit trails",    scores: { starter:0, ifs:5, elite:3, ultimate:1 } },
      { id: "advanced",  icon: "⚙",  label: "Advanced workflows — multi-step, automated, integrated with other systems", desc: "Complex cross-department processes that trigger actions in CRM, ERP, or other tools",    scores: { starter:0, ifs:2, elite:5, ultimate:2 } },
      { id: "lifecycle", icon: "🗂",  label: "Full lifecycle — retention policies, archiving, and defensible deletion",  desc: "Legal, compliance, or records teams require structured retention and disposal of content", scores: { starter:0, ifs:0, elite:4, ultimate:4 } },
    ]
  },
  {
    id: "security",
    q: "What security and compliance requirements do they have?",
    sub: "Select all that apply — many customers have overlapping needs",
    type: "multi",
    options: [
      { id: "standard",   icon: "🔒", label: "Standard — MFA, audit logs, file versioning, and secure link sharing",       desc: "Core security controls every business needs. No advanced threat detection required",                                          scores: { starter:4, ifs:2, elite:0, ultimate:0 } },
      { id: "ransomware", icon: "🚨", label: "Ransomware detection, unusual access alerts, and snapshot recovery",          desc: "Cyber insurance or a past incident requires documented detection and fast recovery capabilities",                          scores: { starter:0, ifs:4, elite:4, ultimate:2 } },
      { id: "governance", icon: "🛡", label: "Full governance — issue remediation, insider risk, and compliance reporting", desc: "Security team needs visibility across all sharing, permissions, and access anomalies with auto-remediation",              scores: { starter:0, ifs:1, elite:5, ultimate:3 } },
      { id: "regulated",  icon: "📋", label: "Regulated data — HIPAA, FINRA, GDPR, SOC 2, or contractual obligations",    desc: "Must classify sensitive data, prove where it lives, support audits, and meet data residency requirements",                  scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
    ]
  },
  {
    id: "ai",
    q: "How important is AI and intelligence to this opportunity?",
    sub: "What level of AI capability is the customer ready to adopt?",
    options: [
      { id: "none",     icon: "➖", label: "Not a priority right now — focused on core file management",                  desc: "Customer wants a solid foundation before thinking about AI features",                                                        scores: { starter:3, ifs:1, elite:0, ultimate:0 } },
      { id: "search",   icon: "🤖", label: "AI Assistant and search — ask questions across documents, get summaries",     desc: "Want to reduce time finding information and generate content from stored files",                                            scores: { starter:0, ifs:5, elite:3, ultimate:1 } },
      { id: "classify", icon: "🧠", label: "AI classification — auto-tag document types and extract data at scale",       desc: "Large volumes of unstructured content that need to be organized and acted on automatically",                                scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
      { id: "all",      icon: "⚡", label: "Full AI suite — search, assistant, classification, and AI-triggered workflows",desc: "AI is a core part of the business case and they want the most advanced capabilities available",                           scores: { starter:0, ifs:2, elite:3, ultimate:5 } },
    ]
  },
  {
    id: "budget",
    q: "How would you characterize the customer's investment approach?",
    sub: "This helps calibrate the recommendation to what will actually land",
    options: [
      { id: "essential",  icon: "💡", label: "Essential — get the basics right at the lowest cost",                        desc: "Budget-conscious. They want to solve the core problem without overbuying",                                                      scores: { starter:5, ifs:2, elite:0, ultimate:0 } },
      { id: "value",      icon: "📈", label: "Value — willing to invest more for meaningful capability upgrades",           desc: "Will pay more if the ROI is clear. Open to a mid-tier plan with strong features",                                            scores: { starter:1, ifs:4, elite:3, ultimate:0 } },
      { id: "strategic",  icon: "🚀", label: "Strategic — security and governance are a business priority",                desc: "Leadership sees content security and compliance as competitive or regulatory differentiators",                              scores: { starter:0, ifs:1, elite:4, ultimate:3 } },
      { id: "enterprise", icon: "🏛", label: "Enterprise — needs the most comprehensive solution available",               desc: "Has regulatory, insurance, or contractual requirements that demand an enterprise-grade platform",                            scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
    ]
  },
];

const BUILDER_CHECKLIST = [
  {
    category: "Foundation",
    color: "#76A2BC",
    items: [
      { id: "file_server",    icon: "🖥",  label: "Replace file servers, NAS, or VPN-based access",           desc: "Move on-prem or remote-access file storage to a managed cloud platform",                  scores: { starter:4, ifs:3, elite:1, ultimate:0 } },
      { id: "external_share", icon: "🔗",  label: "Secure external file sharing with clients or vendors",     desc: "Replace email attachments and consumer tools with controlled, auditable link sharing",    scores: { starter:3, ifs:4, elite:2, ultimate:0 } },
      { id: "remote_sites",   icon: "📡",  label: "Remote offices or job sites needing fast file access",     desc: "Field crews or branch offices with bandwidth issues accessing large files offline",         scores: { starter:0, ifs:4, elite:2, ultimate:0 } },
      { id: "small_team",     icon: "👤",  label: "Small team (under 25 users), cost is the top priority",    desc: "Budget-conscious deployment, essential capabilities only, no advanced security required",   scores: { starter:5, ifs:0, elite:0, ultimate:0 } },
    ]
  },
  {
    category: "Collaboration & Workflows",
    color: "#6E49FF",
    items: [
      { id: "esig_pdf",       icon: "✍",  label: "E-signatures and PDF editing within the platform",          desc: "Contracts, proposals, and SOPs require markup and sign-off without leaving Egnyte",         scores: { starter:0, ifs:5, elite:2, ultimate:0 } },
      { id: "adv_workflows",  icon: "⚙",  label: "Multi-step automated workflows connected to other tools",   desc: "Complex cross-department processes that trigger actions in CRM, ERP, or other systems",    scores: { starter:0, ifs:2, elite:5, ultimate:1 } },
      { id: "lifecycle",      icon: "🗂",  label: "Content retention, archiving, and defensible deletion",     desc: "Legal or records teams require structured retention schedules and automated disposal",      scores: { starter:0, ifs:0, elite:4, ultimate:3 } },
    ]
  },
  {
    category: "Security & Recovery",
    color: "#3D71EA",
    items: [
      { id: "ransomware",     icon: "🚨",  label: "Ransomware detection and snapshot-based recovery",          desc: "Cyber insurance or a past incident requires documented detection and point-in-time recovery", scores: { starter:0, ifs:4, elite:3, ultimate:2 } },
      { id: "insider_risk",   icon: "🛡",  label: "Insider threat monitoring and auto-remediation",            desc: "Security team needs visibility into anomalous access with automated response and reporting", scores: { starter:0, ifs:1, elite:5, ultimate:2 } },
      { id: "device_sso",     icon: "🔐",  label: "SSO, device controls, and role-based administration",       desc: "MSP needs centralized identity and device policy enforcement across managed clients",        scores: { starter:0, ifs:3, elite:3, ultimate:2 } },
    ]
  },
  {
    category: "Compliance & Governance",
    color: "#037BBD",
    items: [
      { id: "regulated",      icon: "📋",  label: "Regulated industry — HIPAA, FINRA, GDPR, or SOC 2",        desc: "Must support audits, data residency requirements, and prove policy compliance",              scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
      { id: "sensitive_data", icon: "🔍",  label: "Sensitive data discovery and classification (PII/PHI/PCI)", desc: "Need to automatically locate, tag, and govern regulated content across the entire repository", scores: { starter:0, ifs:0, elite:1, ultimate:5 } },
      { id: "dlp",            icon: "🔒",  label: "DLP and preventive security control integrations",          desc: "Require Egnyte to feed into an existing security stack for active prevention",               scores: { starter:0, ifs:0, elite:0, ultimate:4 } },
    ]
  },
  {
    category: "AI & Intelligence",
    color: "#0BC5BA",
    items: [
      { id: "ai_search",      icon: "🤖",  label: "AI Assistant — search across documents, get summaries",    desc: "Reduce time finding information and generate content from files stored in Egnyte",        scores: { starter:0, ifs:5, elite:2, ultimate:0 } },
      { id: "ai_classify",    icon: "🧠",  label: "AI classification, tagging, and workflow automation",       desc: "Auto-identify document types, extract metadata, and trigger AI-driven workflows at scale",  scores: { starter:0, ifs:0, elite:2, ultimate:5 } },
    ]
  },
];

// Gen 3 equivalent mapping for the toggle
const GEN3_EQUIVALENT = {
  starter: { id:"cfs",             name:"CFS",             note:"CFS covers essential cloud file sharing at the Gen 3 entry-level price point." },
  ifs:     { id:"afs",             name:"AFS",             note:"AFS is the Gen 3 equivalent, covering collaboration and standard workflows." },
  elite:   { id:"enterprise_lite", name:"Enterprise Lite", note:"Enterprise Lite covers governance and lifecycle management at a Gen 3 price." },
  ultimate:{ id:"enterprise",      name:"Enterprise",      note:"Enterprise is the most capable Gen 3 option, covering advanced security and compliance." },
};

const PLAN_BUILDER_MAP = {
  starter: { id:"starter", name:"Starter",  color:"#76A2BC", bg:"rgba(118,162,188,0.08)", border:"rgba(118,162,188,0.25)" },
  ifs:     { id:"ifs",     name:"IFS",      color:"#0BC5BA", bg:"rgba(11,197,186,0.08)",  border:"rgba(11,197,186,0.3)"  },
  elite:   { id:"elite",   name:"Elite",    color:"#3D71EA", bg:"rgba(61,113,234,0.08)",  border:"rgba(61,113,234,0.3)"  },
  ultimate:{ id:"ultimate",name:"Ultimate", color:"#6E49FF", bg:"rgba(110,73,255,0.08)",  border:"rgba(110,73,255,0.3)"  },
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

const scoreChecklist = (selected) => {
  const totals = { starter:0, ifs:0, elite:0, ultimate:0 };
  BUILDER_CHECKLIST.forEach(cat => {
    cat.items.forEach(item => {
      if (selected[item.id]) {
        Object.entries(item.scores).forEach(([plan, pts]) => { totals[plan] += pts; });
      }
    });
  });
  const ranked = Object.entries(totals).sort((a,b) => b[1] - a[1]);
  return { totals, winner: ranked[0][0], ranked };
};

// ─── USE CASE DATA ────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    id: "file_server",
    icon: "🖥",
    title: "Replacing an On-Premises File Server",
    example: "Customer still has Windows file servers/NAS or uses VPN for file access and wants to move that to the cloud.",
    triggers: ["Still on Windows file servers or NAS", "VPN pain or remote access issues", "Upcoming server or NAS hardware refresh", "Shadow IT use of Dropbox or personal OneDrive for file sharing"],
    plans: ["starter", "ifs"],
    planNotes: { starter: "Modern cloud file server for small businesses that need basic collaboration, SSO and MFA, and simple workflows.", ifs: "For cost-conscious companies that need organization-wide collaboration, advanced workflows, PDF editing, and AI insights." },
    capabilities: ["Cloud File Server with controlled sharing, external users, and global file locking", "Mapped drive and desktop apps for a familiar drive-letter experience", "Granular folder and NTFS-like permissions with unified admin dashboard", "File versioning and file and login audit trails"],
    competitors: ["SharePoint and OneDrive", "Dropbox", "Box", "FileCloud"],
    whyEgnyte: ["Purpose built as a secure cloud file platform with familiar drive-letter access, not just a web site or documents app", "Better hybrid performance for shared drives than generic SharePoint sites or basic cloud storage tools", "Integrated governance and recovery without requiring multiple additional point products"],
    customerStories: [
      { company: "KL Engineering", industry: "Civil Engineering", headline: "Future-Proofs Talent and Wins New Work With Egnyte", url: "https://www.egnyte.com/customers/kl-engineering-case-study" },
      { company: "A&E Design", industry: "Architecture", headline: "Builds the Hybrid Work Model of Its Dreams", url: "https://www.egnyte.com/customers/aande-design-case-study" },
      { company: "Choate Construction", industry: "Commercial Construction", headline: "Renders Traditional IT Hardware an Afterthought", url: "https://www.egnyte.com/customers/choate-construction-case-study" },
      { company: "Campbell University", industry: "Higher Education", headline: "Secures Data, Simplifies IT, and Drives Campus-Wide Collaboration", url: "https://www.egnyte.com/customers/campbell-university-case-study" },
    ],
  },
  {
    id: "sharepoint",
    icon: "📎",
    title: "SharePoint Replacement",
    example: "Customer is frustrated with SharePoint complexity, governance overhead, or poor user adoption and wants a simpler, more intuitive cloud file platform.",
    triggers: ["Complaints about SharePoint being too complex or hard to manage", "Low adoption or staff still emailing files instead of using SharePoint", "Confusion between Teams, OneDrive, and SharePoint sites", "Concerns about Microsoft licensing costs at E3 or E5", "IT spending too much time on SharePoint architecture, permissions, or migrations"],
    plans: ["ifs", "elite", "ultimate"],
    planNotes: { ifs: "For organizations that want straightforward org-wide collaboration with advanced workflows and AI, without SharePoint complexity.", elite: "When the migration must also include lifecycle policies, analytics, and data access governance.", ultimate: "For regulated customers who need SharePoint replacement plus sensitive data discovery and privacy monitoring." },
    capabilities: ["Cloud File Server with familiar drive-letter access and simple folder-based permissions", "Granular admin controls easier to operate than SharePoint site and library structures", "Content Lifecycle and Governance at Elite and Ultimate for retention and classification", "Sensitive Data Discovery at Ultimate for compliance use cases", "Integrations with Microsoft 365 so Egnyte can complement or fully replace SharePoint document libraries"],
    competitors: ["SharePoint and OneDrive", "Box", "Dropbox"],
    whyEgnyte: ["Built specifically for unstructured file management, not retrofitted from a productivity suite", "Simpler shared drive model that maps directly to how teams and departments are organized", "Consistent permission model without managing separate site collections, libraries, and Teams channels", "Easier for MSPs to deploy and support across multiple customer environments without deep Microsoft expertise"],
    customerStories: [
      { company: "Wintrust Financial", industry: "Financial Services", headline: "Transcends Secure Sharing to Achieve True Data Governance", url: "https://www.egnyte.com/customers/wintrust-case-study" },
      { company: "Neuren Pharmaceuticals", industry: "Life Sciences", headline: "Implements Egnyte as eQMS in Record Time", url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study" },
    ],
  },
  {
    id: "consolidation",
    icon: "📂",
    title: "Consolidating Scattered Data",
    example: "Customer has files spread across local drives, legacy file servers, personal cloud storage, and multiple SaaS tools with no consistent standard for where content lives.",
    triggers: ["Files split across Dropbox, Google Drive, OneDrive, and email", "No clear standard for where to save documents or which version is current", "Staff duplicating files across systems to ensure access", "IT unable to answer where sensitive or regulated content is stored", "Multiple acquired or merged businesses each using different file tools"],
    plans: ["ifs", "elite", "ultimate"],
    planNotes: { ifs: "For consolidating scattered files into a single governed platform with advanced workflows and AI assistance.", elite: "When consolidation must include lifecycle policies, analytics, and governance reporting.", ultimate: "For environments where scattered data includes sensitive or regulated content that must be discovered, classified, and remediated." },
    capabilities: ["Egnyte Connect as a single, governed repository for all unstructured content", "Integrations with Microsoft 365, Google Workspace, Salesforce, and other line of business tools", "Metadata, full-text search, and AI-powered knowledge base Q&A to surface content across repositories", "File versioning and controlled sharing to eliminate version confusion", "Content Lifecycle policies at Elite and Ultimate to clean up and manage sprawl", "Sensitive Data Discovery at Ultimate to locate and classify personal or regulated data"],
    competitors: ["SharePoint and OneDrive", "Box", "Dropbox"],
    whyEgnyte: ["Designed to sit at the center of a multi-application environment rather than requiring customers to go all-in on a single productivity suite", "Provides a single source of truth for files without forcing teams off the tools they use for communication", "Governance, search, and classification features address not just where files are stored but whether access and content policies are applied consistently", "MSPs can use Egnyte to standardize across diverse customer environments without rebuilding every customer's tool stack"],
    customerStories: [
      { company: "Salas O'Brien", industry: "Engineering", headline: "Unifies Rapid M&A Growth and Achieves CMMC Compliance", url: "https://www.egnyte.com/customers/salasobrien-case-study" },
      { company: "Choate Construction", industry: "Commercial Construction", headline: "Renders Traditional IT Hardware an Afterthought", url: "https://www.egnyte.com/customers/choate-construction-case-study" },
      { company: "Campbell University", industry: "Higher Education", headline: "Secures Data, Simplifies IT, and Drives Campus-Wide Collaboration", url: "https://www.egnyte.com/customers/campbell-university-case-study" },
    ],
  },
  {
    id: "internal_sharing",
    icon: "🤝",
    title: "Internal File Sharing",
    example: "Departments need shared drives for day-to-day work, remote/hybrid staff need consistent access, and they want to standardize \"where files live.\"",
    triggers: ["Team and department silos built on separate file servers or cloud folders", "Remote or hybrid workers struggling with consistent access", "Lack of a clear standard for where documents should live"],
    plans: ["starter", "ifs", "elite"],
    planNotes: { starter: "For small teams standardizing on a single cloud file solution with basic workflows.", ifs: "For organization-wide collaboration and advanced workflows with AI assistance.", elite: "When collaboration must be combined with lifecycle, governance, and additional safeguards." },
    capabilities: ["Unified folder structure for departments, projects, and offices", "Desktop and mobile apps for consistent access to all shares", "Co-editing, comments, and tasks on shared documents", "Role-based administration at higher tiers"],
    competitors: ["SharePoint and OneDrive", "Dropbox", "Box"],
    whyEgnyte: ["Straightforward shared drive model easier to understand than complex SharePoint site architectures", "Consistent experience across desktop, web, and mobile without multiple disjointed apps", "Clear mapping between organizational structure and folder permissions"],
    customerStories: [
      { company: "KL Engineering", industry: "Civil Engineering", headline: "Future-Proofs Talent and Wins New Work With Egnyte", url: "https://www.egnyte.com/customers/kl-engineering-case-study" },
      { company: "A&E Design", industry: "Architecture", headline: "Builds the Hybrid Work Model of Its Dreams", url: "https://www.egnyte.com/customers/aande-design-case-study" },
      { company: "Köster GmbH", industry: "Construction", headline: "Simplifies Collaboration by Centralizing Data Management", url: "https://www.egnyte.com/customers/koster-case-study" },
    ],
  },
  {
    id: "external_sharing",
    icon: "🔗",
    title: "External File Sharing",
    example: "They regularly send/receive files with customers, partners, vendors and are worried about uncontrolled links/attachments.",
    triggers: ["Heavy reliance on email attachments for client or vendor collaboration", "Use of public links from consumer tools such as Dropbox or WeTransfer", "Questions about secure link expirations, passwords, or domain restrictions"],
    plans: ["starter", "ifs", "elite"],
    planNotes: { starter: "For small businesses that need secure sharing with basic workflows and MFA.", ifs: "For organizations that want multi-step workflows, PDF editing, and AI to support external collaboration.", elite: "When external sharing involves sensitive data that also requires governance, watermarking, and issue remediation." },
    capabilities: ["Secure upload and download links with password and expiry options", "External user accounts with full admin visibility and control", "File locking and detailed audit logs for shared content", "Advanced workflows and PDFs with annotation and e-signature at higher tiers"],
    competitors: ["SharePoint and OneDrive", "Dropbox", "Box", "FileCloud"],
    whyEgnyte: ["All external sharing is managed from a single governed platform rather than a mix of tools", "External users are fully controlled accounts with policy and audit coverage", "Supports both quick ad hoc link sharing and structured, project-based external spaces"],
    customerStories: [
      { company: "MOMA Therapeutics", industry: "Life Sciences", headline: "Strengthens CRO Collaboration Through Smarter IT", url: "https://www.egnyte.com/customers/moma-therapeutics-case-study" },
      { company: "Köster GmbH", industry: "Construction", headline: "Simplifies Collaboration by Centralizing Data Management", url: "https://www.egnyte.com/customers/koster-case-study" },
      { company: "Tilt Creative", industry: "Media & Production", headline: "Neutralizes Compliance Threats with Egnyte", url: "https://www.egnyte.com/customers/tilt-creative-case-study" },
      { company: "Wintrust Financial", industry: "Financial Services", headline: "Transcends Secure Sharing to Achieve True Data Governance", url: "https://www.egnyte.com/customers/wintrust-case-study" },
    ],
  },
  {
    id: "remote_jobsite",
    icon: "📡",
    title: "Remote Job Site Collaboration",
    example: "They have job sites, plants, or branches with poor internet that still need LAN-speed access to large CAD/BIM/media files.",
    triggers: ["Field or job site workers who frequently lose connectivity or have poor bandwidth", "Large CAD, BIM, or media files that are slow to open directly from the cloud", "Existing on-site file servers that are difficult to manage but still needed for performance"],
    plans: ["ifs", "elite", "ultimate"],
    planNotes: { ifs: "Minimum for edge caching and advanced workflows at job sites.", elite: "When remote site collaboration must also include lifecycle or governance.", ultimate: "When remote site collaboration must also include sensitive data protection." },
    capabilities: ["Edge caching via Turbo, SmartCache, or Storage Sync appliances", "Local cache of project data that syncs automatically to the cloud", "Optimized large file access for AEC, manufacturing, media, and similar verticals"],
    competitors: ["SharePoint and OneDrive", "FileCloud", "Nasuni", "Panzura"],
    whyEgnyte: ["Purpose-built hybrid edge appliances designed for branch and job site use cases", "Keeps a single, authoritative copy of files in the cloud while delivering LAN speed locally", "Less complex and costly than full file gateway re-architecture projects"],
    customerStories: [
      { company: "QK", industry: "Civil Engineering", headline: "Gets from Dirt to Data to Decision Faster", url: "https://www.egnyte.com/customers/qk-case-study" },
      { company: "KL Engineering", industry: "Civil Engineering", headline: "Future-Proofs Talent and Wins New Work With Egnyte", url: "https://www.egnyte.com/customers/kl-engineering-case-study" },
      { company: "A&E Design", industry: "Architecture", headline: "Builds the Hybrid Work Model of Its Dreams", url: "https://www.egnyte.com/customers/aande-design-case-study" },
      { company: "Köster GmbH", industry: "Construction", headline: "Simplifies Collaboration by Centralizing Data Management", url: "https://www.egnyte.com/customers/koster-case-study" },
    ],
  },
  {
    id: "sensitive_data",
    icon: "🔍",
    title: "Discovery and Classification of Sensitive Content",
    example: "Customer needs to find PII/PHI/PCI across shares for GDPR/CCPA/HIPAA/SOC 2 and prove it to auditors.",
    triggers: ["Unclear location of PII, PHI, PCI, or other regulated data", "Audit or compliance pressure such as GDPR, CCPA, HIPAA, or SOC 2", "Need to inventory and classify sensitive data across multiple repositories"],
    plans: ["ultimate"],
    planNotes: { ultimate: "Required for Sensitive Data Discovery and Governance, privacy and compliance monitoring, and advanced remediation." },
    capabilities: ["Sensitive Data Discovery and Governance to locate and classify personal and regulated content", "Privacy and compliance monitoring across cloud and on-premises repositories", "AI and pattern-based detection tuned for unstructured content", "Auto remediation to quarantine, secure, or delete high-risk data"],
    competitors: ["Microsoft Purview and SharePoint", "FileCloud"],
    whyEgnyte: ["Single console to inventory sensitive data across Egnyte and connected repositories, not just one productivity suite", "AI-driven detection reduces the amount of manual rule writing and tuning required", "Built-in remediation actions to fix issues, not just report on them"],
    customerStories: [
      { company: "Tilt Creative", industry: "Media & Production", headline: "Neutralizes Compliance Threats with Egnyte", url: "https://www.egnyte.com/customers/tilt-creative-case-study" },
      { company: "Wintrust Financial", industry: "Financial Services", headline: "Transcends Secure Sharing to Achieve True Data Governance", url: "https://www.egnyte.com/customers/wintrust-case-study" },
      { company: "Neuren Pharmaceuticals", industry: "Life Sciences", headline: "Implements Egnyte as eQMS in Record Time", url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study" },
      { company: "Salas O'Brien", industry: "Engineering", headline: "Unifies Rapid M&A Growth and Achieves CMMC Compliance", url: "https://www.egnyte.com/customers/salasobrien-case-study" },
    ],
  },
  {
    id: "lifecycle",
    icon: "🗂",
    title: "Content Lifecycle Management",
    example: "Customer's storage is exploding and legal/IT want defensible retention, archive, and deletion policies.",
    triggers: ["Storage growth and cost concerns driven by keeping all files forever", "Records or legal teams asking for defensible retention, archival, and deletion policies", "Desire to systematically remove redundant, obsolete, and trivial content"],
    plans: ["elite", "ultimate"],
    planNotes: { elite: "Minimum plan for full lifecycle policies, analytics, and reports.", ultimate: "For lifecycle initiatives tied to sensitive data discovery, privacy, and advanced governance." },
    capabilities: ["Content Lifecycle Policies, Analytics, and Reports", "Detection of redundant, old, or stale content and usage trends", "Automated retain, archive, and delete actions to enforce policy", "Reporting for audits and records management teams"],
    competitors: ["Microsoft 365 and SharePoint retention", "FileCloud Compliance Center"],
    whyEgnyte: ["Lifecycle policies designed around shared drives and projects, not only individual workspaces or mailboxes", "Clear visibility into stale and redundant content before enforcing policies", "No separate archive product required to balance compliance and storage cost"],
    customerStories: [
      { company: "Neuren Pharmaceuticals", industry: "Life Sciences", headline: "Implements Egnyte as eQMS in Record Time", url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study" },
    ],
  },
  {
    id: "ransomware",
    icon: "🚨",
    title: "Ransomware Detection and Recovery",
    example: "They care about ransomware specifically and need both early detection and a fast, guided recovery story for cyber insurance/security.",
    triggers: ["History of ransomware incidents or close calls", "Questions from cyber insurance or security teams about detection and recovery capabilities", "Concerns that backup alone is not sufficient for fast recovery"],
    plans: ["ifs", "elite", "ultimate"],
    planNotes: { ifs: "Introduces probable ransomware detection and remediation via APIs, suitable for cost-conscious customers.", elite: "Adds broader issue detection, auto remediation, and lifecycle reporting for security-focused customers.", ultimate: "Adds extended snapshot-based ransomware recovery and the most advanced detection and governance." },
    capabilities: ["Probable ransomware detection using artifact and behavior-based signals", "Suspicious login and unusual access detection", "Extended snapshot-based ransomware recovery for rapid, point-in-time restore", "Auto remediation and delegation of security issues"],
    competitors: ["Dropbox Rewind", "FileCloud", "Traditional backup vendors such as Veeam"],
    whyEgnyte: ["Combines ransomware detection and recovery directly on the content platform rather than relying only on backup snapshots", "Behavior and artifact-based analytics help catch new attack patterns earlier", "Faster and more targeted restore than full share or volume recovery from backup"],
    customerStories: [
      { company: "Campbell University", industry: "Higher Education", headline: "Secures Data, Simplifies IT, and Drives Campus-Wide Collaboration", url: "https://www.egnyte.com/customers/campbell-university-case-study" },
    ],
  },
  {
    id: "document_room",
    icon: "🔐",
    title: "Secure Document Control (Document Room)",
    example: "They run M&A, investor portals, board packs, or client deal rooms and need tight, auditable access control.",
    triggers: ["Needs for M&A data rooms, investor portals, loan or diligence packages, or board materials", "Requirement for invitation-only project or deal workspaces", "Stakeholders asking for detailed visibility into who viewed or downloaded documents"],
    plans: ["elite", "ultimate"],
    planNotes: { elite: "Recommended baseline for secure document rooms, including watermarking and advanced workflows.", ultimate: "For highly regulated or high-value deals that also require sensitive data discovery and privacy monitoring." },
    capabilities: ["Document Room and secure, invitation-only domains", "Granular folder permissions with read-only viewer options", "Watermarking and PDF annotation, editing, and e-signature", "Advanced workflows for review and approval"],
    competitors: ["SharePoint and OneDrive", "Dropbox"],
    whyEgnyte: ["Virtual data rooms are delivered on the same platform used for everyday collaboration", "Simpler permissioning and auditing of external users than generic SharePoint sites or consumer tools", "Lower cost and complexity than maintaining a separate, standalone VDR product"],
    customerStories: [
      { company: "Tilt Creative", industry: "Media & Production", headline: "Neutralizes Compliance Threats with Egnyte", url: "https://www.egnyte.com/customers/tilt-creative-case-study" },
      { company: "Wintrust Financial", industry: "Financial Services", headline: "Transcends Secure Sharing to Achieve True Data Governance", url: "https://www.egnyte.com/customers/wintrust-case-study" },
    ],
  },
  {
    id: "single_source",
    icon: "☁",
    title: "Single Source of Truth",
    example: "Content is scattered across email, SharePoint, file servers, and they want one governed place for \"the real version.\"",
    triggers: ["Files scattered across CRM systems, email, Slack, local drives, and file servers", "Frequent confusion about which version of a document is current", "Multiple file servers or repositories across different offices"],
    plans: ["ifs", "elite", "ultimate"],
    planNotes: { ifs: "Standard plan for organization-wide collaboration, advanced workflows, AI discovery, and PDF editing.", elite: "When centralization must include lifecycle policies, analytics, and data access governance.", ultimate: "When the single source of truth must also support sensitive data discovery and compliance reporting." },
    capabilities: ["Egnyte Connect as a central, governed repository for unstructured content", "Integrations to Microsoft 365, Google Workspace, CRM, and e-signature tools", "Search, metadata, and knowledge base Q&A", "File versioning and controlled sharing for a single source of truth"],
    competitors: ["SharePoint and OneDrive", "Box", "Dropbox"],
    whyEgnyte: ["Designed to sit at the center of a multi-application environment, not just a single productivity suite", "Keeps one governed copy of files while still integrating with line of business applications", "Easier for MSPs to standardize across diverse customer environments"],
    customerStories: [
      { company: "Salas O'Brien", industry: "Engineering", headline: "Unifies Rapid M&A Growth and Achieves CMMC Compliance", url: "https://www.egnyte.com/customers/salasobrien-case-study" },
      { company: "Professional Assoc. Services", industry: "HOA Management", headline: "Empowers Staff and Delights Clients With AI-Powered Content Intelligence", url: "https://www.egnyte.com/customers/professional-association-services-case-study" },
      { company: "Pure Financial Advisors", industry: "Financial Services", headline: "Scales Planning Efficiency with Egnyte and AI", url: "https://www.egnyte.com/customers/pure-financial-advisors-case-study" },
    ],
  },
  {
    id: "archive",
    icon: "🗃",
    title: "Archive",
    example: "They must keep data 7–10+ years for legal/compliance but rarely access it, and want a cheaper, safer place to park it.",
    triggers: ["Long-term retention needs of seven to ten years or more", "Desire to reduce storage spend on inactive but legally required data", "Concerns about users accidentally changing or deleting archival records"],
    plans: ["elite", "ultimate"],
    planNotes: { elite: "Baseline for lifecycle policies, reporting, and archive workflows.", ultimate: "When archive requirements are tightly coupled to privacy, sensitive data discovery, and advanced recovery." },
    capabilities: ["Archive domains for cold, low-cost storage of inactive content", "Content lifecycle policies to move content into archive based on age or usage", "Audit-ready access and reporting for legal and compliance teams"],
    competitors: ["SharePoint and OneDrive with retention", "FileCloud", "Archive and backup products"],
    whyEgnyte: ["Archive is part of the same content platform and lifecycle policies as active data", "Clear separation between user workspaces and tightly controlled archive domains", "Less operational overhead than maintaining a separate archive or backup tier"],
    customerStories: [
      { company: "Neuren Pharmaceuticals", industry: "Life Sciences", headline: "Implements Egnyte as eQMS in Record Time", url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study" },
    ],
  },
  {
    id: "inventory_sensitive",
    icon: "📋",
    title: "Inventory and Secure Sensitive Data",
    example: "Privacy/compliance ask: \"Where is customer/patient data stored?\" and they need DSAR/right-to-be-forgotten workflows.",
    triggers: ["Privacy or compliance officers requesting reports on where personal data is stored", "Requirements to support data subject access requests or right to be forgotten", "Concern about regulator fines tied to unmanaged personal data"],
    plans: ["ultimate"],
    planNotes: { ultimate: "Required for sensitive data discovery, classification, management reviews, and privacy monitoring." },
    capabilities: ["Governance and Classification engine for PII, PHI, PCI, and other patterns", "Privacy and compliance monitoring for personal data across repositories", "Risk dashboards and review workflows for high-risk data locations"],
    competitors: ["Microsoft Purview", "FileCloud"],
    whyEgnyte: ["Focused specifically on unstructured content rather than primarily on email and structured systems", "Supports scans across Egnyte and connected third-party repositories from a single pane of glass", "Turns findings into concrete remediation actions that IT or MSPs can execute"],
    customerStories: [
      { company: "Wintrust Financial", industry: "Financial Services", headline: "Transcends Secure Sharing to Achieve True Data Governance", url: "https://www.egnyte.com/customers/wintrust-case-study" },
      { company: "Pure Financial Advisors", industry: "Financial Services", headline: "Scales Planning Efficiency with Egnyte and AI", url: "https://www.egnyte.com/customers/pure-financial-advisors-case-study" },
      { company: "Neuren Pharmaceuticals", industry: "Life Sciences", headline: "Implements Egnyte as eQMS in Record Time", url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study" },
    ],
  },
  {
    id: "data_loss",
    icon: "🛡",
    title: "Preventing Accidental Data Loss",
    example: "Users constantly delete/move/overwrite files and IT spends time restoring.",
    triggers: ["Frequent tickets to restore deleted or overwritten files and folders", "Users unintentionally moving or reorganizing key shared folders", "Administrators spending significant time on manual file recovery"],
    plans: ["starter", "ifs", "elite"],
    planNotes: { starter: "Provides file versioning, unified Trash, and basic security alerts for small environments.", ifs: "For larger organizations that also want advanced workflows and AI assistance around high-value content.", elite: "When accidental loss prevention is part of a broader lifecycle and governance initiative." },
    capabilities: ["File versioning and unified Trash for restoring deleted content", "Permissions viewer and access reporting to identify risky access patterns", "Suspicious login detection and enhanced malware detection at lower tiers"],
    competitors: ["SharePoint and OneDrive", "Dropbox", "FileCloud"],
    whyEgnyte: ["Central control over who can delete or move critical data across all shared content", "Simple self-service recovery for everyday user mistakes without always involving IT", "Governance and reporting features help prevent repeated issues over time"],
    customerStories: [
      { company: "Campbell University", industry: "Higher Education", headline: "Secures Data, Simplifies IT, and Drives Campus-Wide Collaboration", url: "https://www.egnyte.com/customers/campbell-university-case-study" },
    ],
  },
  {
    id: "insider_threat",
    icon: "👁",
    title: "Protection Against Malicious Insiders",
    example: "They're worried about staff/contractors walking out with data and want behavior/anomaly monitoring tied to files.",
    triggers: ["Concerns about staff or contractors exfiltrating sensitive data", "High employee turnover or heavy use of temporary and external accounts", "Security teams asking for user behavior or anomaly detection tied to content access"],
    plans: ["ifs", "elite", "ultimate"],
    planNotes: { ifs: "Introduces suspicious login detection, external sharing issue detection, and artifact-based ransomware detection.", elite: "Adds unusual access and inactive user detection, malformed permission detection, and auto remediation.", ultimate: "Extends insider risk monitoring with deeper privacy, sensitive data, and recovery capabilities." },
    capabilities: ["Insider risk management with detection of unusual access and inactive accounts", "Monitoring of external sharing, public links, and malformed permissions", "Alerts, audit trails, and auto remediation for risky user actions"],
    competitors: ["Dropbox", "FileCloud", "Microsoft 365 and SharePoint security and audit tools"],
    whyEgnyte: ["Focuses specifically on risky behavior around sensitive content, not just sign-in events", "Keeps security and governance telemetry in the same platform as the files themselves", "Provides clear, actionable alerts that MSPs and security teams can respond to quickly"],
    customerStories: [
      { company: "Tilt Creative", industry: "Media & Production", headline: "Neutralizes Compliance Threats with Egnyte", url: "https://www.egnyte.com/customers/tilt-creative-case-study" },
      { company: "Campbell University", industry: "Higher Education", headline: "Secures Data, Simplifies IT, and Drives Campus-Wide Collaboration", url: "https://www.egnyte.com/customers/campbell-university-case-study" },
    ],
  },
];

// ─── CUSTOMER STORIES ─────────────────────────────────────────────────────────
const CUSTOMER_STORIES = [
  {
    id: "tilt",
    company: "Tilt Creative + Production",
    industry: "Media & Advertising",
    title: "Neutralizes Compliance Threats with Egnyte",
    summary: "Ad production studio serving Audi, Walmart and others replaced their file provider after high-profile clients demanded stricter data security compliance and governed content access.",
    url: "https://www.egnyte.com/customers/tilt-creative-case-study",
    useCases: ["sensitive_data", "inventory_sensitive", "external_sharing"],
  },
  {
    id: "wintrust",
    company: "Wintrust Financial",
    industry: "Financial Services",
    title: "Transcends Secure Sharing to Achieve True Data Governance",
    summary: "$64B financial holding company replaced ShareFile across 16 community banks — gaining SSO, governed external sharing, and a real data governance strategy.",
    url: "https://www.egnyte.com/customers/wintrust-case-study",
    useCases: ["external_sharing", "single_source", "sensitive_data", "document_room"],
  },
  {
    id: "moma",
    company: "MOMA Therapeutics",
    industry: "Life Sciences",
    title: "Strengthens CRO Collaboration Through Smarter IT",
    summary: "Clinical-stage biotech uses Egnyte to securely share sensitive lab data with CRO partners during Phase I trials, replacing ad hoc transfer methods with governed, auditable collaboration.",
    url: "https://www.egnyte.com/customers/moma-therapeutics-case-study",
    useCases: ["external_sharing", "sensitive_data"],
  },
  {
    id: "qk",
    company: "QK",
    industry: "AEC / Civil Engineering",
    title: "Gets from Dirt to Data to Decision Faster",
    summary: "Civil engineering firm with siloed per-office file servers tried Panzura and Azure Files before landing on Egnyte — solving CAD file access and cross-office collaboration in one move.",
    url: "https://www.egnyte.com/customers/qk-case-study",
    useCases: ["file_server", "remote_jobsite", "consolidation"],
  },
  {
    id: "salasobrien",
    company: "Salas O'Brien",
    industry: "AEC / Engineering",
    title: "Unifies Rapid M&A Growth and Achieves CMMC Compliance",
    summary: "Engineering firm with 50+ acquisitions across 105 offices replaced a tangle of per-location file servers and drive letters with a single governed platform — also achieving CMMC compliance.",
    url: "https://www.egnyte.com/customers/salasobrien-case-study",
    useCases: ["consolidation", "file_server", "single_source"],
  },
  {
    id: "kl_engineering",
    company: "KL Engineering",
    industry: "AEC / Civil Engineering",
    title: "Future-Proofs Talent and Wins New Work With Egnyte",
    summary: "100-person civil engineering firm replaced legacy file servers and remote access workarounds with Egnyte — enabling hybrid work and handling Civil 3D files across five Upper Midwest offices.",
    url: "https://www.egnyte.com/customers/kl-engineering-case-study",
    useCases: ["file_server", "remote_jobsite"],
  },
  {
    id: "pure_financial",
    company: "Pure Financial Advisors",
    industry: "Financial Services",
    title: "Scales Planning Efficiency with Egnyte and AI",
    summary: "Leading RIA firm uses Egnyte as a secure document foundation and layered AI to automate extraction of investment data from thousands of client statements per year.",
    url: "https://www.egnyte.com/customers/pure-financial-advisors-case-study",
    useCases: ["sensitive_data", "single_source", "consolidation"],
  },
  {
    id: "pas",
    company: "Professional Association Services",
    industry: "Property Management",
    title: "Empowers Staff and Delights Clients With AI-Powered Content Intelligence",
    summary: "HOA management firm for 150+ communities replaced a single-location file server with Egnyte, then added AI Assistant to let staff instantly find answers across a massive document library.",
    url: "https://www.egnyte.com/customers/professional-association-services-case-study",
    useCases: ["file_server", "single_source", "consolidation"],
  },
  {
    id: "koster",
    company: "Köster GmbH",
    industry: "Construction",
    title: "Simplifies Collaboration by Centralizing Data Management",
    summary: "Century-old German construction company with 20+ branches and dozens of subcontractors replaced a clunky FTP-based system with Egnyte for real-time external file sharing and permissions management.",
    url: "https://www.egnyte.com/customers/koster-case-study",
    useCases: ["external_sharing", "remote_jobsite", "internal_sharing"],
  },
  {
    id: "neuren",
    company: "Neuren Pharmaceuticals",
    industry: "Life Sciences",
    title: "Implements Egnyte as eQMS in Record Time",
    summary: "Pharmaceutical company deployed a complete electronic Quality Management System in 12 weeks using Egnyte's life sciences solution — meeting regulatory compliance without a lengthy validation project.",
    url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study",
    useCases: ["sensitive_data", "inventory_sensitive"],
  },
  {
    id: "aande",
    company: "A&E Design",
    industry: "AEC / Architecture",
    title: "Builds the Hybrid Work Model of Its Dreams",
    summary: "Montana architecture firm replaced on-prem storage that had become unmanageable for multi-office hybrid work, eliminating data silos and enabling real-time collaboration on large project files.",
    url: "https://www.egnyte.com/customers/aande-design-case-study",
    useCases: ["file_server", "consolidation", "internal_sharing"],
  },
  {
    id: "choate",
    company: "Choate Construction",
    industry: "Construction",
    title: "Renders Traditional IT Hardware an Afterthought",
    summary: "National commercial construction company outgrew AWS-hosted infrastructure as it scaled — switching to Egnyte to solve permissions complexity, folder structure, accessibility, and storage performance.",
    url: "https://www.egnyte.com/customers/choate-construction-case-study",
    useCases: ["file_server", "consolidation", "data_loss"],
  },
  {
    id: "campbell",
    company: "Campbell University",
    industry: "Education",
    title: "Secures Data, Simplifies IT, and Drives Campus-Wide Collaboration",
    summary: "Private university migrated from fragmented on-prem storage to Egnyte — gaining ransomware detection, self-service permissions, and data governance while simplifying a lean IT team's workload.",
    url: "https://www.egnyte.com/customers/campbell-university-case-study",
    useCases: ["file_server", "ransomware", "consolidation", "sensitive_data"],
  },
  {
    id: "redbull",
    company: "Red Bull",
    industry: "Media & Consumer Goods",
    title: "Unifies Global File Sharing for 20,000+ Users Across 170 Countries",
    summary: "Red Bull replaced fragmented per-region file servers, email attachments, and consumer cloud tools with a single governed platform — rolling out to 10,000 users globally in three months.",
    url: "https://www.egnyte.com/customers",
    useCases: ["consolidation", "internal_sharing", "file_server", "single_source"],
  },
  {
    id: "sme",
    company: "S&ME",
    industry: "AEC / Engineering",
    title: "Transforms 90TB of Chaotic Data Across 35 Offices Into a Governed Platform",
    summary: "Engineering firm managing 90TB across 35 offices replaced a chaotic multi-server environment with Egnyte — eliminating version conflicts, cutting storage costs, and unlocking federal contract eligibility.",
    url: "https://www.egnyte.com/customers",
    useCases: ["consolidation", "lifecycle", "single_source"],
  },
  {
    id: "alta",
    company: "ALTA Planning + Design",
    industry: "AEC / Planning",
    title: "Achieves $220K in Annual Savings by Replacing Legacy IT Systems",
    summary: "Global planning and design firm replaced costly legacy on-prem systems and disjointed data silos with Egnyte — saving over $220K annually and improving project efficiency by 10%.",
    url: "https://www.egnyte.com/customers",
    useCases: ["consolidation", "file_server"],
  },
  {
    id: "buzzfeed",
    company: "BuzzFeed",
    industry: "Media",
    title: "Balances Agile Media Production with Enterprise-Grade Data Governance",
    summary: "Digital media company deployed Egnyte's content classification and governance tools to protect sensitive content and enforce data policies without slowing down fast-moving creative workflows.",
    url: "https://www.egnyte.com/customers",
    useCases: ["sensitive_data", "inventory_sensitive"],
  },
  {
    id: "waionoka",
    company: "The Waionoka Group",
    industry: "Professional Services",
    title: "Boosts Data Security and Cuts Backup Support Tickets by 60%",
    summary: "Professional services firm moved sensitive client data off on-premises servers and tape backups to Egnyte — dramatically improving security posture and reducing backup-related IT burden.",
    url: "https://www.egnyte.com/customers",
    useCases: ["file_server", "data_loss"],
  },
];

const PLAN_COLORS = {
  starter: { color:"#76A2BC", bg:"rgba(118,162,188,0.15)", border:"rgba(118,162,188,0.3)" },
  ifs:     { color:"#0BC5BA", bg:"rgba(11,197,186,0.15)",  border:"rgba(11,197,186,0.35)" },
  elite:   { color:"#3D71EA", bg:"rgba(61,113,234,0.15)",  border:"rgba(61,113,234,0.35)" },
  ultimate:{ color:"#6E49FF", bg:"rgba(110,73,255,0.15)",  border:"rgba(110,73,255,0.35)" },
};
const PLAN_LABELS = { starter:"Starter", ifs:"IFS", elite:"Elite", ultimate:"Ultimate" };

// ─── CUSTOMER STORIES ─────────────────────────────────────────────────────────
const CUSTOMER_STORIES = [
  {
    id: "tilt_creative",
    company: "Tilt Creative + Production",
    industry: "Media & Entertainment",
    icon: "🎬",
    headline: "Ad production studio governing confidential data access for high-profile clients including Audi and Walmart.",
    url: "https://www.egnyte.com/customers/tilt-creative-case-study",
    useCases: ["sensitive_data", "inventory_sensitive"],
  },
  {
    id: "wintrust",
    company: "Wintrust Financial",
    industry: "Financial Services",
    icon: "🏦",
    headline: "$64B financial holding company replaced ShareFile with Egnyte for SSO, secure sharing, and data governance across 16 banks.",
    url: "https://www.egnyte.com/customers/wintrust-case-study",
    useCases: ["external_sharing", "sensitive_data", "single_source"],
  },
  {
    id: "moma",
    company: "MOMA Therapeutics",
    industry: "Life Sciences",
    icon: "🧬",
    headline: "Clinical-stage biotech securely sharing sensitive lab data with CRO partners during Phase I trials.",
    url: "https://www.egnyte.com/customers/moma-therapeutics-case-study",
    useCases: ["external_sharing", "sensitive_data"],
  },
  {
    id: "qk",
    company: "QK",
    industry: "Civil Engineering",
    icon: "🏗",
    headline: "Replaced siloed office file servers — previously tried Panzura and Azure Files — to get CAD files moving across offices.",
    url: "https://www.egnyte.com/customers/qk-case-study",
    useCases: ["file_server", "remote_jobsite", "consolidation"],
  },
  {
    id: "salasobrien",
    company: "Salas O'Brien",
    industry: "Engineering",
    icon: "🏛",
    headline: "Engineering firm with 50+ acquisitions and 105 offices replaced individual file servers and achieved CMMC compliance.",
    url: "https://www.egnyte.com/customers/salasobrien-case-study",
    useCases: ["consolidation", "file_server", "single_source"],
  },
  {
    id: "kl_engineering",
    company: "KL Engineering",
    industry: "Civil Engineering (AEC)",
    icon: "🛣",
    headline: "Civil engineering firm replaced old-school file servers to support remote work and large Civil 3D files across five offices.",
    url: "https://www.egnyte.com/customers/kl-engineering-case-study",
    useCases: ["file_server", "remote_jobsite"],
  },
  {
    id: "pure_financial",
    company: "Pure Financial Advisors",
    industry: "Financial Services (RIA)",
    icon: "📊",
    headline: "RIA using Egnyte as secure document foundation with AI layered on top to automate processing of thousands of client statements.",
    url: "https://www.egnyte.com/customers/pure-financial-advisors-case-study",
    useCases: ["single_source", "sensitive_data"],
  },
  {
    id: "pas",
    company: "Professional Association Services",
    industry: "Property Management",
    icon: "🏘",
    headline: "HOA management company for 150+ communities uses Egnyte AI Assistant to answer questions across a massive document library instantly.",
    url: "https://www.egnyte.com/customers/professional-association-services-case-study",
    useCases: ["single_source", "consolidation"],
  },
  {
    id: "koster",
    company: "Köster GmbH",
    industry: "Construction",
    icon: "🏗",
    headline: "German construction company with 20+ branches replaced a clunky file transfer process to collaborate with subcontractors and field teams.",
    url: "https://www.egnyte.com/customers/koster-case-study",
    useCases: ["external_sharing", "remote_jobsite", "internal_sharing"],
  },
  {
    id: "neuren",
    company: "Neuren Pharmaceuticals",
    industry: "Life Sciences / Pharma",
    icon: "💊",
    headline: "Pharmaceutical company implemented a compliant eQMS in just 12 weeks, replacing a legacy quality management system.",
    url: "https://www.egnyte.com/customers/neuren-pharmaceuticals-case-study",
    useCases: ["sensitive_data", "inventory_sensitive"],
  },
  {
    id: "aande",
    company: "A&E Design",
    industry: "Architecture",
    icon: "📐",
    headline: "Architecture firm eliminated data silos across Montana offices to enable hybrid work and collaboration on large AEC project files.",
    url: "https://www.egnyte.com/customers/aande-design-case-study",
    useCases: ["file_server", "remote_jobsite", "internal_sharing"],
  },
  {
    id: "choate",
    company: "Choate Construction",
    industry: "Commercial Construction",
    icon: "🏢",
    headline: "Commercial construction company eliminated traditional file server hardware as growth created complex permission and folder structure challenges.",
    url: "https://www.egnyte.com/customers/choate-construction-case-study",
    useCases: ["file_server", "consolidation", "internal_sharing"],
  },
  {
    id: "campbell",
    company: "Campbell University",
    industry: "Higher Education",
    icon: "🎓",
    headline: "Private university migrated from fragmented on-prem storage to Egnyte for ransomware detection, data governance, and campus-wide collaboration.",
    url: "https://www.egnyte.com/customers/campbell-university-case-study",
    useCases: ["file_server", "ransomware", "sensitive_data"],
  },
];

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
  const [builderShowScores, setBuilderShowScores] = useState(false);
  const [builderGen3, setBuilderGen3] = useState(false);

  // Use Cases state
  const [ucSearch, setUcSearch] = useState("");
  const [ucFilter, setUcFilter] = useState("all"); // all | starter | ifs | elite | ultimate
  const [ucExpanded, setUcExpanded] = useState({});

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
      // AEC: BIM/CAD file handling, project lifecycle, Procore/Autodesk integrations,
      // field site access, PDF markup, e-sig for submittals, ransomware protection, AI search for large file sets
      highlights:["specialized_file_handler","project_hub","pdf_handler","esignature","advanced_workflows","app_integrations","edge_caching","file_locking","link_sharing","ransomware_artifact","ai_search","ocr_search"] },
    { id:"finserv",  label:"Financial Services",icon:"🏦",
      desc:"Banking, Wealth, Insurance & Financial Advisory",
      // FinServ: client onboarding portals, sensitive data/PII discovery, compliance monitoring,
      // lifecycle policies, legal hold, DLP, audit trails, auto-remediation, e-sig for contracts
      highlights:["doc_portal","pdf_handler","esignature","sensitive_data","compliance_monitoring","lifecycle_policies","legal_hold","dlp","doc_labeling","auto_remediation","audit","suspicious_login","ransomware_artifact"] },
    { id:"lifesci",  label:"Life Sciences",     icon:"🧬",
      desc:"Pharma, Biotech & Medical Devices",
      // Life Sciences: GxP compliant storage, lifecycle/retention, legal hold, audit trails,
      // sensitive data for patient/IP protection, PDF workflows, OCR search for lab docs
      highlights:["compliant_storage","lifecycle_policies","legal_hold","compliance_monitoring","audit","sensitive_data","advanced_workflows","pdf_handler","esignature","ocr_search","ransomware_artifact","doc_labeling"] },
    { id:"mssp",     label:"MSP / IT",          icon:"🖥",
      desc:"Managed Service Providers & IT Teams",
      // MSP/IT: SSO/SAML for client domains, device controls, role admin,
      // ransomware detection + behavioral, auto-remediation, insider risk, data residency, encryption keys
      highlights:["sso","device_controls","role_admin","ransomware_artifact","ransomware_behavioral","auto_remediation","suspicious_login","unusual_access","data_residency","encryption_keys","api_remediation","lifecycle_policies"] },
  ];

  // ── AI Value Generation ──
  const [valuePoints, setValuePoints] = useState(null);   // legacy — kept for cache compat
  const [valuePillars, setValuePillars] = useState(null); // new pillar-grouped output
  const [objections, setObjections] = useState(null);
  const [scenario, setScenario] = useState("");           // optional seller context
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
    setValuePillars(null);
    setObjections(null);
    setValueError(null);
  }, [fromPlan, toPlan]);


  const generateValue = () => {
    if (!isUp || !fp || !tp) return;
    const verticalInfo = vertical ? VERTICALS.find(v=>v.id===vertical) : null;

    // Extract budget ceiling from scenario before building cache key
    const budgetMatch = scenario.match(/\$\s*(\d+(?:\.\d+)?)\s*(?:per user|\/user|\/u)?/i)
      || scenario.match(/(?:under|below|max|maximum|budget.*?)\s*\$?\s*(\d+(?:\.\d+)?)/i);
    const budgetCeiling = budgetMatch ? parseFloat(budgetMatch[1]) : null;

    const valueKey = `${fromPlan}→${toPlan}${vertical||""}${scenario.trim().slice(0,40)}${budgetCeiling||""}`;
    if (valueCache.current[valueKey]) {
      const c = valueCache.current[valueKey];
      setValuePillars(c.pillars);
      setObjections(c.objections);
      return;
    }

    const gained = FEATURE_SECTIONS.flatMap(s =>
      s.features.filter(f => {
        const fv = fp.features[f.id]; const tv = tp.features[f.id];
        return (tv === true || tv === "addon-included") && !fv;
      }).map(f => ({ ...f, sectionLabel: s.label }))
    );

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

    const scenarioLine = scenario.trim()
      ? "\nCustomer context from the seller: \"" + scenario.trim() + "\""
      : "";

    const budgetLine = budgetCeiling
      ? "\nHARD CONSTRAINT: The customer's maximum MSP price is $" + budgetCeiling.toFixed(2) + "/user/month. Do NOT generate value points that imply, suggest, or require a plan above this price point. Focus only on the capabilities available within this budget."
      : "";

    const verticalLine = verticalInfo
      ? " Customer industry: " + verticalInfo.desc + "." + (verticalHighlights.length > 0 ? " Key capabilities for this vertical: " + verticalHighlights.join(", ") + "." : "")
      : "";

    setValueLoading(true);
    setValuePillars(null);
    setObjections(null);
    setValueError(null);

    const prompt = "You are a senior Egnyte partner sales engineer preparing a concise upgrade brief.\n\n"
      + "Upgrade: " + fp.name + " (" + fp.family + ") → " + tp.name + " (" + tp.family + ")\n"
      + costLine + verticalLine + scenarioLine + budgetLine + "\n\n"
      + "Net-new capabilities by category:\n" + gainedBySec + "\n\n"
      + "Return ONLY valid JSON (no markdown, no preamble):\n"
      + '{\n'
      + '  "pillars": [\n'
      + '    { "icon": "🤝", "pillar": "Pillar Name", "point": "1-2 sentence outcome-focused value statement", "vertical_key": false },\n'
      + '    ...\n'
      + '  ],\n'
      + '  "objections": [\n'
      + '    { "q": "objection as customer would say it", "a": "1-2 sentence response" },\n'
      + '    ...\n'
      + '  ]\n'
      + '}\n\n'
      + 'For "pillars" — 3 to 5 entries, each covering a DISTINCT business area from the capabilities listed above. Rules:\n'
      + '- ONLY reference capabilities that are actually listed in "Net-new capabilities by category" above. Do not invent or imply features not in that list.\n'
      + '- Choose a relevant emoji icon and short pillar name (e.g. "Security & Recovery", "AI & Search", "Document Workflows", "Governance")\n'
      + '- Each "point" leads with the business outcome — what the customer can now do or prevent that they couldn\'t before\n'
      + '- Be concrete. No filler. No generic phrases like "improve productivity"\n'
      + '- 1-2 sentences per point\n'
      + (budgetLine ? '- CRITICAL: Do not suggest, imply, or reference any plan or capability beyond the stated budget ceiling. Stay strictly within what this upgrade provides.\n' : '')
      + (scenarioLine ? '- Tailor every point to the specific customer context provided. Address their stated situation directly.\n' : '')
      + (verticalInfo ? '- Weight outcomes relevant to ' + verticalInfo.desc + ' buyers\n' : '')
      + (verticalInfo ? '- Set "vertical_key": true on the 1-2 pillars most directly relevant to ' + verticalInfo.label + ' buyers\n' : '- Set "vertical_key": false on all pillars\n')
      + '\n'
      + 'For "objections" — exactly 3. Each "q" is phrased as the customer would actually say it (skeptical, casual). Each "a" is a confident 1-2 sentence response grounded in specific capabilities from the list above — no generic answers.\n'
      + (budgetLine ? 'Objections should reflect realistic pushbacks given the stated budget constraints and customer context.' : '');

    fetch("/api/value", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1800,
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
        setValuePillars(parsed.pillars);
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
        @keyframes shimmer{from{background-position:-468px 0}to{background-position:468px 0}}
        .shimmer{background:linear-gradient(90deg,rgba(11,197,186,0.04) 0%,rgba(11,197,186,0.1) 50%,rgba(11,197,186,0.04) 100%);background-size:936px 100%;animation:shimmer 1.4s ease infinite;}
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
              {[{id:"compare",label:"Upgrade Compare"},{id:"matrix",label:"Full Matrix"},{id:"builder",label:"✦ Plan Builder"},{id:"usecases",label:"🎯 Use Cases"}].map(tab=>(
                <button key={tab.id} className="mode-btn" onClick={()=>{ setMode(tab.id); if(tab.id==="builder"){ setBuilderStep(0); setBuilderAnswers({}); setBuilderResult(null); setBuilderShowFeatures(false); setBuilderShowScores(false); setBuilderGen3(false); } }} style={{
                  padding:"7px 20px", borderRadius:7, fontSize:12, fontWeight:600, letterSpacing:"0.01em",
                  background: mode===tab.id ? tab.id==="builder" ? `linear-gradient(135deg,${E.purple},${E.blue2})` : tab.id==="usecases" ? `linear-gradient(135deg,${E.blue},${E.blue2})` : `linear-gradient(135deg,${E.teal},#0099A8)` : "transparent",
                  color: mode===tab.id ? "white" : E.textMut,
                  boxShadow: mode===tab.id ? tab.id==="builder" ? `0 2px 14px rgba(110,73,255,0.4)` : tab.id==="usecases" ? `0 2px 14px rgba(3,123,189,0.4)` : `0 2px 14px rgba(11,197,186,0.3)` : "none",
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

              {/* Pricing disclaimer — shown once */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:6, marginBottom:16, padding:"8px 12px", background:E.navySurf, borderRadius:8, border:`1px solid ${E.borderSub}` }}>
                <span style={{ fontSize:13, color:E.textMut, flexShrink:0 }}>ⓘ</span>
                <span style={{ fontSize:11, color:E.textMut, lineHeight:1.6 }}>Pricing shown reflects current standard entry-level MSP rates for the first license tier. Actual pricing may vary based on license volume, contract terms, or program cohort. Confirm with your Partner Manager or refer to your invoice.</span>
              </div>

              {!isUp ? (
                <div style={{ background:"rgba(110,73,255,0.1)", border:`1px solid rgba(110,73,255,0.3)`, borderRadius:10, padding:"16px 20px", color:"#a78bfa", fontSize:14, fontWeight:500 }}>
                  ⚠ Select a higher-tier proposed plan to generate the upgrade comparison.
                </div>
              ) : (<>

                {/* ── Summary Card ── */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, marginBottom:12, overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1px 1fr" }}>

                  {/* LEFT — Upgrade Summary */}
                  <div style={{ padding:"20px 24px" }}>
                    <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>Upgrade Summary</div>

                    {/* Net-new */}
                    <div style={{ marginBottom:20 }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                        <span style={{ fontSize:52, fontWeight:900, color:E.purple, letterSpacing:"-0.05em", lineHeight:1 }}>{netNew}</span>
                        <span style={{ fontSize:14, color:E.textMut, fontWeight:500 }}>net-new features</span>
                      </div>
                      <div style={{ fontSize:11, color:E.textMut, marginTop:4 }}>unlocked moving to {tp?.name}</div>
                    </div>

                    {/* Per-user uplift */}
                    <div style={{ borderTop:`1px solid ${E.borderSub}`, paddingTop:14 }}>
                      <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Price Uplift / User / Month</div>
                      <div style={{ display:"flex", gap:20, alignItems:"flex-end" }}>
                        <div>
                          <div style={{ fontSize:9, fontWeight:700, color:E.teal, letterSpacing:"0.08em", marginBottom:3 }}>MSP</div>
                          <div style={{ fontSize:28, fontWeight:800, color:E.teal, letterSpacing:"-0.03em", lineHeight:1 }}>
                            {dMsp!=null ? fmtD(dMsp) : "—"}
                          </div>
                        </div>
                        {dMsrp!=null && <>
                          <div style={{ width:1, height:36, background:E.border, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", marginBottom:3 }}>MSRP</div>
                            <div style={{ fontSize:20, fontWeight:700, color:E.textMut, letterSpacing:"-0.02em", lineHeight:1 }}>{fmtD(dMsrp)}</div>
                          </div>
                        </>}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ background:E.border }}/>

                  {/* RIGHT — Deal Calculator */}
                  <div style={{ padding:"20px 24px", background:E.navySurf }}>
                    <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>Deal Calculator</div>

                    {/* Inputs row */}
                    <div style={{ display:"flex", gap:10, alignItems:"flex-end", marginBottom:18, flexWrap:"wrap" }}>
                      {/* Users */}
                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        <span style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase" }}>Users</span>
                        <input type="number" min="1" value={userCount}
                          onChange={e => setUserCount(Math.max(1, parseInt(e.target.value)||1))}
                          style={{ width:70, background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:7, padding:"7px 8px", color:E.text, fontSize:14, fontWeight:700, fontFamily:"'Inter',sans-serif", outline:"none", textAlign:"center" }}/>
                      </div>

                      {/* From price */}
                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        <span style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase" }}>{fp?.name} $/user</span>
                        <div style={{ position:"relative" }}>
                          <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:E.textMut, fontSize:11, pointerEvents:"none" }}>$</span>
                          <input type="number" min="0" step="0.01" value={calcFromPrice}
                            onChange={e => setFromPrice(parseFloat(e.target.value)||0)}
                            style={{ width:80, background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:7, padding:"7px 8px 7px 18px", color:E.textSub, fontSize:14, fontWeight:600, fontFamily:"'Inter',sans-serif", outline:"none" }}/>
                        </div>
                      </div>

                      <span style={{ color:E.textMut, fontSize:16, paddingBottom:4, flexShrink:0 }}>→</span>

                      {/* To price */}
                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        <span style={{ fontSize:9, fontWeight:700, color:E.teal, letterSpacing:"0.08em", textTransform:"uppercase" }}>{tp?.name} $/user</span>
                        <div style={{ position:"relative" }}>
                          <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:E.teal+"88", fontSize:11, pointerEvents:"none" }}>$</span>
                          <input type="number" min="0" step="0.01" value={calcToPrice}
                            onChange={e => setToPrice(parseFloat(e.target.value)||0)}
                            style={{ width:80, background:E.navyCard, border:`1px solid ${E.teal}44`, borderRadius:7, padding:"7px 8px 7px 18px", color:E.teal, fontSize:14, fontWeight:600, fontFamily:"'Inter',sans-serif", outline:"none" }}/>
                        </div>
                      </div>
                    </div>

                    {/* Impact output */}
                    <div style={{ borderTop:`1px solid ${E.border}`, paddingTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                      <div style={{ paddingRight:16, borderRight:`1px solid ${E.borderSub}` }}>
                        <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Monthly Δ</div>
                        <div style={{ fontSize:28, fontWeight:800, color:E.teal, letterSpacing:"-0.03em", lineHeight:1 }}>{fmtD(monthlyDelta)}</div>
                        <div style={{ fontSize:10, color:E.textMut, marginTop:4 }}>${currentMo.toFixed(2)} → ${proposedMo.toFixed(2)}</div>
                      </div>
                      <div style={{ paddingLeft:16 }}>
                        <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Annual Δ</div>
                        <div style={{ fontSize:28, fontWeight:800, color:E.purple, letterSpacing:"-0.03em", lineHeight:1 }}>{fmtD(annualDelta)}</div>
                        <div style={{ fontSize:10, color:E.textMut, marginTop:4 }}>{userCount} users</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ── Upgrade Value + Vertical (unified card) ── */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, marginBottom:20, overflow:"hidden" }}>

                  {/* Header */}
                  <div style={{ padding:"18px 24px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${E.borderSub}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:2.5, height:14, borderRadius:2, background:E.teal }}/>
                      <span style={{ fontSize:10, fontWeight:700, color:E.teal, textTransform:"uppercase", letterSpacing:"0.12em" }}>Upgrade Value Summary</span>
                      <span style={{ fontSize:10, color:E.textMut }}>— {fp.name} → {tp.name}</span>
                    </div>
                    {valuePillars && !valueLoading && (
                      <button onClick={generateValue} style={{ background:"transparent", border:`1px solid ${E.borderSub}`, borderRadius:6, color:E.textMut, fontSize:11, cursor:"pointer", fontFamily:"'Inter',sans-serif", padding:"4px 10px" }}>
                        ↻ Regenerate
                      </button>
                    )}
                  </div>

                  {/* Steps */}
                  <div style={{ padding:"20px 24px 0", display:"flex", flexDirection:"column", gap:0 }}>

                    {/* Step 1 */}
                    <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background: vertical ? E.teal : E.navySurf, border:`2px solid ${vertical ? E.teal : E.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                          <span style={{ fontSize:13, fontWeight:800, color: vertical ? E.navy : E.textMut }}>1</span>
                        </div>
                        <div style={{ width:2, flex:1, minHeight:20, background: vertical ? `linear-gradient(${E.teal}, ${E.borderSub})` : E.borderSub, marginTop:4, marginBottom:4 }}/>
                      </div>
                      <div style={{ flex:1, paddingBottom:16 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                          <span style={{ fontSize:13, fontWeight:700, color: vertical ? E.text : E.textSub }}>Customer Industry</span>
                          <span style={{ fontSize:9, color:E.textMut, background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:4, padding:"1px 6px" }}>optional · tailors AI + highlights table</span>
                        </div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <button onClick={()=>setVertical(null)}
                            style={{ padding:"6px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                              background: vertical===null ? "rgba(118,162,188,0.15)" : "transparent",
                              border: `1px solid ${vertical===null ? E.textSub : E.borderSub}`,
                              color: vertical===null ? E.text : E.textMut }}>
                            All
                          </button>
                          {VERTICALS.map(v=>(
                            <button key={v.id} onClick={()=>setVertical(prev=>prev===v.id?null:v.id)}
                              style={{ padding:"6px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                                background: vertical===v.id ? "rgba(11,197,186,0.15)" : "transparent",
                                border: `1px solid ${vertical===v.id ? E.teal : E.borderSub}`,
                                color: vertical===v.id ? E.teal : E.textMut,
                                boxShadow: vertical===v.id ? `0 0 0 3px rgba(11,197,186,0.1)` : "none" }}>
                              {v.icon} {v.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background: scenario.trim() ? E.teal : E.navySurf, border:`2px solid ${scenario.trim() ? E.teal : E.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                          <span style={{ fontSize:13, fontWeight:800, color: scenario.trim() ? E.navy : E.textMut }}>2</span>
                        </div>
                        <div style={{ width:2, flex:1, minHeight:20, background: scenario.trim() ? `linear-gradient(${E.teal}, ${E.borderSub})` : E.borderSub, marginTop:4, marginBottom:4 }}/>
                      </div>
                      <div style={{ flex:1, paddingBottom:16 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                          <span style={{ fontSize:13, fontWeight:700, color: scenario.trim() ? E.text : E.textSub }}>Customer Context</span>
                          <span style={{ fontSize:9, color:E.textMut, background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:4, padding:"1px 6px" }}>optional</span>
                        </div>
                        <textarea
                          value={scenario}
                          onChange={e => setScenario(e.target.value)}
                          placeholder="e.g. 80-user AEC firm moving off an on-prem file server, field teams on job sites, concerned about ransomware after a recent incident…"
                          rows={2}
                          style={{ width:"100%", background:E.navySurf, border:`1px solid ${scenario ? E.teal+"55" : E.borderSub}`, borderRadius:8, padding:"10px 12px", color:E.textSub, fontSize:12, fontFamily:"'Inter',sans-serif", outline:"none", resize:"vertical", lineHeight:1.6, transition:"border-color 0.15s", boxSizing:"border-box" }}
                        />
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                      <div style={{ flexShrink:0 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${E.teal},#0099A8)`, border:`2px solid ${E.teal}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 12px rgba(11,197,186,0.35)` }}>
                          <span style={{ fontSize:13, fontWeight:800, color:E.navy }}>3</span>
                        </div>
                      </div>
                      <div style={{ flex:1, paddingBottom:20 }}>
                        <div style={{ marginBottom:10 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:E.text }}>Generate</span>
                        </div>
                        <button onClick={generateValue} disabled={valueLoading}
                          style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"13px 24px", borderRadius:8, border:`1px solid ${E.teal}55`, background: valueLoading ? "rgba(11,197,186,0.05)" : "rgba(11,197,186,0.12)", color: valueLoading ? E.textMut : E.teal, fontSize:13, fontWeight:700, cursor: valueLoading ? "not-allowed" : "pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
                          {valueLoading
                            ? <><div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${E.teal}44`, borderTopColor:E.teal, animation:"spin 0.8s linear infinite" }}/> Generating…</>
                            : <>✦ Generate Value Summary{vertical ? ` · ${VERTICALS.find(v=>v.id===vertical)?.icon} ${VERTICALS.find(v=>v.id===vertical)?.label}` : ""}{scenario.trim() ? " · with context" : ""}</>}
                        </button>
                      </div>
                    </div>

                  </div>{/* end steps */}

                  {valueError && (
                    <div style={{ margin:"0 24px 20px", padding:"10px 14px", background:"rgba(255,202,41,0.08)", border:`1px solid rgba(255,202,41,0.2)`, borderRadius:8, fontSize:12, color:E.yellow }}>⚠ {valueError}</div>
                  )}

                  {/* Loading shimmer */}
                  {valueLoading && (
                    <div style={{ borderTop:`1px solid ${E.border}`, padding:"20px 24px", display:"flex", flexDirection:"column", gap:10 }}>
                      {[1,2,3].map(i => (
                        <div key={i} className="shimmer" style={{ borderRadius:10, height:86 }}/>
                      ))}
                      <div style={{ borderTop:`1px solid ${E.borderSub}`, paddingTop:16, display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
                        {[1,2,3].map(i => (
                          <div key={i} className="shimmer" style={{ borderRadius:8, height:56 }}/>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pillar cards */}
                  {valuePillars && !valueLoading && (() => {
                    const vertObj = vertical ? VERTICALS.find(v=>v.id===vertical) : null;
                    return (
                      <div style={{ borderTop:`1px solid ${E.border}`, padding:"20px 24px", display:"flex", flexDirection:"column", gap:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <div style={{ width:2.5, height:12, borderRadius:2, background:E.teal }}/>
                          <span style={{ fontSize:9, fontWeight:700, color:E.teal, textTransform:"uppercase", letterSpacing:"0.12em" }}>Value by Pillar</span>
                          {vertObj && <span style={{ fontSize:9, color:E.teal, background:"rgba(11,197,186,0.08)", border:`1px solid rgba(11,197,186,0.2)`, borderRadius:4, padding:"1px 8px" }}>{vertObj.icon} {vertObj.label} context applied</span>}
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:10 }}>
                          {valuePillars.map((p, i) => (
                            <div key={i} className="fade-up" style={{
                              background: p.vertical_key ? `rgba(11,197,186,0.06)` : E.navySurf,
                              borderRadius:10, padding:"14px 16px",
                              border:`1px solid ${p.vertical_key ? E.teal+"55" : E.borderSub}`,
                              borderLeft:`3px solid ${p.vertical_key ? E.teal : E.borderSub}`,
                              animationDelay:`${i*60}ms`
                            }}>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ fontSize:20, lineHeight:1 }}>{p.icon}</span>
                                  <span style={{ fontSize:10, fontWeight:700, color: p.vertical_key ? E.teal : E.textSub, textTransform:"uppercase", letterSpacing:"0.1em" }}>{p.pillar}</span>
                                </div>
                                {p.vertical_key && vertObj && (
                                  <span style={{ fontSize:9, fontWeight:700, color:E.teal, background:"rgba(11,197,186,0.1)", border:`1px solid rgba(11,197,186,0.25)`, borderRadius:4, padding:"2px 7px", whiteSpace:"nowrap" }}>
                                    KEY · {vertObj.label}
                                  </span>
                                )}
                              </div>
                              <p style={{ fontSize:13, color:E.text, lineHeight:1.7, margin:0 }}>{p.point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Objections */}
                  {objections && !valueLoading && (
                    <div style={{ borderTop:`1px solid ${E.border}`, padding:"20px 24px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                        <div style={{ width:2.5, height:12, borderRadius:2, background:E.yellow }}/>
                        <span style={{ fontSize:9, fontWeight:700, color:E.yellow, textTransform:"uppercase", letterSpacing:"0.12em" }}>Common Objections</span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {objections.map((obj, i) => (
                          <div key={i} className="fade-up" style={{ background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:10, overflow:"hidden", animationDelay:`${i*80}ms` }}>
                            <div style={{ padding:"11px 16px", display:"flex", gap:10, alignItems:"flex-start", borderBottom:`1px solid ${E.borderSub}` }}>
                              <span style={{ fontSize:10, fontWeight:700, color:E.yellow, background:"rgba(255,202,41,0.1)", border:`1px solid rgba(255,202,41,0.25)`, borderRadius:4, padding:"2px 7px", flexShrink:0, marginTop:1 }}>Q</span>
                              <span style={{ fontSize:13, color:E.text, fontWeight:500, lineHeight:1.5 }}>{obj.q}</span>
                            </div>
                            <div style={{ padding:"11px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
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

                        {/* Score breakdown toggle */}
                        <button onClick={()=>setBuilderShowScores(v=>!v)}
                          style={{ marginTop:14, display:"flex", alignItems:"center", gap:6, background:"transparent", border:`1px solid ${E.borderSub}`, borderRadius:6, padding:"5px 12px", cursor:"pointer", fontFamily:"'Inter',sans-serif", color:E.textMut, fontSize:11 }}>
                          <span>{builderShowScores ? "▲" : "▼"}</span>
                          <span>Show score breakdown</span>
                        </button>

                        {builderShowScores && (
                          <div style={{ marginTop:12, background:"rgba(0,0,0,0.2)", borderRadius:10, overflow:"hidden", border:`1px solid ${E.borderSub}` }}>
                            {/* Header row */}
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px 80px", padding:"8px 14px", borderBottom:`1px solid ${E.borderSub}`, background:"rgba(0,0,0,0.2)" }}>
                              <div style={{ fontSize:9, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.08em" }}>Question / Answer</div>
                              {["Starter","IFS","Elite","Ultimate"].map(p => (
                                <div key={p} style={{ fontSize:9, fontWeight:700, color: PLAN_BUILDER_MAP[p.toLowerCase()]?.color, textTransform:"uppercase", letterSpacing:"0.08em", textAlign:"center" }}>{p}</div>
                              ))}
                            </div>
                            {BUILDER_QUESTIONS.map(q => {
                              const ans = builderAnswers[q.id];
                              const ids = Array.isArray(ans) ? ans : ans ? [ans] : [];
                              if (ids.length === 0) return (
                                <div key={q.id} style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px 80px", padding:"8px 14px", borderBottom:`1px solid ${E.borderSub}`, opacity:0.4 }}>
                                  <div>
                                    <div style={{ fontSize:10, color:E.textMut, marginBottom:2 }}>{q.q}</div>
                                    <div style={{ fontSize:11, color:E.textMut, fontStyle:"italic" }}>skipped</div>
                                  </div>
                                  {["starter","ifs","elite","ultimate"].map(p => <div key={p} style={{ textAlign:"center", fontSize:11, color:E.textMut }}>—</div>)}
                                </div>
                              );
                              return ids.map(id => {
                                const opt = q.options.find(o => o.id === id);
                                if (!opt) return null;
                                return (
                                  <div key={q.id+id} style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px 80px", padding:"8px 14px", borderBottom:`1px solid ${E.borderSub}` }}>
                                    <div>
                                      <div style={{ fontSize:10, color:E.textMut, marginBottom:2 }}>{q.q}</div>
                                      <div style={{ fontSize:12, color:E.text, fontWeight:500 }}>{opt.icon} {opt.label}</div>
                                    </div>
                                    {["starter","ifs","elite","ultimate"].map(p => {
                                      const pts = opt.scores[p] || 0;
                                      const m = PLAN_BUILDER_MAP[p];
                                      return (
                                        <div key={p} style={{ textAlign:"center", fontSize:12, fontWeight: pts > 0 ? 700 : 400, color: pts >= 4 ? m.color : pts > 0 ? `${m.color}99` : E.textMut+"55" }}>
                                          {pts > 0 ? `+${pts}` : "—"}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              });
                            })}
                            {/* Totals row */}
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px 80px", padding:"10px 14px", background:"rgba(0,0,0,0.2)" }}>
                              <div style={{ fontSize:11, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.08em" }}>Total</div>
                              {["starter","ifs","elite","ultimate"].map(p => {
                                const m = PLAN_BUILDER_MAP[p];
                                return (
                                  <div key={p} style={{ textAlign:"center", fontSize:13, fontWeight:800, color: p===winner ? m.color : E.textMut }}>
                                    {totals[p]}
                                    {p===winner && <span style={{ fontSize:9, marginLeft:3 }}>★</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
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

                    {/* Gen 3 toggle */}
                    {(() => {
                      const gen3 = GEN3_EQUIVALENT[winner];
                      const gen3plan = gen3 ? PLANS.find(p => p.id === gen3.id) : null;
                      return gen3 ? (
                        <div style={{ marginTop:4 }}>
                          <button onClick={() => setBuilderGen3(v => !v)}
                            style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:`1px solid ${E.borderSub}`, borderRadius:8, padding:"10px 14px", cursor:"pointer", fontFamily:"'Inter',sans-serif", width:"100%", marginBottom: builderGen3 ? 0 : 16 }}>
                            <span style={{ fontSize:11, color:E.textMut }}>Looking for a Gen 3 equivalent?</span>
                            <span style={{ fontSize:11, fontWeight:700, color:E.blue2 }}>{gen3.name}</span>
                            <span style={{ marginLeft:"auto", fontSize:11, color:E.textMut }}>{builderGen3 ? "▲" : "▼"}</span>
                          </button>
                          {builderGen3 && gen3plan && (
                            <div style={{ background:"rgba(55,113,234,0.06)", border:`1px solid rgba(55,113,234,0.2)`, borderRadius:"0 0 10px 10px", padding:"14px 16px", marginBottom:16 }}>
                              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:10 }}>
                                <div>
                                  <div style={{ fontSize:9, fontWeight:700, color:E.blue2, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>Gen 3 Equivalent</div>
                                  <div style={{ fontSize:24, fontWeight:800, color:E.blue2 }}>{gen3.name}</div>
                                </div>
                                {gen3plan.pricing?.msp && (
                                  <div style={{ textAlign:"right" }}>
                                    <div style={{ fontSize:9, color:E.textMut, marginBottom:2 }}>MSP</div>
                                    <div style={{ fontSize:20, fontWeight:800, color:E.blue2 }}>${gen3plan.pricing.msp.toFixed(2)}<span style={{ fontSize:11, fontWeight:400, color:E.textMut }}>/user/mo</span></div>
                                    <div style={{ fontSize:10, color:E.textMut }}>MSRP ${gen3plan.pricing.msrp.toFixed(2)}/user/mo</div>
                                  </div>
                                )}
                              </div>
                              <p style={{ fontSize:12, color:E.textSub, lineHeight:1.6, marginBottom:10 }}>{gen3.note}</p>
                              <button onClick={() => { setToPlan(gen3.id); setMode("compare"); }}
                                style={{ padding:"8px 16px", borderRadius:7, border:`1px solid rgba(55,113,234,0.4)`, background:"rgba(55,113,234,0.1)", color:E.blue2, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                                Compare {gen3.name} vs Current Plan →
                              </button>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}

                    {/* CTAs */}
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      <button onClick={()=>{ setToPlan(winner); setMode("compare"); }}
                        style={{ flex:1, minWidth:200, padding:"14px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${meta.color},${meta.color}cc)`, color: winner==="starter" ? E.navy : "white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", boxShadow:`0 4px 20px ${meta.color}44` }}>
                        Compare {meta.name} vs Current Plan →
                      </button>
                      <button onClick={()=>{ setBuilderStep(0); setBuilderAnswers({}); setBuilderResult(null); setBuilderShowFeatures(false); setBuilderShowScores(false); setBuilderGen3(false); }}
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
          {/* ── USE CASES ── */}
          {mode==="usecases" && (() => {
            const filtered = USE_CASES.filter(uc => {
              const matchesPlan = ucFilter === "all" || uc.plans.includes(ucFilter);
              const q = ucSearch.toLowerCase();
              const matchesSearch = !q || uc.title.toLowerCase().includes(q) || uc.example.toLowerCase().includes(q) || uc.triggers.some(t => t.toLowerCase().includes(q)) || uc.competitors.some(c => c.toLowerCase().includes(q));
              return matchesPlan && matchesSearch;
            });

            return (
              <div>
                {/* Header */}
                <div style={{ marginBottom:28 }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(3,123,189,0.1)", border:"1px solid rgba(3,123,189,0.25)", borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:E.blue, letterSpacing:"0.12em", textTransform:"uppercase" }}>● Sales Discovery Guide</span>
                  </div>
                  <h1 style={{ fontSize:32, fontWeight:900, color:E.text, margin:"0 0 10px", letterSpacing:"-0.02em" }}>
                    Use Case <span style={{ color:E.blue }}>Library</span>
                  </h1>
                  <p style={{ fontSize:14, color:E.textSub, lineHeight:1.6, maxWidth:600, margin:0 }}>
                    Start from the customer's problem, not the plan. Find the use case that matches your conversation, then get the right plan, key capabilities, and competitive win themes.
                  </p>
                </div>

                {/* Search + Filter bar */}
                <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
                  <div style={{ position:"relative", flex:1, minWidth:220 }}>
                    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:E.textMut, fontSize:14, pointerEvents:"none" }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search use cases, triggers, competitors…"
                      value={ucSearch}
                      onChange={e => setUcSearch(e.target.value)}
                      style={{ width:"100%", boxSizing:"border-box", background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:9, padding:"10px 12px 10px 36px", color:E.text, fontSize:13, fontFamily:"'Inter',sans-serif", outline:"none" }}
                    />
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {[
                      { id:"all",     label:"All Plans" },
                      { id:"starter", label:"Starter" },
                      { id:"ifs",     label:"IFS" },
                      { id:"elite",   label:"Elite" },
                      { id:"ultimate",label:"Ultimate" },
                    ].map(f => {
                      const pc = f.id === "all" ? null : PLAN_COLORS[f.id];
                      const active = ucFilter === f.id;
                      return (
                        <button key={f.id} onClick={() => setUcFilter(f.id)} style={{
                          padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer",
                          fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                          background: active ? (pc ? pc.bg : "rgba(11,197,186,0.15)") : "transparent",
                          border: active ? `1px solid ${pc ? pc.border : E.border}` : `1px solid ${E.borderSub}`,
                          color: active ? (pc ? pc.color : E.teal) : E.textMut,
                        }}>{f.label}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Count */}
                <div style={{ fontSize:11, color:E.textMut, marginBottom:16 }}>
                  {filtered.length} of {USE_CASES.length} use cases
                  {ucFilter !== "all" && <span style={{ color:PLAN_COLORS[ucFilter]?.color }}> · filtered by {PLAN_LABELS[ucFilter]}</span>}
                  {ucSearch && <span> · matching "{ucSearch}"</span>}
                </div>

                {/* Cards grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(440px, 1fr))", gap:14 }}>
                  {filtered.map(uc => {
                    const isOpen = !!ucExpanded[uc.id];
                    return (
                      <div key={uc.id} style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:12, overflow:"hidden", transition:"border-color 0.15s", borderColor: isOpen ? "rgba(3,123,189,0.4)" : E.border }}>

                        {/* Card header — always visible */}
                        <button onClick={() => setUcExpanded(p => ({...p, [uc.id]: !p[uc.id]}))}
                          style={{ width:"100%", textAlign:"left", background:"transparent", border:"none", cursor:"pointer", padding:"18px 20px", fontFamily:"'Inter',sans-serif" }}>
                          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                            <span style={{ fontSize:24, lineHeight:1, marginTop:2, flexShrink:0 }}>{uc.icon}</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, fontWeight:700, color:E.text, marginBottom:6, lineHeight:1.3 }}>{uc.title}</div>
                              <div style={{ fontSize:12, color:E.textSub, lineHeight:1.5, marginBottom:10 }}>{uc.example}</div>
                              {/* Plan badges */}
                              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                                {uc.plans.map(p => {
                                  const pc = PLAN_COLORS[p];
                                  return (
                                    <span key={p} style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:5, background:pc.bg, border:`1px solid ${pc.border}`, color:pc.color, letterSpacing:"0.04em" }}>
                                      {PLAN_LABELS[p]}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                            <span style={{ color:E.textMut, fontSize:14, flexShrink:0, marginTop:2 }}>{isOpen ? "▲" : "▼"}</span>
                          </div>
                        </button>

                        {/* Expanded detail */}
                        {isOpen && (
                          <div style={{ borderTop:`1px solid ${E.borderSub}`, padding:"16px 20px", display:"flex", flexDirection:"column", gap:16 }}>

                            {/* Discovery triggers */}
                            <div>
                              <div style={{ fontSize:9, fontWeight:700, color:E.blue, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>🎯 What to Listen For</div>
                              <ul style={{ margin:0, paddingLeft:16, display:"flex", flexDirection:"column", gap:4 }}>
                                {uc.triggers.map((t,i) => (
                                  <li key={i} style={{ fontSize:12, color:E.textSub, lineHeight:1.5 }}>{t}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Plan notes */}
                            <div>
                              <div style={{ fontSize:9, fontWeight:700, color:E.teal, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>📦 Recommended Plans</div>
                              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                                {uc.plans.map(p => {
                                  const pc = PLAN_COLORS[p];
                                  return (
                                    <div key={p} style={{ display:"flex", gap:10, alignItems:"flex-start", background:pc.bg, border:`1px solid ${pc.border}`, borderRadius:7, padding:"8px 12px" }}>
                                      <span style={{ fontSize:11, fontWeight:800, color:pc.color, flexShrink:0, marginTop:1, minWidth:48 }}>{PLAN_LABELS[p]}</span>
                                      <span style={{ fontSize:12, color:E.textSub, lineHeight:1.5 }}>{uc.planNotes[p]}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Key capabilities */}
                            <div>
                              <div style={{ fontSize:9, fontWeight:700, color:E.purple, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>✦ Key Capabilities</div>
                              <ul style={{ margin:0, paddingLeft:16, display:"flex", flexDirection:"column", gap:4 }}>
                                {uc.capabilities.map((c,i) => (
                                  <li key={i} style={{ fontSize:12, color:E.textSub, lineHeight:1.5 }}>{c}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Competitors + why we win — side by side */}
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                              <div>
                                <div style={{ fontSize:9, fontWeight:700, color:E.textMut, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>⚔ Competitors</div>
                                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                                  {uc.competitors.map((c,i) => (
                                    <div key={i} style={{ fontSize:11, color:E.textSub, background:E.navySurf, borderRadius:5, padding:"4px 9px" }}>{c}</div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize:9, fontWeight:700, color:E.teal, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>🏆 Why Egnyte Wins</div>
                                <ul style={{ margin:0, paddingLeft:14, display:"flex", flexDirection:"column", gap:4 }}>
                                  {uc.whyEgnyte.map((w,i) => (
                                    <li key={i} style={{ fontSize:11, color:E.textSub, lineHeight:1.5 }}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Customer stories */}
                            {(() => {
                              const stories = CUSTOMER_STORIES.filter(s => s.useCases.includes(uc.id));
                              if (!stories.length) return null;
                              return (
                                <div>
                                  <div style={{ fontSize:9, fontWeight:700, color:"#FFCA29", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>📖 Customer Stories</div>
                                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                                    {stories.map(s => (
                                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                                        style={{ display:"flex", alignItems:"flex-start", gap:10, background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:8, padding:"10px 12px", textDecoration:"none", transition:"border-color 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,202,41,0.35)"}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = E.borderSub}>
                                        <span style={{ fontSize:18, lineHeight:1, flexShrink:0, marginTop:1 }}>{s.icon}</span>
                                        <div style={{ flex:1, minWidth:0 }}>
                                          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
                                            <span style={{ fontSize:12, fontWeight:700, color:E.text }}>{s.company}</span>
                                            <span style={{ fontSize:9, fontWeight:600, color:E.textMut, background:E.navyCard, borderRadius:4, padding:"2px 7px", letterSpacing:"0.05em" }}>{s.industry}</span>
                                          </div>
                                          <div style={{ fontSize:11, color:E.textSub, lineHeight:1.5 }}>{s.headline}</div>
                                        </div>
                                        <span style={{ fontSize:11, color:"#FFCA29", flexShrink:0, marginTop:2, whiteSpace:"nowrap" }}>Read →</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Customer Stories */}
                            {uc.customerStories && uc.customerStories.length > 0 && (
                              <div>
                                <div style={{ fontSize:9, fontWeight:700, color:"#FFCA29", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>📖 Customer Stories</div>
                                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                                  {uc.customerStories.map((s,i) => (
                                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"8px 12px", background:"rgba(255,202,41,0.06)", border:"1px solid rgba(255,202,41,0.2)", borderRadius:7, textDecoration:"none", transition:"border-color 0.15s" }}
                                      onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,202,41,0.5)"}
                                      onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,202,41,0.2)"}>
                                      <div>
                                        <div style={{ fontSize:12, fontWeight:700, color:"#FFCA29", marginBottom:2 }}>{s.company}</div>
                                        <div style={{ fontSize:11, color:E.textSub, lineHeight:1.4 }}>{s.headline}</div>
                                      </div>
                                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                                        <span style={{ fontSize:9, fontWeight:600, color:E.textMut, background:E.navySurf, padding:"2px 7px", borderRadius:4, whiteSpace:"nowrap" }}>{s.industry}</span>
                                        <span style={{ fontSize:10, color:"rgba(255,202,41,0.6)" }}>Read story →</span>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Customer stories */}
                            {(() => {
                              const stories = CUSTOMER_STORIES.filter(s => s.useCases.includes(uc.id));
                              if (!stories.length) return null;
                              return (
                                <div>
                                  <div style={{ fontSize:9, fontWeight:700, color:"#FFCA29", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>⭐ Customer Stories</div>
                                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                                    {stories.map(s => (
                                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                                        style={{ display:"block", textDecoration:"none", background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:8, padding:"10px 12px", transition:"border-color 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,202,41,0.4)"}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = E.borderSub}>
                                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:4 }}>
                                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                            <span style={{ fontSize:11, fontWeight:700, color:"#FFCA29" }}>{s.company}</span>
                                            <span style={{ fontSize:9, color:E.textMut, background:"rgba(255,255,255,0.06)", borderRadius:4, padding:"1px 6px" }}>{s.industry}</span>
                                          </div>
                                          <span style={{ fontSize:10, color:E.textMut }}>↗</span>
                                        </div>
                                        <div style={{ fontSize:11, color:E.textSub, lineHeight:1.5 }}>{s.summary}</div>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* CTA — compare the top plan */}
                            <div style={{ display:"flex", gap:8, paddingTop:4 }}>
                              <button
                                onClick={() => { setToPlan(uc.plans[uc.plans.length - 1]); setMode("compare"); }}
                                style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${E.blue},${E.blue2})`, color:"white", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", boxShadow:`0 3px 12px rgba(3,123,189,0.35)` }}>
                                Compare {PLAN_LABELS[uc.plans[uc.plans.length - 1]]} →
                              </button>
                              <button
                                onClick={() => { setMode("builder"); setBuilderStep(0); setBuilderAnswers({}); setBuilderResult(null); setBuilderGen3(false); }}
                                style={{ padding:"10px 16px", borderRadius:8, border:`1px solid ${E.border}`, background:E.navySurf, color:E.textMut, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                                Plan Builder
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div style={{ textAlign:"center", padding:"60px 20px", color:E.textMut }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>No use cases match</div>
                    <div style={{ fontSize:12 }}>Try a different search term or clear the plan filter.</div>
                  </div>
                )}
              </div>
            );
          })()}

        </main>
      </div>
    </>
  );
}