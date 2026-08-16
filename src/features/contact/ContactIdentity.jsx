// features/contact/ContactIdentity/ContactIdentity.jsx
// RSC — no client directive required.
//
// Compact identity anchor. Renders in the right column of the ContactHero
// on desktop (lg+). Hidden on mobile — the hero heading already carries
// the identity signal at that viewport width and the form needs full width.
//
// Purpose: re-establish who the visitor is writing to for cold arrivals
// (direct link, search) without rebuilding the full Home hero.
//
// Content:
//   — Avatar (photo or initials fallback)
//   — Name + role
//   — One-line positioning statement
//   — Three proof points (metrics or facts — not adjectives)
//   — Thin divider
//   — Discipline tags
//
// All content is data-driven from CONTACT_IDENTITY below.
// Update the data — the component layout does not change.

import { CONTACT_IDENTITY } from "./contact-data";

export function ContactIdentity() {
  const {
    initials,
    name,
    role,
    positioning,
    proofPoints,
    disciplines,
    photoUrl,
  } = CONTACT_IDENTITY;

  return (
    // Hidden on mobile — desktop (lg+) only
    <div
      className="hidden lg:flex flex-col gap-6 h-full"
      aria-label="About Alex Shedrach"
    >
      {/* Card shell */}
      <div
        className="relative flex flex-col gap-6 p-6 rounded-2xl h-full"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-sub)",
        }}
      >
        {/* Top accent line — mirrors ContactForm */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-6 right-6 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-border), transparent)",
          }}
        />

        {/* Avatar + name block */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              background: "var(--color-accent-bg)",
              border: "1px solid rgba(181,242,61,0.25)",
            }}
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  letterSpacing: "var(--tracking-tight)",
                }}
                aria-hidden="true"
              >
                {initials}
              </span>
            )}

            {/* Online indicator dot */}
            <span
              className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full"
              style={{
                background: "var(--color-success)",
                border: "2px solid var(--color-surface)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Name + role */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <p
              className="truncate"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-md)",
                fontWeight: 600,
                color: "var(--color-fg)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {name}
            </p>
            <p
              className="truncate"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {role}
            </p>
          </div>
        </div>

        {/* Positioning statement */}
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          {positioning}
        </p>

        {/* Proof points */}
        <ul className="flex flex-col gap-3" role="list">
          {proofPoints.map(({ value, label }, i) => (
            <li key={i} className="flex items-baseline gap-2.5">
              {/* Value */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-md)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight: 1,
                  minWidth: "3rem",
                }}
              >
                {value}
              </span>

              {/* Separator */}
              <span
                aria-hidden="true"
                className="w-px h-3 shrink-0 self-center"
                style={{ background: "var(--color-border)" }}
              />

              {/* Label */}
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-faint)",
                  lineHeight: "var(--leading-snug)",
                }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{ borderTop: "1px solid var(--color-border-sub)" }}
        />

        {/* Discipline tags */}
        <div className="flex flex-wrap gap-2" aria-label="Areas of focus">
          {disciplines.map((discipline) => (
            <span
              key={discipline}
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-mono)",
                color: "var(--color-faint)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border-sub)",
                borderRadius: "6px",
                padding: "3px 10px",
                letterSpacing: "0.01em",
              }}
            >
              {discipline}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactIdentity;
