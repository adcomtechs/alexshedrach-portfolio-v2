// features/home/PrinciplesSection/PrincipleCard.jsx
// RSC — no client directive required.
//
// Schema change: `description` → `summary` + `details`
//
//   summary  — rendered as the primary readable thesis. Full weight, full color.
//   details  — rendered as clamped supporting rationale. Muted, secondary.
//              Prepared for progressive disclosure when DEC-* approves
//              the client boundary for inline expansion.
//
// Proof is evidence — it always renders. It is not expandable.

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

function ProofLine({ text }) {
  return (
    <div
      className="flex items-start gap-2 pt-4 border-t"
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
        {text}
      </Text>
    </div>
  );
}

/**
 * PrincipleCard
 *
 * Standard card for principles 2–N.
 *
 * Content hierarchy:
 *   title    — what the principle is called
 *   summary  — the thesis, one line, primary weight
 *   details  — supporting rationale, clamped, muted
 *   proof    — named evidence, always visible
 *   tags     — domain anchors
 *
 * @param {Object}    principle
 * @param {Component} principle.icon
 * @param {string}    principle.index
 * @param {string}    principle.title
 * @param {string}    principle.summary   — compressed thesis (1 sentence)
 * @param {string}    [principle.details] — expanded rationale (optional)
 * @param {string}    principle.proof
 * @param {string[]}  principle.tags
 */
