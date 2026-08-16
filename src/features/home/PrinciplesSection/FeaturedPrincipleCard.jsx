// features/home/PrinciplesSection/FeaturedPrincipleCard.jsx
// RSC — no client directive required.
//
// Schema change: `description` → `summary` + `details`
//
// Left column content — reduced to signal-only:
//   icon · title · accent line · summary · proof
//   `details` is NOT rendered here. It lives at /about.
//
// Right column — unchanged:
//   pullquote · tags
//   The pullquote is the primary differentiator. The column rebalance
//   (50/50) gives it more breathing room.
//
// Column split: previously lg:w-[55%] / lg:w-[45%]
//               now lg:w-1/2 / lg:w-1/2
//
// The pullquote is the stronger signal. Equal columns let it surface
// at the same visual weight as the description column.

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

/**
 * FeaturedPrincipleCard
 *
 * Left column  — icon, index, title, accent line, summary, proof
 * Right column — pullquote, tags
 *
 * @param {Object}    principle
 * @param {Component} principle.icon
 * @param {string}    principle.index
 * @param {string}    principle.title
 * @param {string}    principle.summary    — compressed thesis (rendered here)
 * @param {string}    [principle.details]  — NOT rendered on homepage
 * @param {string}    principle.proof
 * @param {string}    principle.pullquote
 * @param {string[]}  principle.tags
 */
export function FeaturedPrincipleCard({ principle }) {
  const {
    icon: Icon,
    index,
    title,
    summary,
    proof,
    pullquote,
    tags,
  } = principle;

  return (
    <div
      className={cn(
        "relative flex flex-col lg:flex-row",
        "rounded-xl overflow-hidden",
        "border border-[var(--color-border-sub)]",
        "bg-[var(--color-surface)]",
        "transition-[border-color,box-shadow] duration-200",
        "hover:border-[rgba(181,242,61,0.25)]",
        "hover:shadow-[var(--shadow-lg),_0_0_0_1px_var(--color-accent-bg)]",
      )}
    >
      {/* Background index glyph */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 right-5 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "8rem",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--color-fg)",
          opacity: 0.025,
          letterSpacing: "-0.04em",
        }}
      >
        {index}
      </span>

      {/* ── Left column: icon, title, summary, proof ───────────────────── */}
      {/* Rebalanced: lg:w-1/2 (was lg:w-[55%]) */}
      <div
        className="flex flex-col gap-5 p-6 lg:p-7 lg:w-1/2 lg:border-r"
        style={{ borderColor: "var(--color-border-sub)" }}
      >
        {/* Icon + index */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{
              background: "var(--color-accent-bg)",
              border: "1px solid rgba(181,242,61,0.18)",
            }}
          >
            <Icon
              size={18}
              aria-hidden="true"
              style={{ color: "var(--color-accent)" }}
            />
          </div>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.06em",
              color: "var(--color-faint)",
            }}
          >
            {index}
          </span>
        </div>

        {/* Title + accent line */}
        <div className="flex flex-col gap-3">
          <Heading as="h3" size="3">
            {title}
          </Heading>
          <div
            aria-hidden
            className="h-px w-8 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
        </div>

        {/* Summary — thesis only, no details paragraph */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: 500,
            lineHeight: "var(--leading-snug)",
            color: "var(--color-fg)",
          }}
        >
          {summary}
        </p>

        {/* Proof — evidence, always visible */}
        <div
          className="flex items-start gap-2 pt-4 border-t mt-auto"
          style={{ borderColor: "var(--color-border-sub)" }}
        >
          <span
            aria-hidden="true"
            style={{
              color: "var(--color-success)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              lineHeight: "var(--leading-normal)",
              flexShrink: 0,
              marginTop: "1px",
            }}
          >
            ✓
          </span>
          <Text
            as="span"
            size="sm"
            color="muted"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.01em" }}
          >
            {proof}
          </Text>
        </div>
      </div>

      {/* ── Right column: pullquote + tags ─────────────────────────────── */}
      {/* Rebalanced: lg:w-1/2 (was lg:w-[45%]) — pullquote gets equal weight */}
      <div
        className="flex flex-col gap-6 p-6 lg:p-7 lg:w-1/2 border-t lg:border-t-0"
        style={{ borderColor: "var(--color-border-sub)" }}
      >
        {pullquote && (
          <blockquote className="flex flex-col gap-4 flex-1">
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3.5rem",
                lineHeight: 0.7,
                color: "var(--color-accent)",
                opacity: 0.4,
                display: "block",
              }}
            >
              &ldquo;
            </span>

            <Text
              as="p"
              size="base"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                lineHeight: "var(--leading-snug)",
                color: "var(--color-fg)",
                fontStyle: "italic",
              }}
            >
              {pullquote}
            </Text>

            <footer>
              <Text
                as="span"
                size="sm"
                color="faint"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                — Alex Shedrach
              </Text>
            </footer>
          </blockquote>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-[5px] mt-auto">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.03em",
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
    </div>
  );
}

// // features/home/PrinciplesSection/FeaturedPrincipleCard.jsx
// // RSC — no client directive required.
// //
// // Full-width card for the first principle — "Systems over pages".
// // Interior split: description + proof on the left, pullquote + tags on the right.
// //
// // The pullquote is the primary differentiator from PrincipleCard.
// // It receives the typographic weight the one-liner deserves — large,
// // opinionated, rendered in display font. This is the hook: a reader who
// // disagrees with it is already thinking about the principle.

// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { cn } from "@/lib/utils";

