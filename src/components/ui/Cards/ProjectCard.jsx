
// components/ui/Cards/ProjectCard.jsx
// RSC — no client directive required. This component is a navigation element.
//
// Supports two layout variants driven by the `variant` prop:
//   "grid" — full three-zone card. Default. Two-column grid layout. (DEC-023)
//   "list" — compact horizontal row. Single column. Scanning-optimised. (DEC-028)
//
// The variant prop is set by ProjectIndex based on the active view.
// ProjectCard does not read view state — it renders what it receives.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Status config ──────────────────────────────────────────────────────────────
//
// Enum: "live" | "wip" | "archived"
// Aligns with the status field in lib/data/projects.js

const STATUS_CONFIG = {
  live: {
    label: "Live",
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
    border: "rgba(34, 197, 94, 0.2)",
  },
  wip: {
    label: "WIP",
    color: "var(--color-faint)",
    bg: "transparent",
    border: "var(--color-border)",
  },
  archived: {
    label: "Archived",
    color: "var(--color-faint)",
    bg: "transparent",
    border: "var(--color-border)",
  },
};

// ── Signal label ───────────────────────────────────────────────────────────────
//
// Reused for "Constraint" and "Outcome" rows in the grid variant.

function SignalLabel({ children }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.5625rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--color-faint)",
        fontWeight: 500,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────────
//
// Shared between grid and list variants. Extracted to avoid duplication.

function StatusBadge({ config }) {
  if (!config) return null;
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.5625rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        padding: "2px 7px",
        borderRadius: "3px",
        lineHeight: 1.6,
        flexShrink: 0,
      }}
    >
      {config.label}
    </span>
  );
}

// ── ProjectCard ────────────────────────────────────────────────────────────────

/**
 * ProjectCard
 *
 * Surfaces the three required signals per spec (PORTFOLIO_V2_SPEC § 6.2):
 *   - Problem domain   — eyebrow label, sets category context
 *   - Key constraint   — the non-trivial challenge that shaped the solution
 *   - Primary outcome  — the measurable result
 *
 * Grid variant renders all three signal zones.
 * List variant renders domain, title, and outcome in a compact horizontal row.
 *
 * Used in:
 *   - features/home/SelectedSystemsSection — grid variant, 2–3 featured projects
 *   - features/projects/ProjectIndex       — grid or list variant per view toggle
 *
 * @param {Object}          project         - Project data object.
 * @param {number}          [index]         - Positional override for display index.
 * @param {"grid"|"list"}   [variant]       - Layout variant. Default: "grid".
 * @param {string}          [className]     - Layout overrides only.
 */
