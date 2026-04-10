import { useState, useRef, useEffect } from "react";
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";
const submitToFormspree = async (payload) => {
  if (!FORMSPREE_ENDPOINT) {
    return { ok: false, missingConfig: true };
  }
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    return { ok: response.ok, missingConfig: false };
  } catch {
    return { ok: false, missingConfig: false, networkError: true };
  }
};
const PRACTICES = [
  { title: "Agentic AI Engineering", desc: "Multi-agent orchestration with governance built in." },
  { title: "Context Engineering & RAG", desc: "Knowledge graphs, vector pipelines, and grounding." },
  { title: "AI Evaluation & Quality", desc: "Eval frameworks and measurable AI performance." },
  { title: "Cloud-Native Architecture", desc: "Multi-cloud across AWS, Azure, and GCP." },
  { title: "Integration & Ecosystems", desc: "Legacy bridging and event-driven architectures." },
  { title: "Delivery Leadership", desc: "Embedded sprint leadership for AI programmes." }
];
const MSTEPS = [
  { n: "01", title: "Discover", desc: "Workshops, workflow mapping, data landscape." },
  { n: "02", title: "Architect", desc: "Blueprints, governance frameworks, integration." },
  { n: "03", title: "Deliver", desc: "Embedded engineering in sprints, not handoffs." },
  { n: "04", title: "Govern", desc: "Eval, monitoring, drift detection, improvement." }
];
const USE_CASES = [
  { title: "Autonomous Claims Processing", desc: "End-to-end claims adjudication with fraud detection.", tags: ["Insurance", "Healthcare"] },
  { title: "Agentic Code Migration", desc: "AI-assisted legacy codebase migration.", tags: ["Cross-Industry"] },
  { title: "Intelligent Ticket Triage", desc: "Classify, prioritise, route, and resolve autonomously.", tags: ["Enterprise IT"] },
  { title: "KYC & Compliance Automation", desc: "Document verification, sanctions, risk scoring.", tags: ["Banking", "FinTech"] },
  { title: "Clinical Workflow Automation", desc: "Patient pathways with HL7/FHIR compliance.", tags: ["Healthcare", "MedTech"] },
  { title: "Regulated Conversational AI", desc: "Compliant virtual agents with guardrails.", tags: ["Finance", "Insurance"] }
];
const INDUSTRIES_DATA = [
  { title: "Healthcare & MedTech", desc: "HL7/FHIR-aware, clinician-in-the-loop." },
  { title: "Financial Services", desc: "KYC, fraud detection, PCI-DSS aligned." },
  { title: "Insurance & RegTech", desc: "Claims, underwriting, regulatory scrutiny." }
];
const PRODUCTS = [
  { title: "Agent Blueprint", tag: "Design", icon: "\u{1F4D0}", desc: "Production-ready agent design for your workflow. Includes workflow analysis, agent spec, eval framework, orchestration, governance model, and implementation roadmap.", deliverables: ["20-page architecture document", "Workflow map with pain points", "Agent spec with tools & integrations", "Eval framework & test scenarios", "Governance checkpoint design", "Implementation roadmap"], cta: "Get a Blueprint" },
  { title: "Eval Pack", tag: "Validate", icon: "\u{1F9EA}", desc: "Packaged evaluation framework for your industry. Scenario libraries, test harnesses, governance checklists, and pass/fail criteria.", deliverables: ["Industry-specific scenario library", "Test harness & execution framework", "Governance compliance checklist", "Pass/fail/flag criteria matrix", "Production readiness scorecard", "Monitoring & alerting templates"], cta: "Get an Eval Pack" },
  { title: "Architecture Templates", tag: "Accelerate", icon: "\u{1F3D7}", desc: "Pre-built reference architectures for proven use cases. Cloud-specific service mappings, integration patterns, and governance layers.", deliverables: ["Reference architecture diagrams", "Cloud-specific mapping (AWS/Azure/GCP)", "Integration pattern library", "Governance decision framework", "Deployment guide & IaC templates", "2 hours advisory included"], cta: "Get a Template Pack" },
  { title: "AEO Audit Pack", tag: "Discover", icon: "\u{1F50D}", desc: "Find out how AI agents see your business. ChatGPT, Claude, Gemini, and Perplexity are replacing search for enterprise buyers. If AI agents can't find you, your next customer won't either.", deliverables: ["AI visibility score across 4 major LLM platforms", "Structured data and schema.org audit", "llms.txt and machine-readable content plan", "Content gap analysis for AI extraction", "Competitor AI discoverability benchmark", "Prioritised 30-day implementation plan"], cta: "Get an AEO Audit" }
];
const SERVICES_DISCOVER = [
  { title: "AI Maturity Diagnostic", desc: "Comprehensive assessment across 10 dimensions. Know exactly where you stand.", gets: ["Maturity score & gap analysis", "Prioritised 90-day roadmap", "Half-day leadership workshop", "Executive summary report"] },
  { title: "Agent Blueprint Workshop", desc: "Intensive discovery to map your workflow and design the agent architecture.", gets: ["Workflow decomposition", "Agent specification draft", "Risk & compliance mapping", "Pilot scope recommendation"] }
];
const SERVICES_DESIGN = [
  { title: "Governance Audit", desc: "Independent review of existing AI systems against compliance and governance best practices.", gets: ["Compliance gap analysis", "Risk assessment matrix", "Remediation plan", "Governance framework recommendations"] },
  { title: "AI Discoverability Audit (AEO)", desc: "Assess how AI agents (ChatGPT, Claude, Gemini, Perplexity) see, understand, and recommend your business. Most enterprises are invisible to AI-mediated search.", gets: ["LLM visibility score across major AI platforms", "Structured data and schema assessment", "Content gap analysis for AI agent extraction", "llms.txt and machine-readable content plan", "Competitor AI discoverability benchmarking", "Prioritised implementation roadmap"] }
];
const SERVICES_BUILD = [
  { title: "Agent Sprint", desc: "Fixed-scope build. One agent, blueprint to production, 4 to 6 weeks.", gets: ["Working agent deployed", "1 to 2 system integrations", "Eval suite running", "Governance checkpoints active", "Handover documentation"] },
  { title: "Integration Package", desc: "Wire your AI into Salesforce, SAP, EHR, ITSM, or any enterprise platform.", gets: ["Integration architecture", "API design & build", "Auth/SSO setup", "Testing & deployment runbook"] },
  { title: "Eval & Launch", desc: "Take your AI from development to production with confidence.", gets: ["Eval framework & test suite", "Governance implementation", "Monitoring & alerting", "Go/no-go assessment"] },
  { title: "Retained Architecture Advisory", desc: "Ongoing technical leadership. Scoped monthly outcomes delivered independently using AgenTek methods.", gets: ["Monthly architecture deliverables", "Technical decision documentation", "Governance & compliance guidance", "Vendor evaluation support", "Architecture review & sign-off"] },
  { title: "Technical Delivery Leadership", desc: "Lead your AI delivery through sprints and releases. Defined outcomes, independent methods.", gets: ["Sprint planning & oversight", "Technical risk management", "Cross-team coordination", "Release & go-live support", "Stakeholder reporting"] },
  { title: "Fractional Chief AI Architect", desc: "Strategic AI architecture advisory on a retained basis. Senior leadership without a full-time hire.", gets: ["AI strategy & roadmap", "Architecture standards", "Technology & vendor selection", "Team capability assessment", "Executive-level advisory"] },
  { title: "AI Programme Advisory", desc: "Cross-team governance and architecture oversight for complex AI programmes.", gets: ["Programme architecture governance", "Cross-workstream integration", "Compliance & regulatory alignment", "Delivery assurance & risk reviews", "Stakeholder alignment"] }
];
const CASE_STUDIES = [
  {
    industry: "Financial Services",
    tag: "Contact Centre AI",
    problem: "A regulated financial services firm processing millions of customer interactions annually was running a legacy contact centre with high average handling times and inconsistent compliance outcomes.",
    solution: "AgenTek designed and delivered a voice AI and agent-assist architecture on AWS, replacing manual call routing with intelligent triage. The system used real-time speech processing to surface case context, compliance prompts, and next-best-action recommendations to human agents during live calls.",
    stack: ["AWS Connect", "Lex", "Bedrock", "Kinesis", "S3", "LangChain RAG"],
    outcomes: ["40% reduction in average handling time", "Consistent compliance prompts across all interactions", "Full audit trail for regulatory review", "Strategic roadmap for RPA-to-AI migration"]
  },
  {
    industry: "Legal & Professional Services",
    tag: "AI-Powered Document Intelligence",
    problem: "A national law firm needed a secure way to query internal HR policies and precedent documents without exposing sensitive PII data to third-party AI services.",
    solution: "AgenTek delivered an Azure-based HR Copilot with PII-safe document ingestion, enterprise governance controls, and a retrieval-augmented generation layer. All processing stayed within the firm's Azure tenant with Purview-managed data lineage and classification.",
    stack: ["Azure AI Document Intelligence", "ADLS", "Databricks", "Purview", "RAG Pipeline"],
    outcomes: ["Zero PII exposure to external services", "HR query resolution time cut from days to minutes", "Complete data lineage and classification audit", "Governance framework reusable across other practice areas"]
  },
  {
    industry: "Enterprise Retail & Distribution",
    tag: "Data Platform Modernisation",
    problem: "A national distribution business with hundreds of branches was running analytics on fragmented legacy databases with no unified data strategy.",
    solution: "AgenTek designed a serverless data platform on AWS, consolidating disparate data sources into a medallion architecture with automated pipelines. The platform enabled self-serve analytics and laid the foundation for ML-driven demand forecasting and inventory optimisation.",
    stack: ["AWS S3", "Glue", "Athena", "Step Functions", "Delta Lake", "MLflow"],
    outcomes: ["Single source of truth across 400+ branches", "Reporting cycle reduced from weeks to hours", "Self-serve analytics for regional managers", "ML pipeline ready for demand forecasting"]
  },
  {
    industry: "Healthcare & MedTech",
    tag: "Clinical Workflow Automation",
    problem: "A healthcare technology provider needed to automate patient referral processing while maintaining full compliance with clinical data regulations and insurance verification requirements.",
    solution: "AgenTek designed a governed agent workflow for patient referral management. The system coordinated intake, insurance eligibility verification, clinical triage, and appointment scheduling with human-in-the-loop checkpoints at every clinical decision point.",
    stack: ["HL7/FHIR Integration", "AWS", "Salesforce CRM", "Identity Gateway", "Eval Framework"],
    outcomes: ["Referral processing time reduced from 5 days to same-day", "100% of clinical decisions routed through human review", "Insurance verification automated for standard cases", "Full audit trail meeting regulatory requirements"]
  },
  {
    industry: "Travel & Transportation",
    tag: "AI Video Analytics",
    problem: "A global tourism operator running open-top bus tours across multiple cities needed real-time visibility into passenger volumes and brand exposure from street-level video feeds, but had no automated way to process thousands of hours of footage.",
    solution: "AgenTek designed a GPU-accelerated video analytics pipeline using PyTorch and TensorFlow for real-time brand recognition and passenger counting. The system was containerised on AWS EKS for scalable inference across multiple city feeds, with embedded ethical AI controls, adversarial testing, and GDPR-compliant data handling.",
    stack: ["PyTorch", "TensorFlow", "AWS EKS", "GPU Inference", "MLflow", "GDPR Controls"],
    outcomes: ["Over 90% brand recognition accuracy from street-level video", "Real-time passenger counting across multiple city operations", "Scalable inference architecture handling concurrent video feeds", "Ethical AI framework with adversarial testing built in"]
  }
];
const INDUSTRIES = [
  { id: "insurance", label: "Insurance", icon: "\u{1F6E1}", color: "#7c3aed" },
  { id: "finance", label: "Finance", icon: "\u{1F3E6}", color: "#1d4ed8" },
  { id: "enterprise", label: "Enterprise", icon: "\u{1F3E2}", color: "#0891b2" },
  { id: "healthcare", label: "Healthcare", icon: "\u{1F3E5}", color: "#059669" }
];
const EXAMPLES = {
  insurance: { desc: "Claims take 2 weeks. We review docs, check coverage, run fraud checks, then approve or deny.", steps: [
    { name: "Claim Intake", type: "manual", pain: "Manual data entry from multiple channels" },
    { name: "Document Collection", type: "manual", pain: "Chasing missing documents" },
    { name: "Coverage Check", type: "semi", pain: "Complex policy interpretation" },
    { name: "Fraud Assessment", type: "semi", pain: "Manual review of flagged items" },
    { name: "Adjudication", type: "manual", pain: "Senior adjuster bottleneck" },
    { name: "Settlement", type: "semi", pain: "Calculation errors, delays" }
  ] },
  finance: { desc: "KYC team manually reviews ID docs, runs sanctions checks, scores risk. 48hrs per application.", steps: [
    { name: "Application Receipt", type: "manual", pain: "Multiple formats, incomplete data" },
    { name: "Doc Classification", type: "manual", pain: "Manual sorting errors" },
    { name: "Data Extraction", type: "semi", pain: "OCR errors on handwritten docs" },
    { name: "Sanctions Screening", type: "semi", pain: "False positives need review" },
    { name: "Risk Scoring", type: "manual", pain: "Inconsistent between analysts" },
    { name: "Approval", type: "manual", pain: "Approval bottleneck" }
  ] },
  enterprise: { desc: "IT tickets queue up. Someone reads each, categorises, assigns priority, routes to the right team.", steps: [
    { name: "Ticket Receipt", type: "auto", pain: "Multiple intake channels" },
    { name: "Classification", type: "manual", pain: "Inconsistent categorisation" },
    { name: "Priority Assessment", type: "manual", pain: "Subjective prioritisation" },
    { name: "Assignment", type: "manual", pain: "Workload imbalance" },
    { name: "Resolution", type: "semi", pain: "Knowledge scattered across teams" }
  ] },
  healthcare: { desc: "Patient referrals come by fax/email. Staff enter data, check insurance, schedule, coordinate.", steps: [
    { name: "Referral Receipt", type: "manual", pain: "Fax-based, manual entry" },
    { name: "Data Entry", type: "manual", pain: "Transcription errors" },
    { name: "Insurance Check", type: "semi", pain: "Phone-based verification" },
    { name: "Clinical Review", type: "manual", pain: "Clinician time bottleneck" },
    { name: "Scheduling", type: "manual", pain: "Availability conflicts" },
    { name: "Notification", type: "manual", pain: "Missed confirmations" }
  ] }
};
const CAPABILITY_QS = [
  { id: "docs", q: "Does your workflow involve documents or files?", example: "Claim forms, ID documents, contracts, medical records", icon: "\u{1F4C4}", tools: ["parser"] },
  { id: "rules", q: "Are there compliance or regulatory rules to enforce?", example: "FCA regulations, HIPAA, KYC/AML, SLA thresholds", icon: "\u{1F6E1}", tools: ["rules", "auditlog"] },
  { id: "integrate", q: "Does this need to connect to existing systems?", example: "Salesforce, SAP, EHR, ITSM, payment platforms", icon: "\u{1F517}", tools: ["integrator"] },
  { id: "notify", q: "Should people be notified at certain stages?", example: "Email alerts, Slack messages, SMS updates", icon: "\u{1F4E8}", tools: ["notifier"] },
  { id: "learn", q: "Should the agent learn from past decisions?", example: "Pattern recognition, historical resolution matching", icon: "\u{1F9E0}", tools: ["vectordb"] }
];
const TOOL_NAMES = {
  parser: "Document Parser",
  rules: "Rules Engine",
  auditlog: "Audit Logger",
  integrator: "Integration Gateway",
  notifier: "Notification Service",
  vectordb: "Knowledge Store"
};
function getEvalTests(industry) {
  const tests = {
    insurance: [
      { name: "Complete claim with all documents", explain: "A standard claim comes in with every required document attached.", type: "pass", delay: 800 },
      { name: "Claim missing a required document", explain: "The agent should pause and request the missing document, not guess.", type: "pass", delay: 1400 },
      { name: "Two documents contradict each other", explain: "Date of incident differs between the claim form and police report.", type: "warn", delay: 2e3 },
      { name: "Someone submits a suspicious claim", explain: "Patterns match known fraud indicators. Agent should flag, not auto-approve.", type: "pass", delay: 2600 },
      { name: "Claim sits right on the coverage limit", explain: "Borderline case. Agent needs to handle ambiguity rather than force a decision.", type: "warn", delay: 3200 },
      { name: "100 claims arrive at the same time", explain: "Can the agent handle a sudden spike without dropping or duplicating claims?", type: "pass", delay: 3800 },
      { name: "Someone tries to manipulate the system", explain: "Unusual input patterns designed to trick the agent into wrong decisions.", type: "pass", delay: 4300 },
      { name: "External system goes offline mid-process", explain: "The fraud database is unreachable. Agent should wait and retry, not skip the check.", type: "fail", delay: 4800 },
      { name: "Recovery after the outage resolves", explain: "Once the system comes back, pending claims should resume, not start over.", type: "pass", delay: 5400 }
    ],
    finance: [
      { name: "Standard identity verification", explain: "Clean passport photo, matching address proof. The happy path.", type: "pass", delay: 800 },
      { name: "Customer uploads wrong document type", explain: "A bank statement instead of proof of address. Agent should ask for the right one.", type: "pass", delay: 1400 },
      { name: "Name spelling differs between documents", explain: "Is this a typo or a different person? Agent needs to flag, not auto-reject.", type: "warn", delay: 2e3 },
      { name: "Potential sanctions list match", explain: "Common name partially matches a sanctioned individual. Needs careful handling.", type: "pass", delay: 2600 },
      { name: "Customer from a high-risk jurisdiction", explain: "Extra due diligence required. Agent must apply enhanced checks automatically.", type: "warn", delay: 3200 },
      { name: "50 applications arrive simultaneously", explain: "Month-end rush. Agent needs to process without degrading quality.", type: "pass", delay: 3800 },
      { name: "Fraudulent document submitted", explain: "A manipulated passport image. Agent should detect inconsistencies.", type: "pass", delay: 4300 },
      { name: "Sanctions database goes offline", explain: "Can't verify against sanctions. Agent must NOT approve. It should wait.", type: "fail", delay: 4800 },
      { name: "Processing resumes after recovery", explain: "Queued applications should pick up where they left off.", type: "pass", delay: 5400 }
    ],
    enterprise: [
      { name: "Standard IT ticket with clear description", explain: "User reports 'email not syncing on phone'. Straightforward categorisation.", type: "pass", delay: 800 },
      { name: "Ticket with no useful description", explain: "'It's broken'. Agent needs to ask follow-up questions, not guess.", type: "pass", delay: 1400 },
      { name: "Ticket that could fit two categories", explain: "Network issue or application issue? Agent should pick best match and explain why.", type: "warn", delay: 2e3 },
      { name: "VIP user reports a critical issue", explain: "CEO can't access the board deck. SLA and priority rules should auto-escalate.", type: "pass", delay: 2600 },
      { name: "Duplicate ticket from the same user", explain: "User submitted twice. Agent should detect and merge, not create two.", type: "warn", delay: 3200 },
      { name: "200 tickets flood in during an outage", explain: "Major incident creates a wave. Agent should detect the pattern and group them.", type: "pass", delay: 3800 },
      { name: "User tries to escalate their own priority", explain: "'URGENT!!!' in the subject. Agent should assess impact, not follow shouting.", type: "pass", delay: 4300 },
      { name: "Routing system is temporarily unavailable", explain: "Can't assign tickets. Agent should queue them safely, not drop them.", type: "fail", delay: 4800 },
      { name: "Queued tickets route after recovery", explain: "Backlog clears in priority order once routing is back.", type: "pass", delay: 5400 }
    ],
    healthcare: [
      { name: "Standard patient referral with complete info", explain: "GP refers patient to specialist with full clinical notes.", type: "pass", delay: 800 },
      { name: "Referral missing insurance information", explain: "Agent should flag and request, not schedule without coverage confirmation.", type: "pass", delay: 1400 },
      { name: "Clinical notes suggest two possible specialties", explain: "Could be cardiology or pulmonology. Agent should surface both options.", type: "warn", delay: 2e3 },
      { name: "Urgent referral flagged by GP", explain: "Suspected cancer referral. Must be fast-tracked within 2-week wait rules.", type: "pass", delay: 2600 },
      { name: "Patient has conflicting appointment preferences", explain: "Requested morning but only evening slots available. Needs human coordination.", type: "warn", delay: 3200 },
      { name: "30 referrals arrive from one GP practice", explain: "Batch referral from a closing practice. System should handle without delays.", type: "pass", delay: 3800 },
      { name: "Referral contains sensitive safeguarding note", explain: "Agent must handle PHI with extra care and restrict access appropriately.", type: "pass", delay: 4300 },
      { name: "EHR system goes offline during processing", explain: "Can't read patient records. Agent must pause, NOT proceed without clinical data.", type: "fail", delay: 4800 },
      { name: "Paused referrals resume after EHR recovery", explain: "Referrals pick up from where they stopped with full context preserved.", type: "pass", delay: 5400 }
    ]
  };
  return tests[industry] || tests.enterprise;
}
const COLORS = {
  manual: { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626", label: "Manual" },
  semi: { bg: "#fefce8", border: "#fde047", text: "#ca8a04", label: "Semi-auto" },
  auto: { bg: "#ecfdf5", border: "#6ee7b7", text: "#059669", label: "Automated" }
};
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes drawLine{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
@keyframes hitRight{0%{transform:translateX(-40px);opacity:0}60%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:1}}
@keyframes resultPop{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(29,78,216,0)}50%{box-shadow:0 0 0 6px rgba(29,78,216,0.1)}}
`;
function Logo() {
  return /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 50 50", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M8 46 C12 34, 17 25, 22 18 C24 14, 25 10, 25 6", stroke: "#1e3a7a", strokeWidth: "5", strokeLinecap: "round", fill: "none" }), /* @__PURE__ */ React.createElement("path", { d: "M42 46 C38 34, 33 25, 28 18 C26 14, 25 10, 25 6", stroke: "#c47a2a", strokeWidth: "5", strokeLinecap: "round", fill: "none" }), /* @__PURE__ */ React.createElement("path", { d: "M25 46 C25 34, 25 25, 25 18 C25 14, 25 10, 25 6", stroke: "#1d4ed8", strokeWidth: "3", strokeLinecap: "round", fill: "none", opacity: "0.55" }), /* @__PURE__ */ React.createElement("circle", { cx: "25", cy: "6", r: "3", fill: "#c47a2a", opacity: "0.3" }));
}
function ProgressBar({ stage, total }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px", marginBottom: "1.25rem" } }, Array.from({ length: total }, (_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, height: 4, borderRadius: 2, background: i <= stage ? "#1d4ed8" : "#e5e7eb", transition: "background 0.4s" } })));
}
function StageTitle({ num, title, sub }) {
  return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "1rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "#1d4ed8", marginBottom: "0.2rem" } }, "STAGE ", num, " OF 6"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 400, lineHeight: 1.15 } }, title), sub && /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.82rem", color: "#64748b", marginTop: "0.25rem" } }, sub));
}
function FlowDiagram({ steps, animatedCount, checkpoints, onToggleCheckpoint }) {
  const W = 500, nodeW = 180, nodeH = 50, gap = 20, padY = 20, padX = (W - nodeW) / 2;
  const totalH = padY + steps.length * (nodeH + gap) + 10;
  return /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", WebkitOverflowScrolling: "touch" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${totalH}`, style: { width: "100%", maxWidth: 500, height: "auto", display: "block", margin: "0 auto" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "fa", viewBox: "0 0 10 7", refX: "10", refY: "3.5", markerWidth: "7", markerHeight: "5", orient: "auto" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 3.5 0 7z", fill: "#cbd5e1" })), /* @__PURE__ */ React.createElement("filter", { id: "ns" }, /* @__PURE__ */ React.createElement("feDropShadow", { dx: "0", dy: "1", stdDeviation: "2", floodOpacity: "0.08" }))), steps.map((step, i) => {
    if (i >= animatedCount) return null;
    const y = padY + i * (nodeH + gap);
    const tc = COLORS[step.type] || COLORS.manual;
    const isCP = checkpoints?.includes(i);
    const delay = i * 0.15;
    return /* @__PURE__ */ React.createElement("g", { key: i, style: { animation: `slideUp 0.4s ${delay}s ease-out both` } }, i > 0 && /* @__PURE__ */ React.createElement(
      "line",
      {
        x1: W / 2,
        y1: y - gap + 2,
        x2: W / 2,
        y2: y - 2,
        stroke: "#cbd5e1",
        strokeWidth: "1.5",
        markerEnd: "url(#fa)",
        strokeDasharray: "200",
        style: { animation: `drawLine 0.3s ${delay}s ease-out both` }
      }
    ), /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: padX,
        y,
        width: nodeW,
        height: nodeH,
        rx: 8,
        fill: "white",
        stroke: isCP ? "#ea580c" : tc.border,
        strokeWidth: isCP ? 2 : 1.5,
        filter: "url(#ns)",
        strokeDasharray: isCP ? "5 3" : "none"
      }
    ), /* @__PURE__ */ React.createElement("circle", { cx: padX + 16, cy: y + nodeH / 2, r: 10, fill: tc.bg, stroke: tc.border, strokeWidth: "1" }), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: padX + 16,
        y: y + nodeH / 2 + 3.5,
        textAnchor: "middle",
        style: { fontSize: "9px", fontWeight: 700, fill: tc.text, fontFamily: "'DM Sans',sans-serif" }
      },
      i + 1
    ), /* @__PURE__ */ React.createElement("text", { x: padX + 34, y: y + 20, style: { fontSize: "10px", fontWeight: 600, fill: "#0f1729", fontFamily: "'DM Sans',sans-serif" } }, step.name), /* @__PURE__ */ React.createElement("text", { x: padX + 34, y: y + 34, style: { fontSize: "7.5px", fill: "#94a3b8", fontFamily: "'DM Sans',sans-serif" } }, "\u26A0 ", step.pain), /* @__PURE__ */ React.createElement("rect", { x: padX + nodeW - 50, y: y + 6, width: 42, height: 16, rx: 4, fill: tc.bg, stroke: tc.border, strokeWidth: "0.5" }), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: padX + nodeW - 29,
        y: y + 17,
        textAnchor: "middle",
        style: { fontSize: "6.5px", fontWeight: 600, fill: tc.text, fontFamily: "'DM Sans',sans-serif" }
      },
      tc.label
    ), onToggleCheckpoint && /* @__PURE__ */ React.createElement("g", { onClick: (e) => {
      e.stopPropagation();
      onToggleCheckpoint(i);
    }, style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: padX + nodeW + 10,
        y: y + 10,
        width: 30,
        height: 30,
        rx: 6,
        fill: isCP ? "#ea580c" : "#f1f5f9",
        stroke: isCP ? "#ea580c" : "#e2e8f0",
        strokeWidth: "1"
      }
    ), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: padX + nodeW + 25,
        y: y + 29,
        textAnchor: "middle",
        style: { fontSize: "12px" }
      },
      isCP ? "\u{1F441}" : "+"
    )), isCP && /* @__PURE__ */ React.createElement("g", { style: { animation: `popIn 0.3s ease-out` } }, /* @__PURE__ */ React.createElement("rect", { x: padX - 40, y: y + 14, width: 34, height: 16, rx: 4, fill: "#ea580c", opacity: "0.1", stroke: "#ea580c", strokeWidth: "0.5" }), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: padX - 23,
        y: y + 25,
        textAnchor: "middle",
        style: { fontSize: "6px", fontWeight: 700, fill: "#ea580c", fontFamily: "'DM Sans',sans-serif" }
      },
      "HUMAN"
    )));
  })));
}
function CapabilityBuilder({ answers, onAnswer }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (revealed < CAPABILITY_QS.length) {
      const t = setTimeout(() => setRevealed((r) => r + 1), 400);
      return () => clearTimeout(t);
    }
  }, [revealed]);
  const derivedTools = [];
  CAPABILITY_QS.forEach((cq) => {
    if (answers[cq.id]) cq.tools.forEach((t) => {
      if (!derivedTools.includes(t)) derivedTools.push(t);
    });
  });
  return /* @__PURE__ */ React.createElement("div", null, CAPABILITY_QS.slice(0, revealed).map((cq, i) => {
    const answered = answers[cq.id] !== void 0;
    const yes = answers[cq.id] === true;
    return /* @__PURE__ */ React.createElement("div", { key: cq.id, style: {
      background: "#fff",
      borderRadius: 12,
      border: `1.5px solid ${answered ? yes ? "#1d4ed820" : "rgba(0,0,0,0.04)" : "rgba(29,78,216,0.15)"}`,
      padding: "0.85rem",
      marginBottom: "0.6rem",
      animation: `slideUp 0.35s ease-out`,
      opacity: answered && !yes ? 0.55 : 1,
      transition: "opacity 0.3s"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.6rem", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "1.2rem", flexShrink: 0, marginTop: "0.1rem" } }, cq.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.4, marginBottom: "0.2rem" } }, cq.q), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.4 } }, "e.g. ", cq.example))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.4rem", marginTop: "0.65rem", marginLeft: "1.8rem" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onAnswer(cq.id, true),
        style: { flex: 1, padding: "0.5rem", borderRadius: 7, border: `1.5px solid ${yes ? "#059669" : "rgba(0,0,0,0.07)"}`, background: yes ? "#ecfdf5" : "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: yes ? 600 : 400, color: yes ? "#059669" : "#64748b", transition: "all 0.2s" }
      },
      "Yes"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onAnswer(cq.id, false),
        style: { flex: 1, padding: "0.5rem", borderRadius: 7, border: `1.5px solid ${answered && !yes ? "#94a3b8" : "rgba(0,0,0,0.07)"}`, background: answered && !yes ? "#f1f5f9" : "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: answered && !yes ? 600 : 400, color: answered && !yes ? "#64748b" : "#94a3b8", transition: "all 0.2s" }
      },
      "No"
    )), yes && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "0.5rem", marginLeft: "1.8rem", display: "flex", gap: "0.3rem", flexWrap: "wrap", animation: "popIn 0.25s ease-out" } }, cq.tools.map((tid) => /* @__PURE__ */ React.createElement("span", { key: tid, style: { fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.45rem", borderRadius: 4, background: "rgba(29,78,216,0.06)", color: "#1d4ed8", border: "1px solid rgba(29,78,216,0.1)" } }, "+ ", TOOL_NAMES[tid]))));
  }), derivedTools.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", padding: "0.85rem", marginTop: "0.25rem", animation: "slideUp 0.3s ease-out" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.68rem", fontWeight: 600, color: "#1d4ed8", letterSpacing: "0.1em", marginBottom: "0.5rem" } }, "YOUR AGENT WILL USE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.35rem" } }, derivedTools.map((tid, i) => /* @__PURE__ */ React.createElement("span", { key: tid, style: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: "0.3rem 0.6rem",
    borderRadius: 6,
    background: "#1d4ed808",
    color: "#1d4ed8",
    border: "1px solid rgba(29,78,216,0.12)",
    animation: `popIn 0.25s ${i * 0.08}s ease-out both`
  } }, TOOL_NAMES[tid])))));
}
function StressTest({ industry, onComplete }) {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState({ pass: 0, warn: 0, fail: 0 });
  const [expanded, setExpanded] = useState(null);
  const tests = getEvalTests(industry);
  useEffect(() => {
    const timers = tests.map(
      (test, i) => setTimeout(() => {
        setResults((r) => [...r, test]);
        setScore((s) => ({ ...s, [test.type]: s[test.type] + 1 }));
        if (i === tests.length - 1) {
          setTimeout(() => {
            setRunning(false);
            if (onComplete) onComplete();
          }, 800);
        }
      }, test.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  const total = results.length;
  const pct = Math.round(total / tests.length * 100);
  const statusColors = { pass: "#059669", warn: "#ca8a04", fail: "#dc2626" };
  const statusIcons = { pass: "\u2713", warn: "\u26A0", fail: "\u2717" };
  const statusLabels = { pass: "HANDLED", warn: "FLAGGED", fail: "BLOCKED" };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "1rem" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.75rem", fontWeight: 600 } }, running ? "Simulating real scenarios..." : "All scenarios tested"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.75rem", fontWeight: 600, color: "#1d4ed8" } }, pct, "%")), /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", background: "linear-gradient(90deg, #1d4ed8, #7c3aed)", borderRadius: 3, width: `${pct}%`, transition: "width 0.3s" } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "1rem" } }, [["pass", "Handled"], ["warn", "Flagged"], ["fail", "Blocked"]].map(([k, l]) => /* @__PURE__ */ React.createElement("div", { key: k, style: { flex: 1, padding: "0.6rem", borderRadius: 8, background: `${statusColors[k]}08`, border: `1px solid ${statusColors[k]}20`, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "1.3rem", fontWeight: 700, color: statusColors[k] } }, score[k]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.65rem", color: statusColors[k], fontWeight: 500 } }, l)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.72rem", color: "#64748b", lineHeight: 1.5, padding: "0.6rem 0.75rem", background: "#fff", borderRadius: 8, border: "1px solid rgba(0,0,0,0.05)", marginBottom: "0.75rem" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#059669", fontWeight: 600 } }, "Handled"), " = agent processed correctly \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: "#ca8a04", fontWeight: 600 } }, "Flagged"), " = agent escalated to a human \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: "#dc2626", fontWeight: 600 } }, "Blocked"), " = agent needs a fallback plan"), /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, background: "#fafbfc", overflow: "hidden" } }, results.map((r, i) => {
    const isExp = expanded === i;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        onClick: () => setExpanded(isExp ? null : i),
        style: {
          padding: "0.6rem 0.75rem",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          animation: "hitRight 0.35s ease-out",
          cursor: "pointer",
          background: isExp ? "#fff" : "transparent",
          transition: "background 0.2s"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: {
        width: 22,
        height: 22,
        borderRadius: 6,
        background: `${statusColors[r.type]}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: statusColors[r.type],
        flexShrink: 0,
        animation: "resultPop 0.2s ease-out"
      } }, statusIcons[r.type]), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: "0.8rem", fontWeight: 500, lineHeight: 1.35 } }, r.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.62rem", fontWeight: 600, color: statusColors[r.type], flexShrink: 0 } }, statusLabels[r.type])),
      isExp && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "0.45rem", marginLeft: "1.85rem", fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5, animation: "slideUp 0.2s ease-out" } }, r.explain)
    );
  }), running && /* @__PURE__ */ React.createElement("div", { style: { padding: "0.75rem", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 16, height: 16, border: "2px solid #e5e7eb", borderTopColor: "#1d4ed8", borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto" } }))));
}
function OrchDiagram({ agents }) {
  const W = 480, H = 260, cx = W / 2, cy = H / 2;
  const r = 95;
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", maxWidth: 480, height: "auto", display: "block", margin: "0 auto" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "oa", viewBox: "0 0 10 7", refX: "10", refY: "3.5", markerWidth: "6", markerHeight: "4", orient: "auto" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 3.5 0 7z", fill: "#1d4ed8", opacity: "0.4" })), /* @__PURE__ */ React.createElement("filter", { id: "os" }, /* @__PURE__ */ React.createElement("feDropShadow", { dx: "0", dy: "1", stdDeviation: "2", floodOpacity: "0.08" }))), /* @__PURE__ */ React.createElement("g", { style: { animation: "popIn 0.5s ease-out" } }, /* @__PURE__ */ React.createElement("circle", { cx, cy, r: 32, fill: "#7c3aed", opacity: "0.08", stroke: "#7c3aed", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy - 4, textAnchor: "middle", style: { fontSize: "8px", fontWeight: 700, fill: "#7c3aed", fontFamily: "'DM Sans',sans-serif" } }, "ORCHESTRATOR"), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy + 8, textAnchor: "middle", style: { fontSize: "6.5px", fill: "#7c3aed", fontFamily: "'DM Sans',sans-serif", opacity: 0.7 } }, "State Machine")), agents.map((a, i) => {
    const angle = i / agents.length * Math.PI * 2 - Math.PI / 2;
    const ax = cx + Math.cos(angle) * r;
    const ay = cy + Math.sin(angle) * r;
    const isHuman = a.type === "human";
    const colors = { worker: "#1d4ed8", validator: "#ca8a04", gateway: "#059669", human: "#ea580c" };
    const c = colors[a.type] || "#1d4ed8";
    const lineEndX = cx + Math.cos(angle) * 38;
    const lineEndY = cy + Math.sin(angle) * 38;
    const lineStartX = ax - Math.cos(angle) * 30;
    const lineStartY = ay - Math.sin(angle) * 30;
    return /* @__PURE__ */ React.createElement("g", { key: i, style: { animation: `popIn 0.4s ${0.3 + i * 0.12}s ease-out both` } }, /* @__PURE__ */ React.createElement(
      "line",
      {
        x1: lineEndX,
        y1: lineEndY,
        x2: lineStartX,
        y2: lineStartY,
        stroke: c,
        strokeWidth: "1",
        opacity: "0.3",
        strokeDasharray: "4 3",
        markerEnd: "url(#oa)"
      }
    ), /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: ax - 46,
        y: ay - 22,
        width: 92,
        height: 44,
        rx: 8,
        fill: "white",
        stroke: c,
        strokeWidth: isHuman ? 2 : 1.5,
        strokeDasharray: isHuman ? "5 3" : "none",
        filter: "url(#os)"
      }
    ), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: ax,
        y: ay - 5,
        textAnchor: "middle",
        style: { fontSize: "8.5px", fontWeight: 600, fill: "#0f1729", fontFamily: "'DM Sans',sans-serif" }
      },
      a.name
    ), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: ax,
        y: ay + 7,
        textAnchor: "middle",
        style: { fontSize: "7px", fill: c, fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }
      },
      a.role
    ), isHuman && /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x: ax + 24, y: ay - 22, width: 22, height: 12, rx: 3, fill: "#ea580c" }), /* @__PURE__ */ React.createElement(
      "text",
      {
        x: ax + 35,
        y: ay - 13.5,
        textAnchor: "middle",
        style: { fontSize: "5.5px", fontWeight: 700, fill: "white", fontFamily: "'DM Sans',sans-serif" }
      },
      "H"
    )));
  }));
}
function AgentBuilderInline({ onCTA }) {
  const [stage, setStage] = useState(0);
  const [industry, setIndustry] = useState(null);
  const [steps, setSteps] = useState([]);
  const [animCount, setAnimCount] = useState(0);
  const [checkpoints, setCheckpoints] = useState([]);
  const [capAnswers, setCapAnswers] = useState({});
  const activeTools = [];
  CAPABILITY_QS.forEach((cq) => {
    if (capAnswers[cq.id]) cq.tools.forEach((t) => {
      if (!activeTools.includes(t)) activeTools.push(t);
    });
  });
  const [evalsComplete, setEvalsComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [archCloud, setArchCloud] = useState("aws");
  const pb = { display: "block", width: "100%", padding: "0.8rem", background: "#1d4ed8", color: "#fff", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer", textAlign: "center" };
  const pbOff = { ...pb, opacity: 0.4, cursor: "default" };
  useEffect(() => {
    if (stage === 1 && animCount < steps.length) {
      const t = setTimeout(() => setAnimCount((c) => c + 1), 300);
      return () => clearTimeout(t);
    }
  }, [stage, animCount, steps.length]);
  const selectIndustry = (id) => {
    setIndustry(id);
    const ex = EXAMPLES[id];
    setSteps(ex.steps);
    setAnimCount(0);
    setCheckpoints([]);
    setStage(1);
  };
  const toggleCheckpoint = (idx) => {
    setCheckpoints((cp) => cp.includes(idx) ? cp.filter((i) => i !== idx) : [...cp, idx]);
  };
  const answerCap = (id, val) => setCapAnswers((a) => ({ ...a, [id]: val }));
  const getAgents = () => {
    const base = [
      { name: "Intake Agent", role: "Parse & validate", type: "gateway" },
      { name: "Processing Agent", role: "Core workflow", type: "worker" },
      { name: "Validator", role: "Quality checks", type: "validator" }
    ];
    if (checkpoints.length > 0) base.push({ name: "Human Gate", role: "Review & approve", type: "human" });
    if (activeTools.includes("rules")) base.push({ name: "Policy Agent", role: "Rule enforcement", type: "validator" });
    return base;
  };
  if (stage === 0) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" } }, /* @__PURE__ */ React.createElement(Logo, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: "0.92rem" } }, "AgenTek ", /* @__PURE__ */ React.createElement("span", { style: { color: "#9ca3af", fontWeight: 400 } }, "Labs")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.12em", color: "#c47a2a" } }, "AGENT BUILDER"))), /* @__PURE__ */ React.createElement(ProgressBar, { stage: 0, total: 7 }), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: "2rem" } }, /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 400, lineHeight: 1.12, marginBottom: "0.5rem" } }, "Build your AI agent ", /* @__PURE__ */ React.createElement("em", { style: { fontStyle: "italic", color: "#1d4ed8" } }, "visually")), /* @__PURE__ */ React.createElement("p", { style: { color: "#4b5563", fontSize: "0.88rem", lineHeight: 1.6 } }, "Pick your industry. Watch the agent assemble step by step.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" } }, INDUSTRIES.map((ind, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: ind.id,
      onClick: () => selectIndustry(ind.id),
      style: {
        padding: "1.25rem 0.85rem",
        borderRadius: 12,
        border: "2px solid rgba(0,0,0,0.06)",
        background: "#fff",
        cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif",
        textAlign: "center",
        animation: `slideUp 0.3s ${i * 0.08}s ease-out both`,
        transition: "border-color 0.2s, transform 0.15s"
      },
      onMouseEnter: (e) => e.currentTarget.style.borderColor = ind.color,
      onMouseLeave: (e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: "1.8rem", marginBottom: "0.4rem" } }, ind.icon),
    /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: "0.9rem" } }, ind.label),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.15rem" } }, EXAMPLES[ind.id].steps.length, " steps")
  )))));
  if (stage === 1) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(ProgressBar, { stage: 1, total: 7 }), /* @__PURE__ */ React.createElement(StageTitle, { num: "1", title: "Your workflow, mapped", sub: "Each step appeared as we analysed your process. Tap + to add human checkpoints." }), /* @__PURE__ */ React.createElement(FlowDiagram, { steps, animatedCount: animCount, checkpoints, onToggleCheckpoint: animCount >= steps.length ? toggleCheckpoint : null }), animCount >= steps.length && /* @__PURE__ */ React.createElement("div", { style: { animation: "slideUp 0.4s ease-out", marginTop: "1rem" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", padding: "0.85rem", marginBottom: "0.85rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.72rem", fontWeight: 600, color: "#ea580c", marginBottom: "0.3rem" } }, "\u{1F441} HUMAN CHECKPOINTS: ", checkpoints.length), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.78rem", color: "#64748b" } }, checkpoints.length === 0 ? "Tap the + buttons on the right side of each step to mark where humans should review." : `${checkpoints.length} checkpoint${checkpoints.length > 1 ? "s" : ""} set. These become governance gates in your agent.`)), /* @__PURE__ */ React.createElement("button", { onClick: () => setStage(2), style: pb }, "Continue to Agent Assembly \u2192"))));
  const allAnswered = Object.keys(capAnswers).length >= CAPABILITY_QS.length;
  if (stage === 2) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(ProgressBar, { stage: 2, total: 7 }), /* @__PURE__ */ React.createElement(StageTitle, { num: "2", title: "What does your agent need?", sub: "Answer 5 questions. We'll assemble the right capabilities automatically." }), /* @__PURE__ */ React.createElement(CapabilityBuilder, { answers: capAnswers, onAnswer: answerCap }), allAnswered && /* @__PURE__ */ React.createElement("button", { onClick: () => setStage(3), style: { ...pb, marginTop: "1rem" } }, "Stress Test Your Agent \u2192")));
  if (stage === 3) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(ProgressBar, { stage: 3, total: 7 }), /* @__PURE__ */ React.createElement(StageTitle, { num: "3", title: "Can your agent handle the real world?", sub: "We're throwing 9 real business scenarios at your agent. Tap any result to see what happened." }), /* @__PURE__ */ React.createElement(StressTest, { industry, onComplete: () => setEvalsComplete(true) }), evalsComplete && /* @__PURE__ */ React.createElement("div", { style: { animation: "slideUp 0.4s ease-out", marginTop: "1rem" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#ecfdf5", borderRadius: 10, padding: "0.85rem", border: "1px solid #05966920", marginBottom: "0.85rem", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: "#059669", fontSize: "0.88rem" } }, "Your agent handled 7 out of 9 scenarios"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.75rem", color: "#065f46", marginTop: "0.15rem" } }, "The 2 flagged items get escalated to a human. The 1 blocked scenario needs a fallback. That's what governance is for.")), /* @__PURE__ */ React.createElement("button", { onClick: () => setStage(4), style: pb }, "See Orchestration \u2192"))));
  if (stage === 4) {
    const agents = getAgents();
    return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(ProgressBar, { stage: 4, total: 7 }), /* @__PURE__ */ React.createElement(StageTitle, { num: "4", title: "Multi-agent orchestration", sub: "Your single workflow has split into specialist agents. The orchestrator coordinates them all." }), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: "0.75rem", marginBottom: "1rem" } }, /* @__PURE__ */ React.createElement(OrchDiagram, { agents })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" } }, agents.map((a, i) => {
      const colors = { worker: "#1d4ed8", validator: "#ca8a04", gateway: "#059669", human: "#ea580c" };
      const c = colors[a.type] || "#1d4ed8";
      return /* @__PURE__ */ React.createElement("div", { key: i, style: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 0.75rem",
        background: "#fff",
        borderRadius: 8,
        border: `1px solid ${c}20`,
        animation: `slideIn 0.3s ${i * 0.1}s ease-out both`
      } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 6, background: `${c}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: c, flexShrink: 0 } }, a.type[0].toUpperCase()), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: "0.82rem" } }, a.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", color: "#64748b" } }, a.role)));
    })), /* @__PURE__ */ React.createElement("button", { onClick: () => setStage(5), style: pb }, "Generate Blueprint \u2192")));
  }
  if (stage === 5) {
    const agents = getAgents();
    const indLabel = INDUSTRIES.find((i) => i.id === industry)?.label || "";
    return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(ProgressBar, { stage: 5, total: 7 }), /* @__PURE__ */ React.createElement(StageTitle, { num: "5", title: "Your Agent Blueprint" }), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: "1rem", animation: "slideUp 0.5s ease-out" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", padding: "1.25rem", color: "white" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", opacity: 0.7 } }, "AGENT BLUEPRINT"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "1.3rem", fontWeight: 400, marginTop: "0.25rem" } }, indLabel, " Agent System")), /* @__PURE__ */ React.createElement("div", { style: { padding: "1rem" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1rem" } }, [
      { n: steps.length, l: "Workflow Steps" },
      { n: agents.length, l: "Agents" },
      { n: activeTools.length, l: "Tools" },
      { n: checkpoints.length, l: "Human Gates" },
      { n: "7/9", l: "Scenarios Handled" },
      { n: "Orch", l: "Architecture" }
    ].map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "0.5rem", background: "#fafbfc", borderRadius: 8, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "1rem", fontWeight: 700, color: "#1d4ed8" } }, s.n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.6rem", color: "#94a3b8", fontWeight: 500 } }, s.l)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "0.4rem" } }, "WORKFLOW"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "1rem" } }, steps.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "0.2rem" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.7rem", fontWeight: 600, color: COLORS[s.type]?.text || "#64748b", background: COLORS[s.type]?.bg || "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: 4 } }, s.name), i < steps.length - 1 && /* @__PURE__ */ React.createElement("span", { style: { color: "#cbd5e1", fontSize: "0.7rem" } }, "\u2192")))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "0.4rem" } }, "AGENTS"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.3rem" } }, agents.map((a, i) => {
      const colors = { worker: "#1d4ed8", validator: "#ca8a04", gateway: "#059669", human: "#ea580c" };
      return /* @__PURE__ */ React.createElement("span", { key: i, style: { fontSize: "0.7rem", fontWeight: 600, color: colors[a.type], background: `${colors[a.type]}08`, padding: "0.2rem 0.5rem", borderRadius: 5, border: `1px solid ${colors[a.type]}20` } }, a.name);
    })))), !submitted ? /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: "1.15rem", marginBottom: "0.85rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.68rem", fontWeight: 600, color: "#1d4ed8", letterSpacing: "0.1em", marginBottom: "0.5rem" } }, "GET YOUR FULL BLUEPRINT"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.78rem", color: "#64748b", marginBottom: "0.75rem" } }, "Enter your email for a detailed PDF with architecture diagrams, eval results, and implementation roadmap."), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: email,
        onChange: (e) => setEmail(e.target.value),
        placeholder: "Your work email",
        style: { width: "100%", padding: "0.7rem 0.85rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.07)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", outline: "none", marginBottom: "0.6rem" }
      }
    ), /* @__PURE__ */ React.createElement("button", { onClick: async () => {
      if (!email.trim()) return;
      setSubmitted(true);
      try {
        const result = await submitToFormspree({ email, type: "Agent Builder Blueprint", industry, steps: steps.length, checkpoints: checkpoints.length });
        if (!result.ok) {
          throw new Error(result.missingConfig ? "missing-config" : "submit-failed");
        }
      } catch {
      }
    }, style: pb }, "Send My Blueprint")) : /* @__PURE__ */ React.createElement("div", { style: { background: "#ecfdf5", borderRadius: 12, padding: "1.15rem", textAlign: "center", marginBottom: "0.85rem", border: "1px solid #05966920" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: "#059669" } }, "\u2713 Blueprint request received")), /* @__PURE__ */ React.createElement("button", { onClick: () => setStage(6), style: pb }, "See Cloud Architecture \u2192")));
  }
  const selCloud = [
    { id: "aws", label: "AWS", color: "#FF9900", svc: { compute: "Lambda", ai: "Bedrock", vector: "OpenSearch", storage: "S3", queue: "EventBridge", auth: "Cognito", monitor: "CloudWatch", db: "DynamoDB" } },
    { id: "azure", label: "Azure", color: "#0078D4", svc: { compute: "Functions", ai: "Azure OpenAI", vector: "AI Search", storage: "Blob", queue: "Service Bus", auth: "Entra ID", monitor: "Monitor", db: "Cosmos DB" } },
    { id: "gcp", label: "GCP", color: "#4285F4", svc: { compute: "Cloud Run", ai: "Vertex AI", vector: "Vector Search", storage: "GCS", queue: "Pub/Sub", auth: "Firebase", monitor: "Cloud Mon", db: "Firestore" } },
    { id: "oss", label: "Open Source", color: "#16a34a", svc: { compute: "K8s / Docker", ai: "Ollama / vLLM", vector: "Qdrant", storage: "MinIO", queue: "Kafka", auth: "Keycloak", monitor: "Prometheus", db: "PostgreSQL" } }
  ];
  const curCloud = selCloud.find((cl) => cl.id === archCloud) || selCloud[0];
  const sv = curCloud.svc;
  const archLayers = [
    { name: "PRESENTATION", color: "#3b82f6", nodes: [["Portal / UI", sv.compute], ["API Gateway", sv.auth]] },
    { name: "AGENT ORCHESTRATION", color: "#7c3aed", nodes: [["Orchestrator", sv.compute], ["Intake Agent", sv.ai], ["Processing Agent", sv.ai], ["Validation Agent", sv.ai]] },
    { name: "GOVERNANCE", color: "#ea580c", nodes: [["Policy Engine", sv.compute], ["Human Review", sv.queue], ["Audit Trail", sv.storage]] },
    { name: "DATA & CONTEXT", color: "#059669", nodes: [["Document Store", sv.storage], ["Vector Store", sv.vector], ["State DB", sv.db]] },
    { name: "MONITORING", color: "#64748b", nodes: [["Performance", sv.monitor], ["Drift Detection", sv.compute], ["Eval Pipeline", sv.compute]] }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1729", padding: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(ProgressBar, { stage: 6, total: 7 }), /* @__PURE__ */ React.createElement(StageTitle, { num: "6", title: "Cloud Architecture", sub: "Your agent system mapped to real cloud services." }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.4rem", marginBottom: "1.25rem" } }, selCloud.map((cl) => /* @__PURE__ */ React.createElement("button", { key: cl.id, onClick: () => setArchCloud(cl.id), style: { flex: 1, padding: "0.55rem 0.5rem", borderRadius: 8, border: `2px solid ${archCloud === cl.id ? cl.color : "rgba(0,0,0,0.06)"}`, background: archCloud === cl.id ? `${cl.color}08` : "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: archCloud === cl.id ? 600 : 400, color: archCloud === cl.id ? cl.color : "#64748b", transition: "all 0.2s" } }, cl.label))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" } }, archLayers.map((layer, li) => /* @__PURE__ */ React.createElement("div", { key: li, style: { background: "#fff", borderRadius: 10, border: `1px solid ${layer.color}15`, overflow: "hidden", animation: `slideUp 0.3s ${li * 0.08}s ease-out both` } }, /* @__PURE__ */ React.createElement("div", { style: { background: `${layer.color}08`, padding: "0.45rem 0.85rem", borderBottom: `1px solid ${layer.color}15` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: layer.color } }, layer.name)), /* @__PURE__ */ React.createElement("div", { style: { padding: "0.6rem 0.85rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" } }, layer.nodes.map((n, ni) => /* @__PURE__ */ React.createElement("div", { key: ni, style: { display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.55rem", borderRadius: 6, background: `${layer.color}06`, border: `1px solid ${layer.color}12` } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.75rem", fontWeight: 600, color: "#0f1729" } }, n[0]), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.62rem", color: curCloud.color, fontWeight: 500 } }, n[1]))))))), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", padding: "1rem", marginBottom: "1.25rem", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.68rem", fontWeight: 600, color: curCloud.color, letterSpacing: "0.1em", marginBottom: "0.35rem" } }, curCloud.label.toUpperCase(), " ARCHITECTURE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.82rem", color: "#64748b" } }, archLayers.reduce((sum, l) => sum + l.nodes.length, 0), " components across ", archLayers.length, " layers")), /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg, rgba(29,78,216,0.04), rgba(196,122,42,0.04))", borderRadius: 12, padding: "1.5rem", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "1.15rem", fontWeight: 400, marginBottom: "0.4rem" } }, "Ready to build this for real?"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.78rem", color: "#64748b", marginBottom: "1rem" } }, "This blueprint is a starting point. We take it from design to production."), /* @__PURE__ */ React.createElement("button", { onClick: onCTA, style: { ...pb, width: "auto", display: "inline-block", padding: "0.75rem 2rem" } }, "Talk to AgenTek"))));
}
function SiteLogo({ size = 32, light }) {
  const navy = light ? "#8ba4db" : "#1e3a7a";
  const blue = light ? "#93b4f5" : "#1d4ed8";
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 50 50", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M8 46 C12 34, 17 25, 22 18 C24 14, 25 10, 25 6", stroke: navy, strokeWidth: "5", strokeLinecap: "round", fill: "none" }), /* @__PURE__ */ React.createElement("path", { d: "M42 46 C38 34, 33 25, 28 18 C26 14, 25 10, 25 6", stroke: "#c47a2a", strokeWidth: "5", strokeLinecap: "round", fill: "none" }), /* @__PURE__ */ React.createElement("path", { d: "M25 46 C25 34, 25 25, 25 18 C25 14, 25 10, 25 6", stroke: blue, strokeWidth: "3", strokeLinecap: "round", fill: "none", opacity: "0.55" }), /* @__PURE__ */ React.createElement("circle", { cx: "25", cy: "6", r: "3", fill: "#c47a2a", opacity: "0.3" }));
}
function HeroJourney() {
  const stages = [
    { icon: "M4 4h8v2H4zM4 8h6v2H4zM4 12h8v2H4z", label: "Define", color: "#60a5fa" },
    { icon: "M8 2a4 4 0 00-4 4v1a4 4 0 008 0V6a4 4 0 00-4-4zM3 14a5 5 0 0110 0", label: "Specify", color: "#a78bfa" },
    { icon: "M3 8l3 3 7-7M3 12h10", label: "Evaluate", color: "#34d399" },
    { icon: "M8 2v4M4 6h8M2 10h4v4H2zM10 10h4v4h-4zM6 14h4", label: "Orchestrate", color: "#fb923c" },
    { icon: "M4 2h8l2 2v10H2V2h2zM6 7h4M6 9h4M6 11h2", label: "Blueprint", color: "#c47a2a" }
  ];
  const W = 420, H = 90;
  const gap = W / 5;
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", maxWidth: 420, height: "auto", display: "block" } }, stages.map((s, i) => {
    const x = gap * i + gap / 2;
    return /* @__PURE__ */ React.createElement("g", { key: i, style: { animation: `popIn 0.5s ${i * 0.15 + 0.3}s ease-out both` } }, i > 0 && /* @__PURE__ */ React.createElement("line", { x1: x - gap + 24, y1: 30, x2: x - 24, y2: 30, stroke: "rgba(255,255,255,0.15)", strokeWidth: "1.5", strokeDasharray: "4 3", style: { animation: `drawLine 0.4s ${i * 0.15 + 0.3}s ease-out both` } }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: 30, r: 22, fill: "rgba(255,255,255,0.06)", stroke: s.color, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("g", { transform: `translate(${x - 8}, 22)` }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16" }, /* @__PURE__ */ React.createElement("path", { d: s.icon, fill: "none", stroke: s.color, strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }))), /* @__PURE__ */ React.createElement("text", { x, y: 68, textAnchor: "middle", style: { fontSize: "9px", fontWeight: 600, fill: s.color, fontFamily: "'DM Sans',sans-serif" } }, s.label), /* @__PURE__ */ React.createElement("text", { x, y: 80, textAnchor: "middle", style: { fontSize: "7px", fill: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" } }, "Stage ", i + 1));
  }));
}
function ContactForm({ onSuccess, dark }) {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [st, setSt] = useState({ text: "", type: "" });
  const [sending, setSending] = useState(false);
  const is = { width: "100%", padding: "0.8rem 1rem", borderRadius: 8, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, background: dark ? "rgba(255,255,255,0.05)" : "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: dark ? "#e2e8f0" : "#0f1729", outline: "none" };
  const submit = async () => {
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) {
      setSt({ text: "Please fill in all fields.", type: "error" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      setSt({ text: "Valid email required.", type: "error" });
      return;
    }
    setSending(true);
    try {
      const result = await submitToFormspree(f);
      if (result.ok) {
        setSt({ text: "Sent! We'll be in touch.", type: "success" });
        setF({ name: "", email: "", message: "" });
        if (onSuccess) setTimeout(onSuccess, 2e3);
      } else if (result.missingConfig) setSt({ text: "Contact form is not configured yet.", type: "error" });
      else setSt({ text: "Something went wrong.", type: "error" });
    } catch {
      setSt({ text: "Network error.", type: "error" });
    }
    setSending(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.65rem" } }, /* @__PURE__ */ React.createElement("input", { value: f.name, onChange: (e) => setF((p) => ({ ...p, name: e.target.value })), placeholder: "Your name", style: is }), /* @__PURE__ */ React.createElement("input", { value: f.email, onChange: (e) => setF((p) => ({ ...p, email: e.target.value })), placeholder: "Your email", style: is }), /* @__PURE__ */ React.createElement("textarea", { value: f.message, onChange: (e) => setF((p) => ({ ...p, message: e.target.value })), placeholder: "Tell us about your challenge", rows: 3, style: { ...is, resize: "vertical", minHeight: 80 } }), /* @__PURE__ */ React.createElement("button", { onClick: submit, disabled: sending, style: { width: "100%", padding: "0.8rem", background: "#c47a2a", color: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer", opacity: sending ? 0.7 : 1, transition: "opacity 0.2s" } }, sending ? "Sending..." : "Send Message"), st.text && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.82rem", color: st.type === "success" ? "#34d399" : "#f87171" } }, st.text));
}
function ProductsPage({ onCTA }) {
  return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "7rem 2rem 5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", maxWidth: 640, margin: "0 auto 3.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c47a2a", marginBottom: "1rem" } }, "Products"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.08, marginBottom: "1rem" } }, "Repeatable deliverables.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "#94a3b8" } }, "Fixed scope. Fixed price.")), /* @__PURE__ */ React.createElement("p", { style: { color: "#64748b", fontSize: "1.05rem", lineHeight: 1.7 } }, "Buy without a discovery call. Each product is a defined deliverable you can act on immediately.")), /* @__PURE__ */ React.createElement("div", { className: "g3", style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" } }, PRODUCTS.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }, onMouseEnter: (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
  }, onMouseLeave: (e) => {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
  } }, /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg, #0a0f1e, #1a2744)", padding: "1.75rem 1.5rem", color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "2rem" } }, p.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.62rem", fontWeight: 600, color: "#c47a2a", background: "rgba(196,122,42,0.15)", padding: "0.2rem 0.6rem", borderRadius: 4 } }, p.tag)), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "1.2rem", fontWeight: 600, marginTop: "0.75rem" } }, p.title)), /* @__PURE__ */ React.createElement("div", { style: { padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.85rem", color: "#4b5563", lineHeight: 1.65, marginBottom: "1.25rem", flex: 1 } }, p.desc), /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "1rem", marginBottom: "1.25rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "0.5rem" } }, "WHAT YOU GET"), p.deliverables.map((d, j) => /* @__PURE__ */ React.createElement("div", { key: j, style: { fontSize: "0.8rem", color: "#475569", padding: "0.2rem 0", display: "flex", alignItems: "center", gap: "0.4rem" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#c47a2a", fontSize: "0.6rem" } }, "\u25C6"), " ", d))), /* @__PURE__ */ React.createElement("button", { onClick: onCTA, style: { width: "100%", padding: "0.75rem", background: "#0a0f1e", color: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer", transition: "background 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "#1d4ed8", onMouseLeave: (e) => e.currentTarget.style.background = "#0a0f1e" }, p.cta))))));
}
function ServicesPage({ onCTA }) {
  const phases = [
    { name: "Discover", color: "#60a5fa", desc: "Understand where AI creates value.", items: SERVICES_DISCOVER },
    { name: "Design", color: "#a78bfa", desc: "Architect what production looks like.", items: SERVICES_DESIGN },
    { name: "Build & Partner", color: "#34d399", desc: "Fixed-scope delivery and retained engagements.", items: SERVICES_BUILD }
  ];
  const [expandedCard, setExpandedCard] = useState(null);
  return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "7rem 2rem 5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", maxWidth: 640, margin: "0 auto 3.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: "1rem" } }, "Services"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.08, marginBottom: "1rem" } }, "From your problem", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "#94a3b8" } }, "to production.")), /* @__PURE__ */ React.createElement("p", { style: { color: "#64748b", fontSize: "1.05rem", lineHeight: 1.7 } }, "We don't sell hours. We sell outcomes. Start wherever you are.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" } }, phases.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "0.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", background: `${p.color}18`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: p.color } }, i + 1), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, fontSize: "0.9rem" } }, p.name), i < 2 && /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 1, background: "#e2e8f0", marginLeft: "0.5rem" } })))), phases.map((phase, pi) => /* @__PURE__ */ React.createElement("div", { key: pi, style: { marginBottom: "3rem" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "1.5rem" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: "1.4rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.6rem" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 4, height: 24, borderRadius: 2, background: phase.color, display: "inline-block" } }), phase.name), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.88rem", color: "#64748b", marginLeft: "1.1rem" } }, phase.desc)), /* @__PURE__ */ React.createElement("div", { className: "g3", style: { display: "grid", gridTemplateColumns: `repeat(${Math.min(phase.items.length, 3)},1fr)`, gap: "1rem" } }, phase.items.map((s, si) => {
    const cardId = `${pi}-${si}`;
    const isExp = expandedCard === cardId;
    const isRetained = pi === 2 && si >= 3;
    return /* @__PURE__ */ React.createElement("div", { key: si, onClick: () => setExpandedCard(isExp ? null : cardId), style: { background: "#fff", borderRadius: 12, border: `1px solid ${isRetained ? `${phase.color}30` : "rgba(0,0,0,0.06)"}`, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }, onMouseEnter: (e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
    }, onMouseLeave: (e) => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "";
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "1.25rem 1.25rem 0.85rem", borderLeft: `3px solid ${phase.color}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "0.95rem", fontWeight: 600, flex: 1 } }, s.title), isRetained && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.58rem", fontWeight: 600, color: phase.color, background: `${phase.color}12`, padding: "0.15rem 0.45rem", borderRadius: 3, flexShrink: 0 } }, "RETAINED")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.82rem", color: "#64748b", lineHeight: 1.55, marginTop: "0.3rem" } }, s.desc)), isExp && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 1.25rem 1.25rem", borderLeft: `3px solid ${phase.color}`, animation: "slideUp 0.2s ease-out" } }, /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.85rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.62rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "0.4rem" } }, "WHAT YOU GET"), s.gets.map((g, gi) => /* @__PURE__ */ React.createElement("div", { key: gi, style: { fontSize: "0.78rem", color: "#475569", padding: "0.15rem 0" } }, "\u25C6 ", g)), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      onCTA();
    }, style: { marginTop: "0.85rem", width: "100%", padding: "0.6rem", background: `${phase.color}12`, color: phase.color, borderRadius: 7, fontSize: "0.82rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", border: `1px solid ${phase.color}25`, cursor: "pointer" } }, "Let's discuss"))), !isExp && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 1.25rem 0.85rem", borderLeft: `3px solid ${phase.color}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.72rem", color: "#94a3b8" } }, "Tap to see deliverables \u2192")));
  })))));
}
function AgenTekV3() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTag, setActiveTag] = useState("All");
  const refs = { builder: useRef(null), about: useRef(null) };
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);
  useEffect(() => {
    const schemas = [
      { "@context": "https://schema.org", "@type": "Organization", "name": "AgenTek Labs", "legalName": "AgenTek Labs Limited", "url": "https://agentek.co.uk", "email": "hello@agentek.co.uk", "description": "Specialist AI architecture and advisory consultancy for regulated industries. We help enterprises productionise agent workflows safely across healthcare, financial services, and insurance.", "foundingDate": "2026", "areaServed": "Global", "address": { "@type": "PostalAddress", "addressCountry": "GB" }, "sameAs": [], "knowsAbout": ["Agentic AI", "Enterprise Architecture", "AI Governance", "Cloud-Native AI", "RAG", "Context Engineering", "Multi-Agent Systems", "AI Evaluation", "Healthcare AI", "Financial Services AI", "Insurance AI"] },
      { "@context": "https://schema.org", "@type": "ProfessionalService", "name": "AgenTek Labs", "url": "https://agentek.co.uk", "serviceType": ["AI Architecture Advisory", "Agent Blueprint Design", "AI Evaluation Frameworks", "Cloud Architecture Templates", "AI Governance Consulting", "Technical Delivery Leadership", "Fractional Chief AI Architect", "AI Discoverability Audit (AEO)"], "areaServed": { "@type": "Place", "name": "Global" }, "provider": { "@type": "Organization", "name": "AgenTek Labs" } },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "What does AgenTek Labs do?", "acceptedAnswer": { "@type": "Answer", "text": "AgenTek Labs is a specialist AI architecture and advisory consultancy. We help enterprises in regulated industries (healthcare, financial services, insurance) design, build, and govern AI agent systems for production use." } },
        { "@type": "Question", "name": "What industries does AgenTek work with?", "acceptedAnswer": { "@type": "Answer", "text": "Healthcare and MedTech, Financial Services and Payments, and Insurance and RegTech. All engagements are designed for regulatory compliance including HIPAA, FCA, PCI-DSS, GDPR, and HL7/FHIR." } },
        { "@type": "Question", "name": "What is an Agent Blueprint?", "acceptedAnswer": { "@type": "Answer", "text": "An Agent Blueprint is a fixed-price, fixed-scope deliverable that includes workflow analysis, agent specification, evaluation framework, orchestration architecture, governance model, and implementation roadmap for a specific enterprise workflow." } },
        { "@type": "Question", "name": "Does AgenTek build AI agents or just design them?", "acceptedAnswer": { "@type": "Answer", "text": "Both. AgenTek offers design products (Blueprints, Eval Packs, Architecture Templates) and delivery services (Agent Sprints, Integration Packages, Eval and Launch). We also provide ongoing retained advisory and fractional Chief AI Architect engagements." } },
        { "@type": "Question", "name": "What cloud platforms does AgenTek support?", "acceptedAnswer": { "@type": "Answer", "text": "AWS, Azure, GCP, and open-source stacks. AgenTek is platform-agnostic and vendor-neutral. Architecture Templates include cloud-specific service mappings for all major providers." } },
        { "@type": "Question", "name": "What is the AgenTek Agent Builder?", "acceptedAnswer": { "@type": "Answer", "text": "A free interactive tool on the AgenTek website that lets you design an AI agent visually. Pick your industry, map the workflow, add governance gates, stress test with real scenarios, see multi-agent orchestration, and generate a cloud architecture. 6 stages, no sign-up required." } },
        { "@type": "Question", "name": "Where is AgenTek Labs based?", "acceptedAnswer": { "@type": "Answer", "text": "AgenTek Labs Limited is registered in England and Wales (Company No. 17041966). UK-based, globally delivered." } }
      ] }
    ];
    schemas.forEach((schema, i) => {
      const id = `agentek-schema-${i}`;
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
  }, []);
  const goPage = (p) => {
    setPage(p);
    setMenuOpen(false);
  };
  const openModal = () => {
    setMenuOpen(false);
    setModalOpen(true);
  };
  const openBuilder = () => {
    setMenuOpen(false);
    if (page !== "home") setPage("home");
    setTimeout(() => refs.builder?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), page === "home" ? 100 : 200);
  };
  const scrollTo = (id) => {
    if (page !== "home") setPage("home");
    setMenuOpen(false);
    setTimeout(() => refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), page === "home" ? 0 : 100);
  };
  const isHome = page === "home";
  const navDark = isHome && !scrolled;
  const allTags = ["All", ...new Set(USE_CASES.flatMap((u) => u.tags))];
  const filteredUC = activeTag === "All" ? USE_CASES : USE_CASES.filter((u) => u.tags.includes(activeTag));
  return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'DM Sans',sans-serif", background: "#fff", color: "#0f1729", lineHeight: 1.7, overflowX: "hidden" } }, /* @__PURE__ */ React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        *{margin:0;padding:0;box-sizing:border-box} ::placeholder{color:#64748b}
        input:focus,textarea:focus{border-color:rgba(196,122,42,0.4)!important;box-shadow:0 0 0 3px rgba(196,122,42,0.08)!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes drawLine{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
        @keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        @keyframes hitRight{0%{transform:translateX(-40px);opacity:0}60%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:1}}
        @keyframes resultPop{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-2%)}30%{transform:translate(1%,2%)}50%{transform:translate(-1%,1%)}70%{transform:translate(2%,-1%)}90%{transform:translate(-2%,2%)}}
        @media(max-width:768px){.desk{display:none!important}.mob{display:flex!important}.g3{grid-template-columns:1fr!important}.g2{grid-template-columns:1fr!important}.g4{grid-template-columns:1fr 1fr!important}.hcta{flex-direction:column!important}.h1{font-size:2.4rem!important}.hero-split{flex-direction:column!important}.hero-right{display:none!important}}
      `), /* @__PURE__ */ React.createElement("nav", { style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1e3, padding: "0.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: navDark ? "rgba(10,15,30,0.6)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${navDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, transition: "all 0.4s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }, onClick: () => goPage("home") }, /* @__PURE__ */ React.createElement(SiteLogo, { size: 26, light: navDark }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: "0.92rem", color: navDark ? "#fff" : "#0f1729" } }, "AgenTek ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: navDark ? "rgba(255,255,255,0.5)" : "#9ca3af" } }, "Labs"))), /* @__PURE__ */ React.createElement("div", { className: "desk", style: { display: "flex", gap: "1.75rem", alignItems: "center" } }, [["products", "Products"], ["services", "Services"]].map(([id, label]) => /* @__PURE__ */ React.createElement("a", { key: id, onClick: () => goPage(id), style: { fontSize: "0.8rem", color: page === id ? "#c47a2a" : navDark ? "rgba(255,255,255,0.7)" : "#4b5563", cursor: "pointer", fontWeight: page === id ? 600 : 400, textDecoration: "none", borderBottom: page === id ? "2px solid #c47a2a" : "2px solid transparent", paddingBottom: "0.15rem", transition: "all 0.2s" } }, label)), /* @__PURE__ */ React.createElement("a", { onClick: openBuilder, style: { fontSize: "0.8rem", color: "#c47a2a", cursor: "pointer", fontWeight: 600, textDecoration: "none" } }, "Agent Builder"), /* @__PURE__ */ React.createElement("a", { onClick: () => scrollTo("about"), style: { fontSize: "0.8rem", color: navDark ? "rgba(255,255,255,0.7)" : "#4b5563", cursor: "pointer", textDecoration: "none" } }, "About"), /* @__PURE__ */ React.createElement("a", { onClick: openModal, style: { background: "#c47a2a", color: "#fff", padding: "0.45rem 1.1rem", borderRadius: 6, fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", textDecoration: "none", transition: "background 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "#a86520", onMouseLeave: (e) => e.currentTarget.style.background = "#c47a2a" }, "Let's Talk")), /* @__PURE__ */ React.createElement("button", { className: "mob", onClick: () => setMenuOpen(true), style: { display: "none", background: "none", border: "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: navDark ? "#fff" : "#4b5563", strokeWidth: "1.5", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "4", y1: "7", x2: "20", y2: "7" }), /* @__PURE__ */ React.createElement("line", { x1: "4", y1: "12", x2: "20", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "4", y1: "17", x2: "20", y2: "17" })))), menuOpen && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "#0a0f1e", zIndex: 1001, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setMenuOpen(false), style: { position: "absolute", top: "1rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "1.5", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }))), [["products", "Products"], ["services", "Services"]].map(([id, l]) => /* @__PURE__ */ React.createElement("a", { key: id, onClick: () => goPage(id), style: { fontSize: "1.2rem", color: page === id ? "#c47a2a" : "rgba(255,255,255,0.8)", cursor: "pointer", fontWeight: page === id ? 600 : 400, textDecoration: "none" } }, l)), /* @__PURE__ */ React.createElement("a", { onClick: openBuilder, style: { fontSize: "1.2rem", color: "#c47a2a", cursor: "pointer", fontWeight: 600, textDecoration: "none" } }, "Agent Builder"), /* @__PURE__ */ React.createElement("a", { onClick: () => scrollTo("about"), style: { fontSize: "1.2rem", color: "rgba(255,255,255,0.8)", cursor: "pointer", textDecoration: "none" } }, "About"), /* @__PURE__ */ React.createElement("a", { onClick: openModal, style: { fontSize: "1.2rem", color: "#c47a2a", cursor: "pointer", textDecoration: "none" } }, "Let's Talk")), modalOpen && /* @__PURE__ */ React.createElement("div", { onClick: (e) => {
    if (e.target === e.currentTarget) setModalOpen(false);
  }, style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 2e3, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 20, padding: "2.25rem", maxWidth: 440, width: "100%", position: "relative", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setModalOpen(false), style: { position: "absolute", top: "1rem", right: "1rem", background: "#f1f5f9", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#64748b", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }))), /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.4rem" } }, "Start a Conversation"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" } }, "Tell us about your challenge."), /* @__PURE__ */ React.createElement(ContactForm, { onSuccess: () => setModalOpen(false) }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "0.8rem", color: "#94a3b8", textAlign: "center" } }, "Or email ", /* @__PURE__ */ React.createElement("a", { href: "mailto:hello@agentek.co.uk", style: { color: "#c47a2a", textDecoration: "none", fontWeight: 600 } }, "hello@agentek.co.uk")))), page === "products" && /* @__PURE__ */ React.createElement(ProductsPage, { onCTA: openModal }), page === "services" && /* @__PURE__ */ React.createElement(ServicesPage, { onCTA: openModal }), isHome && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { style: { background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "10%", right: "15%", width: 400, height: 400, background: "radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 70%)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: "10%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(196,122,42,0.1) 0%, transparent 70%)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')", backgroundSize: "128px", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "8rem 2rem 4rem", position: "relative", zIndex: 2, width: "100%" } }, /* @__PURE__ */ React.createElement("div", { className: "hero-split", style: { display: "flex", alignItems: "center", gap: "4rem" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c47a2a", marginBottom: "1.5rem", opacity: 0, animation: "fadeUp 0.6s 0.1s ease-out forwards" } }, "Enterprise AI Architecture & Advisory"), /* @__PURE__ */ React.createElement("h1", { className: "h1", style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", opacity: 0, animation: "fadeUp 0.7s 0.25s ease-out forwards" } }, "From workflow", /* @__PURE__ */ React.createElement("br", null), "to AI agent.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", { style: { fontStyle: "italic", color: "#c47a2a" } }, "try it now")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", maxWidth: 440, marginTop: "1.5rem", lineHeight: 1.8, opacity: 0, animation: "fadeUp 0.7s 0.4s ease-out forwards" } }, "Pick your industry. Watch the workflow map itself. Add governance gates. Stress test with real scenarios."), /* @__PURE__ */ React.createElement("div", { className: "hcta", style: { display: "flex", gap: "0.75rem", marginTop: "2rem", opacity: 0, animation: "fadeUp 0.7s 0.55s ease-out forwards" } }, /* @__PURE__ */ React.createElement("a", { onClick: openBuilder, style: { display: "inline-flex", alignItems: "center", padding: "0.8rem 1.75rem", background: "#c47a2a", color: "#fff", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "background 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "#a86520", onMouseLeave: (e) => e.currentTarget.style.background = "#c47a2a" }, "Try the Agent Builder"), /* @__PURE__ */ React.createElement("a", { onClick: () => goPage("products"), style: { display: "inline-flex", alignItems: "center", padding: "0.8rem 1.5rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 500, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", textDecoration: "none", transition: "border-color 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)", onMouseLeave: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)" }, "View Products"))), /* @__PURE__ */ React.createElement("div", { className: "hero-right", style: { flex: "0 0 420px", opacity: 0, animation: "fadeUp 0.8s 0.5s ease-out forwards" } }, /* @__PURE__ */ React.createElement(HeroJourney, null)))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "3.5rem 0", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)", fontStyle: "italic", color: "#94a3b8" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 40, height: 1, background: "#c47a2a", display: "inline-block", verticalAlign: "middle", marginRight: "1rem", opacity: 0.5 } }), "Where AI meets regulatory reality", /* @__PURE__ */ React.createElement("span", { style: { width: 40, height: 1, background: "#c47a2a", display: "inline-block", verticalAlign: "middle", marginLeft: "1rem", opacity: 0.5 } }))), /* @__PURE__ */ React.createElement("section", { ref: refs.builder, style: { padding: "4rem 0 5rem", background: "#f8f9fb" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 560, margin: "0 auto", padding: "0 1.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: "1.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c47a2a", marginBottom: "0.5rem" } }, "Interactive"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, lineHeight: 1.12 } }, "Build your AI agent visually")), /* @__PURE__ */ React.createElement(AgentBuilderInline, { onCTA: openModal }))), /* @__PURE__ */ React.createElement("section", { style: { padding: "4rem 0" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 2rem" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: "0.5rem" } }, "How We Work"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, lineHeight: 1.15 } }, "From your problem to production")), /* @__PURE__ */ React.createElement("a", { onClick: () => goPage("services"), style: { fontSize: "0.85rem", color: "#c47a2a", cursor: "pointer", fontWeight: 600, textDecoration: "none" } }, "View all services \u2192")), /* @__PURE__ */ React.createElement("div", { className: "g4", style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem" } }, MSTEPS.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#1d4ed810", border: "2px solid #1d4ed830", margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#1d4ed8" } }, s.n), /* @__PURE__ */ React.createElement("h4", { style: { fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.2rem" } }, s.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5 } }, s.desc)))))), /* @__PURE__ */ React.createElement("section", { style: { padding: "4.5rem 0", background: "#f8f9fb" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 2rem" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c47a2a", marginBottom: "0.5rem" } }, "Representative Engagements"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, lineHeight: 1.15 } }, "Real problems. Real architectures.")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.72rem", color: "#94a3b8", maxWidth: 280 } }, "Based on patterns across multiple client engagements. Details anonymised.")), /* @__PURE__ */ React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.25rem" } }, CASE_STUDIES.map((cs, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)", onMouseLeave: (e) => e.currentTarget.style.transform = "" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.62rem", fontWeight: 600, color: "#1d4ed8", background: "#1d4ed808", padding: "0.2rem 0.6rem", borderRadius: 4 } }, cs.industry), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "0.62rem", color: "#94a3b8" } }, cs.tag)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.6 } }, cs.problem)), /* @__PURE__ */ React.createElement("div", { style: { padding: "1.25rem 1.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.62rem", fontWeight: 600, color: "#c47a2a", letterSpacing: "0.1em", marginBottom: "0.4rem" } }, "WHAT AGENTEK DELIVERED"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.8rem", color: "#475569", lineHeight: 1.6, marginBottom: "0.85rem" } }, cs.solution), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.85rem" } }, cs.stack.map((t, j) => /* @__PURE__ */ React.createElement("span", { key: j, style: { fontSize: "0.6rem", fontWeight: 500, padding: "0.15rem 0.4rem", borderRadius: 4, background: "rgba(0,0,0,0.03)", color: "#64748b", border: "1px solid rgba(0,0,0,0.05)" } }, t))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.62rem", fontWeight: 600, color: "#059669", letterSpacing: "0.1em", marginBottom: "0.3rem" } }, "OUTCOMES"), cs.outcomes.map((o, j) => /* @__PURE__ */ React.createElement("div", { key: j, style: { fontSize: "0.78rem", color: "#475569", padding: "0.12rem 0", display: "flex", gap: "0.35rem" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#059669", flexShrink: 0 } }, "+"), " ", o)))))))), /* @__PURE__ */ React.createElement("section", { style: { padding: "5rem 0" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 2rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: "0.5rem" } }, "Solutions"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: "1.5rem" } }, "Domain-specific AI agents", /* @__PURE__ */ React.createElement("br", null), "for workflows that matter"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2rem" } }, allTags.map((tag) => /* @__PURE__ */ React.createElement("button", { key: tag, onClick: () => setActiveTag(tag), style: { padding: "0.4rem 0.85rem", borderRadius: 100, border: `1px solid ${activeTag === tag ? "#1d4ed8" : "rgba(0,0,0,0.08)"}`, background: activeTag === tag ? "#1d4ed8" : "#fff", color: activeTag === tag ? "#fff" : "#64748b", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: activeTag === tag ? 600 : 400, transition: "all 0.2s" } }, tag))), /* @__PURE__ */ React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" } }, filteredUC.map((u, i) => /* @__PURE__ */ React.createElement("div", { key: u.title, style: { background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, padding: "1.5rem", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)", onMouseLeave: (e) => e.currentTarget.style.transform = "" }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.3rem" } }, u.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.82rem", color: "#64748b", lineHeight: 1.6, marginBottom: "0.75rem" } }, u.desc), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.3rem", flexWrap: "wrap" } }, u.tags.map((t, j) => /* @__PURE__ */ React.createElement("span", { key: j, style: { fontSize: "0.62rem", fontWeight: 500, padding: "0.18rem 0.5rem", borderRadius: 100, background: "#1d4ed808", color: "#1d4ed8", border: "1px solid #1d4ed815" } }, t)))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" } }, INDUSTRIES_DATA.map((ind, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, minWidth: 200, padding: "1rem 1.25rem", borderLeft: "3px solid #c47a2a30", background: "#f8f9fb", borderRadius: "0 8px 8px 0" } }, /* @__PURE__ */ React.createElement("h4", { style: { fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.15rem" } }, ind.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5 } }, ind.desc)))))), /* @__PURE__ */ React.createElement("section", { style: { padding: "4.5rem 0", background: "#f8f9fb" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: "0 2rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: "0.5rem" } }, "FAQ"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: "2rem" } }, "Common questions"), [
    ["What does AgenTek Labs do?", "We're a specialist AI architecture and advisory consultancy. We help enterprises in regulated industries design, build, and govern AI agent systems for production use."],
    ["What industries do you work with?", "Healthcare and MedTech, Financial Services and Payments, Insurance and RegTech. Every engagement is designed for regulatory compliance including HIPAA, FCA, PCI-DSS, GDPR, and HL7/FHIR."],
    ["Do you build AI agents or just design them?", "Both. We offer fixed-price design products (Blueprints, Eval Packs, Architecture Templates) and delivery services (Agent Sprints, Integration Packages, Eval and Launch). We also provide ongoing retained advisory and fractional Chief AI Architect engagements."],
    ["What cloud platforms do you support?", "AWS, Azure, GCP, and open-source stacks. We're platform-agnostic and vendor-neutral. Our Architecture Templates include cloud-specific service mappings for all major providers."],
    ["What is the Agent Builder?", "A free interactive tool on our website. Pick your industry, map the workflow, add governance gates, stress test with real scenarios, see multi-agent orchestration, and generate a cloud architecture. 6 stages, no sign-up required."],
    ["How do your products differ from your services?", "Products are repeatable, fixed-scope deliverables you can buy without a discovery call. Services are consulting engagements scoped to your specific situation. Many clients start with a product (like a Blueprint) and then move into a service engagement for delivery."],
    ["Where are you based?", "AgenTek Labs Limited is registered in England and Wales (Company No. 17041966). UK-based, globally delivered."]
  ].map(([q, a], i) => /* @__PURE__ */ React.createElement("details", { key: i, style: { background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", marginBottom: "0.5rem", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("summary", { style: { padding: "1rem 1.25rem", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: "#0f1729", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" } }, q, /* @__PURE__ */ React.createElement("span", { style: { color: "#94a3b8", fontSize: "1.1rem", flexShrink: 0, marginLeft: "1rem" } }, "+")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 1.25rem 1rem", fontSize: "0.85rem", color: "#4b5563", lineHeight: 1.7 } }, a))))), /* @__PURE__ */ React.createElement("section", { ref: refs.about, style: { padding: "5rem 0", background: "#0a0f1e", color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 2rem" } }, /* @__PURE__ */ React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c47a2a", marginBottom: "0.75rem" } }, "About Us"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.25rem" } }, "Specialist AI consultancy.", /* @__PURE__ */ React.createElement("br", null), "Built for the real world."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.92rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "1rem" } }, "AgenTek Labs works with enterprise clients in regulated industries to move AI from experimentation into production. Safely, at scale, and without vendor lock-in."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.92rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 } }, "Deep expertise across cloud-native systems, agentic AI, and complex integration landscapes. Embedded partners, not outsourced resources."), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" } }, "UK-based. Globally delivered.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c47a2a", marginBottom: "0.75rem" } }, "Get in Touch"), /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.25rem" } }, "Let's Talk"), /* @__PURE__ */ React.createElement(ContactForm, { dark: true }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textAlign: "center" } }, "Or email ", /* @__PURE__ */ React.createElement("a", { href: "mailto:hello@agentek.co.uk", style: { color: "#c47a2a", textDecoration: "none", fontWeight: 600 } }, "hello@agentek.co.uk"))))))), /* @__PURE__ */ React.createElement("footer", { style: { padding: "1.5rem 2rem", background: isHome ? "#0a0f1e" : "#fff", borderTop: isHome ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.06)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.72rem", color: isHome ? "rgba(255,255,255,0.25)" : "#9ca3af", lineHeight: 1.5 } }, "\xA9 2026 AgenTek Labs Limited \xB7 Registered in England & Wales, No. 17041966"), /* @__PURE__ */ React.createElement("a", { href: "mailto:hello@agentek.co.uk", style: { fontSize: "0.72rem", color: isHome ? "rgba(255,255,255,0.4)" : "#64748b", textDecoration: "none" } }, "hello@agentek.co.uk"))));
}
export {
  AgenTekV3 as default
};
