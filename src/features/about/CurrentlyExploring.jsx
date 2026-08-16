// features/about/CurrentlyExploring.jsx
// RSC — no client directive required. Purely presentational, no
// interactivity, so no touch-target or hover-vs-tap concerns apply here
// (unlike DecisionMaking / WorkingApproach elsewhere in this feature).
//
// editorial variant — SectionBackground per DEC-045.
// default Container (896px) — per DEC-044 and the explicit statement in
// PORTFOLIO_V2_SPEC.md §6.4: "All sections use default Container — the
// About page is entirely prose and discrete-item content, no grid surfaces
// require wide."
//
// CORRECTION APPLIED IN THIS PASS (flagged per AI_CONTEXT.md §8 — not a
// silent override):
//   The component was rendering `<Container size="wide">` while its own
//   header comment and DEC-045 both specify `default`. A 220px label
//   column + prose fits comfortably inside 896px; nothing about this
//   layout justified the wide container. Reverted to `default` to match
//   the logged decision rather than treating the drift as a de facto
//   amendment.
//
// MOBILE-FIRST LAYOUT — implements what the original comment described
// ("On mobile: single column, left page stacks above right") but never
// actually coded:
//   - Grid is `grid-cols-1 lg:grid-cols-[220px_1fr]` — single column by
//     default, two-page spread only at `lg`, consistent with the `lg`
//     breakpoint already used for DecisionMaking's book window and
//     WorkingApproach's document/sidebar split.
//   - Spine shadow and ruled-paper texture are `lg:`-only, same reasoning
//     as the other two book-metaphor sections: they only read as a "left
//     page" once a facing page exists alongside it.
//   - A light top border marks the left→right page transition when
//     stacked, standing in for the spine that a two-page layout normally
//     provides.
//
// Layout: open book spread.
//   Left page: chapter index (Roman numeral) + topic + date.
//   Right page: exploration detail.
//   lg+: a 1px spine separates left and right pages — shadow on right
//   creates depth. Below lg: pages stack top-to-bottom.
//
// Maximum three entries per DEC-047.
// Date format: "Month YYYY" per DEC-049 (decision note in DECISIONS-PHASE3.5.md).

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { aboutData } from "./about-data";

// Roman numerals — three entries maximum per DEC-047.
const ROMAN = ["I", "II", "III"];

// ── BookSpread ────────────────────────────────────────────────────────────────
//
// A single facing-page spread for one exploration entry.
// Entries are separated by a horizontal rule; the last entry has none.

function BookSpread({ topic, detail, date, chapterIndex, isLast }) {
  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--color-border-sub)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        {/* ── Left page ────────────────────────────────────────────────── */}
        <div className="relative p-5 sm:p-6 lg:border-r lg:border-(--color-border) lg:p-8">
          {/*
           * Spine shadow + ruled-paper texture — desktop "left page" only.
           * Decoupled from the content div so it never leaks into the
           * mobile single-column stack, where there's no facing page for
           * it to cast a shadow onto.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              boxShadow: "inset -12px 0 20px -8px rgba(0,0,0,0.25)",
              backgroundImage:
                "repeating-linear-gradient(" +
                "to bottom," +
                "transparent," +
                "transparent 27px," +
                "var(--color-border-sub) 27px," +
                "var(--color-border-sub) 28px" +
                ")",
              backgroundPositionY: "4px",
            }}
          />

          {/* Chapter number — large, structurally decorative, faint */}
          <span
            aria-hidden="true"
            className="relative mb-4 block text-(length:--text-3xl) lg:text-(length:--text-4xl)"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--color-border)",
              lineHeight: 1,
            }}
          >
            {ROMAN[chapterIndex]}
          </span>

          {/* Topic — chapter heading on the left page */}
          <p
            className="relative mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-fg)",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {topic}
          </p>

          {/* Date — mono timestamp, lowest visual weight */}
          <span
            className="relative"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.06em",
              color: "var(--color-faint)",
            }}
          >
            {date}
          </span>
        </div>

        {/* ── Right page ───────────────────────────────────────────────── */}
        {/* Top border stands in for the spine when stacked below lg. */}
        <div className="border-t border-(--color-border-sub) p-5 sm:p-6 lg:border-t-0 lg:py-8 lg:pl-10 lg:pr-8">
          {/* Accent rule — a short line marks the "chapter opening" position */}
          <div
            aria-hidden="true"
            className="mb-4 h-0.5 w-8"
            style={{ background: "var(--color-accent)", opacity: 0.6 }}
          />

          {/* Detail prose */}
          <p
            style={{
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-muted)",
              textWrap: "pretty",
            }}
          >
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── CurrentlyExploring ────────────────────────────────────────────────────────

export function CurrentlyExploring() {
  const entries = aboutData.currentlyExploring;

  return (
    <Section spacing="sm" id="currently-exploring" className="relative">
      <SectionBackground variant="editorial" />

      <Container size="default">
        <SectionHeader
          label="Currently exploring"
          title="Active technical interests"
          as="h2"
          size="default"
          description="What is occupying engineering attention right now — specific enough to be useful, dated so the signal stays honest."
        />

        {/* ── The Book ──────────────────────────────────────────────────────
         *
         * The book frame:
         *   - surface background (one level above page bg)
         *   - strong border + deep shadow to feel lifted
         *   - overflow hidden to clip the left-page line pattern at corners
         *   - rounded corners: a physical book viewed from above
         *
         * Book header bar acts as the book cover spine — mono label center,
         * entry count right. Matches the file-header aesthetic from the
         * code block system (themes.css) for coherence across the system.
         */}
        <div
          className="mt-10 overflow-hidden rounded-xl sm:mt-12"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg), 0 0 0 1px var(--color-border-sub)",
          }}
        >
          {/* Book header bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--color-border) bg-(--color-surface-2) px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              {/* Decorative window buttons — editorial touch */}
              {[
                "var(--color-danger)",
                "var(--color-warning)",
                "var(--color-success)",
              ].map((color, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ background: color, opacity: 0.5 }}
                />
              ))}
            </div>

            {/* Filename — decorative labeling, hidden below sm where three
                groups can't share one line without wrapping awkwardly. */}
            <span
              className="hidden sm:block"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                letterSpacing: "0.06em",
              }}
            >
              currently-exploring.md
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
              }}
            >
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {/* Page spreads */}
          {entries.map((entry, i) => (
            <BookSpread
              key={entry.topic}
              {...entry}
              chapterIndex={i}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
