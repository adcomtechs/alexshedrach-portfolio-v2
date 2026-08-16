// data/about.js
//
// Content for AboutTeaser (home), AboutModal (expanded), and AboutStats.
//
// CONTENT STANDARD — every field must be:
//   Specific: references named projects, named institutions, named decisions
//   Honest:   no inflated years, no invented metrics, no "passionate about"
//   Yours:    only you can write this — Nigerian context, domain-first process,
//             Adcomtechs brand, UNN background
//
// ─────────────────────────────────────────────────────────────────────────────
// ABOUT_INTRO
// Drives the home teaser: headline, subheading, body, blockquote, signature.
// ─────────────────────────────────────────────────────────────────────────────

export const ABOUT_INTRO = {
  // H2 heading — the first thing a visitor reads in the about column.
  // Makes the positioning claim immediately: Nigerian context, real problems, not tutorials.
  headline:
    "I build software that solves problems the existing tools get wrong.",

  // Mono subheading — role + brand, no inflated seniority.
  subheading: "Software Engineer · CS Student, UNN · Founder, Adcomtechs",

  // Body paragraph — 3 sentences max. Who you are, what you build, what makes it different.
  // Appears below the headline in the home teaser.
  body:
    "I am a Computer Science student at the University of Nigeria, Nsukka, " +
    "building full-stack software for problems that existing tools solve poorly " +
    "or not at all for the Nigerian market. Every product starts with a domain " +
    "model before a framework is chosen, targets Nigerian deployment constraints " +
    "by design, and ships with written architectural decisions. " +
    "Adcomtechs is the company behind the work.",

  // Blockquote — rendered in the editorial aside inside the component.
  // First-person, opinionated, specific to your actual process.
  // This should be the most memorable sentence on the entire about section.
  pullquote:
    "I build the domain in vanilla JavaScript before I open a framework. " +
    "Not because it is faster because if I cannot model the problem in plain " +
    "functions, I do not understand it well enough to design a database schema for it.",

  // The paragraph that follows the blockquote — contextualises the quote with Adcomtechs.
  pullquoteContext:
    "Adcomtechs started as a tutorials and education brand. It is becoming a " +
    "software company. Six products for university attendance, CGPA transcripts, " +
    "retail POS, academic materials, personal finance, and institutional management " +
    "are all in active development. Every one of them was designed for how Nigerian " +
    "infrastructure actually behaves, not how Western deployment guides assume it should.",

  // Signature line — bottom of the editorial column.
  // Keep Adcomtechs on the second line as the brand anchor.
  name: "Alex Shedrach Uchenna",
  brandHandle: "Adcomtechs · adcomtechs.com",

  // Profile image alt text — descriptive, no inflated title.
  imageAlt: "Founder of Adcomtechs — Software Engineer and CS Student, UNN",

  // CTA labels
  modalButtonLabel: "How I build",
  fullPageLabel: "Full engineering philosophy",

  // Resume — served from /public, same-origin. See AboutTeaser.jsx for the
  // download behavior (explicit filename + target="_blank" fallback).
  // Verify this file actually exists in /public before deploying — a
  // missing asset here fails silently (a plain anchor click, not a fetch
  // with error handling) and won't show up in a build or lint pass.
  resumePath: "/alex_shedrach_uchenna_resume.pdf",
  resumeLabel: "Download résumé",
};

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT_STATS
// Three honest, verifiable numbers. Rendered in the AboutStats component
// below the profile image in the left column.
//
// WHY THESE THREE:
//   "6 Products" — the most direct statement of output. Verifiable.
//   "2 Stacks"   — shows full-stack range (JavaScript ecosystem + Java/Spring Boot)
//                  without claiming abstract "experience years."
//   "100%"       — the documentation practice. Every project, every tradeoff written.
//                  This is the claim that separates you from most developers at any level.
//
// WHAT WAS REMOVED AND WHY:
//   "5+ Years shipping production code"  → not accurate for a student
//   "20+ Projects delivered end-to-end"  → not verifiable and inflated
//   "3 Founding-stage products built"    → vague; replaced by "6 Products in development"
// ─────────────────────────────────────────────────────────────────────────────

export const ABOUT_STATS = [
  {
    value: "6",
    label: "Products in development",
  },
  {
    value: "2",
    label: "Full stacks (JS + Java)",
  },
  {
    value: "100%",
    label: "Decisions documented",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT_EXTENDED
// Rendered inside the AboutModal — opened when the user clicks "How I build".
// Four sections, each with a heading and a content paragraph.
// These are the slower, deeper reads. The reader chose to open the modal —
// they are already interested. Give them the full argument.
// ─────────────────────────────────────────────────────────────────────────────

export const ABOUT_EXTENDED = [
  {
    id: "approach",
    heading: "How I approach every problem",
    content:
      "Domain first, framework second. Before a Spring Boot class or a Next.js " +
      "page exists, I build the core logic in vanilla JavaScript no dependencies, " +
      "no abstractions. GradeForge's CGPA calculation engine was fully working in " +
      "plain functions, correctly handling carry-over courses, repeat units, and " +
      "5-point vs 4-point scale variance, before the Java codebase existed. " +
      "Ledgera's budget and envelope logic was proven the same way. " +
      "In both cases, the vanilla JS prototype became the specification document " +
      "for the Spring Boot service. This sequence is not slower — it prevents " +
      "the architectural rework that happens when you design a database before " +
      "you understand the domain.",
  },

  {
    id: "environment",
    heading: "Why the environment shapes the architecture",
    content:
      "VendaCore is offline-first with an IndexedDB transaction queue because NEPA " +
      "outages are a daily operational reality for Nigerian retailers not an edge case. " +
      "AttendIQ uses naira Paystack payouts because USD PayPal is effectively unusable " +
      "for Nigerian students. GradeForge generates NUC-formatted transcripts because " +
      "that is the document Nigerian postgraduate admissions offices and NYSC accept. " +
      "None of these are workarounds. Each is a first-class architectural decision " +
      "made before a line of feature code was written. Architecture that ignores its " +
      "deployment environment is architecture that fails its users.",
  },

  {
    id: "background",
    heading: "Where Adcomtechs comes from",
    content:
      "Adcomtechs started as a personal brand for computer science tutorials and education " +
      "while I was still learning to build software seriously. The constraint of teaching " +
      "what I was learning forced a level of understanding that passive studying never " +
      "produces you cannot teach something you only partially understand. That background " +
      "shaped how I build: I document decisions at the moment they are made, I write the " +
      "domain model before the framework, and I treat every architectural choice as " +
      "something the next engineer deserves to inherit with context, not just code. " +
      "Adcomtechs is now a software company with six products in active development.",
  },

  {
    id: "now",
    heading: "What I am building right now",
    content:
      "AttendIQ ships first a QR code attendance system for Nigerian universities " +
      "with cryptographic proxy-attendance prevention, built on Spring Boot and Next.js 16, " +
      "documented as a full YouTube tutorial series. GradeForge follows: CGPA calculation " +
      "and NUC-compliant transcript generation for Nigerian students, rebuilt from the " +
      "proven vanilla JS prototype. UniCore the full university management system " +
      "embeds both as modules. VendaCore is the offline-first retail POS for Nigerian SMEs. " +
      "ScholarHive is the long game: a Turborepo monorepo marketplace for African academic " +
      "materials with semantic search, naira contributor payouts, and AI-powered document " +
      "similarity scoring. Every product on this list solves a problem no existing tool " +
      "addresses correctly for the Nigerian market.",
  },
];