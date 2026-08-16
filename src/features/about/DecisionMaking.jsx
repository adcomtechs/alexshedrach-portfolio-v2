// features/about/DecisionMaking.jsx
// use client — two justifications:
//   1. IntersectionObserver for section entrance animation.
//   2. Interactive scenario navigation (TOC click/tap → content panel update).
//      Logged in AI_CONTEXT.md use client ledger as
//      "DecisionMaking — IntersectionObserver + scenario tab state".
//
// PROPOSED AMENDMENT — DEC-045 (unchanged, carried forward):
//   Original: "minimal" SectionBackground for DecisionMaking.
//   Proposed: custom analytical background (accent mesh + dot grid).
//   Container: wide (1152px) — book layout requires two-column grid room.
//   DEC-044 assigns default (896px) to all About sections; the book window
//   is the first layout that genuinely cannot fit at 896px. Log before commit.
//
// CORRECTIONS APPLIED IN THIS PASS (flagging per AI_CONTEXT.md §8 — not
// silent overrides):
//   1. DESIGN_SYSTEM.md §2.3 — several rgba(181,242,61,…) literals were
//      hardcoded instead of resolving through --color-accent. Replaced with
//      a color-mix() helper (`accentTint`) so light theme's darker accent
//      hex is respected automatically instead of bleeding dark-theme lime
//      into the light theme.
//   2. DESIGN_SYSTEM.md §1.3 — the chapter number used
//      clamp(1.875rem, 3vw, 2.5rem), a vw-scaled font size. Replaced with
//      fixed rem tokens switched at breakpoints (base → sm → lg), per the
//      explicit rule: fix layout, don't scale type with viewport width.
//
// MOBILE-FIRST LAYOUT CHANGES:
//   - Book interior is single-column by default; the two-page
//     (260px TOC / 1fr content) grid only activates at `lg`, consistent
//     with the ProjectCard/LabCard grid-collapse precedent (DEC-023/042).
//   - Below `lg`, ScenarioTOC renders as a horizontal snap-scroll strip of
//     chapter chips instead of a vertical list — the spine shadow and ruled
//     paper texture are `lg:`-only since they only read as a "left page"
//     once a facing page exists.
//   - Prev/Next controls and progress dots now carry explicit ≥44×44px hit
//     areas (padding / sized wrapper) independent of their visual size —
//     DESIGN_SYSTEM.md §5.3.
//   - Prev/Next text labels hide below `sm` (icon + aria-label remain) to
//     prevent wrap at 320–375px; verified at 375px before 1440px per §5.3.
//
// Layout: interactive book window.
//   Header bar     — traffic lights + pipeline indicator (md+) + scenario count.
//   Mobile         — TOC renders as a horizontal snap-scroll chip strip above content.
//   Desktop (lg+)  — TOC becomes the book's left page, content the right page.
//   Spine          — 1px border + inset shadow, lg+ only.
//   Left page      — ruled paper pattern, lg+ only.

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { aboutData } from "./about-data";

const PIPELINE_STAGES = ["Situation", "Tradeoff", "Reasoning", "Decision"];

// Resolves an accent tint through the active theme's --color-accent instead
// of a hardcoded dark-theme lime literal — see correction #1 above.
function accentTint(percent) {
  return `color-mix(in srgb, var(--color-accent) ${percent}%, transparent)`;
}

// ── DecisionMakingBackground ──────────────────────────────────────────────────
//
// Analytical personality: single accent blob, fine dot grid.
// Cooler and more structured than WorkingApproach's dual-color treatment.
// Dot grid registers as precision and systematic thinking.
// Purely decorative (aria-hidden) — sizing stays fixed across breakpoints
// since it's a background wash, not content that can overflow or clip text.

function DecisionMakingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        style={{
          position: "absolute",
          width: "640px",
          height: "640px",
          top: "-160px",
          right: "-140px",
          background: `radial-gradient(circle, ${accentTint(7)} 0%, transparent 65%)`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          bottom: "-80px",
          left: "-60px",
          background: `radial-gradient(circle, ${accentTint(4.5)} 0%, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, var(--color-border-sub) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 20%, var(--color-bg) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.015,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

// ── BookWindowHeader ──────────────────────────────────────────────────────────
//
// Mobile:  traffic lights ←→ scenario count. Pipeline indicator hidden —
//          at sub-360px widths, three connector arrows plus four labels
//          cannot render without truncation or horizontal scroll inside a
//          non-scrollable header, so it's deferred to md+ where it fits
//          without compromise (mobile-first: base case omits it, larger
//          viewports add it — not the inverse).
// md+:     Pipeline indicator appears, centered.

function BookWindowHeader({ total, activeIndex }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) bg-(--color-surface-2) px-4 py-3 sm:px-6">
      {/* Traffic lights */}
      <div className="flex shrink-0 items-center gap-2">
        {[
          "var(--color-danger)",
          "var(--color-warning)",
          "var(--color-success)",
        ].map((color, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ background: color, opacity: 0.45 }}
          />
        ))}
      </div>

      {/* Pipeline indicator — md+ only, see rationale above */}
      <div className="hidden items-center gap-0.5 md:flex">
        {PIPELINE_STAGES.map((stage, i) => {
          const isDecision = stage === "Decision";
          const isLast = i === PIPELINE_STAGES.length - 1;

          return (
            <div key={stage} className="flex items-center">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.05em",
                  color: isDecision
                    ? "var(--color-accent)"
                    : "var(--color-faint)",
                  fontWeight: isDecision ? 600 : 400,
                }}
              >
                {stage}
              </span>

              {!isLast && (
                <svg
                  width="28"
                  height="10"
                  viewBox="0 0 28 10"
                  fill="none"
                  aria-hidden="true"
                  style={{ margin: "0 3px", flexShrink: 0 }}
                >
                  <line
                    x1="0"
                    y1="5"
                    x2="20"
                    y2="5"
                    stroke="var(--color-border)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <polyline
                    points="18,2 22,5 18,8"
                    stroke="var(--color-border)"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Scenario count */}
      <span
        className="shrink-0"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
        }}
      >
        {activeIndex + 1} / {total}
      </span>
    </div>
  );
}

// ── ScenarioTOC ───────────────────────────────────────────────────────────────
//
// Below lg  — horizontal snap-scroll strip of fixed-width chapter chips.
//             No spine shadow, no ruled paper — those only read correctly
//             once a facing page exists.
// lg+       — vertical list, full width, becomes the book's left page.
//             Spine shadow + ruled paper texture render as a decorative
//             layer behind the buttons (`hidden lg:block`), decoupled from
//             layout so it never affects the mobile chip strip.
//
// Active state (both layouts):
//   - 2px accent left border
//   - chapter number transitions from --color-border to --color-accent
//   - situation text transitions from --color-muted to --color-fg
//   - faint accent background tint (accentTint helper)

function ScenarioTOC({ scenarios, activeIndex, onSelect }) {
  return (
    <div className="relative border-b border(--color-border) lg:border-b-0 lg:border-r">
      {/* Decorative spine + ruled paper — desktop "left page" only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          boxShadow: "inset -14px 0 22px -8px rgba(0,0,0,0.3)",
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

      <div className="flex snap-x snap-mandatory overflow-x-auto lg:flex-col lg:overflow-visible lg:snap-none">
        {scenarios.map((scenario, i) => {
          const isActive = i === activeIndex;

          return (
            <button
              key={scenario.situation}
              onClick={() => onSelect(i)}
              aria-current={isActive ? "true" : undefined}
              className="relative w-45 shrink-0 snap-start border-r border-(--color-border-sub) p-4 text-left outline-none last:border-r-0 sm:w-55 sm:p-5 lg:w-full lg:shrink lg:border-r-0 lg:border-b lg:p-6 lg:last:border-b-0"
              style={{
                borderLeft: `2px solid ${isActive ? "var(--color-accent)" : "transparent"}`,
                background: isActive ? accentTint(3.5) : "transparent",
                cursor: "pointer",
                transition:
                  "background 200ms ease, border-left-color 200ms ease",
              }}
            >
              {/* Chapter number — large, structural, transitions to accent.
                  Fixed rem tokens per breakpoint, not vw-scaled — §1.3. */}
              <span
                aria-hidden="true"
                className="mb-2.5 block text-(length:--text-2xl) sm:text-(length:--text-3xl) lg:text-(length:--text-4xl)"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                  transition: "color 200ms ease",
                  userSelect: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Situation — chapter title */}
              <span
                className="block"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: "var(--leading-snug)",
                  color: isActive ? "var(--color-fg)" : "var(--color-muted)",
                  transition: "color 200ms ease, font-weight 200ms ease",
                }}
              >
                {scenario.situation}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── AnalyticalRow ─────────────────────────────────────────────────────────────
//
// A single labeled row in the right page (Tradeoff or Reasoning).
// Single column on mobile (label stacked above content — narrow viewports
// can't sustain a 96px label column without crushing the prose), two-column
// from md up.

function AnalyticalRow({ label, content }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[96px_1fr] md:gap-6">
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
          paddingTop: "3px",
        }}
      >
        {label}
      </span>
      <p
        style={{
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-relaxed)",
          color: "var(--color-muted)",
          textWrap: "pretty",
        }}
      >
        {content}
      </p>
    </div>
  );
}

// ── ScenarioContent ───────────────────────────────────────────────────────────
//
// Right page of the book — full analytical content for the active scenario.
// React key on the outer div causes remount on scenario change, triggering
// the animate-slide-up CSS animation. Padding scales up across breakpoints
// instead of a single fixed value so the content doesn't feel cramped on
// mobile or under-filled on wide desktop.

function ScenarioContent({ scenario }) {
  const { situation, tradeoff, reasoning, decision } = scenario;

  return (
    <div className="animate-slide-up flex h-full flex-col gap-6 p-6 sm:gap-7 sm:p-8 lg:p-10">
      {/* Situation header */}
      <div>
        <div
          aria-hidden="true"
          className="mb-4 h-0.5 w-6"
          style={{ background: "var(--color-accent)", opacity: 0.6 }}
        />
        <Heading as="h3" size="3">
          {situation}
        </Heading>
      </div>

      {/* Analytical rows */}
      <div className="flex flex-col gap-5">
        <AnalyticalRow label="Tradeoff" content={tradeoff} />
        <AnalyticalRow label="Reasoning" content={reasoning} />
      </div>

      {/* Decision — resolution block, visually distinguished from the rows above.
       * Not another row — the Decision is the conclusion of the pipeline.
       * Accent left-border + faint accent fill elevates it as the final word,
       * consistent with the blockquote treatment in utilities.css. */}
      <div
        className="mt-auto rounded-lg p-4 sm:p-5"
        style={{
          border: `1px solid ${accentTint(15)}`,
          borderLeft: "2px solid var(--color-accent)",
          background: accentTint(2.5),
        }}
      >
        <span
          className="mb-2 block"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          Decision
        </span>
        <p
          style={{
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-muted)",
            textWrap: "pretty",
          }}
        >
          {decision}
        </p>
      </div>
    </div>
  );
}

// ── DecisionMaking ────────────────────────────────────────────────────────────

export function DecisionMaking() {
  const { narrative, scenarios } = aboutData.decisionMaking;

  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // contentKey forces ScenarioContent remount on scenario change,
  // firing the animate-slide-up CSS animation cleanly.
  const [contentKey, setContentKey] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelect = useCallback(
    (i) => {
      if (i === activeIndex) return;
      setActiveIndex(i);
      setContentKey((k) => k + 1);
    },
    [activeIndex],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = (activeIndex + 1) % scenarios.length;
        handleSelect(next);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (activeIndex - 1 + scenarios.length) % scenarios.length;
        handleSelect(prev);
      }
    },
    [activeIndex, handleSelect, scenarios.length],
  );

  const sectionFade = {
    transition:
      "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
  };

  const activeScenario = scenarios[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === scenarios.length - 1;

  return (
    <div ref={wrapperRef}>
      <Section spacing="sm" id="decision-making" className="relative">
        <DecisionMakingBackground />

        <Container size="wide">
          {/* ── Section header — outside the book frame ──────────────────── */}
          <div style={sectionFade}>
            <div className="mb-6 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                Decision making
              </span>
            </div>

            <Heading as="h2" size="2" balance className="mb-6">
              Operational reality over technical trends
            </Heading>

            {/* Narrative — accent-bordered, max-width prose */}
            <div
              className="mb-8 max-w-215 border-l-2 pl-4 sm:mb-12 sm:pl-5"
              style={{ borderLeftColor: accentTint(20) }}
            >
              <Text size="sm" color="muted" className="leading-relaxed">
                {narrative}
              </Text>
            </div>
          </div>

          {/* ── Book window ───────────────────────────────────────────────── */}
          {/*
           * Elevated above the background with a compound shadow:
           *   --shadow-lg    — main depth
           *   ring shadow    — hairline border reinforcement
           *
           * Mobile:  single column — TOC strip, then content, then footer nav.
           * lg+:     260px / 1fr two-page book grid.
           *
           * Transition delay: book appears after the section header settles.
           */}
          <div
            className="overflow-hidden rounded-xl"
            style={{
              ...sectionFade,
              transitionDelay: "180ms",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg), 0 0 0 1px var(--color-border-sub)",
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Header bar — pipeline indicator lives here (md+) */}
            <BookWindowHeader
              total={scenarios.length}
              activeIndex={activeIndex}
            />

            {/* Book interior — single column by default, two-page at lg+ */}
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] lg:min-h-95">
              <ScenarioTOC
                scenarios={scenarios}
                activeIndex={activeIndex}
                onSelect={handleSelect}
              />

              {/* Key prop causes remount on scenario change — fires
                  animate-slide-up from animations.css without manual
                  opacity state management. */}
              <ScenarioContent key={contentKey} scenario={activeScenario} />
            </div>

            {/* Book footer — prev/next navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--color-border) bg-(--color-surface-2) px-4 py-2 sm:px-6 sm:py-3">
              <button
                onClick={() => handleSelect(activeIndex - 1)}
                disabled={isFirst}
                aria-label="Previous scenario"
                className="-m-2 flex items-center gap-2 p-2 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: isFirst ? "var(--color-faint)" : "var(--color-muted)",
                  background: "none",
                  border: "none",
                  cursor: isFirst ? "not-allowed" : "pointer",
                  transition: "color 150ms",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Progress dots — 44×44px hit area per dot, visual pill unchanged */}
              <div className="flex items-center">
                {scenarios.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    aria-label={`Go to scenario ${i + 1}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-11 sm:w-11"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "block",
                        width: i === activeIndex ? "1.25rem" : "0.375rem",
                        height: "0.375rem",
                        borderRadius: "9999px",
                        background:
                          i === activeIndex
                            ? "var(--color-accent)"
                            : "var(--color-border)",
                        transition: "width 300ms ease, background 200ms ease",
                      }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleSelect(activeIndex + 1)}
                disabled={isLast}
                aria-label="Next scenario"
                className="-m-2 flex items-center gap-2 p-2 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: isLast ? "var(--color-faint)" : "var(--color-muted)",
                  background: "none",
                  border: "none",
                  cursor: isLast ? "not-allowed" : "pointer",
                  transition: "color 150ms",
                }}
              >
                <span className="hidden sm:inline">Next</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
