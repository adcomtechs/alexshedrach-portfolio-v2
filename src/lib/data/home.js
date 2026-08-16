import { Layers, Eye, Zap, GitBranch, Shield } from "lucide-react";

// lib/data/home.js (principles section)
//
// Schema change — DEC-010 follow-up:
//   `description` → `summary` + `details`
//
//   summary  — 1 compressed thesis line. Rendered on the homepage card.
//              Aphoristic, strategic, scan-optimized. No clause chains.
//   details  — Expanded rationale. NOT rendered on homepage by default.
//              Rendered on /about in full. Available for progressive
//              disclosure when that client boundary is approved in DECISIONS.md.
//
// PRINCIPLES_HOME — compressed for homepage scan velocity
// PRINCIPLES_ALL  — full philosophy essays for /about deep reading
//
// These two arrays are intentionally independent.
// Do NOT spread PRINCIPLES_HOME into PRINCIPLES_ALL —
// the three shared principles carry different content at each layer.

// ─────────────────────────────────────────────────────────────────────────────
// PRINCIPLES_HOME
// 3 cards. Homepage Layer 1 — fast comprehension, not full argument.
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Principle[]} */
export const PRINCIPLES_HOME = [
  // ── 01 · FEATURED CARD ───────────────────────────────────────────────────
  {
    id: "domain-first",
    icon: Layers,
    index: "01",
    title: "Domain before framework",

    summary:
      "Core business logic is modelled before frameworks or infrastructure are introduced.",

    details:
      "The domain is the stable thing. The framework is the replaceable thing. " +
      "Architectural decisions come from evidence in the domain not from " +
      "framework defaults or assumption.",

    proof:
      "GradeForge's Spring Boot service was spec'd from a vanilla JS prototype " +
      "every edge case proven in plain functions before a single Java class was written. " +
      "The prototype became the spec.",

    tags: ["Domain Modelling", "Prototype-First", "Architecture", "Systems Thinking"],

    pullquote:
      "I build the domain in the simplest medium available before I touch Spring Boot " +
      "or Next.js. If I cannot model it in plain functions, I do not understand it " +
      "well enough to design a database schema for it.",
  },

  // ── 02 · GRID CARD ───────────────────────────────────────────────────────
  {
    id: "environment",
    icon: Eye,
    index: "02",
    title: "Environment shapes architecture",

    summary:
      "Deployment constraints are first-class architectural inputs not afterthoughts.",

    details:
      "Power reliability, connectivity, payment infrastructure, and device capability " +
      "determine system design before framework preference does. Architecture that " +
      "ignores its environment fails its users.",

    proof:
      "VendaCore uses an IndexedDB transaction queue because NEPA outages are a " +
      "daily operational reality for Nigerian retail not an edge case to handle later.",

    tags: ["Context-Aware Design", "Offline-First", "African Market"],

    pullquote: null,
  },

  // ── 03 · GRID CARD ───────────────────────────────────────────────────────
  {
    id: "correctness",
    icon: Zap,
    index: "03",
    title: "Correctness over convenience",

    summary:
      "Correct systems are cheaper to maintain than convenient ones that accumulate silent errors.",

    details:
      "When a provably correct approach and a convenient approach exist for the same " +
      "problem, correctness wins the cost of a wrong answer is paid by real users, " +
      "not the developer who chose the shortcut.",

    proof:
      "Ledgera implements double-entry bookkeeping because a rounding error in " +
      "a user's naira balance is not acceptable.",

    tags: ["Engineering Rigour", "Data Integrity", "Correctness"],

    pullquote: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRINCIPLES_ALL
// 5 principles. /about Layer 3 — full argument, full evidence.
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Principle[]} */
export const PRINCIPLES_ALL = [
  // ── 01 ───────────────────────────────────────────────────────────────────
  {
    id: "domain-first",
    icon: Layers,
    index: "01",
    title: "Domain before framework",

    summary:
      "Core business logic is modelled before frameworks or infrastructure are introduced.",

    details:
      "The domain is the stable thing. The framework is the replaceable thing. " +
      "Every project starts with the simplest possible implementation of the core " +
      "business logic no framework, no database, no abstractions until the " +
      "domain is understood deeply enough to make architectural decisions from " +
      "evidence, not assumption.",

    proof:
      "GradeForge's Spring Boot service was specified entirely from a working vanilla " +
      "JavaScript prototype. Every edge case carry-over courses, repeat units, " +
      "5-point vs 4-point scale variance was proven in plain functions before a " +
      "single Java class was written. The prototype became the spec.",

    tags: ["Domain Modelling", "Prototype-First", "Architecture", "Systems Thinking"],

    pullquote:
      "I build the domain in the simplest medium available before I touch Spring Boot " +
      "or Next.js. If I cannot model it in plain functions, I do not understand it " +
      "well enough to design a database schema for it.",
  },

  // ── 02 ───────────────────────────────────────────────────────────────────
  {
    id: "environment",
    icon: Eye,
    index: "02",
    title: "Environment shapes architecture",

    summary:
      "Deployment constraints are first-class architectural inputs — not afterthoughts.",

    details:
      "The constraints of the deployment environment determine system design before " +
      "any framework preference does. Power reliability, network connectivity, payment " +
      "infrastructure, regulatory requirements, and user device capability are " +
      "architectural facts not edge cases. Architecture that ignores its environment " +
      "fails its users.",

    proof:
      "VendaCore is offline-first with an IndexedDB transaction queue because NEPA " +
      "outages are a daily operational reality for Nigerian retail. AttendIQ uses " +
      "naira Paystack payouts not USD PayPal because that is what Nigerian " +
      "contributors can actually receive. GradeForge generates NUC-formatted " +
      "transcripts because that is what Nigerian postgraduate admissions offices accept.",

    tags: ["Context-Aware Design", "Offline-First", "African Market"],

    pullquote: null,
  },

  // ── 03 ───────────────────────────────────────────────────────────────────
  {
    id: "correctness",
    icon: Zap,
    index: "03",
    title: "Correctness over convenience",

    summary:
      "Correct systems are cheaper to maintain than convenient ones that accumulate silent errors.",

    details:
      "When a provably correct approach and a convenient approach exist for the same " +
      "problem, correctness wins not because it is elegant, but because the cost of " +
      "a wrong answer is paid by real users, not by the developer who chose the " +
      "shortcut. Correct systems are cheaper to maintain than convenient ones that " +
      "accumulate silent errors.",

    proof:
      "Ledgera implements double-entry bookkeeping rather than a simpler " +
      "income/expense ledger the mathematically self-validating model used by " +
      "every real financial system because a rounding error in a user's naira " +
      "balance is not acceptable. AttendIQ enforces proxy-attendance prevention via " +
      "single-use cryptographic nonces at the database constraint level, not the " +
      "application layer, because UI controls can be bypassed.",

    tags: ["Engineering Rigour", "Data Integrity", "Correctness"],

    pullquote: null,
  },

  // ── 04 ───────────────────────────────────────────────────────────────────
  {
    id: "artifacts",
    icon: GitBranch,
    index: "04",
    title: "Decisions leave artifacts",

    summary:
      "Every significant architectural decision is documented at the moment it is made not reconstructed later.",

    details:
      "The reasoning behind a decision and the options rejected matter as much as " +
      "the option chosen. Future engineers including future me deserve to inherit " +
      "context, not just code.",

    proof:
      "The choice of modular monolith over microservices in UniCore is documented " +
      "with explicit tradeoffs: deployment simplicity vs. independent scaling, " +
      "written at the time of the decision not rationalised after the fact. The " +
      "same applies to pgvector over Pinecone in ScholarHive, IndexedDB over " +
      "localStorage in VendaCore, and stateful nonce JWT over stateless JWT in AttendIQ.",

    tags: ["Documentation", "ADRs", "Architecture", "Engineering Culture"],

    pullquote: null,
  },

  // ── 05 ───────────────────────────────────────────────────────────────────
  {
    id: "clarity",
    icon: Shield,
    index: "05",
    title: "Clarity over cleverness",

    summary:
      "Complexity earns its place with a documented reason, or it does not ship.",

    details:
      "Readable, maintainable code outlasts clever abstractions every time. Every " +
      "function, module, and domain boundary is named for what it does in the " +
      "business domain not what it does technically. The wrong abstraction demands " +
      "explanation at every reading.",

    proof:
      "Domain language drives naming across every codebase: CgpaCalculationService, " +
      "not DataProcessor. EnvelopeBudgetAllocator, not BalanceManager. " +
      "CarryoverCourseResolver, not StatusHandler. The business domain is readable " +
      "in the code without a separate translation layer in your head.",

    tags: ["Code Quality", "Naming", "Domain Language", "Maintainability"],

    pullquote: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOME METRICS
//
// These reflect the honest, verifiable state of the work.
// No inflated production user counts. No invented deployment figures.
// The credibility of every other claim on this portfolio depends on these
// numbers being true.
//
// What is genuinely true and worth stating:
//   — 6 products in active, serious development with real architecture docs
//   — 2 domain models fully proven in vanilla JS before full-stack rebuild
//   — Every project starts with a domain model and decision record, not a repo
//   — Every product solves a specific Nigerian/African problem no existing
//     tool addresses correctly — zero generic tutorial clones
// ─────────────────────────────────────────────────────────────────────────────

/** @type {HomeMetric[]} */
export const HOME_METRICS = [
  {
    value: "6",
    label: "Products in active development",
    trend: "up",
    context: "EdTech, Fintech, and Retail all Nigerian market-specific",
  },
  {
    value: "2",
    label: "Domain models shipped as vanilla JS before any framework",
    trend: "neutral",
    context: "GradeForge and Ledgera domain proven, then stack chosen",
  },
  {
    value: "6+",
    label: "Architecture decision records documented",
    trend: "neutral",
    context: "Every project. Every significant tradeoff. Written before code.",
  },
  {
    value: "0",
    label: "Generic tutorial clones in this portfolio",
    trend: "neutral",
    context: "Every project solves a problem existing software gets wrong",
  },
];

export const SECTION_STATS = [
  {
    value: "5",
    label: "Core engineering principles",
  },
  {
    value: "6",
    label: "Products built under these rules",
  },
  {
    value: "100%",
    label: "Decisions documented before code",
  },
];

// HOME_METRICS schema:
//   value    — Display value. Numbers, units, prefixes all included here.
//   label    — What the number measures. One phrase.
//   context  — Supporting qualifier — timeframe, scope, measurement method.
//   trend    — "up" | "down" | "neutral" — direction indicator.
//   featured — true = PrimaryMetric (only one). false = SecondaryMetric.

/** @type {HomeMetric[]} */
export const PROOF_HOME_METRICS = [
  // ── FEATURED — Primary signal ─────────────────────────────────────────────
  {
    // (a) Architecture fact — verifiable from the GradeForge and Ledgera repos
    value: "2",

    // What the number measures — specific, not generic
    label:
      "Vanilla JS domain models that became Spring Boot service specifications",

    // Context — names the projects and the sequencing decision
    context: "GradeForge · Ledgera domain correct before stack was chosen",

    // Neutral: this is a process fact, not a growing metric
    trend: "neutral",

    // Only one entry may be featured: true
    featured: true,
  },

  // ── SECONDARY 1 — GradeForge grading engine ───────────────────────────────
  {
    // (a) Architecture fact — verified in the GradeForge calculation engine
    value: "5+",

    // What the number measures
    label: "Nigerian university grading scale variants",

    // Context — names the institutions and the key architectural decision
    context:
      "UNN · UNILAG · UI · OAU · NOUN one configurable engine, zero institution-specific special-casing",

    // Neutral: the count is stable by design
    trend: "neutral",

    featured: false,
  },

  // ── SECONDARY 2 — VendaCore offline recovery ──────────────────────────────
  {
    // (b) Tested behaviour — confirmed in simulated network failure scenarios
    value: "100%",

    // What the number measures — "in test scenarios" is part of the label
    label: "Offline transaction recovery in simulated scenarios",

    // Context — names the mechanism and the test condition
    context:
      "VendaCore · IndexedDB queue + idempotency key deduplication · tested against simulated NEPA outages",

    // Neutral: a binary pass/fail in testing, not a trending metric
    trend: "neutral",

    featured: false,
  },

  // ── SECONDARY 3 — ScholarHive semantic search ─────────────────────────────
  {
    // (c) Design target — documented specification, not a measured production result
    value: "< 400ms",

    // What the number measures — "design target" is part of the label
    label: "Semantic search response design target",

    // Context — names the technology and the indexing strategy
    context:
      "ScholarHive · pgvector with OpenAI embeddings, colocated in PostgreSQL target, not measured production latency",

    // Up: the target is being actively worked toward
    trend: "up",

    featured: false,
  },
];
