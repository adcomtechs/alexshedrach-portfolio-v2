// features/home/SelectedSystemsSection/FeaturedProjectCard.jsx
// RSC — no client directive required.
//
// Changes from previous version:
//   ✓ SignalRow now accepts a `clamp` prop — defaults to true.
//     constraint and outcome are clamped at 2 lines. Without this,
//     the right column height is determined purely by content length,
//     which breaks grid alignment and was the primary scroll driver.
//   ✓ description reduced from line-clamp-3 → line-clamp-2.
//     Card-level field content is now trimmed in the data layer;
//     the clamp is a structural safety net, not the content strategy.
//   ✓ Column split unchanged at 55% / 45% — the left column carries
//     the project title and description which need horizontal room.
//     The right column is signals-only; 45% is sufficient.

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
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5625rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <p
        className={clamp ? "line-clamp-2" : undefined}
        style={{
          fontSize: "var(--text-sm)",
          color: highlight ? "var(--color-fg)" : "var(--color-muted)",
          lineHeight: "var(--leading-normal)",
          fontWeight: highlight ? 500 : undefined,
        }}
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
        "group relative flex flex-col lg:flex-row",
        "bg-[var(--color-surface)]",
        "hover:bg-[var(--color-surface-2)]",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
        "focus-visible:ring-[var(--color-accent)]",
        "overflow-hidden",
      )}
    >
      {/* Decorative accent glow — top-left, aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-52 h-52 rounded-full blur-[80px]"
        style={{ background: "var(--color-accent)", opacity: 0.04 }}
      />

      {/* ── Left column: domain, title, description, tags ──────────────── */}
      <div className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[55%] lg:border-r lg:border-[var(--color-border-sub)]">
        {/* Header row: index + domain + meta */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {displayIndex && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.06em",
                  color: "var(--color-faint)",
                }}
              >
                {displayIndex}
              </span>
            )}

            {domain && (
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: "var(--color-accent)" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                  }}
                >
                  {domain}
                </span>
              </div>
            )}
          </div>

          {/* Meta: year + status + arrow */}
          <div className="flex items-center gap-2 shrink-0">
            {year && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.04em",
                  color: "var(--color-faint)",
                }}
              >
                {year}
              </span>
            )}

            {status === "live" && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-success)",
                  background: "var(--color-success-bg)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  padding: "2px 7px",
                  borderRadius: "3px",
                  lineHeight: 1.6,
                }}
              >
                Live
              </span>
            )}

            <ArrowUpRight
              size={15}
              aria-hidden
              className={cn(
                "shrink-0",
                "opacity-0 -translate-x-[3px] translate-y-[3px]",
                "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
                "group-hover:text-[var(--color-accent)]",
                "transition-all duration-200",
              )}
              style={{ color: "var(--color-faint)" }}
            />
          </div>
        </div>

        {/* Title + accent line */}
        <div>
          <Heading
            as="h3"
            size="2"
            balance
            className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            {title}
          </Heading>

          <div
            aria-hidden
            className={cn(
              "h-px rounded-[1px] mt-3",
              "w-8 group-hover:w-16",
              "transition-[width] duration-[400ms]",
              "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
            )}
            style={{ background: "var(--color-accent)" }}
          />
        </div>

        {/* Description — clamp-2. Card field is now one sentence; clamp is a safety net. */}
        <Text size="base" color="muted" className="line-clamp-2 flex-1">
          {description}
        </Text>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-[5px] mt-auto pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group-hover:text-[var(--color-accent)] group-hover:border-[rgba(181,242,61,0.2)] transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.04em",
                  padding: "2px 7px",
                  borderRadius: "3px",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-faint)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Right column: constraint, outcome, CTA ──────────────────────── */}
      <div className="flex flex-col gap-6 p-7 lg:p-8 lg:w-[45%] border-t border-[var(--color-border-sub)] lg:border-t-0">
        {/* Constraint — clamped. Full constraint in case study. */}
        {constraint && (
          <SignalRow label="Key Constraint" value={constraint} clamp />
        )}

        {constraint && outcome && (
          <div
            aria-hidden
            className="h-px"
            style={{ background: "var(--color-border-sub)" }}
          />
        )}

        {/* Outcome — clamped, highlighted. Full outcome in case study. */}
        {outcome && (
          <SignalRow label="Outcome" value={outcome} highlight clamp />
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span
            className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--color-faint)",
            }}
          >
            Read case study
          </span>
          <ArrowUpRight
            size={12}
            aria-hidden
            className="text-[var(--color-faint)] group-hover:text-[var(--color-accent)] transition-colors duration-200"
          />
        </div>
      </div>
    </Link>
  );
}

