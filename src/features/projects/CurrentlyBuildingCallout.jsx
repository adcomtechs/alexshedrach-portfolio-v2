// features/projects/CurrentlyBuildingCallout.jsx
// RSC — no client directive required.
//
// Enhancements over the original single-line bar:
//
//   1. Two-column layout — left: identity (label + title + summary),
//      right: stack pills + CTA link. Each column has a distinct
//      communication job. The original collapsed all of this into a
//      single row with no information hierarchy.
//
//   2. Left accent border + ambient glow — a 2px accent border-left
//      with a radial gradient glow treats the callout as a live signal,
//      not a passive label. Consistent with blockquote/Decision block
//      treatments in the prose system and case study layout.
//
//   3. Project summary line — one-line truncated excerpt from the project
//      record gives evaluators meaningful context without requiring a
//      click. Sourced from project.summary (required field per spec).
//
//   4. Stack badges — first three technology pills from project.stack.
//      Mono treatment. Capped at three — the callout should not become
//      a full project card.
//
//   5. Status chip — "In Progress" pill replaces the plain "Currently
//      building" label as the first visible signal. The pulsing dot
//      moves inside the chip so it reads as a live indicator, not a
//      decorative icon.
//
//   6. Arrow link promoted to an explicit CTA — was opacity-0 until hover.
//      Now visible, right-aligned, and clearly labeled. Evaluators should
//      not have to discover the link through hover exploration.
//
// The callout remains subtle relative to the hero and grid:
//   - Background is --color-surface, one level above --color-bg
//   - Accent use is scoped to the left border and chip only
//   - No heading-scale typography — display text belongs in the hero
//
// Props extended from original: project.summary and project.stack now used.
// Passing them is non-breaking — both fields are optional here.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * CurrentlyBuildingCallout
 *
 * @param {Object}   project         - The project with currentlyBuilding: true.
 * @param {string}   project.slug    - URL slug for the case study link.
 * @param {string}   project.title   - Project name.
 * @param {string}   project.domain  - Problem domain.
 * @param {string}   [project.summary]  - One-sentence summary (optional, shown truncated).
 * @param {string[]} [project.stack]    - Technology array (optional, first 3 shown).
 */
