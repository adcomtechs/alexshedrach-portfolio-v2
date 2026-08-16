// features/home/SelectedSystemsSection/FeaturedProjectCard.jsx
// RSC — no client directive required.
//
// ── Token & legibility pass ──────────────────────────────────────────────
//
// Every micro-label in the previous version (index, domain eyebrow, year,
// status badge, tags, SignalRow labels, CTA text) was set inline at
// `fontSize: "0.5625rem"` (9px) in `--color-faint`. Two compounding bugs:
//
//   1. 9px has no token behind it — tokens.css's floor is --text-xs (12px),
//      documented as the sanctioned size for exactly this content type
//      (DESIGN_SYSTEM.md §1.3: "Metadata, captions, chips"). Nothing should
//      render smaller than that anywhere in this system.
//   2. --color-faint itself measured ~2.44:1 against --color-surface in
//      dark mode (~3.13:1 in light) — both fail WCAG AA's 4.5:1 floor for
//      this text size. That's a token defect, not a per-component mistake,
//      and it's fixed at the token layer (themes.css), not here — see the
//      accompanying diff. Every consumer of --color-faint inherits the fix.
//
// This version uses the new `.text-label` utility (utilities.css) instead
// of hand-rolling font-mono/text-xs/tracking-wide/uppercase inline per
// label — the duplication across LabHero, TechTicker, and this card is
// exactly how the 9px value drifted in here unnoticed in the first place.
//
// Also fixed in this pass, same class of bug as the token issue:
//   - Two hardcoded rgba borders (`rgba(34,197,94,0.2)`,
//     `rgba(181,242,61,0.2)`) were dark-theme snapshots reused in light
//     mode — replaced with `color-mix()` against the live semantic token,
//     per DESIGN_SYSTEM.md §2.3.
//   - Bracket Tailwind syntax (`bg-[var(--x)]`) standardized to the v4
//     custom-property shorthand (`bg-(--x)`) throughout, matching the
//     convention already established in TechTicker.jsx.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

/**
 * SignalRow
 *
 * Labelled signal row for the right column.
 * `clamp` defaults to true — always clamp in card context.
 * The full value is available in the case study.
 *
 * @param {string}  label
 * @param {string}  value
 * @param {boolean} [highlight=false] — fg color instead of muted, for outcome
 * @param {boolean} [clamp=true]      — clamp to 2 lines
 */
function SignalRow({ label, value, highlight = false, clamp = true }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label text-(--color-faint)">{label}</span>
      <p
        className={cn(
          "text-sm leading-normal",
          highlight ? "font-medium text-(--color-fg)" : "text-(--color-muted)",
          clamp && "line-clamp-2",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * FeaturedProjectCard
 *
 * Full-width card for the primary featured project.
 *
 * Left column  — domain, index, title, accent line, description (clamp-2), tags
 * Right column — constraint (clamp-2), outcome (clamp-2), CTA
 *
 * Both signal rows are clamped. Content depth lives in the case study.
 *
 * @param {Object} project - Project data from lib/data/projects.js
 */
export function FeaturedProjectCard({ project }) {
  const {
    slug,
    title,
    domain,
    description,
    constraint,
    outcome,
    tags,
    status,
    year,
    index,
  } = project;

  const displayIndex =
    index !== undefined ? String(index).padStart(2, "0") : null;

  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden lg:flex-row",
        "bg-(--color-surface) hover:bg-(--color-surface-2)",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-accent)",
      )}
    >
      {/* Decorative accent glow — top-left, aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-(--color-accent) opacity-[0.04] blur-[80px]"
      />

      {/* ── Left column: domain, title, description, tags ──────────────── */}
      <div className="flex flex-col gap-5 p-7 lg:w-[55%] lg:border-r lg:border-(--color-border-sub) lg:p-8">
        {/* Header row: index + domain + meta */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {displayIndex && (
              <span className="text-label text-(--color-faint)">{displayIndex}</span>
            )}

            {domain && (
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
                />
                <span className="text-label text-(--color-accent)">{domain}</span>
              </div>
            )}
          </div>

          {/* Meta: year + status + arrow */}
          <div className="flex shrink-0 items-center gap-2">
            {year && <span className="text-label text-(--color-faint)">{year}</span>}

            {status === "live" && (
              <span
                className={cn(
                  "text-label rounded-[3px] border px-1.75 py-0.5 leading-normal",
                  "border-[color-mix(in_srgb,var(--color-success)_20%,transparent)]",
                  "bg-(--color-success-bg) text-(--color-success)",
                )}
              >
                Live
              </span>
            )}

            <ArrowUpRight
              size={15}
              aria-hidden
              className={cn(
                "shrink-0 text-(--color-faint)",
                "-translate-x-0.75 translate-y-0.75 opacity-0",
                "group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100",
                "group-hover:text-(--color-accent)",
                "transition-all duration-200",
              )}
            />
          </div>
        </div>

        {/* Title + accent line */}
        <div>
          <Heading
            as="h3"
            size="2"
            balance
            className="transition-colors duration-200 group-hover:text-(--color-accent)"
          >
            {title}
          </Heading>

          <div
            aria-hidden
            className={cn(
              "mt-3 h-px rounded-[1px] bg-(--color-accent)",
              "w-8 group-hover:w-16",
              "transition-[width] duration-400",
              "ease-[cubic-bezier(0.16,1,0.3,1)]",
            )}
          />
        </div>

        {/* Description — clamp-2. Card field is now one sentence; clamp is a safety net. */}
        <Text size="base" color="muted" className="line-clamp-2 flex-1">
          {description}
        </Text>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.25 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-label rounded-[3px] border px-1.75 py-0.5",
                  "border-(--color-border) bg-(--color-bg) text-(--color-faint)",
                  "transition-colors duration-200",
                  "group-hover:border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] group-hover:text-(--color-accent)",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Right column: constraint, outcome, CTA ──────────────────────── */}
      <div className="flex flex-col gap-6 border-t border-(--color-border-sub) p-7 lg:w-[45%] lg:border-t-0 lg:p-8">
        {/* Constraint — clamped. Full constraint in case study. */}
        {constraint && (
          <SignalRow label="Key Constraint" value={constraint} clamp />
        )}

        {constraint && outcome && (
          <div aria-hidden className="h-px bg-(--color-border-sub)" />
        )}

        {/* Outcome — clamped, highlighted. Full outcome in case study. */}
        {outcome && <SignalRow label="Outcome" value={outcome} highlight clamp />}

        {/* CTA */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-label text-(--color-faint) transition-colors duration-200 group-hover:text-(--color-accent)">
            Read case study
          </span>
          <ArrowUpRight
            size={12}
            aria-hidden
            className="text-(--color-faint) transition-colors duration-200 group-hover:text-(--color-accent)"
          />
        </div>
      </div>
    </Link>
  );
}