// // features/home/SelectedSystemsSection/FeaturedProjectCard.jsx
// // RSC — no client directive required.
// //
// // Distinct from ProjectCard in components/ui/.
// // ProjectCard is a general-purpose component used across the project index.
// // FeaturedProjectCard is a feature-scoped component that gives the primary
// // project a richer, expanded display — it is not a replacement for ProjectCard
// // and should not be abstracted into the design system.
// //
// // Layout:
// //   Mobile  — single column, stacked
// //   Desktop — [description column (55%)] | [signals column (45%)]

// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { cn } from "@/lib/utils";

// /**
//  * SignalRow
//  *
//  * A labelled signal row used in the right column.
//  * Renders a mono uppercase label above a prose value.
//  * Mirrors the pattern in ProjectCard's constraint/outcome rows.
//  *
//  * @param {string} label   - Short metadata label (e.g., "Key Constraint")
//  * @param {string} value   - Signal prose text
//  * @param {boolean} highlight - Uses fg color instead of muted — for the outcome row
//  */
// function SignalRow({ label, value, highlight = false }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <span
//         style={{
//           fontFamily: "var(--font-mono)",
//           fontSize: "0.5625rem",
//           letterSpacing: "0.1em",
//           textTransform: "uppercase",
//           color: "var(--color-faint)",
//           fontWeight: 500,
//           lineHeight: 1,
//         }}
//       >
//         {label}
//       </span>
//       <Text
//         size="sm"
//         color={highlight ? "default" : "muted"}
//         style={highlight ? { fontWeight: 500 } : undefined}
//       >
//         {value}
//       </Text>
//     </div>
//   );
// }

// /**
//  * FeaturedProjectCard
//  *
//  * Full-width card for the primary featured project in SelectedSystemsSection.
//  * Surfaces all three required signals (domain, constraint, outcome) with more
//  * visual space than ProjectCard allows.
//  *
//  * This component is always the top cell of the section grid — it does not
//  * render a border; the grid container provides the border context.
//  *
//  * @param {Object} project - Project data object from lib/data/projects.js
//  */
// export function FeaturedProjectCard({ project }) {
//   const {
//     slug,
//     title,
//     domain,
//     description,
//     constraint,
//     outcome,
//     tags,
//     status,
//     year,
//     index,
//   } = project;

//   const displayIndex =
//     index !== undefined ? String(index).padStart(2, "0") : null;

//   return (
//     <Link
//       href={`/projects/${slug}`}
//       className={cn(
//         "group relative flex flex-col lg:flex-row",
//         "bg-[var(--color-surface)]",
//         "hover:bg-[var(--color-surface-2)]",
//         "transition-colors duration-200",
//         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
//         "focus-visible:ring-[var(--color-accent)]",
//         // The decorative corner glow is positioned relative to this container
//         "overflow-hidden",
//       )}
//     >
//       {/* Decorative accent glow — top-left corner, scoped, aria-hidden */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -top-20 -left-20 w-52 h-52 rounded-full blur-[80px]"
//         style={{ background: "var(--color-accent)", opacity: 0.04 }}
//       />