export function ProjectCard({ project, index, variant = "grid", className }) {
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
  } = project;

  const cardIndex = index ?? project.index;
  const displayIndex =
    cardIndex !== undefined ? String(cardIndex).padStart(2, "0") : null;

  const statusConfig = status ? STATUS_CONFIG[status] : null;

  // ── Shared link classes ────────────────────────────────────────────────────
  const linkBase = cn(
    "group relative flex",
    "bg-[var(--color-surface)]",
    "hover:bg-[var(--color-surface-2)]",
    "transition-colors duration-[200ms]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
    "focus-visible:ring-[var(--color-accent)]",
    className,
  );

  // ── List variant ───────────────────────────────────────────────────────────
  //
  // Compact horizontal row. Optimised for scanning titles and outcomes quickly.
  // Outcome column hidden below lg breakpoint — mobile reads identity only.
  // (DEC-028)

  if (variant === "list") {
    return (
      <Link
        href={`/projects/${slug}`}
        className={cn(linkBase, "items-center gap-4 px-6 py-4")}
      >
        {/* Index */}
        {displayIndex && (
          <span
            className="shrink-0 w-6 text-right"
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

        {/* Identity — domain eyebrow + title */}
        <div className="flex flex-col gap-0.5 flex-[2] min-w-0">
          {domain && (
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
          )}
          <span
            className="truncate group-hover:text-[var(--color-accent)] transition-colors duration-[200ms]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-fg)",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {title}
          </span>
        </div>

        {/* Outcome — hidden below lg, single truncated line */}
        <div className="hidden lg:flex flex-[3] min-w-0">
          {outcome && (
            <p
              className="truncate"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-muted)",
                lineHeight: "var(--leading-normal)",
              }}
            >
              {outcome}
            </p>
          )}
        </div>

        {/* Meta cluster — status + year + arrow */}
        <div className="shrink-0 flex items-center gap-2.5 ml-auto">
          <StatusBadge config={statusConfig} />

          {year && (
            <span
              className="hidden sm:inline"
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

          <ArrowUpRight
            size={14}
            aria-hidden
            className={cn(
              "shrink-0 opacity-0 -translate-x-[3px] translate-y-[3px]",
              "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
              "group-hover:text-[var(--color-accent)]",
              "transition-all duration-[200ms]",
            )}
            style={{ color: "var(--color-faint)" }}
          />
        </div>
      </Link>
    );
  }

  // ── Grid variant (default) ─────────────────────────────────────────────────
  //
  // Full three-zone card: header, signal body, footer.
  // Communicates domain, constraint, and outcome with full visual weight.

  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(linkBase, "flex-col")}
    >
      {/* ── Zone 1: Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-0">
        {displayIndex ? (
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
        ) : (
          <span aria-hidden="true" />
        )}

        <div className="flex items-center gap-2">
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

          <StatusBadge config={statusConfig} />

          <ArrowUpRight
            size={14}
            aria-hidden
            className={cn(
              "shrink-0",
              "opacity-0 -translate-x-[3px] translate-y-[3px]",
              "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
              "group-hover:text-[var(--color-accent)]",
              "transition-all duration-[200ms]",
            )}
            style={{ color: "var(--color-faint)" }}
          />
        </div>
      </div>

      {/* ── Zone 2: Signal body ───────────────────────────────────────────── */}
      <div className="flex flex-col px-6 pt-4 pb-0 flex-1">
        {domain && (
          <div className="flex items-center gap-1.5 mb-3">
            <span
              aria-hidden
              className="inline-block w-1 h-1 rounded-full"
              style={{ background: "var(--color-accent)", flexShrink: 0 }}
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

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-md)",
            fontWeight: 600,
            lineHeight: "var(--leading-snug)",
            color: "var(--color-fg)",
            marginBottom: "0.625rem",
          }}
          className="group-hover:text-[var(--color-accent)] transition-colors duration-[200ms]"
        >
          {title}
        </h3>

        {/* Accent line */}
        <div
          aria-hidden
          className={cn(
            "h-px rounded-[1px] mb-4",
            "w-5 group-hover:w-10",
            "transition-[width] duration-[360ms]",
            "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          )}
          style={{ background: "var(--color-accent)" }}
        />

        <p
          className="line-clamp-2 mb-5"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          {description}
        </p>

        {(constraint || outcome) && (
          <div
            className="flex flex-col gap-3 py-4 border-t mt-auto"
            style={{ borderColor: "var(--color-border-sub)" }}
          >
            {constraint && (
              <div className="flex flex-col gap-1">
                <SignalLabel>Key Constraint</SignalLabel>
                <p
                  className="line-clamp-2"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {constraint}
                </p>
              </div>
            )}

            {outcome && (
              <div className="flex flex-col gap-1">
                <SignalLabel>Outcome</SignalLabel>
                <p
                  className="line-clamp-2"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-fg)",
                    lineHeight: "var(--leading-normal)",
                    fontWeight: 500,
                  }}
                >
                  {outcome}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Zone 3: Footer ────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-6 py-4 mt-4",
          "border-t",
        )}
        style={{ borderColor: "var(--color-border-sub)" }}
      >
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-[5px] min-w-0">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group-hover:text-[var(--color-accent)] group-hover:border-[rgba(181,242,61,0.2)] transition-colors duration-[200ms]"
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
        ) : (
          <span aria-hidden="true" />
        )}

        <span
          className="shrink-0 group-hover:text-[var(--color-accent)] transition-colors duration-[200ms]"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
          }}
        >
          Case study
        </span>
      </div>
    </Link>
  );
}

