/// features/home/TechSelectorSection/TestimonialsColumn.jsx

//  components/sections/tech-selector/testimonials-column.jsx
// RSC-compatible — rendered inside the client TechSelector parent.
// No "use client" required.
//
// Refinements vs. original:
//
//   1. absolute children → conditional render + key={activeId}.
//      Original used absolute top/left children that collapsed the wrapper
//      to 0px height. New approach: only the active testimonial set is in
//      the DOM. key change triggers remount + animate-fade-in.
//
//   2. Content sized for two testimonials per category without scroll.
//      Testimonial card estimated height: ~168px.
//      Two cards + gap + header: ~372px — fits the ~518px panel height.
//
//   3. All colors reference TESTIMONIALS data tokens — no hardcoded values.

import { TESTIMONIALS } from "@/lib/data/techSelector";

// ── TestimonialCard ────────────────────────────────────────────────────────────

/**
 * TestimonialCard
 *
 * Individual testimonial. Compact card with:
 *   - Accent top edge in the testimonial's avatar color
 *   - Decorative opening quote mark
 *   - Italic quote body
 *   - Attribution row: avatar initials + name + role
 *
 * All colors come from the TESTIMONIALS data entry — no hardcoded values.
 *
 * @param {Object} testimonial - TESTIMONIALS entry
 */
function TestimonialCard({ testimonial: t }) {
  return (
    <article
      className="relative flex min-w-0 flex-col gap-2.5 overflow-hidden rounded-lg p-4"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      {/* Accent top edge — tapers right to transparent */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${t.avatarColor}55 0%, transparent 80%)`,
        }}
      />

      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          lineHeight: 1,
          color: t.avatarColor,
          opacity: 0.2,
          // Negative margin pulls the quote mark up against the card top
          // without consuming layout space from the content below.
          marginBottom: "-6px",
          userSelect: "none",
        }}
      >
        &ldquo;
      </div>

      {/* Quote body */}
      <p
        className="italic"
        style={{
          fontSize: "var(--text-xs)",
          lineHeight: "var(--leading-relaxed)",
          color: "var(--color-muted)",
        }}
      >
        {t.quote}
      </p>

      {/* Attribution row */}
      <footer
        className="flex items-center gap-2.5 pt-2.5"
        style={{ borderTop: "1px solid var(--color-border-sub)" }}
      >
        {/* Avatar initials */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.5rem",
            fontWeight: 800,
            background: t.avatarBg,
            color: t.avatarColor,
            borderColor: t.avatarBorder,
          }}
          aria-hidden="true"
        >
          {t.initials}
        </div>

        {/* Name + role */}
        <div className="flex flex-col gap-[2px] min-w-0">
          <span
            className="truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-fg)",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {t.name}
          </span>
          <span
            className="truncate"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              color: "var(--color-faint)",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {t.role}
          </span>
        </div>
      </footer>
    </article>
  );
}

// ── TestimonialsColumn ─────────────────────────────────────────────────────────

/**
 * TestimonialsColumn
 *
 * Right column of TechSelector.
 * Shows 2 testimonials for the active category.
 *
 * Cross-fade: key={activeId} on the list wrapper triggers a remount
 * on category switch. animate-fade-in (animations.css) re-runs on mount.
 *
 * Empty state is handled inline — retained as a defensive fallback if the
 * category data ever fails to provide an initial active item.
 *
 * @param {string|null} activeId - Active category id
 */
export function TestimonialsColumn({ activeId }) {
  const activeTestimonials = activeId ? (TESTIMONIALS[activeId] ?? []) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Column header — matches TechList header style */}
      <div
        className="px-5 py-3 border-b border-[var(--color-border-sub)] shrink-0"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
        }}
      >
        From collaborators
      </div>

      {/* Testimonial list */}
      {/*
        key={activeId} → remount on category change → animate-fade-in runs.
        flex-1 fills remaining column height after the header.
      */}
      <div
        key={activeId ?? "empty"}
        className="grid flex-1 gap-3 p-4 animate-fade-in sm:grid-cols-2 lg:flex lg:flex-col"
      >
        {activeTestimonials.length === 0 ? (
          // Empty state — centered in available space
          <div className="flex min-h-32 items-center justify-center sm:col-span-2 lg:min-h-0">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                letterSpacing: "0.06em",
              }}
            >
              Select a domain
            </span>
          </div>
        ) : (
          activeTestimonials.map((t, i) => (
            // Index key is stable per category — list order never changes
            <TestimonialCard key={i} testimonial={t} />
          ))
        )}
      </div>
    </div>
  );
}