//       {/* ── Left column: domain, title, description, tags ──────────────── */}
//       <div className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[55%] lg:border-r lg:border-[var(--color-border-sub)]">
//         {/* Header row: index + domain eyebrow + meta */}
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             {displayIndex && (
//               <span
//                 style={{
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "var(--text-xs)",
//                   letterSpacing: "0.06em",
//                   color: "var(--color-faint)",
//                 }}
//               >
//                 {displayIndex}
//               </span>
//             )}

//             {domain && (
//               <div className="flex items-center gap-1.5">
//                 <span
//                   aria-hidden
//                   className="w-1 h-1 rounded-full shrink-0"
//                   style={{ background: "var(--color-accent)" }}
//                 />
//                 <span
//                   style={{
//                     fontFamily: "var(--font-mono)",
//                     fontSize: "var(--text-xs)",
//                     letterSpacing: "0.07em",
//                     textTransform: "uppercase",
//                     color: "var(--color-accent)",
//                   }}
//                 >
//                   {domain}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Meta: year + status + directional arrow */}
//           <div className="flex items-center gap-2 shrink-0">
//             {year && (
//               <span
//                 style={{
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "var(--text-xs)",
//                   letterSpacing: "0.04em",
//                   color: "var(--color-faint)",
//                 }}
//               >
//                 {year}
//               </span>
//             )}
//             {status === "live" && (
//               <span
//                 style={{
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "0.5625rem",
//                   letterSpacing: "0.08em",
//                   textTransform: "uppercase",
//                   color: "var(--color-success)",
//                   background: "var(--color-success-bg)",
//                   border: "1px solid rgba(34,197,94,0.2)",
//                   padding: "2px 7px",
//                   borderRadius: "3px",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 Live
//               </span>
//             )}
//             <ArrowUpRight
//               size={15}
//               aria-hidden
//               className={cn(
//                 "shrink-0",
//                 "opacity-0 -translate-x-[3px] translate-y-[3px]",
//                 "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
//                 "group-hover:text-[var(--color-accent)]",
//                 "transition-all duration-200",
//               )}
//               style={{ color: "var(--color-faint)" }}
//             />
//           </div>
//         </div>

//         {/* Title */}
//         <div>
//           <Heading
//             as="h3"
//             size="2"
//             balance
//             className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
//           >
//             {title}
//           </Heading>

//           {/* Accent line — expands on hover */}
//           <div
//             aria-hidden
//             className={cn(
//               "h-px rounded-[1px] mt-3",
//               "w-8 group-hover:w-16",
//               "transition-[width] duration-[400ms]",
//               "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
//             )}
//             style={{ background: "var(--color-accent)" }}
//           />
//         </div>

//         {/* Description — 3 lines max in this expanded context */}
//         <Text size="base" color="muted" className="line-clamp-3 flex-1">
//           {description}
//         </Text>

//         {/* Tags */}
//         {tags && tags.length > 0 && (
//           <div className="flex flex-wrap gap-[5px] mt-auto pt-1">
//             {tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="group-hover:text-[var(--color-accent)] group-hover:border-[rgba(181,242,61,0.2)] transition-colors duration-200"
//                 style={{
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "var(--text-xs)",
//                   letterSpacing: "0.04em",
//                   padding: "2px 7px",
//                   borderRadius: "3px",
//                   background: "var(--color-bg)",
//                   border: "1px solid var(--color-border)",
//                   color: "var(--color-faint)",
//                 }}
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Right column: signals + CTA ────────────────────────────────── */}
//       <div className="flex flex-col gap-6 p-7 lg:p-8 lg:w-[45%] border-t border-[var(--color-border-sub)] lg:border-t-0">
//         {/* Constraint signal */}
//         {constraint && <SignalRow label="Key Constraint" value={constraint} />}

//         {/* Divider between signals */}
//         {constraint && outcome && (
//           <div
//             aria-hidden
//             className="h-px"
//             style={{ background: "var(--color-border-sub)" }}
//           />
//         )}

//         {/* Outcome signal — highlighted */}
//         {outcome && <SignalRow label="Outcome" value={outcome} highlight />}

//         {/* CTA — pushes to bottom of column */}
//         <div className="flex items-center gap-2 mt-auto pt-2">
//           <span
//             className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.07em",
//               textTransform: "uppercase",
//               color: "var(--color-faint)",
//             }}
//           >
//             Read case study
//           </span>
//           <ArrowUpRight
//             size={12}
//             aria-hidden
//             className="text-[var(--color-faint)] group-hover:text-[var(--color-accent)] transition-colors duration-200"
//           />
//         </div>
//       </div>
//     </Link>
//   );
// }