export default ProjectCard;

// // components/ui/Cards/ProjectCard.jsx
// // RSC — no client directive required. This component is a navigation element.
// //
// // Audit findings against the original (addressed below):
// //
// //   1. SPEC VIOLATION — Card only surfaced description and tags.
// //      Spec requires: problem domain, key constraint, primary outcome (PORTFOLIO_V2_SPEC § 6.2).
// //      Resolution: `domain`, `constraint`, and `outcome` fields are now rendered.
// //
// //   2. TOKEN VIOLATION — Font sizes used arbitrary Tailwind values (text-[10px], text-[9px],
// //      text-[1.0625rem]) instead of design system tokens.
// //      Resolution: All type sizes reference var(--text-*) via inline style.
// //
// //   3. TOKEN VIOLATION — `font-display` used as a class. This class does not exist in
// //      the design system. Only text-display, text-heading-1, text-heading-2 apply it
// //      via the utilities layer.
// //      Resolution: fontFamily applied via style={{ fontFamily: 'var(--font-display)' }}.
// //
// //   4. DATA MISMATCH — Status styles mapped "live/wip/archived" but the data schema
// //      used "shipped". Both are now reconciled to "live/wip/archived" (see projects.js).
// //
// //   5. DESIGN GAP — No visual hierarchy separated the three required signals.
// //      Resolution: Card is structured into three zones — header, signal body, footer.

// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// // ── Status ─────────────────────────────────────────────────────────────────────
// //
// // Enum: "live" | "wip" | "archived"
// // Aligns with the status field in lib/data/projects.js

// const STATUS_CONFIG = {
//   live: {
//     label: "Live",
//     color: "var(--color-success)",
//     bg: "var(--color-success-bg)",
//     border: "rgba(34, 197, 94, 0.2)",
//   },
//   wip: {
//     label: "WIP",
//     color: "var(--color-faint)",
//     bg: "transparent",
//     border: "var(--color-border)",
//   },
//   archived: {
//     label: "Archived",
//     color: "var(--color-faint)",
//     bg: "transparent",
//     border: "var(--color-border)",
//   },
// };

// // ── Signal label ───────────────────────────────────────────────────────────────
// //
// // Reused for "Constraint" and "Outcome" rows. Matches the mono uppercase
// // pattern established in SectionHeader's eyebrow label.

// function SignalLabel({ children }) {
//   return (
//     <span
//       style={{
//         fontFamily: "var(--font-mono)",
//         fontSize: "0.5625rem", // Below --text-xs intentionally — this is metadata density
//         letterSpacing: "0.1em",
//         textTransform: "uppercase",
//         color: "var(--color-faint)",
//         fontWeight: 500,
//         lineHeight: 1,
//         flexShrink: 0,
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// // ── ProjectCard ────────────────────────────────────────────────────────────────

// /**
//  * ProjectCard
//  *
//  * Surfaces the three required signals per spec (PORTFOLIO_V2_SPEC § 6.2):
//  *   - Problem domain   — eyebrow label, sets category context
//  *   - Key constraint   — the non-trivial challenge that shaped the solution
//  *   - Primary outcome  — the measurable result
//  *
//  * Used in:
//  *   - features/home/SelectedSystemsSection — 2–3 featured projects
//  *   - features/projects/ProjectIndex       — full project listing (Phase 3)
//  *
//  * The component API is designed to serve both surfaces without modification.
//  * Do not add home-specific props — keep this component general.
//  *
//  * @param {Object}  project         - Project data object from lib/data/projects.js
//  * @param {string}  project.slug    - URL slug — used for routing
//  * @param {string}  project.title   - Project title
//  * @param {string}  project.domain  - Problem domain (eyebrow label)
//  * @param {string}  project.description - Brief summary (2 lines max on card)
//  * @param {string}  project.constraint  - Key constraint navigated
//  * @param {string}  project.outcome     - Primary measurable outcome
//  * @param {string[]} project.tags   - Technology/approach tags
//  * @param {string}  project.status  - "live" | "wip" | "archived"
//  * @param {string}  project.year    - Year completed or started
//  * @param {number}  [project.index] - Display index (01, 02…)
//  * @param {number}  [index]         - Positional override — takes priority over project.index
//  * @param {string}  [className]     - Layout overrides only (grid span, width). No visual overrides.
//  */
// export function ProjectCard({ project, index, className }) {
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
//   } = project;

