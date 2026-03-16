import React, { useState, useMemo } from "react";

// ─── TYPES: true = included, "optional" = paid add-on, "addon-included" = add-on bundled in plan, false/undefined = not available

const FEATURE_SECTIONS = [
  {
    id: "core",
    label: "Core Platform",
    color: "#037BBD",
    features: [
      { id: "encryption",       label: "Encryption at Rest and in Transit",            helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/218025867-Enterprise-Key-Management" },
      { id: "storage_per_user", label: "Storage Per Power User" },
      { id: "upload_limit",     label: "Upload File Size Limit" },
      { id: "domains",          label: "Account Domains" },
      { id: "max_users",        label: "Maximum Number of Users" },
      { id: "sso",              label: "User Authentication (AD and SSO/SAML)",         helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638364-Active-Directory-LDAP-Integration" },
      { id: "mfa",              label: "Multi-Factor Authentication",                   helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638344-Two-Factor-Authentication" },
      { id: "external_collab",  label: "External Collaborators",                        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637744-Inviting-External-Users" },
      { id: "granular_perms",   label: "Granular Permissions",                          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637824-Setting-Folder-Permissions" },
      { id: "compliant_storage",label: "Compliant Storage (HIPAA, FINRA, SOC2, ISO 27001)", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638124-Compliance-Overview" },
      { id: "audit",            label: "File & Login Auditing",                         helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637534-File-Audit-Report" },
      { id: "edge_caching",     label: "Edge Caching / Hybrid Caching",                 helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000286631-Smart-Cache-Overview" },
      { id: "role_admin",       label: "Role-Based Administration",                     helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638124-Compliance-Overview" },
      { id: "device_controls",  label: "Device Controls for Mobile & Desktop",          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638354-Mobile-Device-Management" },
      { id: "data_residency",   label: "Data Residency Options",                        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/17391112602637-Customize-Your-Cloud-Storage-on-Egnyte" },
      { id: "encryption_keys",  label: "Encryption Key Management",                     helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/218025867-Enterprise-Key-Management" },
      { id: "link_throttling",  label: "Link Throttling Removal" },
      { id: "migration_tools",  label: "Migration Tools",                               helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360001819831-Egnyte-Migration-App-Overview" },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence & Search",
    color: "#0BC5BA",
    features: [
      { id: "single_doc_qa",         label: "Single Document / Image Summary & Q&A",              helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/16949145831949-AI-Driven-Document-Summarization-Document-Q-A" },
      { id: "copilot",               label: "AI Copilot (Multi-Doc Q&A, Knowledge Bases, Content Generation)", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/28274380320397-Copilot-Overview" },
      { id: "ai_search",             label: "AI Search (Natural Language + AI-Generated Summary)", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/28274380320397-Copilot-Overview" },
      { id: "ai_workflows",          label: "AI Workflows (AI-Triggered & AI-Step Workflows)",    helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18313846897549-Workflow-Templates-Overview" },
      { id: "text_search",           label: "Full-Text Search",                                    helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637624-Searching-in-Egnyte" },
      { id: "ocr_search",            label: "OCR (Optical Character Recognition)",                 helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31323136131597-AI-Driven-Metadata-Tags-Trainable-Classifiers" },
      { id: "ai_classification",     label: "Document Type Classification",                        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31323136131597-AI-Driven-Metadata-Tags-Trainable-Classifiers" },
      { id: "trainable_classifiers", label: "Trainable Classifiers",                               helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31323136131597-AI-Driven-Metadata-Tags-Trainable-Classifiers" },
    ],
  },
  {
    id: "collaboration",
    label: "Collaboration",
    color: "#6E49FF",
    features: [
      { id: "comments_tasks",   label: "Comments and Tasks",                            helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637764-Comments-and-Notes" },
      { id: "file_locking",     label: "Global File Locking",                           helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637884-File-Locking" },
      { id: "metadata",         label: "Metadata",                                      helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638074-Custom-Metadata" },
      { id: "desktop_apps",     label: "Desktop Apps (Mac and PC)",                     helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638044-Desktop-App-Overview" },
      { id: "mobile_apps",      label: "Mobile Apps (iOS and Android)",                 helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638054-Mobile-App-Overview" },
      { id: "external_accounts",label: "External User Accounts",                        helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637744-Inviting-External-Users" },
      { id: "link_sharing",     label: "Link Sharing / Password-Protected Links",       helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637714-Sharing-Files-and-Folders" },
      { id: "viewer_permission",label: '"Read-Only" Viewer Permission',                 helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/9302129964429-Viewer-Only-Permission" },
      { id: "email_sharing",    label: "Email-Validated Sharing" },
      { id: "pdf_handler",      label: "PDF Markup (Edit, Annotate, Compare, Redact)",  helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/28618583088013-PDF-File-Handler-Add-On" },
      { id: "esignature",       label: "e-Signature",                                   helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/24075263159821-Egnyte-Sign-Overview-and-Administration" },
      { id: "watermarking",     label: "Dynamic Watermarking",                          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360056705352-Watermarking" },
      { id: "content_safeguards",label: "Content Safeguards",                          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360056705352-Watermarking" },
      { id: "standard_workflows",label: "Standard Workflows",                          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18313846897549-Workflow-Templates-Overview" },
      { id: "advanced_workflows",label: "Advanced (Multi-Step) Workflows",             helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/18313846897549-Workflow-Templates-Overview" },
      { id: "advanced_video",   label: "Advanced Video Playback" },
      { id: "file_versioning",  label: "File Versioning",                               helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201637904-File-Versioning" },
      { id: "advanced_snapshot",label: "Snapshot & Recovery (30-day)",                  helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/4417226750605-Ransomware-Recovery-Using-Egnyte-Secure-Govern" },
      { id: "snapshot_90",      label: "Advanced Snapshot & Recovery (90-day)",         helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/4417226750605-Ransomware-Recovery-Using-Egnyte-Secure-Govern" },
    ],
  },
  {
    id: "governance",
    label: "Governance & Security",
    color: "#3D71EA",
    features: [
      { id: "lifecycle_reports",    label: "Content Lifecycle Analytics & Reports",              helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360034403532-Content-Lifecycle-Policies" },
      { id: "lifecycle_policies",   label: "Content Lifecycle (Retain, Archive, Delete) Policies", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360034403532-Content-Lifecycle-Policies" },
      { id: "unified_perms",        label: "Unified Permissions Viewer",                         helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360027511552-Issue-Types-and-Remediation" },
      { id: "suspicious_login",     label: "Suspicious Login Issue Detection",                   helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/7299778344077-Customizing-Suspicious-Login-Detections" },
      { id: "sharing_issues",       label: "Public Link / Open Access / Permission Issue Detection", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360027511552-Issue-Types-and-Remediation" },
      { id: "unusual_access",       label: "Unusual Access Detection",                           helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000723192-Analysis-Rules-Overview" },
      { id: "inactive_user",        label: "Inactive User Detection",                            helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000723192-Analysis-Rules-Overview" },
      { id: "malformed_perms",      label: "Malformed Permissions Detection",                    helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000723192-Analysis-Rules-Overview" },
      { id: "ransomware_artifact",  label: "Probable Ransomware Detection (Artifact-Based)",    helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360059480351-Ransomware-FAQs" },
      { id: "ransomware_behavioral",label: "Probable Ransomware Detection (Behavioral-Based)",  helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360057085752-Analysis-Rules-FAQs" },
      { id: "sensitive_data",       label: "Sensitive Data Discovery & Classification",          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000099332-Egnyte-Secure-Govern-Overview" },
      { id: "doc_labeling",         label: "Document Labeling",                                  helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/32356780428045-Microsoft-Purview-and-Egnyte-Integration" },
      { id: "compliance_monitoring",label: "Privacy & Compliance Monitoring",                    helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000099332-Egnyte-Secure-Govern-Overview" },
      { id: "sensitive_mgmt",       label: "Sensitive Data Management & Reviews",                helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/115000099332-Egnyte-Secure-Govern-Overview" },
      { id: "api_remediation",      label: "Manual & API-Based Remediation",                     helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/13601376018829-Issue-Remediation-Best-Practices" },
      { id: "auto_remediation",     label: "Auto Issue Remediation & Delegation",                 helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/23281081807245-Overview-Secure-Govern-Issue-Auto-Remediation" },
      { id: "legal_hold",           label: "Legal Hold",                                          helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360034403532-Content-Lifecycle-Policies" },
      { id: "rot_data",             label: "Redundant, Obsolete, and Trivial (ROT) Data Management", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360027511552-Issue-Types-and-Remediation" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations & API",
    color: "#00539A",
    features: [
      { id: "google_workspace", label: "Google Workspace Integration & Co-Editing",    helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638164-Google-Apps-Integration" },
      { id: "m365",             label: "M365 / MS Copilot & Co-Editing (Online & Desktop)", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638174-Microsoft-Office-Integration" },
      { id: "dlp",              label: "DLP / Preventative Control Integrations",      helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/32356780428045-Microsoft-Purview-and-Egnyte-Integration" },
      { id: "app_integrations", label: "150+ Industry Application Integrations",       helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/201638984-Third-Party-Apps-That-Can-Be-Used-With-Egnyte" },
    ],
  },
  {
    id: "addons",
    label: "Optional Add-Ons",
    color: "#FFCA29",
    isAddons: true,
    features: [
      { id: "project_hub", label: "Project Hub (AEC Dashboard, Templates, Lifecycle)", helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/360001819831-Egnyte-Migration-App-Overview" },
      { id: "doc_portal",  label: "Document Portal",                                   helpUrl: "https://helpdesk.egnyte.com/hc/en-us/articles/31085359026701-Document-Portal-Overview-and-using-Document-Portal" },
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
      sso: "optional",       // $ on pricing page — paid upgrade
      mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: false, edge_caching: true, role_admin: false, device_controls: false,
      data_residency: false, encryption_keys: false, link_throttling: false, migration_tools: false,
      // Intelligence — only single doc Q&A included; AI Copilot/Search/Workflows are $ (paid upgrades)
      single_doc_qa: true, copilot: "optional", ai_search: "optional", ai_workflows: "optional",
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: false,
      email_sharing: false, pdf_handler: "optional", esignature: "optional",
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
      // Add-ons
      project_hub: "optional", doc_portal: "optional",
    },
  },
  {
    id: "ifs",
    name: "IFS",
    family: "Gen 4 MSP",
    gen: "Gen 4",
    summary: "Everything in Starter, plus email-validated sharing, advanced workflows, ransomware detection, and content lifecycle.",
    pricing: { msrp: 33, msp: 26.4 },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB",
      domains: "1 Primary / 5 Secondary",
      max_users: "Unlimited",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, encryption_keys: false, link_throttling: true, migration_tools: true,
      // Intelligence — AI Copilot/Search/Workflows are $ (paid upgrade); single doc Q&A included
      single_doc_qa: true, copilot: "optional", ai_search: "optional", ai_workflows: "optional",
      text_search: true, ocr_search: false, ai_classification: false, trainable_classifiers: false,
      // Collaboration
      comments_tasks: true, file_locking: true, metadata: true, desktop_apps: true,
      mobile_apps: true, external_accounts: true, link_sharing: true, viewer_permission: true,
      email_sharing: true, pdf_handler: "optional", esignature: "optional",
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
    },
  },
  {
    id: "elite",
    name: "Elite",
    family: "Gen 4 MSP",
    gen: "Gen 4",
    summary: "Everything in IFS, plus AI Copilot/Search/Workflows, PDF markup, e-signature, watermarking, and auto-remediation.",
    pricing: { msrp: 46, msp: 36.8 },
    features: {
      // Core Platform
      encryption: true, storage_per_user: "200 GB", upload_limit: "150 GB",
      domains: "1 Primary / 5 Secondary",
      max_users: "Unlimited",
      sso: true, mfa: true, external_collab: true, granular_perms: true, compliant_storage: true,
      audit: true, edge_caching: true, role_admin: true, device_controls: true,
      data_residency: true, encryption_keys: false, link_throttling: true, migration_tools: true,
      // Intelligence — AI Copilot, AI Search, AI Workflows included in Elite; OCR, Doc Type Classification, Trainable Classifiers = Ultimate only
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
    },
  },
];

const PLAN_ORDER = PLANS.map((p) => p.id);
const fmt = (v) => (typeof v === "number" ? `$${v % 1 === 0 ? v : v.toFixed(2)}` : "—");

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

// ─── HELPDESK LINK ────────────────────────────────────────────────────────────
const HelpLink = ({ url, small }) => !url ? null : (
  <a href={url} target="_blank" rel="noreferrer" title="Open helpdesk article"
    style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
      width: small ? 16 : 18, height: small ? 16 : 18,
      borderRadius:4, background:E.navySurf, border:`1px solid ${E.border}`,
      color:E.textMut, textDecoration:"none", fontSize: small ? 9 : 10,
      fontWeight:700, flexShrink:0, transition:"all 0.15s" }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=E.teal; e.currentTarget.style.color=E.teal; e.currentTarget.style.background="rgba(11,197,186,0.1)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor=E.border; e.currentTarget.style.color=E.textMut; e.currentTarget.style.background=E.navySurf; }}>?</a>
);

// ─── FEATURE ROW (compare mode) ───────────────────────────────────────────────
const FeatureRow = ({ feat, value, compareValue }) => {
  const isGain = (value === true || value === "addon-included") && !compareValue;
  return (
    <div className="feat-row" style={{
      display:"grid", gridTemplateColumns:"1fr 26px 120px 120px",
      padding:"10px 16px", alignItems:"center",
      borderBottom:`1px solid ${E.borderSub}`,
      background: isGain ? "rgba(11,197,186,0.05)" : "transparent",
      transition:"background 0.15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {isGain && <div style={{ width:3, height:3, borderRadius:"50%", background:E.teal, flexShrink:0 }}/>}
        <span style={{ fontSize:13, color: isGain ? E.text : E.textSub, fontWeight: isGain ? 500 : 400, lineHeight:1.4 }}>{feat.label}</span>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}><HelpLink url={feat.helpUrl} /></div>
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
    <div style={{ background:E.navyCard, border:`1px solid ${isCurrent ? "rgba(118,162,188,0.2)" : E.border}`, borderRadius:14, padding:18 }}>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color: isCurrent ? E.textMut : E.teal, marginBottom:12 }}>{label}</div>
      <div style={{ position:"relative", marginBottom:14 }}>
        <select value={selected} onChange={e=>onChange(e.target.value)}
          style={{ width:"100%", appearance:"none", background:E.navySurf, border:`1px solid ${isCurrent ? "rgba(118,162,188,0.15)" : E.border}`, borderRadius:8, padding:"11px 36px 11px 14px", color:E.text, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", outline:"none" }}>
          {Object.entries(families).map(([fam,ps])=>(
            <optgroup key={fam} label={fam}>
              {ps.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
          ))}
        </select>
        <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:accent, pointerEvents:"none", fontSize:11 }}>▾</span>
      </div>
      <p style={{ fontSize:12, color:E.textSub, lineHeight:1.7, marginBottom:14 }}>{plan?.summary}</p>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function EgnytePlanMatrix() {
  const [fromPlan, setFromPlan] = useState("legacy_business");
  const [toPlan,   setToPlan]   = useState("ifs");
  const [mode, setMode] = useState("compare");
  const [expanded, setExpanded] = useState(
    Object.fromEntries(FEATURE_SECTIONS.map(s=>[s.id,true]))
  );

  const fromIdx = PLAN_ORDER.indexOf(fromPlan);
  const toIdx   = PLAN_ORDER.indexOf(toPlan);
  const isUp    = toIdx > fromIdx;

  const fp = PLANS.find(p=>p.id===fromPlan);
  const tp = PLANS.find(p=>p.id===toPlan);

  const dMsrp = fp?.pricing?.msrp!=null && tp?.pricing?.msrp!=null ? tp.pricing.msrp - fp.pricing.msrp : null;
  const dMsp  = fp?.pricing?.msp !=null && tp?.pricing?.msp !=null ? tp.pricing.msp  - fp.pricing.msp  : null;

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

  // ── AI Value Generation ──
  const [valuePoints, setValuePoints] = useState(null);
  const [emailDetailed, setEmailDetailed] = useState(null);
  const [emailPunchy, setEmailPunchy] = useState(null);
  const [valueLoading, setValueLoading] = useState(false);
  const [valueError, setValueError] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(null); // "detailed" | "punchy" | null
  const valueCache = React.useRef({});

  // Reset when plans change
  React.useEffect(() => {
    setValuePoints(null);
    setEmailDetailed(null);
    setEmailPunchy(null);
    setValueError(null);
    setCopiedEmail(null);
  }, [fromPlan, toPlan]);

  const copyEmail = (type, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEmail(type);
      setTimeout(() => setCopiedEmail(null), 2500);
    });
  };

  const generateValue = () => {
    if (!isUp || !fp || !tp) return;
    const valueKey = `${fromPlan}→${toPlan}`;
    if (valueCache.current[valueKey]) {
      const c = valueCache.current[valueKey];
      setValuePoints(c.points);
      setEmailDetailed(c.emailDetailed);
      setEmailPunchy(c.emailPunchy);
      return;
    }

    const gained = FEATURE_SECTIONS.flatMap(s => s.features).filter(f => {
      const fv = fp.features[f.id]; const tv = tp.features[f.id];
      return (tv === true || tv === "addon-included") && !fv;
    }).map(f => f.label);

    const costLine = dMsp != null
      ? `The MSP cost uplift is +$${dMsp.toFixed(2)}/user/month (MSRP +$${dMsrp}/user/month).`
      : `Pricing is available through the Egnyte partner team.`;

    setValueLoading(true);
    setValuePoints(null);
    setEmailDetailed(null);
    setEmailPunchy(null);
    setValueError(null);

    fetch("/api/value", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `You are a sales enablement writer for Egnyte, a content security and collaboration platform. A partner account manager is preparing an upgrade conversation with a customer moving from "${fp.name}" to "${tp.name}".

Net-new capabilities the customer will gain:
${gained.map(f => `- ${f}`).join("\n")}

${costLine}

Return ONLY a valid JSON object with exactly these three keys. No preamble, no markdown fences, no extra text whatsoever:
{
  "points": ["value point 1", "value point 2", "value point 3"],
  "emailDetailed": "full detailed email text",
  "emailPunchy": "short punchy email text"
}

Rules that apply to ALL outputs:
- Never use "--" or "---" anywhere
- Never use placeholder brackets like [Name] or [Company]
- Write ready-to-send language using warm, generic openers like "Hi there" or "Hope you are doing well"
- Do not reference AI, automation, or scripting in any way
- Use plain text only, no HTML, no bullet symbols, no markdown

For "points": 3 outcome-focused value statements (1-2 sentences each). Weave in the specific capabilities gained. Focus on what the business can now do or prevent, not feature names.

For "emailDetailed": A professional but conversational upgrade outreach email. Structure: warm opener, 2-3 sentences grounded in the value points above explaining what they gain and why it matters for their business, a soft close inviting a conversation. 4-6 sentences total. No fluff. The value reasoning should be clear and direct.

For "emailPunchy": A short, sharp email. 3 sentences max. Lead with the most compelling outcome from the upgrade. One clear reason why now. One low-pressure ask. Everyday language, no jargon. Should feel like something a real person dashed off quickly.`
        }]
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
        setEmailDetailed(parsed.emailDetailed);
        setEmailPunchy(parsed.emailPunchy);
      } catch(e) { setValueError("Could not parse response. Try again."); }
    })
    .catch(() => setValueError("Request failed. Check your API key in Vercel environment variables."))
    .finally(() => setValueLoading(false));
  };

  const LEGEND = [
    { node:<div style={{width:18,height:18,borderRadius:"50%",background:E.teal,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={E.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>, label:"Included" },
    { node:<span style={{padding:"2px 8px",borderRadius:4,background:"rgba(255,202,41,0.12)",border:`1px solid ${E.yellow}55`,color:E.yellow,fontSize:9,fontWeight:700,letterSpacing:"0.06em"}}>ADD-ON</span>, label:"Paid add-on" },
    { node:<span style={{padding:"2px 8px",borderRadius:4,background:"rgba(11,197,186,0.12)",border:`1px solid ${E.teal}55`,color:E.teal,fontSize:9,fontWeight:700,letterSpacing:"0.06em"}}>BUNDLED</span>, label:"Add-on included in plan" },
    { node:<HelpLink url="https://helpdesk.egnyte.com" small />, label:"Helpdesk article" },
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
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#0C2340;}
        ::-webkit-scrollbar-thumb{background:rgba(11,197,186,0.25);border-radius:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        .fade-up{animation:fadeUp 0.4s ease both;}
        .mode-btn{border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
      `}</style>

      <div style={{ minHeight:"100vh", background:`linear-gradient(150deg,#0C2340 0%,#121F37 100%)`, color:E.text }}>

        {/* NAV */}
        <header style={{ position:"relative", overflow:"hidden", background:E.navyMid, borderBottom:`1px solid ${E.border}` }}>
          <HexBg/>
          <div style={{ position:"relative", zIndex:1, maxWidth:1680, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:0 }}>
                <span style={{ fontSize:20, fontWeight:800, color:E.text,   letterSpacing:"-0.04em" }}>EGN</span>
                <span style={{ fontSize:20, fontWeight:800, color:E.teal,   letterSpacing:"-0.04em" }}>Y</span>
                <span style={{ fontSize:20, fontWeight:800, color:E.text,   letterSpacing:"-0.04em" }}>TE</span>
              </div>
              <div style={{ width:1, height:18, background:E.border }}/>
              <span style={{ fontSize:11, fontWeight:600, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase" }}>MSP Partner Plan Tool</span>
            </div>
            {/* Tabs */}
            <div style={{ display:"flex", gap:2, background:E.navySurf, borderRadius:9, padding:3, border:`1px solid ${E.border}` }}>
              {[{id:"compare",label:"Upgrade Compare"},{id:"matrix",label:"Full Matrix"}].map(tab=>(
                <button key={tab.id} className="mode-btn" onClick={()=>setMode(tab.id)} style={{
                  padding:"7px 20px", borderRadius:7, fontSize:12, fontWeight:600, letterSpacing:"0.01em",
                  background: mode===tab.id ? `linear-gradient(135deg,${E.teal},#0099A8)` : "transparent",
                  color: mode===tab.id ? E.navy : E.textMut,
                  boxShadow: mode===tab.id ? `0 2px 14px rgba(11,197,186,0.3)` : "none",
                }}>{tab.label}</button>
              ))}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: mode==="matrix" ? 1680 : 980, margin:"0 auto", padding:"32px 32px 72px" }}>

          {/* ── COMPARE ── */}
          {mode==="compare" && (
            <div className="fade-up">
              {/* Title */}
              <div style={{ marginBottom:28 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(11,197,186,0.1)", border:`1px solid rgba(11,197,186,0.25)`, borderRadius:999, padding:"4px 14px", marginBottom:14 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:E.teal }}/>
                  <span style={{ fontSize:11, fontWeight:600, color:E.teal, letterSpacing:"0.1em", textTransform:"uppercase" }}>Partner Upgrade Tool</span>
                </div>
                <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:"-0.03em", color:E.text, lineHeight:1.1, marginBottom:10 }}>
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
                {/* Stat cards */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  <div style={{ background:"rgba(110,73,255,0.08)", border:`1px solid rgba(110,73,255,0.2)`, borderRadius:12, padding:"22px 24px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"rgba(110,73,255,0.8)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Net-New Features</div>
                    <div style={{ fontSize:38, fontWeight:800, color:E.purple, letterSpacing:"-0.04em", lineHeight:1, marginBottom:8 }}>{netNew}</div>
                    <div style={{ fontSize:12, color:E.textMut, fontWeight:500 }}>capabilities unlocked by upgrading to {tp?.name}</div>
                  </div>
                  <div style={{ background: dMsp!=null ? "rgba(11,197,186,0.08)" : dMsrp!=null ? "rgba(3,123,189,0.08)" : "rgba(118,162,188,0.06)", border:`1px solid ${dMsp!=null ? "rgba(11,197,186,0.2)" : dMsrp!=null ? "rgba(3,123,189,0.2)" : "rgba(118,162,188,0.1)"}`, borderRadius:12, padding:"22px 24px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color: dMsp!=null ? "rgba(11,197,186,0.8)" : dMsrp!=null ? "rgba(3,123,189,0.8)" : "rgba(118,162,188,0.6)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>Cost Uplift</div>
                    {dMsp!=null ? (
                      <div style={{ display:"flex", alignItems:"flex-end", gap:20 }}>
                        <div>
                          <div style={{ fontSize:10, fontWeight:600, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>MSP</div>
                          <div style={{ fontSize:38, fontWeight:800, color:E.teal, letterSpacing:"-0.04em", lineHeight:1 }}>{`+${fmt(dMsp)}`}</div>
                        </div>
                        <div style={{ width:1, height:38, background:"rgba(11,197,186,0.15)", flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:10, fontWeight:600, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>MSRP</div>
                          <div style={{ fontSize:38, fontWeight:800, color:`${E.teal}88`, letterSpacing:"-0.04em", lineHeight:1 }}>{`+${fmt(dMsrp)}`}</div>
                        </div>
                      </div>
                    ) : dMsrp!=null ? (
                      <div>
                        <div style={{ fontSize:10, fontWeight:600, color:E.textMut, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>MSRP</div>
                        <div style={{ fontSize:38, fontWeight:800, color:E.blue, letterSpacing:"-0.04em", lineHeight:1 }}>{`+${fmt(dMsrp)}`}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize:38, fontWeight:800, color:E.textSub, letterSpacing:"-0.04em", lineHeight:1 }}>—</div>
                    )}
                    <div style={{ fontSize:12, color:E.textMut, fontWeight:500, marginTop:8 }}>
                      {dMsp!=null ? "per user / month" : dMsrp!=null ? "MSRP per user / month · MSP: contact Egnyte" : "contact Egnyte for pricing"}
                    </div>
                  </div>
                </div>

                {/* Value section */}
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
                        : <>{valuePoints ? "↻ Regenerate" : "✦ Generate Value Summary"}</>}
                    </button>
                  </div>

                  {/* Value points */}
                  {valuePoints && (
                    <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom: emailDetailed ? 4 : 0 }}>
                      {valuePoints.map((pt, i) => (
                        <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                          <div style={{ width:22, height:22, borderRadius:6, background:"rgba(11,197,186,0.12)", border:`1px solid rgba(11,197,186,0.25)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                            <span style={{ fontSize:11, fontWeight:700, color:E.teal }}>{i+1}</span>
                          </div>
                          <p style={{ fontSize:13, color:E.textSub, lineHeight:1.7, margin:0 }}>{pt}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Email drafts */}
                  {(emailDetailed || emailPunchy) && (
                    <div style={{ borderTop:`1px solid ${E.border}`, paddingTop:20, marginTop: valuePoints ? 20 : 0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                        <div style={{ width:2.5, height:14, borderRadius:2, background:E.blue2 }}/>
                        <span style={{ fontSize:10, fontWeight:700, color:E.blue2, textTransform:"uppercase", letterSpacing:"0.12em" }}>Upgrade Outreach Emails</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                        {/* Detailed email */}
                        {emailDetailed && (
                          <div style={{ background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:10, padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                              <span style={{ fontSize:10, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.1em" }}>Detailed</span>
                              <button onClick={() => copyEmail("detailed", emailDetailed)}
                                style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:6, border:`1px solid ${copiedEmail==="detailed" ? E.teal+"88" : E.blue2+"55"}`, background: copiedEmail==="detailed" ? "rgba(11,197,186,0.12)" : "rgba(61,113,234,0.1)", color: copiedEmail==="detailed" ? E.teal : E.blue2, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}>
                                {copiedEmail==="detailed" ? "✓ Copied!" : "⎘ Copy"}
                              </button>
                            </div>
                            <pre style={{ fontSize:12, color:E.textSub, lineHeight:1.85, margin:0, fontFamily:"'Inter',sans-serif", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{emailDetailed}</pre>
                          </div>
                        )}
                        {/* Punchy email */}
                        {emailPunchy && (
                          <div style={{ background:E.navySurf, border:`1px solid ${E.borderSub}`, borderRadius:10, padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                              <span style={{ fontSize:10, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.1em" }}>Short & Direct</span>
                              <button onClick={() => copyEmail("punchy", emailPunchy)}
                                style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:6, border:`1px solid ${copiedEmail==="punchy" ? E.teal+"88" : E.blue2+"55"}`, background: copiedEmail==="punchy" ? "rgba(11,197,186,0.12)" : "rgba(61,113,234,0.1)", color: copiedEmail==="punchy" ? E.teal : E.blue2, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}>
                                {copiedEmail==="punchy" ? "✓ Copied!" : "⎘ Copy"}
                              </button>
                            </div>
                            <pre style={{ fontSize:12, color:E.textSub, lineHeight:1.85, margin:0, fontFamily:"'Inter',sans-serif", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{emailPunchy}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {valueError && (
                    <p style={{ fontSize:12, color:E.yellow, marginTop:8 }}>⚠ {valueError}</p>
                  )}
                </div>

                {/* Legend */}
                <div style={{ display:"flex", gap:20, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, fontWeight:700, color:E.textMut, textTransform:"uppercase", letterSpacing:"0.1em" }}>Legend</span>
                  {LEGEND.map((l,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                      {l.node}
                      <span style={{ fontSize:12, color:E.textSub }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Feature table */}
                <div style={{ background:E.navyCard, border:`1px solid ${E.border}`, borderRadius:14, overflow:"hidden" }}>
                  {/* Header row */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 26px 120px 120px", padding:"11px 16px", background:E.navyMid, borderBottom:`1px solid ${E.border}` }}>
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
                        {isExp && section.features.map(feat=>(
                          <FeatureRow key={feat.id} feat={feat} value={tp.features[feat.id]} compareValue={fp.features[feat.id]}/>
                        ))}
                      </div>
                    );
                  })}
                </div>

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

              <div style={{ overflowX:"auto", borderRadius:14, border:`1px solid ${E.border}` }}>
                <table style={{ borderCollapse:"collapse", width:"100%", minWidth:1260 }}>
                  <thead>
                    <tr style={{ background:E.navyMid }}>
                      <th style={{ padding:"12px 16px", textAlign:"left", minWidth:290, position:"sticky", left:0, background:E.navyMid, zIndex:10, borderBottom:`1px solid ${E.border}`, borderRight:`1px solid ${E.border}` }}>
                        <span style={{ fontSize:10, fontWeight:700, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase" }}>Feature</span>
                      </th>
                      {Object.entries(families).map(([fam,ps])=>(
                        <th key={fam} colSpan={ps.length} style={{ padding:"10px 12px", textAlign:"center", borderBottom:`1px solid ${E.border}`, borderLeft:`1px solid ${E.border}` }}>
                          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
                            color: fam==="Legacy" ? E.textSub : fam.includes("Gen 3") ? E.blue : E.teal }}>
                            {fam}
                          </span>
                        </th>
                      ))}
                    </tr>
                    <tr style={{ background:E.navyCard }}>
                      <th style={{ padding:"10px 16px", position:"sticky", left:0, background:E.navyCard, zIndex:10, borderBottom:`2px solid ${E.border}`, borderRight:`1px solid ${E.border}` }}>
                        <span style={{ fontSize:9, color:E.textMut, letterSpacing:"0.1em", textTransform:"uppercase" }}>Docs</span>
                      </th>
                      {PLANS.map(p=>(
                        <th key={p.id} style={{ padding:"10px 8px", textAlign:"center", borderBottom:`2px solid ${E.border}`, borderLeft:`1px solid ${E.borderSub}`, minWidth:96 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:E.text, marginBottom:3 }}>{p.name}</div>
                          {p.pricing?.msrp!=null && <div style={{ fontSize:10, color:E.textMut }}>${p.pricing.msrp}/mo</div>}
                        </th>
                      ))}
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
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                {feat.label}
                                <HelpLink url={feat.helpUrl} small/>
                              </div>
                            </td>
                            {PLANS.map(p=>(
                              <td key={p.id} style={{ padding:"9px 8px", borderLeft:`1px solid ${E.borderSub}`, textAlign:"center" }}>
                                <StatusCell value={p.features[feat.id]}/>
                              </td>
                            ))}
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
        </main>
      </div>
    </>
  );
}