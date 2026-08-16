// lib/config/site.js
//
// Site-wide configuration. Single source of truth for values that appear
// across multiple surfaces — availability signal, site identity, social links.
//
// AVAILABILITY SIGNAL (DEC-029)
// ─────────────────────────────
// `available` is a boolean toggle. Changing it is a one-line edit.
// When true:  green dot + availability copy renders in the projects hero and nav.
// When false: the signal is entirely absent — no "unavailable" state renders.
//
// Update `availableFrom` and `availableFor` whenever `available` changes.
// Stale availability information damages credibility more than no signal at all.

export const siteConfig = {
  // ── Identity ───────────────────────────────────────────────────────────────
  name: "Alex Shedrach",
  title: "Senior Frontend Engineer",
  url: "https://alexshedrach.dev",
  description:
    "Senior Frontend Engineer building systems that work — not just interfaces that look good.",

  // ── Availability signal — per DEC-029 ─────────────────────────────────────
  //
  // available:     boolean — controls whether the signal renders at all.
  // availableFrom: string  — human-readable start date. Only shown when available: true.
  // availableFor:  string[] — types of work currently open to. Rendered as a list
  //                           in the availability tooltip or expanded signal.
  //
  // When setting available: false, leave availableFrom and availableFor in place
  // so the values are ready when availability returns.
  available: true,
  availableFrom: "July 2026",
  availableFor: [
    "Full-time engineering roles",
    "Contract and consulting engagements",
    "Technical architecture reviews",
  ],

  // ── Social and contact links ───────────────────────────────────────────────
  links: {
    github: "https://github.com/alexshedrach",
    linkedin: "https://linkedin.com/in/alexshedrach",
    twitter: "https://twitter.com/alexshedrach",
    email: "hello@alexshedrach.dev",
  },
};
