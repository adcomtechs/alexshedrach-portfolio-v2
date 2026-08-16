// ─────────────────────────────────────────────────────────────────────────────
// PHILOSOPHY_STEPS
//
// id must match a key in STEP_ICONS inside philosophy-section.jsx:
//   "architecture" → LayoutGrid
//   "production"   → Layers
//   "internals"    → Cpu
//
// screenshotFilename is the intended asset name — used as the placeholder
// label until the real screenshot is dropped into /public/screenshots/.
// See replacement notes at the bottom of this file.
// ─────────────────────────────────────────────────────────────────────────────

/** @type {PhilosophyStep[]} */
export const PHILOSOPHY_STEPS = [
  {
    id: "architecture",
    number: "01",
    title: "Domain First, Framework Second",
    description:
      "Before a single class is written, the domain is modelled in the " +
      "simplest possible medium — plain functions, plain objects, no " +
      "dependencies. The framework is chosen after the domain is understood, " +
      "not before. GradeForge's Spring Boot service was specified entirely " +
      "from a working vanilla JavaScript prototype that proved every edge case " +
      "— carry-over courses, 5-point vs 4-point scale variance, incomplete " +
      "semester logic — before the Java codebase existed. The prototype " +
      "became the specification.",
    screenshot: null,
    screenshotAlt:
      "GradeForge vanilla JavaScript prototype — the domain model that " +
      "specified the Spring Boot service before any Java was written",
    // Replace with: screenshot of the working vanilla JS GradeForge in the
    // browser — ideally showing the CGPA calculation output side-by-side
    // with the function that produces it. This is the most direct visual
    // proof of the "prototype as specification" principle.
    screenshotFilename: "gradeforge-vanilla-prototype.png",
  },

  {
    id: "production",
    number: "02",
    title: "Environment Shapes Architecture",
    description:
      "The constraints of the deployment environment are first-class " +
      "architectural inputs — not afterthoughts discovered in production. " +
      "VendaCore queues transactions in IndexedDB and syncs on reconnect " +
      "because NEPA outages are a daily operational reality for Nigerian " +
      "retailers — not an edge case. AttendIQ uses naira Paystack payouts " +
      "because that is the payment infrastructure Nigerian contributors can " +
      "actually receive. GradeForge generates NUC-formatted transcripts " +
      "because that is the document Nigerian postgraduate admissions offices " +
      "accept. Architecture that ignores its environment fails its users.",
    screenshot: null,
    screenshotAlt:
      "VendaCore offline transaction queue — showing the IndexedDB sync " +
      "UI with queued transactions pending reconnection",
    // Replace with: screenshot of VendaCore's offline mode indicator and
    // queued transaction UI — ideally captured during a simulated offline
    // scenario showing the sync queue count and the "Sync Now" fallback
    // button. This is the single most visually distinctive feature of the
    // entire portfolio because no existing POS tutorial has ever shown it.
    screenshotFilename: "vendacore-offline-queue.png",
  },

  {
    id: "internals",
    number: "03",
    title: "Decisions Documented Before Code",
    description:
      "Every significant architectural decision is written down at the moment " +
      "it is made — not reconstructed afterwards. The reasoning behind the " +
      "decision matters as much as the decision itself. The options considered " +
      "and rejected matter as much as the option chosen. AttendIQ's choice of " +
      "a stateful nonce JWT over a stateless pure JWT, ScholarHive's choice of " +
      "pgvector over Pinecone, UniCore's choice of a modular monolith over " +
      "microservices — all written before the code that implements them. " +
      "The engineer who reads this codebase next year deserves to inherit " +
      "context, not just code.",
    screenshot: null,
    screenshotAlt:
      "AttendIQ architecture decision record — the written tradeoff " +
      "analysis for the nonce-based JWT token model",
    // Replace with: screenshot of a real ADR document — the AttendIQ nonce
    // JWT decision is ideal because it is the most technically interesting
    // and shows the exact tradeoff reasoning (stateful nonce vs stateless
    // JWT, why the database constraint is the enforcement mechanism, why
    // Redis was considered and rejected). A markdown file in VS Code or a
    // clean Notion/Obsidian view both work. The content matters more than
    // the presentation tool.
    screenshotFilename: "attendiq-adr-document.png",
  },
];

