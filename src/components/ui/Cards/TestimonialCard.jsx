// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIAL CARD
//
// Extracted from philosophy-section.jsx — identical visual output.
// Accent tokens (color, bg, border) come from ACCENT_TOKENS keyed by
// the testimonial's `accent` field.
//
// Structure:
//   Top accent bar  — thin gradient line above the card
//   Ambient glow    — radial blob behind the card content, matching accent
//   Opening quote   — large decorative glyph, low opacity
//   Quote body      — italic, parseBold() for **bold** markers
//   Author footer   — initials badge + name + role
// ─────────────────────────────────────────────────────────────────────────────

import { ACCENT_TOKENS } from "@/lib/data/philosophy";
import { parseBold } from "@/lib/utils";
import { memo } from "react";

export const TestimonialCard = memo(function TestimonialCard({ testimonial }) {
  const tokens = ACCENT_TOKENS[testimonial.accent] ?? ACCENT_TOKENS.accent;

  return (
    <article
      className="relative flex flex-col w-[50%] flex-shrink-0 min-h-[320px] overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border-sub)",
        borderTop: "1px solid var(--color-border-sub)",
      }}
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${tokens.text}55, transparent)`,
        }}
      />

      {/* Ambient glow behind content */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: tokens.text,
          opacity: 0.04,
          filter: "blur(40px)",
        }}
      />

      <div className="relative flex flex-col gap-5 h-full p-8 pt-10">
        {/* Opening quote glyph — decorative, suppressed from AT */}
        <div
          aria-hidden="true"
          className="select-none leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            lineHeight: 1,
            color: tokens.text,
            opacity: 0.2,
          }}
        >
          &ldquo;
        </div>

        {/* Quote body */}
        <p
          className="flex-1 italic"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          {parseBold(testimonial.quote)}
        </p>

        {/* Author footer */}
        <footer
          className="flex items-center gap-3 pt-4"
          style={{ borderTop: "1px solid var(--color-border-sub)" }}
        >
          {/* Initials badge */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: tokens.bg,
              border: `1px solid ${tokens.border}`,
              color: tokens.text,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-xs)",
            }}
            aria-hidden="true"
          >
            {testimonial.initials}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="truncate"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                color: "var(--color-fg)",
              }}
            >
              {testimonial.name}
            </span>
            <span
              className="truncate"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
              }}
            >
              {testimonial.role}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
});