export function PrincipleCard({ principle }) {
  const { icon: Icon, index, title, summary, details, proof, tags } = principle;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 p-5",
        "rounded-xl overflow-hidden",
        "border border-[var(--color-border-sub)]",
        "bg-[var(--color-surface)]",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5",
        "hover:border-[rgba(181,242,61,0.2)]",
        "hover:shadow-[var(--shadow-lg),_0_0_0_1px_var(--color-accent-bg)]",
      )}
    >
      {/* Large faint index — decorative */}
      <span
        aria-hidden="true"
        className="absolute top-3 right-4 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "5rem",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--color-fg)",
          opacity: 0.03,
          letterSpacing: "-0.04em",
        }}
      >
        {index}
      </span>

      {/* Icon + index label row */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{
            background: "var(--color-accent-bg)",
            border: "1px solid rgba(181,242,61,0.15)",
          }}
        >
          <Icon
            size={16}
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
      <div className="flex flex-col gap-2">
        <Heading as="h3" size="4">
          {title}
        </Heading>
        <div
          aria-hidden
          className="h-px w-6 rounded-full"
          style={{ background: "var(--color-accent)", opacity: 0.6 }}
        />
      </div>

      {/* Summary + details — two-layer content */}
      <div className="flex flex-col gap-2 flex-1">
        {/* Summary — primary thesis, full weight */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            lineHeight: "var(--leading-snug)",
            color: "var(--color-fg)",
          }}
        >
          {summary}
        </p>

        {/* Details — supporting rationale, clamped, muted */}
        {details && (
          <Text size="sm" color="muted" className="line-clamp-2">
            {details}
          </Text>
        )}
      </div>

      {/* Proof — always visible */}
      <ProofLine text={proof} />

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-[5px]">
          {tags.slice(0, 3).map((tag) => (
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
  );
}

// // features/home/PrinciplesSection/PrincipleCard.jsx
// // RSC — no client directive required.
// //
// // Used for principles 2–5. The first principle uses FeaturedPrincipleCard.
// //
// // Design language:
// //   - Floats on the section's dual-color glow background — no outer border frame
// //   - Large faint index number as a background decorative element (aria-hidden)
// //   - Proof statement rendered with a distinct treatment — it's evidence, not copy
// //   - Tags row at the bottom anchors the card's lower edge

// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { cn } from "@/lib/utils";

// /**
//  * ProofLine
//  *
//  * The proof statement rendered as a distinct visual unit.
//  * Mono font, small, separated by a top border from the description.
//  * "Proof" is a specific content type — it reads differently from description copy.
//  */
// function ProofLine({ text }) {
//   return (
//     <div
//       className="flex items-start gap-2 pt-4 border-t"
//       style={{ borderColor: "var(--color-border-sub)" }}
//     >
//       {/* Check indicator — signals "verified" without overusing the word */}
//       <span
//         aria-hidden="true"
//         style={{
//           color: "var(--color-success)",
//           fontFamily: "var(--font-mono)",
//           fontSize: "var(--text-xs)",
//           lineHeight: "var(--leading-normal)",
//           flexShrink: 0,
//           marginTop: "1px",
//         }}
//       >
//         ✓
//       </span>
//       <Text
//         as="span"
//         size="sm"
//         color="muted"
//         style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.01em" }}
//       >
//         {text}
//       </Text>
//     </div>
//   );
// }

// /**
//  * PrincipleCard
//  *
//  * Displays a single engineering principle.
//  * Surfaces: icon, index, title, description, proof, tags.
//  *
//  * The large faint index number is a decorative background element — it creates
//  * visual depth without contributing readable content. aria-hidden suppresses it
//  * from AT users; the index is not meaningful to screen reader navigation.
//  *
//  * @param {Object}   principle         - Principle data from lib/data/home.js
//  * @param {Component} principle.icon   - Lucide icon component
//  * @param {string}   principle.index   - Display index string ("01", "02"…)
//  * @param {string}   principle.title   - Principle title
//  * @param {string}   principle.description - Principle description
//  * @param {string}   principle.proof   - Evidence statement
//  * @param {string[]} principle.tags    - Domain tags
//  */
// export function PrincipleCard({ principle }) {
//   const { icon: Icon, index, title, description, proof, tags } = principle;

//   return (
//     <div
//       className={cn(
//         "relative flex flex-col gap-5 p-6",
//         "rounded-xl overflow-hidden",
//         "border border-[var(--color-border-sub)]",
//         "bg-[var(--color-surface)]",
//         // Hover: subtle lift with a faint accent border glow
//         "transition-[border-color,box-shadow,transform] duration-200",
//         "hover:-translate-y-0.5",
//         "hover:border-[rgba(181,242,61,0.2)]",
//         "hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(181,242,61,0.08)]",
//       )}
//     >
//       {/* Large faint index — decorative background element */}
//       <span
//         aria-hidden="true"
//         className="absolute top-3 right-4 select-none pointer-events-none"
//         style={{
//           fontFamily: "var(--font-display)",
//           fontSize: "5rem",
//           fontWeight: 800,
//           lineHeight: 1,
//           color: "var(--color-fg)",
//           opacity: 0.03,
//           letterSpacing: "-0.04em",
//         }}
//       >
//         {index}
//       </span>

//       {/* Icon + index label row */}
//       <div className="flex items-center justify-between">
//         <div
//           className="flex items-center justify-center w-9 h-9 rounded-lg"
//           style={{
//             background: "var(--color-accent-bg)",
//             border: "1px solid rgba(181,242,61,0.15)",
//           }}
//         >
//           <Icon
//             size={16}
//             aria-hidden="true"
//             style={{ color: "var(--color-accent)" }}
//           />
//         </div>

//         <span
//           style={{
//             fontFamily: "var(--font-mono)",
//             fontSize: "var(--text-xs)",
//             letterSpacing: "0.06em",
//             color: "var(--color-faint)",
//           }}
//         >
//           {index}
//         </span>
//       </div>

//       {/* Title + accent line */}
//       <div className="flex flex-col gap-2">
//         <Heading as="h3" size="4">
//           {title}
//         </Heading>
//         <div
//           aria-hidden
//           className="h-px w-6 rounded-full"
//           style={{ background: "var(--color-accent)", opacity: 0.6 }}
//         />
//       </div>

//       {/* Description */}
//       <Text size="sm" color="muted" className="flex-1 line-clamp-4">
//         {description}
//       </Text>

//       {/* Proof */}
//       <ProofLine text={proof} />

//       {/* Tags */}
//       {tags && tags.length > 0 && (
//         <div className="flex flex-wrap gap-[5px]">
//           {tags.slice(0, 3).map((tag) => (
//             <span
//               key={tag}
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.03em",
//                 padding: "2px 7px",
//                 borderRadius: "3px",
//                 background: "var(--color-bg)",
//                 border: "1px solid var(--color-border)",
//                 color: "var(--color-faint)",
//               }}
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