//   const cardIndex = index ?? project.index;
//   const displayIndex =
//     cardIndex !== undefined ? String(cardIndex).padStart(2, "0") : null;

//   const statusConfig = status ? STATUS_CONFIG[status] : null;

//   return (
//     <Link
//       href={`/projects/${slug}`}
//       className={cn(
//         "group relative flex flex-col",
//         // Surface treatment — intentionally no border-radius on ProjectCard.
//         // Cards in a grid read as a unified surface; rounded corners fragment that.
//         // The grid container is responsible for overall shape.
//         "bg-[var(--color-surface)]",
//         "hover:bg-[var(--color-surface-2)]",
//         "transition-colors duration-[200ms]",
//         // Focus ring — full card is keyboard activatable
//         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
//         "focus-visible:ring-[var(--color-accent)]",
//         className,
//       )}
//     >
//       {/* ── Zone 1: Header ──────────────────────────────────────────────────
//           Index, year, status badge, and directional arrow.
//           Kept at low visual weight — navigational metadata, not primary content.
//       ──────────────────────────────────────────────────────────────────────── */}
//       <div className="flex items-center justify-between px-6 pt-6 pb-0">
//         {/* Index */}
//         {displayIndex ? (
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.06em",
//               color: "var(--color-faint)",
//             }}
//           >
//             {displayIndex}
//           </span>
//         ) : (
//           <span aria-hidden="true" />
//         )}

//         {/* Right cluster: year + status + arrow */}
//         <div className="flex items-center gap-2">
//           {year && (
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.04em",
//                 color: "var(--color-faint)",
//               }}
//             >
//               {year}
//             </span>
//           )}

//           {statusConfig && (
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "0.5625rem",
//                 letterSpacing: "0.08em",
//                 textTransform: "uppercase",
//                 color: statusConfig.color,
//                 background: statusConfig.bg,
//                 border: `1px solid ${statusConfig.border}`,
//                 padding: "2px 7px",
//                 borderRadius: "3px",
//                 lineHeight: 1.6,
//               }}
//             >
//               {statusConfig.label}
//             </span>
//           )}

//           {/* Arrow — hidden at rest, reveals and resets translate on hover */}
//           <ArrowUpRight
//             size={14}
//             aria-hidden
//             className={cn(
//               "shrink-0",
//               "opacity-0 -translate-x-[3px] translate-y-[3px]",
//               "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
//               "group-hover:text-[var(--color-accent)]",
//               "transition-all duration-[200ms]",
//             )}
//             style={{ color: "var(--color-faint)" }}
//           />
//         </div>
//       </div>

//       {/* ── Zone 2: Signal body ─────────────────────────────────────────────
//           Domain → Title → Accent line → Description → Constraint + Outcome
//           This zone carries the primary credibility signal.
//       ──────────────────────────────────────────────────────────────────────── */}
//       <div className="flex flex-col px-6 pt-4 pb-0 flex-1">
//         {/* Domain eyebrow */}
//         {domain && (
//           <div className="flex items-center gap-1.5 mb-3">
//             <span
//               aria-hidden
//               className="inline-block w-1 h-1 rounded-full"
//               style={{ background: "var(--color-accent)", flexShrink: 0 }}
//             />
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.07em",
//                 textTransform: "uppercase",
//                 color: "var(--color-accent)",
//               }}
//             >
//               {domain}
//             </span>
//           </div>
//         )}