// /**
//  * FeaturedPrincipleCard
//  *
//  * Expanded layout for the primary principle.
//  *
//  * Left column  — icon, index, title, accent line, description, proof
//  * Right column — pullquote, tags
//  *
//  * @param {Object}    principle           - Principle data from lib/data/home.js
//  * @param {Component} principle.icon      - Lucide icon component
//  * @param {string}    principle.index     - Display index ("01")
//  * @param {string}    principle.title     - Principle title
//  * @param {string}    principle.description
//  * @param {string}    principle.proof     - Evidence statement
//  * @param {string}    principle.pullquote - First-person opinionated statement
//  * @param {string[]}  principle.tags
//  */
// export function FeaturedPrincipleCard({ principle }) {
//   const {
//     icon: Icon,
//     index,
//     title,
//     description,
//     proof,
//     pullquote,
//     tags,
//   } = principle;

//   return (
//     <div
//       className={cn(
//         "relative flex flex-col lg:flex-row",
//         "rounded-xl overflow-hidden",
//         "border border-[var(--color-border-sub)]",
//         "bg-[var(--color-surface)]",
//         "transition-[border-color,box-shadow] duration-200",
//         "hover:border-[rgba(181,242,61,0.25)]",
//         "hover:shadow-[0_12px_48px_rgba(0,0,0,0.45),_0_0_0_1px_rgba(181,242,61,0.1)]",
//       )}
//     >
//       {/* Large background index — spans the full card */}
//       <span
//         aria-hidden="true"
//         className="absolute bottom-2 right-5 select-none pointer-events-none"
//         style={{
//           fontFamily: "var(--font-display)",
//           fontSize: "8rem",
//           fontWeight: 800,
//           lineHeight: 1,
//           color: "var(--color-fg)",
//           opacity: 0.025,
//           letterSpacing: "-0.04em",
//         }}
//       >
//         {index}
//       </span>

//       {/* ── Left column: icon, title, description, proof ──────────────── */}
//       <div
//         className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[55%] lg:border-r"
//         style={{ borderColor: "var(--color-border-sub)" }}
//       >
//         {/* Icon + index */}
//         <div className="flex items-center justify-between">
//           <div
//             className="flex items-center justify-center w-10 h-10 rounded-lg"
//             style={{
//               background: "var(--color-accent-bg)",
//               border: "1px solid rgba(181,242,61,0.18)",
//             }}
//           >
//             <Icon
//               size={18}
//               aria-hidden="true"
//               style={{ color: "var(--color-accent)" }}
//             />
//           </div>

//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.06em",
//               color: "var(--color-faint)",
//             }}
//           >
//             {index}
//           </span>
//         </div>

//         {/* Title + accent line */}
//         <div className="flex flex-col gap-3">
//           <Heading as="h3" size="3">
//             {title}
//           </Heading>
//           <div
//             aria-hidden
//             className="h-px w-8 rounded-full"
//             style={{ background: "var(--color-accent)" }}
//           />
//         </div>

//         {/* Description */}
//         <Text size="base" color="muted" className="flex-1">
//           {description}
//         </Text>

//         {/* Proof */}
//         <div
//           className="flex items-start gap-2 pt-4 border-t"
//           style={{ borderColor: "var(--color-border-sub)" }}
//         >
//           <span
//             aria-hidden="true"
//             style={{
//               color: "var(--color-success)",
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               lineHeight: "var(--leading-normal)",
//               flexShrink: 0,
//               marginTop: "1px",
//             }}
//           >
//             ✓
//           </span>
//           <Text
//             as="span"
//             size="sm"
//             color="muted"
//             style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.01em" }}
//           >
//             {proof}
//           </Text>
//         </div>
//       </div>

//       {/* ── Right column: pullquote + tags ─────────────────────────────── */}
//       <div
//         className="flex flex-col gap-6 p-7 lg:p-8 lg:w-[45%] border-t lg:border-t-0"
//         style={{ borderColor: "var(--color-border-sub)" }}
//       >
//         {/* Pullquote */}
//         {pullquote && (
//           <blockquote className="flex flex-col gap-4 flex-1">
//             {/* Opening quote glyph — large, accent-colored, decorative */}
//             <span
//               aria-hidden="true"
//               style={{
//                 fontFamily: "var(--font-display)",
//                 fontSize: "3.5rem",
//                 lineHeight: 0.7,
//                 color: "var(--color-accent)",
//                 opacity: 0.4,
//                 display: "block",
//               }}
//             >
//               &ldquo;
//             </span>

//             <Text
//               as="p"
//               size="base"
//               style={{
//                 fontFamily: "var(--font-display)",
//                 fontWeight: 500,
//                 lineHeight: "var(--leading-snug)",
//                 color: "var(--color-fg)",
//                 fontStyle: "italic",
//               }}
//             >
//               {pullquote}
//             </Text>

//             {/* Attribution line */}
//             <footer>
//               <Text
//                 as="span"
//                 size="sm"
//                 color="faint"
//                 style={{ fontFamily: "var(--font-mono)" }}
//               >
//                 — Alex Shedrach
//               </Text>
//             </footer>
//           </blockquote>
//         )}

//         {/* Tags — anchored to the bottom of the column */}
//         {tags && tags.length > 0 && (
//           <div className="flex flex-wrap gap-[5px] mt-auto">
//             {tags.slice(0, 4).map((tag) => (
//               <span
//                 key={tag}
//                 style={{
//                   fontFamily: "var(--font-mono)",
//                   fontSize: "var(--text-xs)",
//                   letterSpacing: "0.03em",
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
//     </div>
//   );
// }