export function CurrentlyBuildingCallout({ project }) {
  const { slug, title, domain, summary, stack = [] } = project;

  // Cap stack display at 3 — this is a callout, not a project card
  const visibleStack = stack.slice(0, 3);
  const hasMore = stack.length > 3;

  return (
    <Link
      href={`/projects/${slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg"
      aria-label={`Currently building: ${title}. View case study.`}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "8px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-sub)",
          borderLeft: "2px solid var(--color-accent)",
          overflow: "hidden",
          transition: "border-color 200ms ease, background 200ms ease",
        }}
        className="group-hover:bg-[var(--color-surface-2)] group-hover:border-[var(--color-border)]"
      >
        {/* Ambient glow — emanates from the accent border-left edge */}
        {/*
         * The radial gradient origin is at the far left (0% 50%) so the
         * glow appears to bleed in from the accent border. At 4% opacity
         * it is visible on the dark surface without competing with content.
         */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 100% at 0% 50%, rgba(181,242,61,0.04) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Layout: two columns — identity left, metadata + CTA right */}
        <div
          className="relative flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4"
          style={{ zIndex: 1 }}
        >
          {/* ── Left column: identity ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Status chip row */}
            <div
              className="flex items-center gap-2.5"
              style={{ marginBottom: "0.5rem" }}
            >
              {/* Live indicator chip */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  paddingInline: "8px",
                  paddingBlock: "3px",
                  borderRadius: "4px",
                  background: "rgba(181,242,61,0.07)",
                  border: "1px solid rgba(181,242,61,0.18)",
                  flexShrink: 0,
                }}
              >
                {/* Pulsing dot — inside the chip, signals "live" */}
                <span
                  aria-hidden="true"
                  className="status-pulse"
                  style={{
                    display: "block",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    fontWeight: 500,
                  }}
                >
                  In Progress
                </span>
              </span>

              {/* Domain — context before the title */}
              {domain && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-faint)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {domain}
                </span>
              )}
            </div>

            {/* Project title */}
            <p
              className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--color-fg)",
                lineHeight: "var(--leading-snug)",
                marginBottom: summary ? "0.25rem" : 0,
              }}
            >
              {title}
            </p>

            {/* One-line summary — truncated, gives content without a full card */}
            {summary && (
              <p
                className="truncate"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-faint)",
                  lineHeight: "var(--leading-normal)",
                  maxWidth: "42rem",
                }}
              >
                {summary}
              </p>
            )}
          </div>

          {/* ── Right column: stack + CTA ─────────────────────────────────── */}
          <div
            className="flex items-center gap-3 shrink-0"
            style={{ flexWrap: "wrap" }}
          >
            {/* Stack pills — mono, capped at 3 */}
            {visibleStack.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {visibleStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      display: "inline-block",
                      paddingInline: "8px",
                      paddingBlock: "3px",
                      borderRadius: "4px",
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--color-muted)",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tech}
                  </span>
                ))}

                {/* Overflow indicator — e.g. "+2" when stack has >3 items */}
                {hasMore && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--color-faint)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    +{stack.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* CTA — always visible, not hidden until hover */}
            <span
              className="flex items-center gap-1 group-hover:text-[var(--color-accent)] transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              View case study
              <ArrowUpRight
                size={12}
                aria-hidden
                className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// // features/projects/CurrentlyBuildingCallout.jsx
// // RSC — no client directive required.
// //
// // Single-line callout rendered above the project grid when a project record
// // carries currentlyBuilding: true. Subtle — does not compete with the hero
// // or the grid. Links directly to the project case study. (DEC-030)
// //
// // Visual continuity with the grid: border matches the gap-px border-sub color,
// // and mb-px positions it flush against the grid's top edge so the 1px gap
// // between callout and grid reads as a consistent grid line.

// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";

// /**
//  * CurrentlyBuildingCallout
//  *
//  * Gives returning visitors a reason to come back — signals active engineering
//  * momentum. Renders nothing when no project carries the flag, because the
//  * page.jsx condition check ensures this component is only called when one does.
//  *
//  * @param {Object} project         - The project with currentlyBuilding: true.
//  * @param {string} project.slug    - URL slug for the case study link.
//  * @param {string} project.title   - Project name.
//  * @param {string} project.domain  - Problem domain for context.
//  */
// export function CurrentlyBuildingCallout({ project }) {
//   const { slug, title, domain } = project;

//   return (
//     <Link
//       href={`/projects/${slug}`}
//       className="group flex items-center gap-3 px-6 py-3 mb-15
//         bg-[var(--color-surface)] border border-[var(--color-border-sub)]
//         hover:bg-[var(--color-surface-2)]
//         transition-colors duration-200
//         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
//         focus-visible:ring-[var(--color-accent)]"
//     >
//       {/* Pulsing dot — reinforces "active/live" signal */}
//       <span
//         aria-hidden
//         className="shrink-0 w-1.5 h-1.5 rounded-full animate-[dot-pulse_2.5s_ease-in-out_infinite]"
//         style={{ background: "var(--color-accent)" }}
//       />

//       {/* Label */}
//       <span
//         style={{
//           fontFamily: "var(--font-mono)",
//           fontSize: "var(--text-xs)",
//           letterSpacing: "0.08em",
//           textTransform: "uppercase",
//           color: "var(--color-faint)",
//           flexShrink: 0,
//         }}
//       >
//         Currently building
//       </span>

//       {/* Separator */}
//       <span aria-hidden style={{ color: "var(--color-border)", flexShrink: 0 }}>
//         /
//       </span>

//       {/* Project title */}
//       <span
//         className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
//         style={{
//           fontFamily: "var(--font-display)",
//           fontSize: "var(--text-sm)",
//           fontWeight: 600,
//           color: "var(--color-fg)",
//           flexShrink: 0,
//         }}
//       >
//         {title}
//       </span>

//       {/* Domain — context signal, hidden on small screens */}
//       {domain && (
//         <span
//           className="hidden sm:inline"
//           style={{
//             fontFamily: "var(--font-mono)",
//             fontSize: "var(--text-xs)",
//             letterSpacing: "0.04em",
//             color: "var(--color-faint)",
//           }}
//         >
//           {domain}
//         </span>
//       )}

//       {/* Arrow — pushes to the right, reveals on hover */}
//       <ArrowUpRight
//         size={13}
//         aria-hidden
//         className="ml-auto shrink-0
//           opacity-0 -translate-x-1 translate-y-1
//           group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
//           group-hover:text-[var(--color-accent)]
//           transition-all duration-200"
//         style={{ color: "var(--color-faint)" }}
//       />
//     </Link>
//   );
// }