//         {/* Title */}
//         <h3
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: "var(--text-md)",
//             fontWeight: 600,
//             lineHeight: "var(--leading-snug)",
//             color: "var(--color-fg)",
//             marginBottom: "0.625rem",
//           }}
//           className="group-hover:text-[var(--color-accent)] transition-colors duration-[200ms]"
//         >
//           {title}
//         </h3>

//         {/* Accent line — expands on hover. Width transition uses a precise easing
//             curve that mirrors the spring feel of the arrow translate. */}
//         <div
//           aria-hidden
//           className={cn(
//             "h-px rounded-[1px] mb-4",
//             "w-5 group-hover:w-10",
//             "transition-[width] duration-[360ms]",
//             "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
//           )}
//           style={{ background: "var(--color-accent)" }}
//         />

//         {/* Description */}
//         <p
//           className="line-clamp-2 mb-5"
//           style={{
//             fontSize: "var(--text-sm)",
//             color: "var(--color-muted)",
//             lineHeight: "var(--leading-relaxed)",
//           }}
//         >
//           {description}
//         </p>

//         {/* Constraint + Outcome — structured signal rows
//             These are the two fields that prove engineering depth on the card.
//             Kept compact: mono label + prose value per row. */}
//         {(constraint || outcome) && (
//           <div
//             className="flex flex-col gap-3 py-4 border-t mt-auto"
//             style={{ borderColor: "var(--color-border-sub)" }}
//           >
//             {constraint && (
//               <div className="flex flex-col gap-1">
//                 <SignalLabel>Key Constraint</SignalLabel>
//                 <p
//                   className="line-clamp-2"
//                   style={{
//                     fontSize: "var(--text-sm)",
//                     color: "var(--color-muted)",
//                     lineHeight: "var(--leading-normal)",
//                   }}
//                 >
//                   {constraint}
//                 </p>
//               </div>
//             )}

//             {outcome && (
//               <div className="flex flex-col gap-1">
//                 <SignalLabel>Outcome</SignalLabel>
//                 <p
//                   className="line-clamp-2"
//                   style={{
//                     fontSize: "var(--text-sm)",
//                     // Outcome gets fg color, not muted — it's the proof, not context
//                     color: "var(--color-fg)",
//                     lineHeight: "var(--leading-normal)",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {outcome}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── Zone 3: Footer ──────────────────────────────────────────────────
//           Tags and case study CTA. Lowest visual weight on the card.
//           Tags take accent color on hover to maintain visual cohesion.
//       ──────────────────────────────────────────────────────────────────────── */}
//       <div
//         className={cn(
//           "flex items-center justify-between gap-3 px-6 py-4 mt-4",
//           "border-t",
//         )}
//         style={{ borderColor: "var(--color-border-sub)" }}
//       >
//         {/* Tags */}
//         {tags && tags.length > 0 ? (
//           <div className="flex flex-wrap gap-[5px] min-w-0">
//             {tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="group-hover:text-[var(--color-accent)] group-hover:border-[rgba(181,242,61,0.2)] transition-colors duration-[200ms]"
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
//         ) : (
//           // Empty placeholder preserves flex layout when there are no tags
//           <span aria-hidden="true" />
//         )}

//         {/* CTA */}
//         <span
//           className="shrink-0 group-hover:text-[var(--color-accent)] transition-colors duration-[200ms]"
//           style={{
//             fontFamily: "var(--font-mono)",
//             fontSize: "var(--text-xs)",
//             letterSpacing: "0.07em",
//             textTransform: "uppercase",
//             color: "var(--color-faint)",
//           }}
//         >
//           Case study
//         </span>
//       </div>
//     </Link>
//   );
// }

// export default ProjectCard;
