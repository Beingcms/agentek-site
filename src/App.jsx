import { useState, useRef, useEffect } from "react";

// ═══════════════════ SITE DATA ═══════════════════
const CASE_STUDIES = [
  {
    industry: "Financial Services",
    tag: "Contact Centre AI",
    metric: "40% faster",
    problem: "Legacy contact centre with high handling times and inconsistent compliance.",
    solution: "Voice AI with intelligent triage, real-time context surfacing, and compliance prompts.",
    stack: ["AWS Connect", "Bedrock", "Kinesis"],
    outcome: "40% reduction in average handling time, consistent compliance audit trail",
  },
  {
    industry: "Professional Services",
    tag: "Document Intelligence",
    metric: "Days → Minutes",
    problem: "Manual document querying with PII exposure risk to third-party services.",
    solution: "Azure-based copilot with secure ingestion, RAG layer, and Purview governance.",
    stack: ["Azure AI", "Databricks", "Purview"],
    outcome: "Zero PII exposure, HR queries resolved in minutes, complete data lineage",
  },
  {
    industry: "Enterprise Retail",
    tag: "Data Platform",
    metric: "Weeks → Hours",
    problem: "Fragmented analytics across hundreds of branches, no unified data strategy.",
    solution: "Serverless medallion architecture consolidating legacy databases.",
    stack: ["AWS S3", "Glue", "Athena", "Delta Lake"],
    outcome: "Single source of truth, reporting cycle weeks to hours, self-serve analytics",
  },
  {
    industry: "Healthcare",
    tag: "Clinical Workflows",
    metric: "5 days → Same day",
    problem: "Manual patient referral processing with compliance and verification gaps.",
    solution: "Governed agent workflow with human-in-the-loop at clinical decision points.",
    stack: ["HL7/FHIR", "AWS", "Salesforce", "Eval Framework"],
    outcome: "Referral processing same-day, 100% clinical review, full audit trail",
  },
  {
    industry: "Logistics",
    tag: "Route Optimization",
    metric: "20% efficiency",
    problem: "Inefficient route planning across multiple depots and complex constraints.",
    solution: "AI agent orchestrating real-time optimization with driver preferences.",
    stack: ["AWS", "Optimization Engine", "Mobile Integration"],
    outcome: "20% fuel savings, driver satisfaction up, on-time delivery improved",
  },
];

const INDUSTRIES = [
  { id: "insurance", label: "Insurance", icon: "🛡", color: "#2563EB" },
  { id: "finance", label: "Finance", icon: "🏦", color: "#2563EB" },
  { id: "enterprise", label: "Enterprise", icon: "🏢", color: "#06B6D4" },
  { id: "healthcare", label: "Healthcare", icon: "🏥", color: "#2563EB" },
  { id: "professional_services", label: "Professional Services", icon: "📊", color: "#F97316" },
  { id: "logistics", label: "Logistics", icon: "🚚", color: "#06B6D4" },
];

const EXAMPLES = {
  insurance: { desc: "Claims take 2 weeks. We review docs, check coverage, run fraud checks, then approve or deny.", steps: [
    { name: "Claim Intake", type: "manual", pain: "Manual data entry from multiple channels" },
    { name: "Document Collection", type: "manual", pain: "Chasing missing documents" },
    { name: "Coverage Check", type: "semi", pain: "Complex policy interpretation" },
    { name: "Fraud Assessment", type: "semi", pain: "Manual review of flagged items" },
    { name: "Adjudication", type: "manual", pain: "Senior adjuster bottleneck" },
    { name: "Settlement", type: "semi", pain: "Calculation errors, delays" },
  ]},
  finance: { desc: "KYC team manually reviews ID docs, runs sanctions checks, scores risk. 48hrs per application.", steps: [
    { name: "Application Receipt", type: "manual", pain: "Multiple formats, incomplete data" },
    { name: "Doc Classification", type: "manual", pain: "Manual sorting errors" },
    { name: "Data Extraction", type: "semi", pain: "OCR errors on handwritten docs" },
    { name: "Sanctions Screening", type: "semi", pain: "False positives need review" },
    { name: "Risk Scoring", type: "manual", pain: "Inconsistent between analysts" },
    { name: "Approval", type: "manual", pain: "Approval bottleneck" },
  ]},
  enterprise: { desc: "IT tickets queue up. Someone reads each, categorises, assigns priority, routes to the right team.", steps: [
    { name: "Ticket Receipt", type: "auto", pain: "Multiple intake channels" },
    { name: "Classification", type: "manual", pain: "Inconsistent categorisation" },
    { name: "Priority Assessment", type: "manual", pain: "Subjective prioritisation" },
    { name: "Assignment", type: "manual", pain: "Workload imbalance" },
    { name: "Resolution", type: "semi", pain: "Knowledge scattered across teams" },
  ]},
  healthcare: { desc: "Patient referrals come by fax/email. Staff enter data, check insurance, schedule, coordinate.", steps: [
    { name: "Referral Receipt", type: "manual", pain: "Fax-based, manual entry" },
    { name: "Data Entry", type: "manual", pain: "Transcription errors" },
    { name: "Insurance Check", type: "semi", pain: "Phone-based verification" },
    { name: "Clinical Review", type: "manual", pain: "Clinician time bottleneck" },
    { name: "Scheduling", type: "manual", pain: "Availability conflicts" },
    { name: "Notification", type: "manual", pain: "Missed confirmations" },
  ]},
  professional_services: { desc: "Document review, contract analysis, research synthesis. Manual and time-consuming.", steps: [
    { name: "Document Intake", type: "manual", pain: "Multiple formats and sources" },
    { name: "Initial Classification", type: "manual", pain: "Manual sorting and tagging" },
    { name: "Content Analysis", type: "semi", pain: "Time-consuming human review" },
    { name: "Risk & Compliance Check", type: "manual", pain: "Regulatory compliance review" },
    { name: "Summary & Recommendation", type: "semi", pain: "Report generation delays" },
  ]},
  logistics: { desc: "Route planning, scheduling, optimization across multiple depots with constraints.", steps: [
    { name: "Order Intake", type: "auto", pain: "Multiple order channels" },
    { name: "Route Planning", type: "manual", pain: "Manual assignment to routes" },
    { name: "Driver Scheduling", type: "manual", pain: "Preference conflicts" },
    { name: "Optimization", type: "semi", pain: "Time/fuel vs. SLA tradeoffs" },
    { name: "Execution Tracking", type: "semi", pain: "Real-time adjustments needed" },
  ]},
};

const CAPABILITY_QS = [
  { id: "docs", q: "Does your workflow involve documents or files?", example: "Claim forms, ID documents, contracts, medical records", icon: "📄", tools: ["parser"] },
  { id: "rules", q: "Are there compliance or regulatory rules to enforce?", example: "FCA regulations, HIPAA, KYC/AML, SLA thresholds", icon: "🛡", tools: ["rules", "auditlog"] },
  { id: "integrate", q: "Does this need to connect to existing systems?", example: "Salesforce, SAP, EHR, ITSM, payment platforms", icon: "🔗", tools: ["integrator"] },
  { id: "notify", q: "Should people be notified at certain stages?", example: "Email alerts, Slack messages, SMS updates", icon: "📨", tools: ["notifier"] },
  { id: "learn", q: "Should the agent learn from past decisions?", example: "Pattern recognition, historical resolution matching", icon: "🧠", tools: ["vectordb"] },
];

const TOOL_NAMES = {
  parser: "Document Parser", rules: "Rules Engine", auditlog: "Audit Logger",
  integrator: "Integration Gateway", notifier: "Notification Service", vectordb: "Knowledge Store",
};

