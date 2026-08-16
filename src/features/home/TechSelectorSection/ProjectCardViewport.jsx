// features/home/TechSelectorSection/ProjectCardViewport.jsx

// RSC-compatible — rendered inside the client TechSelector parent.
// No "use client" required.
//
// Refinements vs. original:
//
//   1. onMouseEnter/onMouseLeave on CTAs → Button component.
//      Button handles all hover states internally via CSS.
//      No inline style mutations anywhere in this file.
//
//   2. absolute inset-0 cross-fade → key={activeId} + animate-fade-in.
//      Original used absolute positioning + explicit heights for cross-fade.
//      New approach: remount the content div on activeId change.
//      animate-fade-in (defined in animations.css) re-runs on each remount.
//      Eliminates the need for explicit panel heights and overflow.
//
//   3. aspect-video thumbnail → fixed h-[130px] thumbnail.
//      aspect-video at column widths could produce ~280px of thumbnail.
//      Fixed height ensures the center column fits the panel without scroll.
//
//   4. Hardcoded #0a0a0b → var(--color-bg).
//      Button variant="primary" handles text color internally — no override needed.
//
//   5. All stats/feature colors reference category.color tokens — consistent
//      with the active category's accent rather than hardcoded to accent-only.

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { TECH_CATEGORIES, TECH_PROJECTS } from "@/lib/data/techSelector";

// ── Icons ──────────────────────────────────────────────────────────────────────
//
// Inlined to avoid assuming lucide-react is installed.
// If lucide-react is present: import { ArrowRight, Check } from "lucide-react"

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── ProjectThumbnail ───────────────────────────────────────────────────────────

/**
 * ProjectThumbnail
 *
 * Fixed-height visual header for the project card.
 * Uses category gradient + ambient glow + dot grid + window chrome.
 * Height is fixed (not aspect-ratio-based) to guarantee fit without scroll.
 *
 * @param {Object} category - TECH_CATEGORIES entry (provides visual tokens)
 * @param {Object} badge    - Status badge from PROJECTS entry
 */
function ProjectThumbnail({ category, badge }) {
  return (
    <div
      className="relative h-32 overflow-hidden rounded-lg border border-[var(--color-border-sub)] sm:h-36 lg:h-[130px]"
    >
      {/* Category gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: category.thumbBg }}
      />

      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Radial vignette — darkens edges for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 15%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Ambient category glow — center bloom */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 rounded-full"
        style={{
          background: category.thumbGlow,
          filter: "blur(28px)",
        }}
      />

      {/* Window chrome bar */}
      <div className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 gap-1.5 bg-[rgba(0,0,0,0.32)] border-b border-[rgba(255,255,255,0.05)]">
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
      </div>

      {/* Project name label — bottom-left */}
      <div
        className="absolute bottom-3 left-3 right-3 sm:left-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5625rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          overflowWrap: "anywhere",
        }}
      >
        {category.thumbLabel}
      </div>

      {/* Status badge — top-right, below chrome */}
      {badge && (
        <div
          className="absolute top-8 right-3 inline-flex items-center gap-1 px-2 py-[2px] rounded-[3px] border"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: badge.bg,
            borderColor: badge.border,
            color: badge.color,
          }}
        >
          {/* Pulsing status dot */}
          <span
            className="w-1 h-1 rounded-full animate-[dot-pulse_2.5s_ease-in-out_infinite]"
            style={{ background: badge.color }}
            aria-hidden="true"
          />
          {badge.label}
        </div>
      )}
    </div>
  );
}

// ── ProjectCardViewport ────────────────────────────────────────────────────────

/**
 * ProjectCardViewport
 *
 * Center column of TechSelector.
 * Renders the project associated with the active category.
 *
 * Cross-fade: key={activeId} on the content wrapper triggers a remount
 * on every category switch. animate-fade-in (animations.css) re-runs
 * on mount — producing a clean fade-in without absolute positioning.
 *
 * No overflow-y-auto. Content is designed to fit the panel height:
 *   Thumbnail    130px
 *   Chips         32px
 *   Title+sub     64px
 *   Stats         76px
 *   Features      96px
 *   CTA           40px
 *   Padding+gaps ~80px
 *   ─────────────────
 *   Total        ~518px (panel height = center column height)
 *
 * @param {string|null} activeId - Active category id
 */
export function ProjectCardViewport({ activeId }) {
  // Empty / loading state
  if (!activeId) {
    return (
      <div
        className="flex min-h-[360px] items-center justify-center lg:min-h-[518px]"
        aria-live="polite"
        aria-label="Project details"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.08em",
          }}
        >
          ← Select a domain
        </span>
      </div>
    );
  }

  const category = TECH_CATEGORIES.find((c) => c.id === activeId);
  const project = TECH_PROJECTS[activeId];

  if (!category || !project) return null;

  return (
    <div
      key={activeId}
      className="flex min-w-0 flex-col gap-5 p-4 animate-fade-in sm:p-6 lg:min-h-[518px] lg:p-7"
      aria-live="polite"
      aria-label="Project details"
    >
      {/* 1. Thumbnail */}
      <ProjectThumbnail category={category} badge={project.badge} />

      {/* 2. Tech chips — active category technologies */}
      <div className="flex flex-wrap gap-1.5">
        {category.chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center px-2 py-[3px] rounded-[3px] border"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: category.color.text,
              background: category.color.bg,
              borderColor: category.color.border,
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* 3. Title + subtitle */}
      <div className="flex flex-col gap-1">
        <Heading as="h3" size="3">
          {project.title}
        </Heading>
        <Text as="span" size="sm" color="faint">
          {project.subtitle}
        </Text>
      </div>

      {/* 4. Stats — 2-column metric grid */}
      <div
        className="grid grid-cols-1 gap-3 rounded-lg px-4 py-3.5 sm:grid-cols-2 sm:gap-x-5"
        style={{
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border-sub)",
        }}
      >
        {project.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-[3px]">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 800,
                color: "var(--color-fg)",
                letterSpacing: "-0.025em",
                lineHeight: "var(--leading-tight)",
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                lineHeight: "var(--leading-snug)",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* 5. Feature list */}
      <div className="flex flex-col gap-3">
        {project.features.map((feat) => (
          <div key={feat.strong} className="flex items-start gap-2.5">
            {/* Check icon in category accent color */}
            <div
              className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center shrink-0 mt-[2px]"
              style={{
                background: category.color.bg,
                border: `1px solid ${category.color.border}`,
                color: category.color.text,
              }}
            >
              <CheckIcon />
            </div>

            {/* Feature copy */}
            <p
              style={{
                fontSize: "var(--text-sm)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              <strong style={{ color: "var(--color-fg)", fontWeight: 600 }}>
                {feat.strong}
              </strong>{" "}
              <span style={{ color: "var(--color-muted)" }}>{feat.text}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 6. CTA — Button component handles all hover states */}
      <div>
        <Button
          href={project.href}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          rightIcon={<ArrowRightIcon />}
        >
          View case study
        </Button>
      </div>
    </div>
  );
}