/** @type {PhilosophyTestimonial[]} */
export const PHILOSOPHY_TESTIMONIALS = [
  // ── SLIDE 1 ──────────────────────────────────────────────────────────────

  {
    id: "t1",
    // ⚠ PLACEHOLDER — replace with real quote before going live
    quote:
      "What stood out wasn't just that it worked — it was that **every decision had a reason**. " +
      "I asked why the attendance token was stateful and got a three-paragraph answer " +
      "referencing the specific failure mode a stateless JWT wouldn't prevent. " +
      "That kind of thinking is uncommon at any stage.",
    // ⚠ Replace with real name
    name: "— Real Name Here",
    // ⚠ Replace with real role, e.g. "300L Computer Science, UNN"
    role: "Collaborator — UNN Computer Science",
    // ⚠ Replace with real initials
    initials: "RN",
    accent: "accent",
  },

  {
    id: "t2",
    // ⚠ PLACEHOLDER — replace with real quote before going live
    quote:
      "The GradeForge prototype impressed me because it solved the actual problem Nigerian " +
      "students have — not the problem a Western GPA calculator assumes we have. " +
      "**The carryover logic alone showed more domain understanding** than most " +
      "final-year projects I have reviewed.",
    // ⚠ Replace with real name
    name: "— Real Name Here",
    // ⚠ Replace with real role, e.g. "Lecturer, Dept. of Computer Science, UNN"
    role: "Reviewer — Nigerian University Context",
    // ⚠ Replace with real initials
    initials: "RN",
    accent: "info",
  },

  // ── SLIDE 2 ──────────────────────────────────────────────────────────────

  {
    id: "t3",
    // ⚠ PLACEHOLDER — replace with real quote before going live
    quote:
      "Most developers I see skip the modelling phase and go straight to the framework. " +
      "Seeing the vanilla JS GradeForge prototype — fully working, correctly handling " +
      "every edge case — and knowing it was built **before the Spring Boot codebase** " +
      "even existed changed how I think about my own process.",
    // ⚠ Replace with real name
    name: "— Real Name Here",
    // ⚠ Replace with real role, e.g. "Software Engineer, Lagos"
    role: "Nigerian Developer Community",
    // ⚠ Replace with real initials
    initials: "RN",
    accent: "warning",
  },

  {
    id: "t4",
    // ⚠ PLACEHOLDER — replace with real quote before going live
    quote:
      "The offline-first architecture in VendaCore is the first time I have seen someone " +
      "in this space actually design for Nigerian infrastructure rather than apologise for it. " +
      "**Building the sync queue before building the happy path** is the right order " +
      "of priorities. It shows the environment was taken seriously from the start.",
    // ⚠ Replace with real name
    name: "— Real Name Here",
    // ⚠ Replace with real role, e.g. "Retail SME Advisor / Tech Community"
    role: "Nigerian SME & Tech Community",
    // ⚠ Replace with real initials
    initials: "RN",
    accent: "accent",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ACCENT_TOKENS
//
// Colour tokens for testimonial card accent bars, glows, and initials badges.
// These are styling values — update the CSS variable names if your design
// token system uses different naming conventions.
//
// No content changes needed here — this is purely a visual configuration.
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Record<string, { text: string; bg: string; border: string }>} */
export const ACCENT_TOKENS = {
  // Primary brand accent — lime/neon green
  accent: {
    text: "var(--color-accent)",
    bg: "var(--color-accent-bg)",
    border: "rgba(181, 242, 61, 0.25)",
  },

  // Informational — cool blue
  info: {
    text: "var(--color-info)",
    bg: "color-mix(in srgb, var(--color-info) 12%, transparent)",
    border: "color-mix(in srgb, var(--color-info) 30%, transparent)",
  },

  // Warning — amber/yellow
  warning: {
    text: "var(--color-warning)",
    bg: "color-mix(in srgb, var(--color-warning) 10%, transparent)",
    border: "color-mix(in srgb, var(--color-warning) 28%, transparent)",
  },

  // Success — for future use if you add a fourth accent type
  success: {
    text: "var(--color-success, #4ade80)",
    bg: "color-mix(in srgb, var(--color-success, #4ade80) 10%, transparent)",
    border:
      "color-mix(in srgb, var(--color-success, #4ade80) 28%, transparent)",
  },
};