function getEvalTests(industry) {
  const tests = {
    insurance: [
      { name: "Complete claim with all documents", explain: "A standard claim comes in with every required document attached.", type: "pass", delay: 800 },
      { name: "Claim missing a required document", explain: "The agent should pause and request the missing document, not guess.", type: "pass", delay: 1400 },
      { name: "Two documents contradict each other", explain: "Date of incident differs between the claim form and police report.", type: "warn", delay: 2000 },
      { name: "Someone submits a suspicious claim", explain: "Patterns match known fraud indicators. Agent should flag, not auto-approve.", type: "pass", delay: 2600 },
      { name: "Claim sits right on the coverage limit", explain: "Borderline case. Agent needs to handle ambiguity rather than force a decision.", type: "warn", delay: 3200 },
      { name: "100 claims arrive at the same time", explain: "Can the agent handle a sudden spike without dropping or duplicating claims?", type: "pass", delay: 3800 },
      { name: "Someone tries to manipulate the system", explain: "Unusual input patterns designed to trick the agent into wrong decisions.", type: "pass", delay: 4300 },
      { name: "External system goes offline mid-process", explain: "The fraud database is unreachable. Agent should wait and retry, not skip the check.", type: "fail", delay: 4800 },
      { name: "Recovery after the outage resolves", explain: "Once the system comes back, pending claims should resume, not start over.", type: "pass", delay: 5400 },
    ],
    finance: [
      { name: "Standard identity verification", explain: "Clean passport photo, matching address proof. The happy path.", type: "pass", delay: 800 },
      { name: "Customer uploads wrong document type", explain: "A bank statement instead of proof of address. Agent should ask for the right one.", type: "pass", delay: 1400 },
      { name: "Name spelling differs between documents", explain: "Is this a typo or a different person? Agent needs to flag, not auto-reject.", type: "warn", delay: 2000 },
      { name: "Potential sanctions list match", explain: "Common name partially matches a sanctioned individual. Needs careful handling.", type: "pass", delay: 2600 },
      { name: "Customer from a high-risk jurisdiction", explain: "Extra due diligence required. Agent must apply enhanced checks automatically.", type: "warn", delay: 3200 },
      { name: "50 applications arrive simultaneously", explain: "Month-end rush. Agent needs to process without degrading quality.", type: "pass", delay: 3800 },
      { name: "Fraudulent document submitted", explain: "A manipulated passport image. Agent should detect inconsistencies.", type: "pass", delay: 4300 },
      { name: "Sanctions database goes offline", explain: "Can't verify against sanctions. Agent must NOT approve. It should wait.", type: "fail", delay: 4800 },
      { name: "Processing resumes after recovery", explain: "Queued applications should pick up where they left off.", type: "pass", delay: 5400 },
    ],
    enterprise: [
      { name: "Standard IT ticket with clear description", explain: "User reports 'email not syncing on phone'. Straightforward categorisation.", type: "pass", delay: 800 },
      { name: "Ticket with no useful description", explain: "'It's broken'. Agent needs to ask follow-up questions, not guess.", type: "pass", delay: 1400 },
      { name: "Ticket that could fit two categories", explain: "Network issue or application issue? Agent should pick best match and explain why.", type: "warn", delay: 2000 },
      { name: "VIP user reports a critical issue", explain: "CEO can't access the board deck. SLA and priority rules should auto-escalate.", type: "pass", delay: 2600 },
      { name: "Duplicate ticket from the same user", explain: "User submitted twice. Agent should detect and merge, not create two.", type: "warn", delay: 3200 },
      { name: "200 tickets flood in during an outage", explain: "Major incident creates a wave. Agent should detect the pattern and group them.", type: "pass", delay: 3800 },
      { name: "User tries to escalate their own priority", explain: "'URGENT!!!' in the subject. Agent should assess impact, not follow shouting.", type: "pass", delay: 4300 },
      { name: "Routing system is temporarily unavailable", explain: "Can't assign tickets. Agent should queue them safely, not drop them.", type: "fail", delay: 4800 },
      { name: "Queued tickets route after recovery", explain: "Backlog clears in priority order once routing is back.", type: "pass", delay: 5400 },
    ],
    healthcare: [
      { name: "Standard patient referral with complete info", explain: "GP refers patient to specialist with full clinical notes.", type: "pass", delay: 800 },
      { name: "Referral missing insurance information", explain: "Agent should flag and request, not schedule without coverage confirmation.", type: "pass", delay: 1400 },
      { name: "Clinical notes suggest two possible specialties", explain: "Could be cardiology or pulmonology. Agent should surface both options.", type: "warn", delay: 2000 },
      { name: "Urgent referral flagged by GP", explain: "Suspected cancer referral. Must be fast-tracked within 2-week wait rules.", type: "pass", delay: 2600 },
      { name: "Patient has conflicting appointment preferences", explain: "Requested morning but only evening slots available. Needs human coordination.", type: "warn", delay: 3200 },
      { name: "30 referrals arrive from one GP practice", explain: "Batch referral from a closing practice. System should handle without delays.", type: "pass", delay: 3800 },
      { name: "Referral contains sensitive safeguarding note", explain: "Agent must handle PHI with extra care and restrict access appropriately.", type: "pass", delay: 4300 },
      { name: "EHR system goes offline during processing", explain: "Can't read patient records. Agent must pause, NOT proceed without clinical data.", type: "fail", delay: 4800 },
      { name: "Paused referrals resume after EHR recovery", explain: "Referrals pick up from where they stopped with full context preserved.", type: "pass", delay: 5400 },
    ],
    professional_services: [
      { name: "Standard contract review request", explain: "Complete document, all relevant context provided.", type: "pass", delay: 800 },
      { name: "Document missing key sections", explain: "Agent should identify gaps and request clarification.", type: "pass", delay: 1400 },
      { name: "Conflicting terms across document", explain: "Clause A contradicts Clause B. Agent should flag for human review.", type: "warn", delay: 2000 },
      { name: "Potential compliance issue detected", explain: "Unusual clause that might violate regulations. Agent flags for review.", type: "pass", delay: 2600 },
      { name: "Multiple stakeholder versions submitted", explain: "Different versions from client and opposing party. Agent should merge properly.", type: "warn", delay: 3200 },
      { name: "Batch of 50 documents in one request", explain: "High volume. Agent should prioritise by risk and complexity.", type: "pass", delay: 3800 },
      { name: "Attempt to sneak unfamiliar clause in", explain: "New language not in standard templates. Agent should detect it.", type: "pass", delay: 4300 },
      { name: "Internal knowledge system offline", explain: "Can't access precedent library. Agent should safely queue, not guess.", type: "fail", delay: 4800 },
      { name: "Queued documents processed after recovery", explain: "System resumes with full context, no lost work.", type: "pass", delay: 5400 },
    ],
    logistics: [
      { name: "Standard order batch to optimize", explain: "Clear addresses, standard delivery windows.", type: "pass", delay: 800 },
      { name: "Order with missing delivery details", explain: "Agent should request clarification, not guess address.", type: "pass", delay: 1400 },
      { name: "Two orders to same location, different times", explain: "Agent should consolidate or flag efficiency opportunity.", type: "warn", delay: 2000 },
      { name: "Urgent priority order arrives", explain: "Time-sensitive. Agent reprioritises and adjusts routes.", type: "pass", delay: 2600 },
      { name: "Driver has scheduling preference conflict", explain: "Preferred route conflicts with pickup time. Agent resolves.", type: "warn", delay: 3200 },
      { name: "Massive order spike during peak", explain: "500 orders in one batch. Can system scale and maintain SLAs?", type: "pass", delay: 3800 },
      { name: "Attempt to add unrealistic constraints", explain: "Same day delivery to remote location. Agent should flag feasibility.", type: "pass", delay: 4300 },
      { name: "Route optimization service temporarily down", explain: "Can't calculate optimal routes. Agent queues safely.", type: "fail", delay: 4800 },
      { name: "Orders resume routing after recovery", explain: "System continues from where it paused with no duplicates.", type: "pass", delay: 5400 },
    ],
  };
  return tests[industry] || tests.enterprise;
}

const COLORS = {
  manual: { bg: "#FEE2E2", border: "#FECACA", text: "#DC2626", label: "Manual" },
  semi: { bg: "#FEF3C7", border: "#FDE047", text: "#CA8A04", label: "Semi-auto" },
  auto: { bg: "#DCFCE7", border: "#86EFAC", text: "#16A34A", label: "Automated" },
};

