// lib/data/techSelector.js
//
// Single data source for the TechSelector section.
// Three exports consumed by three separate column components:
//
//   TECH_CATEGORIES → TechList (left column)
//   TECH_PROJECTS   → ProjectCardViewport (center column)
//   TESTIMONIALS    → TestimonialsColumn (right column)
//
// Content designed to fit the panel height without scroll:
//   Each category: 4 chips, 2 stats, 2 features, 2 testimonials.

// ─────────────────────────────────────────────────────────────────────────────
// TECH_CATEGORIES
// Drives the left column (TechList).
// Each id must match an entry in TECH_PROJECTS and TESTIMONIALS.
// ─────────────────────────────────────────────────────────────────────────────

export const TECH_CATEGORIES = [
  // ── 01 · JavaScript Ecosystem ────────────────────────────────────────────
  // The primary frontend and Node.js backend stack.
  // ScholarHive is the representative project — it uses Turborepo to manage
  // three Next.js 16 apps and five Fastify services as one coherent monorepo.
  {
    id: "javascript",
    label: "JavaScript Ecosystem",
    description: "Next.js 16 · TypeScript · Turborepo · Node.js",
    color: {
      text: "var(--color-accent)",
      bg: "var(--color-accent-bg)",
      border: "rgba(181,242,61,0.25)",
    },
    chips: ["Next.js 16", "TypeScript", "Turborepo", "Node.js"],
    thumbBg: "linear-gradient(135deg, #0c1a08 0%, #162a0e 100%)",
    thumbGlow: "rgba(181,242,61,0.18)",
    // Label shown in the card thumbnail visual header
    thumbLabel: "ScholarHive — Monorepo",
  },

  // ── 02 · Java & Spring Boot ───────────────────────────────────────────────
  // The enterprise backend stack. Spring Boot 3 + Java 21 powers UniCore,
  // AttendIQ, GradeForge, and VendaCore. AttendIQ is the representative
  // project — its nonce-based JWT architecture is the most technically
  // distinctive backend decision in the portfolio.
  {
    id: "java",
    label: "Java & Spring Boot",
    description: "Spring Boot 3 · Java 21 · PostgreSQL · Maven",
    color: {
      text: "var(--color-info)",
      bg: "rgba(96,165,250,0.08)",
      border: "rgba(96,165,250,0.25)",
    },
    chips: ["Spring Boot 3", "Java 21", "PostgreSQL", "Maven"],
    thumbBg: "linear-gradient(135deg, #080f1f 0%, #0d1628 100%)",
    thumbGlow: "rgba(96,165,250,0.18)",
    thumbLabel: "AttendIQ — Token Service",
  },

  // ── 03 · Offline-First Systems ────────────────────────────────────────────
  // The architecture pattern that differentiates Adcomtechs from any
  // developer building for a stable-electricity, always-online market.
  // VendaCore is the only project in this portfolio — and one of very few
  // anywhere — that treats offline operation as the primary mode, not a
  // degraded fallback. The IndexedDB queue + idempotency key sync pattern
  // is the representative system.
  {
    id: "offline",
    label: "Offline-First Systems",
    description: "PWA · IndexedDB · Background Sync · Service Workers",
    color: {
      text: "var(--color-warning)",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.25)",
    },
    chips: ["PWA", "IndexedDB", "Next.js 16", "Spring Boot"],
    thumbBg: "linear-gradient(135deg, #1a1000 0%, #251800 100%)",
    thumbGlow: "rgba(245,158,11,0.18)",
    thumbLabel: "VendaCore — Offline Queue",
  },

  // ── 04 · AI & Semantic Search ─────────────────────────────────────────────
  // pgvector within PostgreSQL — not a separate vector database — for
  // colocation with relational metadata. OpenAI embeddings for semantic
  // document similarity and automatic subject tagging.
  // ScholarHive's search layer is the representative system.
  {
    id: "ai",
    label: "AI & Semantic Search",
    description: "pgvector · OpenAI API · Embeddings · PostgreSQL",
    color: {
      // One-off purple — not yet a design token. Add --color-ai to
      // themes.css if this becomes a recurring color in the system.
      text: "#c084fc",
      bg: "rgba(192,132,252,0.08)",
      border: "rgba(192,132,252,0.25)",
    },
    chips: ["pgvector", "OpenAI API", "PostgreSQL", "Node.js"],
    thumbBg: "linear-gradient(135deg, #120820 0%, #1a0d2e 100%)",
    thumbGlow: "rgba(192,132,252,0.18)",
    thumbLabel: "ScholarHive — Semantic Search",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TECH_PROJECTS
// One entry per category. Center column renders the active entry.
//
// METRIC HONESTY RULE:
//   Every stat must be one of:
//   (a) An architecture fact — "5 services", "3 Next.js apps", "1 shared DB"
//   (b) Tested behaviour — proven in a simulated or controlled scenario
//   (c) A documented design target — stated as such, not as a production result
//
//   Fabricated production metrics ("40k+ users", "99.97% uptime") were
//   removed because they contradict the honest stats on the rest of the
//   portfolio and undermine every other credibility claim on the page.
//
// href values: ⚠ Update to real project slugs before going live.
// ─────────────────────────────────────────────────────────────────────────────

export const TECH_PROJECTS = {
  // ── javascript → ScholarHive ────────────────────────────────────────────
  javascript: {
    title: "ScholarHive",
    subtitle: "Academic marketplace · Turborepo monorepo",

    // "Private Beta" — accurate: seeding with UNN CSC department before launch
    badge: {
      label: "Private Beta",
      color: "var(--color-accent)",
      bg: "var(--color-accent-bg)",
      border: "rgba(181,242,61,0.3)",
    },

    // Architecture facts — both verifiable from the codebase structure
    stats: [
      {
        value: "5",
        label: "Independent Node.js Fastify services in the monorepo",
      },
      {
        value: "3",
        label: "Next.js 16 apps (student portal, admin, contributor portal)",
      },
    ],

    features: [
      {
        strong: "Turborepo monorepo architecture",
        text:
          "manages three Next.js 16 apps and five Fastify services with shared " +
          "TypeScript packages, unified build caching, and independent deployment " +
          "pipelines — without the coordination overhead of separate repositories.",
      },
      {
        strong: "Paystack split-payment contributor flow",
        text:
          "revenue from each material download is split between the platform and " +
          "the contributing student, paid in naira not USD PayPal, which is " +
          "unusable for most Nigerian students.",
      },
    ],

    // ⚠ Update to real slug before going live
    href: "/projects/scholarhive",
  },

  // ── java → AttendIQ ────────────────────────────────────────────────────
  java: {
    title: "AttendIQ",
    subtitle: "QR attendance · Cryptographic proxy prevention",

    badge: {
      label: "In Development",
      color: "var(--color-info)",
      bg: "rgba(96,165,250,0.08)",
      border: "rgba(96,165,250,0.3)",
    },

    // (a) Architecture fact + (b) tested behaviour
    stats: [
      {
        value: "0",
        label:
          "Duplicate scan records enforced at DB unique constraint level",
      },
      {
        value: "< 15 min",
        label: "Token validity window per lecture configurable by lecturer",
      },
    ],

    features: [
      {
        strong: "Stateful nonce JWT model",
        text:
          "each QR token contains a signed JWT payload plus a single-use nonce " +
          "stored in PostgreSQL. Stateless JWTs cannot be consumed the nonce " +
          "is the mechanism that makes every token single-use regardless of " +
          "who holds it.",
      },
      {
        strong: "Database-layer proxy prevention",
        text:
          "a PostgreSQL unique constraint on (student_id, lecture_id) is the " +
          "safety net. Duplicate scan attempts fail at the constraint before " +
          "they reach application code — no locking, no race conditions.",
      },
    ],

    // ⚠ Update to real slug before going live
    href: "/projects/attendiq",
  },

  // ── offline → VendaCore ────────────────────────────────────────────────
  offline: {
    title: "VendaCore",
    subtitle: "Nigerian retail POS · Offline-first architecture",

    badge: {
      label: "In Development",
      color: "var(--color-warning)",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.3)",
    },

    // (b) tested in simulated network failure scenario
    stats: [
      {
        value: "100%",
        label: "Transaction recovery in simulated offline scenarios",
      },
      {
        value: "< 2s",
        label: "Sync queue flush time on network reconnect in testing",
      },
    ],

    features: [
      {
        strong: "IndexedDB offline transaction queue",
        text:
          "every sale is written to IndexedDB first regardless of network " +
          "state. A service worker processes the queue in FIFO order on " +
          "reconnect. The POS terminal continues operating through full NEPA " +
          "outages without data loss.",
      },
      {
        strong: "Idempotency key deduplication",
        text:
          "each queued transaction carries a UUID generated at creation time. " +
          "The Spring Boot sync endpoint rejects any transaction whose key " +
          "already exists preventing duplicate records when the queue is " +
          "flushed after a long offline period.",
      },
    ],

    // ⚠ Update to real slug before going live
    href: "/projects/vendacore",
  },

  // ── ai → ScholarHive semantic search ──────────────────────────────────
  ai: {
    title: "ScholarHive Semantic Search",
    subtitle: "Academic documents · pgvector similarity",

    badge: {
      label: "Private Beta",
      color: "#c084fc",
      bg: "rgba(192,132,252,0.08)",
      border: "rgba(192,132,252,0.3)",
    },

    // (a) architecture fact + (c) documented design target
    stats: [
      {
        value: "200",
        label: "Documents in private beta seed set UNN CSC department",
      },
      {
        value: "< 400ms",
        label: "Semantic search response design target, pgvector indexed",
      },
    ],

    features: [
      {
        strong: "pgvector within PostgreSQL",
        text:
          "document embeddings are colocated with relational material metadata " +
          "in one PostgreSQL instance no separate vector database, no network " +
          "hop between similarity search and metadata retrieval. A deliberate " +
          "decision to keep the infrastructure footprint minimal during beta.",
      },
      {
        strong: "Automatic subject tagging on upload",
        text:
          "when a document is uploaded, an OpenAI embedding classifies and " +
          "assigns subject, course level, institution, and topic tags before " +
          "the material goes live reducing the manual tagging burden on " +
          "contributors to zero.",
      },
    ],

    // ⚠ Update to real slug before going live
    href: "/projects/scholarhive",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
//
// Two per category. Right column renders the active set.
// Quotes are short by design — must fit the panel height without scroll.
//
// ⚠ ALL ENTRIES ARE PLACEHOLDERS.
//   The previous version used named people as if they were real testimonials.
//   Every entry below is explicitly marked for replacement before going live.
//
//   WHO TO APPROACH FOR REAL TESTIMONIALS PER CATEGORY:
//
//   javascript (ScholarHive):
//     Nigerian developers who have seen the Turborepo monorepo structure,
//     reviewed the Next.js 16 codebase, or tested the contributor flow.
//
//   java (AttendIQ):
//     A UNN lecturer who has seen the attendance system demoed.
//     A CS classmate who reviewed the nonce JWT architecture.
//
//   offline (VendaCore):
//     A Nigerian retail business owner who has seen the offline mode demoed.
//     A developer who has reviewed the IndexedDB sync architecture.
//
//   ai (ScholarHive Semantic Search):
//     A Nigerian developer or CS student who tested the semantic search beta.
//     Anyone who reviewed the pgvector embedding pipeline.
//
//   See also: TESTIMONIAL REPLACEMENT GUIDE in data/philosophy.js
//   (same approach applies here — ask for 2-3 sentences, name, and role)
// ─────────────────────────────────────────────────────────────────────────────

export const TESTIMONIALS = {
  // ── javascript · ScholarHive ──────────────────────────────────────────
  javascript: [
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "The monorepo structure is the clearest Turborepo setup I've seen " +
        "from a solo developer. Every service boundary is deliberate " +
        "nothing shares internals it shouldn't.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "Full-Stack Developer, Lagos"
      role: "Nigerian Developer Community",
      initials: "RN",
      avatarColor: "var(--color-accent)",
      avatarBg: "var(--color-accent-bg)",
      avatarBorder: "rgba(181,242,61,0.3)",
    },
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "The Paystack contributor split is the feature no existing academic " +
        "platform has. That one decision makes the upload incentive real " +
        "for Nigerian students in a way CourseHero never could.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "CS Student, University of Lagos"
      role: "Nigerian Academic Community",
      initials: "RN",
      avatarColor: "var(--color-accent)",
      avatarBg: "var(--color-accent-bg)",
      avatarBorder: "rgba(181,242,61,0.3)",
    },
  ],

  // ── java · AttendIQ ───────────────────────────────────────────────────
  java: [
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "The nonce model is the right call. A stateless JWT forwards too " +
        "easily I've seen that exact attack in every university I've " +
        "taught at. The database constraint as the final guard is correct.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "Lecturer, Dept. of Computer Science, UNN"
      role: "UNN Computer Science Department",
      initials: "RN",
      avatarColor: "var(--color-info)",
      avatarBg: "rgba(96,165,250,0.08)",
      avatarBorder: "rgba(96,165,250,0.3)",
    },
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "The Spring Boot module organisation is cleaner than most final-year " +
        "projects I've reviewed. Domain language in the class names " +
        "CarryoverCourseResolver, not StatusHandler. That's discipline.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "300L CS Student, UNN"
      role: "UNN Computer Science, Peer Review",
      initials: "RN",
      avatarColor: "var(--color-info)",
      avatarBg: "rgba(96,165,250,0.08)",
      avatarBorder: "rgba(96,165,250,0.3)",
    },
  ],

  // ── offline · VendaCore ───────────────────────────────────────────────
  offline: [
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "Every POS system I've tried stops working when light goes. This one " +
        "kept running through a four-hour outage and synced everything " +
        "the moment power came back. That's what we actually need.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "Supermarket Owner, Nsukka"
      role: "Nigerian Retail Business Owner",
      initials: "RN",
      avatarColor: "var(--color-warning)",
      avatarBg: "rgba(245,158,11,0.08)",
      avatarBorder: "rgba(245,158,11,0.3)",
    },
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "The idempotency key approach is the correct solution to the sync " +
        "duplication problem. I've seen developers solve this with locks " +
        "and get it wrong. UUID keys per transaction is simpler and safer.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "Backend Developer, Lagos"
      role: "Nigerian Developer — Architecture Review",
      initials: "RN",
      avatarColor: "var(--color-warning)",
      avatarBg: "rgba(245,158,11,0.08)",
      avatarBorder: "rgba(245,158,11,0.3)",
    },
  ],

  // ── ai · ScholarHive Semantic Search ─────────────────────────────────
  ai: [
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "I typed 'electromagnetic induction past questions UNN PHY 201' and " +
        "it returned the right documents without those exact words appearing " +
        "in the titles. That's the search experience we've never had before.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "200L Physics Student, UNN"
      role: "Private Beta Tester — UNN Student",
      initials: "RN",
      avatarColor: "#c084fc",
      avatarBg: "rgba(192,132,252,0.08)",
      avatarBorder: "rgba(192,132,252,0.3)",
    },
    {
      // ⚠ PLACEHOLDER — replace with real quote before going live
      quote:
        "Choosing pgvector over Pinecone and keeping everything in one " +
        "Postgres instance is the pragmatic call for a solo-built beta. " +
        "The colocation advantage is real and the tradeoff is documented.",
      // ⚠ Replace with real name
      name: "— Real Name Here",
      // ⚠ Replace with real role, e.g. "Developer, Nigerian AI Community"
      role: "Nigerian Developer — AI Architecture Review",
      initials: "RN",
      avatarColor: "#c084fc",
      avatarBg: "rgba(192,132,252,0.08)",
      avatarBorder: "rgba(192,132,252,0.3)",
    },
  ],
};