// ═══════════════════ GLOBAL STYLES ═══════════════════
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes drawLine{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
@keyframes hitRight{0%{transform:translateX(-40px);opacity:0}60%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:1}}
@keyframes resultPop{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
`;

// ═══════════════════ COMPONENTS ═══════════════════
function SiteLogo({ size = 32, light }) {
  const navy = light ? "#8ba4db" : "#1e3a7a";
  const blue = light ? "#93b4f5" : "#2563EB";
  return <svg width={size} height={size} viewBox="0 0 50 50" fill="none"><path d="M8 46 C12 34, 17 25, 22 18 C24 14, 25 10, 25 6" stroke={navy} strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M42 46 C38 34, 33 25, 28 18 C26 14, 25 10, 25 6" stroke="#F97316" strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M25 46 C25 34, 25 25, 25 18 C25 14, 25 10, 25 6" stroke={blue} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" /><circle cx="25" cy="6" r="3" fill="#F97316" opacity="0.3" /></svg>;
}

function ProgressBar({ stage, total }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "2rem" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= stage ? "#2563EB" : "#E5E7EB", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

function StageTitle({ num, title, sub }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", color: "#2563EB", marginBottom: "0.3rem" }}>STAGE {num} OF 7</div>
      <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "0.5rem" }}>{title}</h2>
      {sub && <p style={{ fontSize: "0.95rem", color: "#64748B", marginTop: "0.35rem", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

// ═══════════════════ FLOW DIAGRAM (Card-based) ═══════════════════
function FlowDiagram({ steps, animatedCount, checkpoints, onToggleCheckpoint }) {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
      {/* Left: Flow steps */}
      <div style={{ flex: "1 1 480px", minWidth: 300 }}>
        {steps.map((step, i) => {
          if (i >= animatedCount) return null;
          const tc = COLORS[step.type] || COLORS.manual;
          const isCP = checkpoints?.includes(i);
          const isHovered = hoveredStep === i;
          const delay = i * 0.12;

          return (
            <div key={i} style={{ animation: `slideUp 0.4s ${delay}s ease-out both` }}>
              {/* Connector line */}
              {i > 0 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "0.15rem 0" }}>
                  <div style={{ width: 2, height: 20, background: "linear-gradient(to bottom, #CBD5E1, #E2E8F0)", borderRadius: 1 }} />
                </div>
              )}

              {/* Step card */}
              <div
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  position: "relative",
                  display: "flex", alignItems: "center", gap: "1rem",
                  background: isHovered ? "#fff" : "#FAFBFF",
                  border: `2px solid ${isCP ? "#F97316" : isHovered ? "#2563EB" : "rgba(0,0,0,0.07)"}`,
                  borderRadius: 14, padding: "1.1rem 1.25rem",
                  transition: "all 0.25s ease",
                  boxShadow: isHovered ? "0 8px 30px rgba(37,99,235,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                  borderStyle: isCP ? "dashed" : "solid",
                  cursor: onToggleCheckpoint ? "pointer" : "default",
                }}
                onClick={() => onToggleCheckpoint && onToggleCheckpoint(i)}
              >
                {/* Step number */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: tc.bg, border: `2px solid ${tc.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", fontWeight: 700, color: tc.text, flexShrink: 0,
                }}>
                  {i + 1}
                </div>

                {/* Step info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0F172A" }}>{step.name}</span>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 600, padding: "0.15rem 0.55rem",
                      borderRadius: 5, background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`,
                      flexShrink: 0,
                    }}>{tc.label}</span>
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "#64748B", lineHeight: 1.4 }}>⚠ {step.pain}</div>
                </div>

                {/* Checkpoint toggle */}
                {onToggleCheckpoint && (
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: isCP ? "#F97316" : isHovered ? "#F1F5F9" : "#F8FAFC",
                    border: `2px solid ${isCP ? "#F97316" : "#E2E8F0"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isCP ? "1.1rem" : "1.3rem", color: isCP ? "#fff" : "#94A3B8",
                    flexShrink: 0, transition: "all 0.2s", fontWeight: 700,
                  }}>
                    {isCP ? "👁" : "+"}
                  </div>
                )}

                {/* Human checkpoint badge */}
                {isCP && (
                  <div style={{
                    position: "absolute", top: -10, right: 12,
                    fontSize: "0.68rem", fontWeight: 700, color: "#F97316",
                    background: "rgba(249,115,22,0.1)", padding: "0.15rem 0.5rem",
                    borderRadius: 4, border: "1px solid rgba(249,115,22,0.2)",
                    animation: "popIn 0.3s ease-out",
                  }}>
                    HUMAN REVIEW
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Detail panel (desktop only) */}
      <div className="desk" style={{ flex: "0 0 280px", position: "sticky", top: 20 }}>
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
          padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", marginBottom: "1rem" }}>WORKFLOW SUMMARY</div>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, textAlign: "center", padding: "0.75rem", background: "#FEF2F2", borderRadius: 10 }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#DC2626" }}>{steps.filter(s => s.type === "manual").length}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#DC2626" }}>Manual</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "0.75rem", background: "#FEFCE8", borderRadius: 10 }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#CA8A04" }}>{steps.filter(s => s.type === "semi").length}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#CA8A04" }}>Semi-auto</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "0.75rem", background: "#ECFDF5", borderRadius: 10 }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16A34A" }}>{steps.filter(s => s.type === "auto").length}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#16A34A" }}>Auto</div>
            </div>
          </div>

          <div style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.65 }}>
            {hoveredStep !== null ? (
              <div style={{ animation: "slideUp 0.2s ease-out" }}>
                <div style={{ fontWeight: 600, color: "#0F172A", marginBottom: "0.35rem", fontSize: "1rem" }}>
                  Step {hoveredStep + 1}: {steps[hoveredStep]?.name}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 600, color: "#F97316" }}>Pain point:</span> {steps[hoveredStep]?.pain}
                </div>
                <div style={{
                  fontSize: "0.78rem", fontWeight: 600, padding: "0.2rem 0.6rem",
                  borderRadius: 5, display: "inline-block",
                  background: COLORS[steps[hoveredStep]?.type]?.bg,
                  color: COLORS[steps[hoveredStep]?.type]?.text,
                  border: `1px solid ${COLORS[steps[hoveredStep]?.type]?.border}`,
                }}>
                  {COLORS[steps[hoveredStep]?.type]?.label}
                </div>
              </div>
            ) : (
              <div>Hover over a step to see details. Click <strong>+</strong> to add human checkpoints where your team should review the agent's work.</div>
            )}
          </div>

          {checkpoints.length > 0 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F97316", marginBottom: "0.35rem" }}>👁 {checkpoints.length} HUMAN CHECKPOINT{checkpoints.length > 1 ? "S" : ""}</div>
              <div style={{ fontSize: "0.82rem", color: "#64748B" }}>These become governance gates in your agent.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════ CAPABILITY BUILDER ═══════════════════
function CapabilityBuilder({ answers, onAnswer }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed < CAPABILITY_QS.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), 400);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  const derivedTools = [];
  CAPABILITY_QS.forEach(cq => { if (answers[cq.id]) cq.tools.forEach(t => { if (!derivedTools.includes(t)) derivedTools.push(t); }); });

  return (
    <div>
      {CAPABILITY_QS.slice(0, revealed).map((cq, i) => {
        const answered = answers[cq.id] !== undefined;
        const yes = answers[cq.id] === true;
        return (
          <div key={cq.id} style={{
            background: "#fff", borderRadius: 14, border: `1.5px solid ${answered ? (yes ? "#2563EB20" : "rgba(0,0,0,0.05)") : "rgba(37,99,235,0.2)"}`,
            padding: "1rem", marginBottom: "0.8rem",
            animation: `slideUp 0.35s ease-out`,
            opacity: answered && !yes ? 0.6 : 1, transition: "opacity 0.3s",
          }}>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: "0.1rem" }}>{cq.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.4, marginBottom: "0.25rem" }}>{cq.q}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.4 }}>e.g. {cq.example}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", marginLeft: "2.2rem" }}>
              <button onClick={() => onAnswer(cq.id, true)}
                style={{ flex: 1, padding: "0.6rem", borderRadius: 8, border: `1.5px solid ${yes ? "#16A34A" : "rgba(0,0,0,0.08)"}`, background: yes ? "#DCFCE7" : "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", fontWeight: yes ? 600 : 500, color: yes ? "#16A34A" : "#64748B", transition: "all 0.2s" }}>
                Yes
              </button>
              <button onClick={() => onAnswer(cq.id, false)}
                style={{ flex: 1, padding: "0.6rem", borderRadius: 8, border: `1.5px solid ${answered && !yes ? "#64748B" : "rgba(0,0,0,0.08)"}`, background: answered && !yes ? "#F1F5F9" : "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", fontWeight: answered && !yes ? 600 : 500, color: answered && !yes ? "#64748B" : "#94A3B8", transition: "all 0.2s" }}>
                No
              </button>
            </div>
            {yes && (
              <div style={{ marginTop: "0.65rem", marginLeft: "2.2rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", animation: "popIn 0.25s ease-out" }}>
                {cq.tools.map(tid => (
                  <span key={tid} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 5, background: "rgba(37,99,235,0.08)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.15)" }}>
                    + {TOOL_NAMES[tid]}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {derivedTools.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: "1rem", marginTop: "0.35rem", animation: "slideUp 0.3s ease-out" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", marginBottom: "0.65rem" }}>YOUR AGENT WILL USE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {derivedTools.map((tid, i) => (
              <span key={tid} style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.9rem", fontWeight: 600, padding: "0.4rem 0.75rem", borderRadius: 7,
                background: "#2563EB10", color: "#2563EB", border: "1px solid rgba(37,99,235,0.15)",
                animation: `popIn 0.25s ${i * 0.08}s ease-out both`,
              }}>
                {TOOL_NAMES[tid]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════ STRESS TEST ═══════════════════
function StressTest({ industry, onComplete }) {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState({ pass: 0, warn: 0, fail: 0 });
  const [expanded, setExpanded] = useState(null);
  const tests = getEvalTests(industry);

  useEffect(() => {
    const timers = tests.map((test, i) =>
      setTimeout(() => {
        setResults(r => [...r, test]);
        setScore(s => ({ ...s, [test.type]: s[test.type] + 1 }));
        if (i === tests.length - 1) {
          setTimeout(() => { setRunning(false); if (onComplete) onComplete(); }, 800);
        }
      }, test.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const total = results.length;
  const pct = Math.round((total / tests.length) * 100);
  const statusColors = { pass: "#16A34A", warn: "#CA8A04", fail: "#DC2626" };
  const statusIcons = { pass: "✓", warn: "⚠", fail: "✗" };
  const statusLabels = { pass: "HANDLED", warn: "FLAGGED", fail: "BLOCKED" };

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{running ? "Simulating real scenarios..." : "All scenarios tested"}</span>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#2563EB" }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #2563EB, #F97316)", borderRadius: 4, width: `${pct}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.65rem", marginBottom: "1.25rem" }}>
        {[["pass", "Handled"], ["warn", "Flagged"], ["fail", "Blocked"]].map(([k, l]) => (
          <div key={k} style={{ flex: 1, padding: "0.8rem", borderRadius: 10, background: `${statusColors[k]}10`, border: `1.5px solid ${statusColors[k]}25`, textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: statusColors[k] }}>{score[k]}</div>
            <div style={{ fontSize: "0.8rem", color: statusColors[k], fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6, padding: "0.8rem 1rem", background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", marginBottom: "1rem" }}>
        <span style={{ color: "#16A34A", fontWeight: 600 }}>Handled</span> = agent processed correctly · <span style={{ color: "#CA8A04", fontWeight: 600 }}>Flagged</span> = agent escalated to a human · <span style={{ color: "#DC2626", fontWeight: 600 }}>Blocked</span> = agent needs a fallback plan
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, background: "#FAFBFC", overflow: "hidden" }}>
        {results.map((r, i) => {
          const isExp = expanded === i;
          return (
            <div key={i} onClick={() => setExpanded(isExp ? null : i)}
              style={{
                padding: "0.8rem 1rem",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                animation: "hitRight 0.35s ease-out",
                cursor: "pointer", background: isExp ? "#fff" : "transparent",
                transition: "background 0.2s",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `${statusColors[r.type]}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 700, color: statusColors[r.type],
                  flexShrink: 0, animation: "resultPop 0.2s ease-out",
                }}>{statusIcons[r.type]}</div>
                <div style={{ flex: 1, fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.4 }}>{r.name}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: statusColors[r.type], flexShrink: 0 }}>{statusLabels[r.type]}</div>
              </div>
              {isExp && (
                <div style={{ marginTop: "0.6rem", marginLeft: "2.65rem", fontSize: "0.88rem", color: "#64748B", lineHeight: 1.6, animation: "slideUp 0.2s ease-out" }}>
                  {r.explain}
                </div>
              )}
            </div>
          );
        })}
        {running && (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            <div style={{ width: 20, height: 20, border: "2.5px solid #E5E7EB", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════ ORCHESTRATION DIAGRAM ═══════════════════
function OrchDiagram({ agents }) {
  const W = 700, H = 320, cx = W / 2, cy = H / 2;
  const r = 130;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 700, height: "auto", display: "block", margin: "0 auto" }}>
      <defs>
        <marker id="oa" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="6" markerHeight="4" orient="auto"><path d="M0 0L10 3.5 0 7z" fill="#2563EB" opacity="0.4"/></marker>
        <filter id="os"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12"/></filter>
      </defs>

      <g style={{ animation: "popIn 0.5s ease-out" }}>
        <circle cx={cx} cy={cy} r={40} fill="#8B5CF6" opacity="0.1" stroke="#8B5CF6" strokeWidth="2" />
        <text x={cx} y={cy - 5} textAnchor="middle" style={{ fontSize: "10px", fontWeight: 700, fill: "#8B5CF6", fontFamily: "'Inter',sans-serif" }}>ORCHESTRATOR</text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: "8px", fill: "#8B5CF6", fontFamily: "'Inter',sans-serif", opacity: 0.7 }}>State Machine</text>
      </g>

      {agents.map((a, i) => {
        const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
        const ax = cx + Math.cos(angle) * r;
        const ay = cy + Math.sin(angle) * r;
        const isHuman = a.type === "human";
        const colors = { worker: "#2563EB", validator: "#CA8A04", gateway: "#16A34A", human: "#F97316" };
        const c = colors[a.type] || "#2563EB";

        const lineEndX = cx + Math.cos(angle) * 48;
        const lineEndY = cy + Math.sin(angle) * 48;
        const lineStartX = ax - Math.cos(angle) * 35;
        const lineStartY = ay - Math.sin(angle) * 35;

        return (
          <g key={i} style={{ animation: `popIn 0.4s ${0.3 + i * 0.12}s ease-out both` }}>
            <line x1={lineEndX} y1={lineEndY} x2={lineStartX} y2={lineStartY}
              stroke={c} strokeWidth="1.25" opacity="0.3" strokeDasharray="5 3" markerEnd="url(#oa)" />

            <rect x={ax - 56} y={ay - 26} width={112} height={52} rx={10}
              fill="white" stroke={c} strokeWidth={isHuman ? 2.5 : 2}
              strokeDasharray={isHuman ? "6 4" : "none"} filter="url(#os)" />

            <text x={ax} y={ay - 6} textAnchor="middle"
              style={{ fontSize: "10px", fontWeight: 600, fill: "#0F172A", fontFamily: "'Inter',sans-serif" }}>{a.name}</text>
            <text x={ax} y={ay + 10} textAnchor="middle"
              style={{ fontSize: "8.5px", fill: c, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{a.role}</text>

            {isHuman && (
              <g>
                <rect x={ax + 28} y={ay - 26} width={26} height={16} rx={4} fill="#F97316" />
                <text x={ax + 41} y={ay - 12} textAnchor="middle"
                  style={{ fontSize: "6.5px", fontWeight: 700, fill: "white", fontFamily: "'Inter',sans-serif" }}>H</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════ AGENT BUILDER ═══════════════════
function AgentBuilderInline({ onCTA }) {
  const [stage, setStage] = useState(0);
  const [industry, setIndustry] = useState(null);
  const [steps, setSteps] = useState([]);
  const [animCount, setAnimCount] = useState(0);
  const [checkpoints, setCheckpoints] = useState([]);
  const [capAnswers, setCapAnswers] = useState({});

  const activeTools = [];
  CAPABILITY_QS.forEach(cq => { if (capAnswers[cq.id]) cq.tools.forEach(t => { if (!activeTools.includes(t)) activeTools.push(t); }); });
  const [evalsComplete, setEvalsComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [archCloud, setArchCloud] = useState("aws");

  const pb = { display: "block", width: "100%", padding: "1rem", background: "#2563EB", color: "#fff", borderRadius: 10, fontSize: "1rem", fontWeight: 600, fontFamily: "'Inter',sans-serif", border: "none", cursor: "pointer", textAlign: "center" };
  const pbOff = { ...pb, opacity: 0.5, cursor: "default" };

  useEffect(() => {
    if (stage === 1 && animCount < steps.length) {
      const t = setTimeout(() => setAnimCount(c => c + 1), 300);
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
    setCheckpoints(cp => cp.includes(idx) ? cp.filter(i => i !== idx) : [...cp, idx]);
  };

  const answerCap = (id, val) => setCapAnswers(a => ({ ...a, [id]: val }));

  const getAgents = () => {
    const base = [
      { name: "Intake Agent", role: "Parse & validate", type: "gateway" },
      { name: "Processing Agent", role: "Core workflow", type: "worker" },
      { name: "Validator", role: "Quality checks", type: "validator" },
    ];
    if (checkpoints.length > 0) base.push({ name: "Human Gate", role: "Review & approve", type: "human" });
    if (activeTools.includes("rules")) base.push({ name: "Policy Agent", role: "Rule enforcement", type: "validator" });
    return base;
  };

  // ── Stage 0: Industry selection ──
  if (stage === 0) return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "2rem" }}>
          <SiteLogo /><div><div style={{ fontWeight: 700, fontSize: "1.05rem" }}>AgenTek <span style={{ color: "#9CA3AF", fontWeight: 400 }}>Labs</span></div><div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", color: "#F97316" }}>AGENT BUILDER</div></div>
        </div>
        <ProgressBar stage={0} total={7} />
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.7rem" }}>
            Build your AI agent <em style={{ fontStyle: "italic", color: "#2563EB" }}>visually</em>
          </h1>
          <p style={{ color: "#4B5563", fontSize: "1.05rem", lineHeight: 1.7 }}>Pick your industry. Watch the agent assemble step by step.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {INDUSTRIES.map((ind, i) => (
            <button key={ind.id} onClick={() => selectIndustry(ind.id)}
              style={{
                padding: "1.5rem 1rem", borderRadius: 14,
                border: "2px solid rgba(0,0,0,0.08)", background: "#fff",
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
                textAlign: "center", animation: `slideUp 0.3s ${i * 0.08}s ease-out both`,
                transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = ind.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"}>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>{ind.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{ind.label}</div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.2rem" }}>{EXAMPLES[ind.id].steps.length} steps</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Stage 1: Workflow flow diagram ──
  if (stage === 1) return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <ProgressBar stage={1} total={7} />
        <StageTitle num="1" title="Your workflow, mapped" sub="Each step appeared as we analysed your process. Tap + to add human checkpoints." />

        <FlowDiagram steps={steps} animatedCount={animCount} checkpoints={checkpoints} onToggleCheckpoint={animCount >= steps.length ? toggleCheckpoint : null} />

        {animCount >= steps.length && (
          <div style={{ animation: "slideUp 0.4s ease-out", marginTop: "1.5rem" }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: "1.1rem", marginBottom: "1.1rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F97316", marginBottom: "0.4rem" }}>👁 HUMAN CHECKPOINTS: {checkpoints.length}</div>
              <div style={{ fontSize: "0.95rem", color: "#64748B" }}>
                {checkpoints.length === 0
                  ? "Tap the + buttons on the right side of each step to mark where humans should review."
                  : `${checkpoints.length} checkpoint${checkpoints.length > 1 ? "s" : ""} set. These become governance gates in your agent.`}
              </div>
            </div>
            <button onClick={() => setStage(2)} style={pb}>Continue to Agent Assembly →</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Stage 2: Capability questions ──
  const allAnswered = Object.keys(capAnswers).length >= CAPABILITY_QS.length;
  if (stage === 2) return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <ProgressBar stage={2} total={7} />
        <StageTitle num="2" title="What does your agent need?" sub="Answer 5 questions. We'll assemble the right capabilities automatically." />

        <CapabilityBuilder answers={capAnswers} onAnswer={answerCap} />

        {allAnswered && (
          <button onClick={() => setStage(3)} style={{ ...pb, marginTop: "1.5rem" }}>
            Stress Test Your Agent →
          </button>
        )}
      </div>
    </div>
  );

  // ── Stage 3: Eval stress test ──
  if (stage === 3) return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <ProgressBar stage={3} total={7} />
        <StageTitle num="3" title="Can your agent handle the real world?" sub="We're throwing 9 real business scenarios at your agent. Tap any result to see what happened." />

        <StressTest industry={industry} onComplete={() => setEvalsComplete(true)} />

        {evalsComplete && (
          <div style={{ animation: "slideUp 0.4s ease-out", marginTop: "1.5rem" }}>
            <div style={{ background: "#DCFCE7", borderRadius: 12, padding: "1.1rem", border: "1.5px solid #86EFAC", marginBottom: "1.1rem", textAlign: "center" }}>
              <div style={{ fontWeight: 600, color: "#16A34A", fontSize: "1rem" }}>Your agent handled 7 out of 9 scenarios</div>
              <div style={{ fontSize: "0.9rem", color: "#15803D", marginTop: "0.2rem" }}>The 2 flagged items get escalated to a human. The 1 blocked scenario needs a fallback. That's what governance is for.</div>
            </div>
            <button onClick={() => setStage(4)} style={pb}>See Orchestration →</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Stage 4: Orchestration ──
  if (stage === 4) {
    const agents = getAgents();
    return (
      <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ProgressBar stage={4} total={7} />
          <StageTitle num="4" title="Multi-agent orchestration" sub="Your single workflow has split into specialist agents. The orchestrator coordinates them all." />

          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", padding: "1rem", marginBottom: "1.5rem" }}>
            <OrchDiagram agents={agents} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
            {agents.map((a, i) => {
              const colors = { worker: "#2563EB", validator: "#CA8A04", gateway: "#16A34A", human: "#F97316" };
              const c = colors[a.type] || "#2563EB";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "0.8rem",
                  padding: "0.8rem 1rem", background: "#fff", borderRadius: 10,
                  border: `1.5px solid ${c}20`, animation: `slideIn 0.3s ${i * 0.1}s ease-out both`,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${c}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: c, flexShrink: 0 }}>{a.type[0].toUpperCase()}</div>
                  <div><div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{a.name}</div><div style={{ fontSize: "0.82rem", color: "#64748B" }}>{a.role}</div></div>
                </div>
              );
            })}
          </div>

          <button onClick={() => setStage(5)} style={pb}>Generate Blueprint →</button>
        </div>
      </div>
    );
  }

  // ── Stage 5: Blueprint ──
  if (stage === 5) {
    const agents = getAgents();
    const indLabel = INDUSTRIES.find(i => i.id === industry)?.label || "";
    return (
      <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ProgressBar stage={5} total={7} />
          <StageTitle num="5" title="Your Agent Blueprint" />

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: "1.5rem", animation: "slideUp 0.5s ease-out" }}>
            <div style={{ background: "linear-gradient(135deg, #2563EB, #8B5CF6)", padding: "1.6rem", color: "white" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", opacity: 0.8 }}>AGENT BLUEPRINT</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "1.5rem", fontWeight: 800, marginTop: "0.3rem" }}>{indLabel} Agent System</div>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem", marginBottom: "1.25rem" }}>
                {[
                  { n: steps.length, l: "Workflow Steps" },
                  { n: agents.length, l: "Agents" },
                  { n: activeTools.length, l: "Tools" },
                  { n: checkpoints.length, l: "Human Gates" },
                  { n: "7/9", l: "Scenarios Handled" },
                  { n: "Orch", l: "Architecture" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "0.65rem", background: "#FAFBFF", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#2563EB" }}>{s.n}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 500, marginTop: "0.15rem" }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>WORKFLOW</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1.25rem" }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: COLORS[s.type]?.text || "#64748B", background: COLORS[s.type]?.bg || "#F1F5F9", padding: "0.2rem 0.5rem", borderRadius: 5 }}>{s.name}</span>
                    {i < steps.length - 1 && <span style={{ color: "#CBD5E1", fontSize: "0.82rem" }}>→</span>}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>AGENTS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {agents.map((a, i) => {
                  const colors = { worker: "#2563EB", validator: "#CA8A04", gateway: "#16A34A", human: "#F97316" };
                  return (
                    <span key={i} style={{ fontSize: "0.82rem", fontWeight: 600, color: colors[a.type], background: `${colors[a.type]}10`, padding: "0.25rem 0.65rem", borderRadius: 6, border: `1.5px solid ${colors[a.type]}25` }}>{a.name}</span>
                  );
                })}
              </div>
            </div>
          </div>

          {!submitted ? (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "1.4rem", marginBottom: "1.1rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.1em", marginBottom: "0.65rem" }}>GET YOUR FULL BLUEPRINT</div>
              <p style={{ fontSize: "0.95rem", color: "#64748B", marginBottom: "1rem" }}>Enter your email for a detailed PDF with architecture diagrams, eval results, and implementation roadmap.</p>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your work email"
                style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontFamily: "'Inter',sans-serif", fontSize: "1rem", outline: "none", marginBottom: "0.8rem" }} />
              <button onClick={async () => { if (!email.trim()) return; setSubmitted(true); try { await fetch("https://formspree.io/f/xaqllpjl", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, type: "Agent Builder Blueprint", industry, steps: steps.length, checkpoints: checkpoints.length }) }); } catch {} }} style={pb}>Send My Blueprint</button>
            </div>
          ) : (
            <div style={{ background: "#DCFCE7", borderRadius: 14, padding: "1.4rem", textAlign: "center", marginBottom: "1.1rem", border: "1.5px solid #86EFAC" }}>
              <div style={{ fontWeight: 600, color: "#16A34A" }}>✓ Blueprint request received</div>
            </div>
          )}

          <button onClick={() => setStage(6)} style={pb}>See Cloud Architecture →</button>
        </div>
      </div>
    );
  }

  // ── Stage 6: Architecture ──
  const selCloud = [
    { id: "aws", label: "AWS", color: "#FF9900", svc: { compute: "Lambda", ai: "Bedrock", vector: "OpenSearch", storage: "S3", queue: "EventBridge", auth: "Cognito", monitor: "CloudWatch", db: "DynamoDB" } },
    { id: "azure", label: "Azure", color: "#0078D4", svc: { compute: "Functions", ai: "Azure OpenAI", vector: "AI Search", storage: "Blob", queue: "Service Bus", auth: "Entra ID", monitor: "Monitor", db: "Cosmos DB" } },
    { id: "gcp", label: "GCP", color: "#4285F4", svc: { compute: "Cloud Run", ai: "Vertex AI", vector: "Vector Search", storage: "GCS", queue: "Pub/Sub", auth: "Firebase", monitor: "Cloud Mon", db: "Firestore" } },
    { id: "oss", label: "Open Source", color: "#16A34A", svc: { compute: "K8s / Docker", ai: "Ollama / vLLM", vector: "Qdrant", storage: "MinIO", queue: "Kafka", auth: "Keycloak", monitor: "Prometheus", db: "PostgreSQL" } },
  ];
  const curCloud = selCloud.find(cl => cl.id === archCloud) || selCloud[0];
  const sv = curCloud.svc;

  const archLayers = [
    { name: "PRESENTATION", color: "#3B82F6", nodes: [["Portal / UI", sv.compute], ["API Gateway", sv.auth]] },
    { name: "AGENT ORCHESTRATION", color: "#8B5CF6", nodes: [["Orchestrator", sv.compute], ["Intake Agent", sv.ai], ["Processing Agent", sv.ai], ["Validation Agent", sv.ai]] },
    { name: "GOVERNANCE", color: "#F97316", nodes: [["Policy Engine", sv.compute], ["Human Review", sv.queue], ["Audit Trail", sv.storage]] },
    { name: "DATA & CONTEXT", color: "#16A34A", nodes: [["Document Store", sv.storage], ["Vector Store", sv.vector], ["State DB", sv.db]] },
    { name: "MONITORING", color: "#64748B", nodes: [["Performance", sv.monitor], ["Drift Detection", sv.compute], ["Eval Pipeline", sv.compute]] },
  ];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#FAFBFF", color: "#0F172A", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <ProgressBar stage={6} total={7} />
        <StageTitle num="6" title="Cloud Architecture" sub="Your agent system mapped to real cloud services." />

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.6rem" }}>
          {selCloud.map(cl => (
            <button key={cl.id} onClick={() => setArchCloud(cl.id)} style={{ flex: 1, padding: "0.7rem 0.65rem", borderRadius: 10, border: `2.5px solid ${archCloud === cl.id ? cl.color : "rgba(0,0,0,0.08)"}`, background: archCloud === cl.id ? `${cl.color}10` : "#fff", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.9rem", fontWeight: archCloud === cl.id ? 600 : 500, color: archCloud === cl.id ? cl.color : "#64748B", transition: "all 0.2s" }}>{cl.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.6rem" }}>
          {archLayers.map((layer, li) => (
            <div key={li} style={{ background: "#fff", borderRadius: 12, border: `1.5px solid ${layer.color}20`, overflow: "hidden", animation: `slideUp 0.3s ${li * 0.08}s ease-out both` }}>
              <div style={{ background: `${layer.color}10`, padding: "0.6rem 1rem", borderBottom: `1.5px solid ${layer.color}20` }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", color: layer.color }}>{layer.name}</div>
              </div>
              <div style={{ padding: "0.8rem 1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {layer.nodes.map((n, ni) => (
                  <div key={ni} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", borderRadius: 8, background: `${layer.color}08`, border: `1.5px solid ${layer.color}15` }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0F172A" }}>{n[0]}</span>
                    <span style={{ fontSize: "0.75rem", color: curCloud.color, fontWeight: 600 }}>{n[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: "1.25rem", marginBottom: "1.6rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: curCloud.color, letterSpacing: "0.1em", marginBottom: "0.45rem" }}>{curCloud.label.toUpperCase()} ARCHITECTURE</div>
          <div style={{ fontSize: "0.95rem", color: "#64748B" }}>{archLayers.reduce((sum, l) => sum + l.nodes.length, 0)} components across {archLayers.length} layers</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(249,115,22,0.06))", borderRadius: 14, padding: "1.8rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>Ready to build this for real?</div>
          <p style={{ fontSize: "0.95rem", color: "#64748B", marginBottom: "1.25rem" }}>This blueprint is a starting point. We take it from design to production.</p>
          <button onClick={onCTA} style={{ ...pb, width: "auto", display: "inline-block", padding: "0.85rem 2.5rem" }}>Talk to AgenTek</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════ CONTACT FORM ═══════════════════
const FORMSPREE_FORM_ID = "xaqllpjl";

function ContactForm({ onSuccess, dark }) {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [st, setSt] = useState({ text: "", type: "" });
  const [sending, setSending] = useState(false);

  const inputBase = {
    width: "100%", padding: "1rem 1.1rem", borderRadius: 10,
    border: `1.5px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
    background: dark ? "rgba(255,255,255,0.07)" : "#fff",
    fontSize: "1rem", color: dark ? "#E2E8F0" : "#0F172A",
    outline: "none", lineHeight: 1.5,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const submit = async () => {
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) { setSt({ text: "Please fill in all fields.", type: "error" }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { setSt({ text: "Please enter a valid email address.", type: "error" }); return; }

    setSending(true);
    try {
      const r = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: f.name, email: f.email, message: f.message }),
      });
      if (r.ok) {
        setSt({ text: "Message sent! We'll be in touch shortly.", type: "success" });
        setF({ name: "", email: "", message: "" });
        if (onSuccess) setTimeout(onSuccess, 2000);
      } else {
        setSt({ text: "Something went wrong — please email us directly.", type: "error" });
      }
    } catch { setSt({ text: "Network error — please email us directly.", type: "error" }); }
    setSending(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} role="form" aria-label="Contact form">
      <div>
        <label htmlFor="contact-name" style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.6)" : "#64748B", marginBottom: "0.45rem", letterSpacing: "0.02em" }}>Full name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" aria-required="true" style={inputBase} />
      </div>
      <div>
        <label htmlFor="contact-email" style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.6)" : "#64748B", marginBottom: "0.45rem", letterSpacing: "0.02em" }}>Work email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" aria-required="true" style={inputBase} />
      </div>
      <div>
        <label htmlFor="contact-message" style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.6)" : "#64748B", marginBottom: "0.45rem", letterSpacing: "0.02em" }}>Tell us about your challenge</label>
        <textarea id="contact-message" name="message" value={f.message} onChange={e => setF(p => ({ ...p, message: e.target.value }))} placeholder="Describe your workflow, the problem you're trying to solve, or the outcome you're aiming for…" rows={4} aria-required="true" style={{ ...inputBase, resize: "vertical", minHeight: 120, lineHeight: 1.7 }} />
      </div>
      <button onClick={submit} disabled={sending} aria-disabled={sending}
        style={{ width: "100%", padding: "1rem", background: "#F97316", color: "#fff", borderRadius: 10, fontSize: "1rem", fontWeight: 600, border: "none", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, transition: "opacity 0.2s, background 0.2s", letterSpacing: "-0.01em" }}
        onMouseEnter={e => { if (!sending) e.currentTarget.style.background = "#EA580C"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#F97316"; }}>
        {sending ? "Sending…" : "Send Message"}
      </button>
      {st.text && (
        <div role="alert" style={{ fontSize: "1rem", fontWeight: 500, color: st.type === "success" ? "#16A34A" : "#DC2626", padding: "0.8rem 1rem", borderRadius: 8, background: st.type === "success" ? "#F0FDF4" : "#FEE2E2", border: `1.5px solid ${st.type === "success" ? "#86EFAC" : "#FECACA"}` }}>
          {st.text}
        </div>
      )}
    </div>
  );
}

// ═══════════════════ AGENT EXAMPLES ═══════════════════
const AGENT_EXAMPLES = [
  {
    tab: "Invoice Processing",
    industry: "Finance",
    color: "#2563EB",
    before: "400+ invoice documents, 3 staff, 2 days of manual work",
    after: "AI agent processes in 2 hours with 99.2% accuracy",
    steps: [
      { icon: "📄", label: "Documents arrive" },
      { icon: "🤖", label: "AI reads & classifies" },
      { icon: "✓", label: "Extracts line items" },
      { icon: "🔍", label: "Cross-checks PO data" },
      { icon: "⚠", label: "Exceptions flagged" },
      { icon: "✨", label: "Approved & posted" },
    ],
  },
  {
    tab: "Client Onboarding",
    industry: "Professional Services",
    color: "#7C3AED",
    before: "12-step manual KYC process, 5 business days per client",
    after: "Automated pipeline, same-day onboarding for 80% of clients",
    steps: [
      { icon: "👤", label: "Client submits info" },
      { icon: "🤖", label: "AI verifies identity" },
      { icon: "📋", label: "Runs KYC checks" },
      { icon: "🔗", label: "Cross-refs databases" },
      { icon: "⚠", label: "Risk flags reviewed" },
      { icon: "✅", label: "Account activated" },
    ],
  },
  {
    tab: "Claims Triage",
    industry: "Insurance",
    color: "#F97316",
    before: "200 claims/week manually sorted by 3 adjusters",
    after: "AI pre-sorts and routes — 80% auto-triaged, humans handle the rest",
    steps: [
      { icon: "📩", label: "Claim submitted" },
      { icon: "🤖", label: "AI reads claim" },
      { icon: "📊", label: "Scores complexity" },
      { icon: "🔀", label: "Routes by type" },
      { icon: "👁", label: "Human reviews edge cases" },
      { icon: "💰", label: "Settlement initiated" },
    ],
  },
  {
    tab: "Compliance Monitoring",
    industry: "Legal",
    color: "#06B6D4",
    before: "Monthly manual audit across 6 systems, 2 compliance officers",
    after: "Continuous AI monitoring with real-time alerts, 95% fewer gaps",
    steps: [
      { icon: "🔄", label: "Systems polled" },
      { icon: "🤖", label: "AI scans changes" },
      { icon: "📏", label: "Checks against rules" },
      { icon: "⚠", label: "Violations flagged" },
      { icon: "📝", label: "Report generated" },
      { icon: "🛡", label: "Audit trail saved" },
    ],
  },
];

function AgentExamplesSection() {
  const [active, setActive] = useState(0);
  const ex = AGENT_EXAMPLES[active];

  // Auto-cycle every 6 seconds
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % AGENT_EXAMPLES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.12em", color: "#F97316", marginBottom: "0.75rem" }}>SEE IT IN ACTION</div>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>What an Agent Actually Does</h2>
        </div>

        {/* Tab selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {AGENT_EXAMPLES.map((eg, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "0.6rem 1.25rem", borderRadius: 10, border: `2px solid ${i === active ? eg.color : "rgba(0,0,0,0.08)"}`,
              background: i === active ? `${eg.color}10` : "#fff", color: i === active ? eg.color : "#64748B",
              fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.25s",
            }}>
              {eg.tab}
            </button>
          ))}
        </div>

        {/* Before / After */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "1rem 1.5rem", flex: "1 1 300px", maxWidth: 420 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#DC2626", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>BEFORE</div>
            <div style={{ fontSize: "1rem", color: "#991B1B", lineHeight: 1.5 }}>{ex.before}</div>
          </div>
          <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: "1rem 1.5rem", flex: "1 1 300px", maxWidth: 420 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16A34A", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>AFTER</div>
            <div style={{ fontSize: "1rem", color: "#166534", lineHeight: 1.5 }}>{ex.after}</div>
          </div>
        </div>

        {/* Flow diagram */}
        <div style={{ background: "#FAFBFF", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", padding: "2.5rem 2rem", overflow: "auto" }}>
          <svg viewBox="0 0 1000 200" style={{ width: "100%", minWidth: 800, height: "auto", display: "block" }}>
            {ex.steps.map((step, i) => {
              const x = 85 + i * ((1000 - 170) / (ex.steps.length - 1));
              return (
                <g key={`${active}-${i}`} style={{ animation: `popIn 0.45s ${i * 0.12 + 0.1}s ease-out both` }}>
                  {i > 0 && <line x1={x - ((1000 - 170) / (ex.steps.length - 1)) + 40} y1={95} x2={x - 40} y2={95} stroke={ex.color} strokeWidth="2.5" strokeDasharray="6 4" opacity="0.5" />}
                  <circle cx={x} cy={95} r={40} fill={`${ex.color}15`} stroke={ex.color} strokeWidth="2.5" />
                  <text x={x} y={105} textAnchor="middle" style={{ fontSize: "28px" }}>{step.icon}</text>
                  <text x={x} y={160} textAnchor="middle" style={{ fontSize: "12px", fontWeight: 600, fill: "#0F172A", fontFamily: "Inter, sans-serif" }}>{step.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Industry badge */}
        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: ex.color, background: `${ex.color}10`, padding: "0.35rem 1rem", borderRadius: 6, border: `1px solid ${ex.color}25` }}>
            {ex.industry}
          </span>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════ MAIN APP ═══════════════════
export default function AgenTekSite() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const refs = { builder: useRef(null), about: useRef(null) };

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  useEffect(() => {
    const schemas = [
      { "@context": "https://schema.org", "@type": "Organization", "name": "AgenTek Labs", "legalName": "AgenTek Labs Limited", "url": "https://agentek.co.uk", "email": "hello@agentek.co.uk", "description": "AI agents that do actual work. We build AI systems for real enterprise problems in healthcare, financial services, professional services, and logistics.", "foundingDate": "2026", "areaServed": "Global", "address": { "@type": "PostalAddress", "addressCountry": "GB" }, "knowsAbout": ["AI Agents", "Agentic AI", "Enterprise AI", "AI Architecture", "Cloud-Native AI", "RAG", "Multi-Agent Systems", "AI Governance"] },
      { "@context": "https://schema.org", "@type": "ProfessionalService", "name": "AgenTek Labs", "url": "https://agentek.co.uk", "serviceType": ["AI Agent Design", "Agent Architecture", "AI Implementation", "Cloud Architecture", "AI Governance", "Technical Leadership"], "areaServed": { "@type": "Place", "name": "Global" } },
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

  const goPage = (p) => { setPage(p); setMenuOpen(false); };
  const openModal = () => { setMenuOpen(false); setModalOpen(true); };
  const openBuilder = () => { setMenuOpen(false); if (page !== "home") setPage("home"); setTimeout(() => refs.builder?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), page === "home" ? 100 : 200); };
  const scrollTo = (id) => { if (page !== "home") setPage("home"); setMenuOpen(false); setTimeout(() => refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), page === "home" ? 0 : 100); };

  const isHome = page === "home";
  const navDark = isHome && !scrolled;

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background: "#fff", color: "#0F172A", lineHeight: 1.7, overflowX: "hidden" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html{font-size:16px}
        body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased}
        ::placeholder{color:#94A3B8;font-size:1rem}
        input,textarea,button,select{font-family:inherit}
        input:focus,textarea:focus{border-color:rgba(37,99,235,0.5)!important;box-shadow:0 0 0 4px rgba(37,99,235,0.12)!important;outline:none}
        :focus-visible{outline:3px solid #2563EB;outline-offset:3px}
        button:focus-visible,a:focus-visible{outline:3px solid #F97316;outline-offset:3px;border-radius:4px}
        .skip-link{position:absolute;top:-100px;left:1rem;z-index:9999;background:#F97316;color:#fff;padding:0.7rem 1.25rem;border-radius:8px;font-weight:600;font-size:1rem;text-decoration:none;transition:top 0.2s}
        .skip-link:focus{top:1rem}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes drawLine{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
        @keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        @keyframes hitRight{0%{transform:translateX(-40px);opacity:0}60%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:1}}
        @keyframes resultPop{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){.desk{display:none!important}.mob{display:flex!important}.g3{grid-template-columns:1fr!important}.g2{grid-template-columns:1fr!important}.hcta{flex-direction:column!important}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: navDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${navDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, transition: "all 0.4s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }} onClick={() => goPage("home")} role="link" tabIndex={0} onKeyDown={e => e.key === "Enter" && goPage("home")} aria-label="AgenTek Labs — home"><SiteLogo size={40} light={navDark} /><span style={{ fontWeight: 800, fontSize: "1.3rem", color: navDark ? "#fff" : "#0F172A", letterSpacing: "-0.02em" }}>AgenTek <span style={{ fontWeight: 400, color: navDark ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>Labs</span></span></div>
        <div className="desk" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <a onClick={openBuilder} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && openBuilder()} style={{ fontSize: "1rem", color: "#2563EB", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}>Agent Builder</a>
          <a onClick={() => scrollTo("about")} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && scrollTo("about")} style={{ fontSize: "1rem", color: navDark ? "rgba(255,255,255,0.75)" : "#374151", cursor: "pointer", fontWeight: 500, textDecoration: "none" }}>About</a>
          <a onClick={openModal} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && openModal()} style={{ background: "#F97316", color: "#fff", padding: "0.65rem 1.5rem", borderRadius: 8, fontWeight: 600, fontSize: "1rem", cursor: "pointer", textDecoration: "none", transition: "background 0.2s", letterSpacing: "-0.01em" }} onMouseEnter={e => e.currentTarget.style.background = "#EA580C"} onMouseLeave={e => e.currentTarget.style.background = "#F97316"}>Let's Talk</a>
        </div>
        <button className="mob" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={navDark ? "#fff" : "#374151"} strokeWidth="2"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && <div style={{ position: "fixed", inset: 0, background: "#0A0F1E", zIndex: 1001, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem" }}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>
        <a onClick={openBuilder} style={{ fontSize: "1.3rem", color: "#F97316", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}>Agent Builder</a>
        <a onClick={() => scrollTo("about")} style={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.8)", cursor: "pointer", textDecoration: "none" }}>About</a>
        <a onClick={openModal} style={{ fontSize: "1.3rem", color: "#F97316", cursor: "pointer", textDecoration: "none" }}>Let's Talk</a>
      </div>}

      {/* MODAL */}
      {modalOpen && <div role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", maxWidth: 480, width: "100%", position: "relative", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
          <button onClick={() => setModalOpen(false)} aria-label="Close dialog" style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "#F1F5F9", border: "none", cursor: "pointer", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>
          <h3 id="modal-title" style={{ fontFamily: "'Inter',sans-serif", fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Start a Conversation</h3>
          <p style={{ fontSize: "1rem", color: "#64748B", marginBottom: "2rem", lineHeight: 1.7 }}>Tell us about your challenge. We'll come back to you within one business day.</p>
          <ContactForm onSuccess={() => setModalOpen(false)} />
          <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(0,0,0,0.08)", fontSize: "0.9rem", color: "#94A3B8", textAlign: "center" }}>Or email <a href="mailto:hello@agentek.co.uk" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>hello@agentek.co.uk</a></div>
        </div>
      </div>}

      {isHome && <>
        {/* HERO */}
        <section id="main-content" role="main" style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "4rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem", width: "100%" }}>
            <div style={{ maxWidth: 700 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2563EB", marginBottom: "2rem", opacity: 0, animation: "fadeUp 0.6s 0.1s ease-out forwards" }}>Real-Life AI for Real-Life Problems</div>
              <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0F172A", opacity: 0, animation: "fadeUp 0.7s 0.2s ease-out forwards", marginBottom: "1.25rem" }}>
                Real-Life AI for Real-Life Problems
              </h1>
              <p style={{ fontSize: "1.25rem", color: "#4B5563", maxWidth: 600, lineHeight: 1.8, opacity: 0, animation: "fadeUp 0.7s 0.35s ease-out forwards", marginBottom: "2.5rem" }}>We build AI agents that do actual work. They read documents, make decisions, and save your team hours every week.</p>
              <div style={{ display: "flex", gap: "1rem", opacity: 0, animation: "fadeUp 0.7s 0.5s ease-out forwards", flexWrap: "wrap" }}>
                <a onClick={openBuilder} style={{ display: "inline-flex", alignItems: "center", padding: "1rem 2rem", background: "#2563EB", color: "#fff", borderRadius: 10, fontSize: "1rem", fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"} onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}>See what an agent can do</a>
                <a onClick={openModal} style={{ display: "inline-flex", alignItems: "center", padding: "1rem 2rem", background: "#F97316", color: "#fff", borderRadius: 10, fontSize: "1rem", fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#EA580C"} onMouseLeave={e => e.currentTarget.style.background = "#F97316"}>Let's Talk</a>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMS */}
        <section style={{ padding: "5rem 2rem", background: "#FAFBFF" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem" }}>The Problem</h2>
              <p style={{ fontSize: "1.1rem", color: "#64748B", maxWidth: 600, margin: "0 auto" }}>Sound familiar?</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {[
                { title: "2 days of work for 2 hours of effort", desc: "Your team spends days on manual work that should take hours. Documents, data entry, verification, decisions." },
                { title: "You've been pitched AI. But no demos.", desc: "Lots of promises. Slides. Demo videos. Nothing you can actually test or measure." },
                { title: "Off-the-shelf tools don't fit.", desc: "Generic platforms force you to change your workflow instead of solving it." },
              ].map((p, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,0.08)", padding: "2rem", animation: `slideUp 0.4s ${i * 0.15}s ease-out both` }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.75rem" }}>{p.title}</h3>
                  <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT AGENTS DO — 4 examples */}
        <AgentExamplesSection />

        {/* CASE STUDIES */}
        <section style={{ padding: "5rem 2rem", background: "#FAFBFF" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Real Results</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {CASE_STUDIES.map((cs, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", animation: `slideUp 0.4s ${i * 0.1}s ease-out both` }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <div style={{ padding: "1.5rem", background: "linear-gradient(135deg, #2563EB10, #F9731610)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2563EB", background: "#2563EB10", padding: "0.3rem 0.75rem", borderRadius: 6 }}>{cs.industry}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F97316" }}>{cs.metric}</span>
                    </div>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.5rem" }}>{cs.tag}</h4>
                    <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.6 }}>{cs.problem}</p>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ fontSize: "0.95rem", color: "#374151", lineHeight: 1.7, marginBottom: "1rem" }}>{cs.solution}</p>
                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                      {cs.stack.map((t, j) => <span key={j} style={{ fontSize: "0.75rem", fontWeight: 500, padding: "0.25rem 0.65rem", borderRadius: 5, background: "rgba(0,0,0,0.05)", color: "#475569" }}>{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTELLIGENCE LAYER */}
        <section style={{ padding: "5rem 2rem", background: "linear-gradient(165deg, #0F172A 0%, #1E293B 100%)", color: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.12em", color: "#F97316", marginBottom: "0.75rem" }}>THE FOUNDATION</div>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1rem" }}>Your Enterprise Intelligence Layer</h2>
              <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
                Before we build agents, we build the brain. A governed context engine that connects your data, knowledge, and processes — so every AI tool in your organisation gets smarter over time.
              </p>
            </div>

            {/* Visual diagram — full width, large */}
            <div style={{ margin: "0 auto 3rem", padding: "2rem 0" }}>
              <svg viewBox="0 0 1100 500" style={{ width: "100%", height: "auto" }}>
                <defs>
                  <linearGradient id="ilglow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity="0.2"/><stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1"/></linearGradient>
                  <linearGradient id="flowArrow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#F97316" stopOpacity="0.7"/><stop offset="100%" stopColor="#2563EB" stopOpacity="0.9"/></linearGradient>
                  <linearGradient id="flowArrowR" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2563EB" stopOpacity="0.9"/><stop offset="100%" stopColor="#06B6D4" stopOpacity="0.7"/></linearGradient>
                  <filter id="ilblur"><feGaussianBlur stdDeviation="30"/></filter>
                  <marker id="arrIL" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0, 10 4, 0 8" fill="#2563EB" opacity="0.7"/></marker>
                  <marker id="arrILR" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0, 10 4, 0 8" fill="#06B6D4" opacity="0.7"/></marker>
                </defs>

                {/* Background glow behind centre */}
                <ellipse cx="550" cy="240" rx="220" ry="180" fill="url(#ilglow)" filter="url(#ilblur)"/>

                {/* Column label: YOUR DATA */}
                <text x="120" y="40" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="13" fontWeight="700" letterSpacing="0.15em" fontFamily="Inter, sans-serif">YOUR DATA</text>

                {/* ── LEFT: Data Sources ── */}
                {[
                  { icon: "📧", label: "Email & Docs", y: 65 },
                  { icon: "🗄", label: "CRM / ERP", y: 165 },
                  { icon: "📊", label: "Spreadsheets", y: 265 },
                  { icon: "💬", label: "Chat & Tickets", y: 365 },
                ].map((src, si) => (
                  <g key={si} style={{ animation: `popIn 0.5s ${si * 0.12}s ease-out both` }}>
                    <rect x="20" y={src.y} width="200" height="72" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                    <text x="58" y={src.y + 44} fontSize="28">{src.icon}</text>
                    <text x="92" y={src.y + 44} fill="rgba(255,255,255,0.9)" fontSize="16" fontWeight="600" fontFamily="Inter, sans-serif">{src.label}</text>
                    {/* Arrow to centre */}
                    <line x1="225" y1={src.y + 36} x2="370" y2="240" stroke="url(#flowArrow)" strokeWidth="2.5" strokeDasharray="8 5" markerEnd="url(#arrIL)"/>
                  </g>
                ))}

                {/* ── CENTRE: Intelligence Layer ── */}
                <g style={{ animation: "popIn 0.7s 0.3s ease-out both" }}>
                  <rect x="375" y="100" width="350" height="280" rx="28" fill="rgba(37,99,235,0.12)" stroke="#2563EB" strokeWidth="2.5"/>
                  <rect x="395" y="120" width="310" height="240" rx="18" fill="rgba(37,99,235,0.06)" stroke="rgba(37,99,235,0.3)" strokeWidth="1" strokeDasharray="5 4"/>

                  <text x="550" y="165" textAnchor="middle" fill="#F97316" fontSize="14" fontWeight="700" letterSpacing="0.15em" fontFamily="Inter, sans-serif">INTELLIGENCE LAYER</text>

                  <text x="550" y="205" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">Context Engine</text>
                  <text x="550" y="232" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="14" fontFamily="Inter, sans-serif">RAG · Vector DB · Knowledge Graph</text>

                  {/* Tech badges */}
                  {["Embeddings", "Governed", "Versioned", "Secure"].map((t, ti) => (
                    <g key={ti}>
                      <rect x={408 + ti * 78} y="258" width="72" height="28" rx="7" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.35)" strokeWidth="1.2"/>
                      <text x={444 + ti * 78} y="277" textAnchor="middle" fill="#06B6D4" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{t}</text>
                    </g>
                  ))}

                  {/* Compounding value line */}
                  <rect x="430" y="305" width="240" height="36" rx="10" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.2)" strokeWidth="1"/>
                  <text x="550" y="328" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Build once → every agent gets smarter</text>
                </g>

                {/* Column label: CONTEXT ENGINE */}
                <text x="550" y="40" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="13" fontWeight="700" letterSpacing="0.15em" fontFamily="Inter, sans-serif">CONTEXT ENGINE</text>

                {/* Column label: AI AGENTS */}
                <text x="980" y="40" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="13" fontWeight="700" letterSpacing="0.15em" fontFamily="Inter, sans-serif">AI AGENTS</text>

                {/* ── RIGHT: AI Agents ── */}
                {[
                  { icon: "🤖", label: "Process Agents", y: 65 },
                  { icon: "📋", label: "Compliance Bot", y: 165 },
                  { icon: "💡", label: "Decision Support", y: 265 },
                  { icon: "📈", label: "Analytics Engine", y: 365 },
                ].map((ag, ai) => (
                  <g key={ai} style={{ animation: `popIn 0.5s ${0.5 + ai * 0.12}s ease-out both` }}>
                    {/* Arrow from centre */}
                    <line x1="730" y1="240" x2="875" y2={ag.y + 36} stroke="url(#flowArrowR)" strokeWidth="2.5" strokeDasharray="8 5" markerEnd="url(#arrILR)"/>
                    <rect x="880" y={ag.y} width="200" height="72" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                    <text x="918" y={ag.y + 44} fontSize="28">{ag.icon}</text>
                    <text x="952" y={ag.y + 44} fill="rgba(255,255,255,0.9)" fontSize="16" fontWeight="600" fontFamily="Inter, sans-serif">{ag.label}</text>
                  </g>
                ))}

                {/* Bottom tagline */}
                <text x="550" y="475" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="12" fontWeight="500" fontFamily="Inter, sans-serif">Your data stays yours. Governed, auditable, enterprise-grade.</text>
              </svg>
            </div>

            {/* Three value props */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: 920, margin: "0 auto" }}>
              {[
                { icon: "🔗", title: "Connect Everything", desc: "We ingest your emails, documents, CRM, tickets, and legacy systems into one governed knowledge base — no rip-and-replace." },
                { icon: "🧠", title: "Context That Compounds", desc: "Every interaction makes the layer smarter. Your AI doesn't start from zero — it builds on everything your organisation already knows." },
                { icon: "🛡", title: "Governed & Auditable", desc: "Role-based access, version control, and full audit trails. Your data stays yours, with enterprise-grade security baked in from day one." },
              ].map((vp, vi) => (
                <div key={vi} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "1.75rem",
                  animation: `slideUp 0.4s ${vi * 0.1}s ease-out both`,
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{vp.icon}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{vp.title}</div>
                  <div style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{vp.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.75rem 1.5rem" }}>
                <span style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)" }}>Cloud-agnostic · Best-of-breed tooling · Your infrastructure, your rules</span>
              </div>
            </div>
          </div>
        </section>

        {/* AGENT BUILDER */}
        <section ref={refs.builder} style={{ padding: "5rem 2rem", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.12em", color: "#F97316", marginBottom: "0.75rem" }}>Try It</div>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Build your AI agent in 7 steps</h2>
            </div>
            <AgentBuilderInline onCTA={openModal} />
          </div>
        </section>

        {/* METRICS */}
        <section style={{ padding: "5rem 2rem", background: "#FAFBFF" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>The Numbers</h2>
              <p style={{ fontSize: "1rem", color: "#64748B", marginTop: "1rem" }}>Every engagement starts with the business case.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
              {[
                { label: "Hours saved vs cost", value: "ROI in 6 months" },
                { label: "Error rate reduction", value: "Up to 95%" },
                { label: "Cost per transaction", value: "1/10th manual" },
                { label: "Time to payback", value: "Under 6 months" },
              ].map((m, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "2rem", textAlign: "center", animation: `slideUp 0.4s ${i * 0.1}s ease-out both` }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748B", marginBottom: "0.75rem" }}>{m.label}</div>
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2563EB" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE WORK */}
        <section style={{ padding: "5rem 2rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>How We Work</h2>
              <p style={{ fontSize: "1rem", color: "#64748B", marginTop: "1rem" }}>Real delivery, real outcomes.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {[
                { num: "1", title: "We map your problem", desc: "2-week discovery sprint. We understand your workflow, constraints, and success metrics." },
                { num: "2", title: "We build a working agent", desc: "4-8 weeks. Real code. Real integrations. Real governance gates. Not slides." },
                { num: "3", title: "We prove it works", desc: "Live metrics, cost-benefit analysis, handoff documentation. You own it." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#FAFBFF", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "2rem", animation: `slideUp 0.4s ${i * 0.15}s ease-out both` }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.25rem" }}>{s.num}</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem" }}>{s.title}</h3>
                  <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT + CONTACT */}
        <section ref={refs.about} style={{ padding: "5rem 2rem", background: "#0A0F1E", color: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.12em", color: "#F97316", marginBottom: "1rem" }}>About</div>
                <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.5rem" }}>Practical AI that works</h2>
                <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "1.25rem" }}>AgenTek Labs helps firms get enterprise AI capability without the enterprise price tag. Real architecture, real results — no fluff.</p>
                <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "1.25rem" }}>We work on a Statement of Work basis, outside IR35, so there's no employment overhead on your side.</p>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>Registered in England & Wales, No. 17041966</div>
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.12em", color: "#F97316", marginBottom: "1rem" }}>Worth 20 minutes?</div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem" }}>Let's talk about your challenge</h3>
                <ContactForm dark onSuccess={() => {}} />
                <div style={{ marginTop: "1.25rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Or reach out: <a href="mailto:hello@agentek.co.uk" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>hello@agentek.co.uk</a></div>
              </div>
            </div>
          </div>
        </section>
      </>}

      {/* FOOTER */}
      <footer style={{ padding: "2rem", background: "#0A0F1E", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>© 2026 AgenTek Labs Limited · Registered in England & Wales, No. 17041966</div>
          <a href="mailto:hello@agentek.co.uk" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>hello@agentek.co.uk</a>
        </div>
      </footer>
    </div>
  );
}
