// features/home/WritingSection/FeaturedPostCard.jsx
// RSC — no client directive required.
//
// Field name migration from the static posts.js schema:
//   post.publishedAt   → post.published        (dateTime attribute)
//   post.readingTime   → parseInt(post.readTime) (ReadingTimeBar still takes minutes)
//   formatDate(x)      → post.publishedFormatted (derived in lib/data/posts.js)
//
// The amber accent palette and editorial layout are unchanged.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

// ── Sub-components ─────────────────────────────────────────────────────────────

/**
 * ReadingTimeBar
 *
 * Visualises reading time as a thin filled bar.
 * Max ceiling: 15 minutes. Articles longer than 15min fill completely.
 *
 * @param {number} minutes — Integer minute count.
 */
function ReadingTimeBar({ minutes }) {
  const MAX_MINUTES = 15;
  const fillPercent = Math.min((minutes / MAX_MINUTES) * 100, 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-px w-full rounded-full overflow-hidden"
        style={{ background: "var(--color-border)" }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${fillPercent}%`,
            background:
              "linear-gradient(to right, #f59e0b, rgba(181,242,61,0.6))",
          }}
        />
      </div>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5625rem",
          letterSpacing: "0.07em",
          color: "var(--color-faint)",
        }}
      >
        {minutes} min read
      </span>
    </div>
  );
}

/**
 * PostTag
 *
 * Primary tag in amber — distinct from lime engineering tags in ProjectCard.
 */
function PostTag({ tag }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="w-1 h-1 rounded-full shrink-0"
        style={{ background: "#f59e0b" }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "#f59e0b",
        }}
      >
        {tag}
      </span>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * FeaturedPostCard
 *
 * Editorial anchor for the WritingSection. Renders the primary featured post
 * at full-width with an expanded two-column layout on desktop.
 *
 * Used once — at the top of WritingSection. Supporting posts use PostCard.
 *
 * @param {PostMeta} post — PostMeta shape from lib/data/posts.js getAllPosts().
 */
export function FeaturedPostCard({ post }) {
  const {
    slug,
    title,
    summary,
    published,
    publishedFormatted,
    readTime,
    tags,
  } = post;
  const primaryTag = tags?.[0] ?? null;

  // readTime is a string — "8 min read". ReadingTimeBar needs the integer.
  // parseInt("8 min read") → 8. The format is always "{n} min read" from
  // deriveReadTime() in lib/data/posts.js, so this is safe.
  const readingMinutes = parseInt(readTime, 10);

  return (
    <Link
      href={`/writing/${slug}`}
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
      {/* Decorative amber glow — contained within card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[70px]"
        style={{ background: "#f59e0b", opacity: 0.06 }}
      />

      {/* ── Left column: tag, date, title, reading time bar ─────────── */}
      <div
        className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[55%] lg:border-r"
        style={{ borderColor: "var(--color-border-sub)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5625rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                padding: "2px 7px",
                borderRadius: "3px",
              }}
            >
              Featured
            </span>

            {primaryTag && <PostTag tag={primaryTag} />}
          </div>

          <ArrowUpRight
            size={15}
            aria-hidden
            className={cn(
              "shrink-0",
              "opacity-0 -translate-x-[3px] translate-y-[3px]",
              "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
              "transition-all duration-200",
            )}
            style={{ color: "#f59e0b" }}
          />
        </div>

        <div>
          <Heading as="h3" size="3" className="transition-colors duration-200">
            <span className="group-hover:[color:#f59e0b] transition-colors duration-200">
              {title}
            </span>
          </Heading>

          {/* Amber accent line — expands on hover */}
          <div
            aria-hidden
            className={cn(
              "h-px rounded-[1px] mt-3",
              "w-8 group-hover:w-16",
              "transition-[width] duration-[400ms]",
              "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
            )}
            style={{ background: "#f59e0b" }}
          />
        </div>

        <ReadingTimeBar minutes={readingMinutes} />
      </div>

      {/* ── Right column: date, summary, CTA ────────────────────────── */}
      <div
        className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[45%] border-t lg:border-t-0"
        style={{ borderColor: "var(--color-border-sub)" }}
      >
        {/* post.published for the datetime attribute (machine-readable ISO),
            post.publishedFormatted for display (human-readable).           */}
        <Text
          as="time"
          dateTime={published}
          size="sm"
          color="faint"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.03em" }}
        >
          {publishedFormatted}
        </Text>

        <Text size="base" color="muted" className="flex-1 line-clamp-4">
          {summary}
        </Text>

        <div className="flex items-center gap-2 mt-auto pt-2">
          <span
            className="transition-colors duration-200"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--color-faint)",
            }}
          >
            Read article
          </span>
          <ArrowUpRight
            size={12}
            aria-hidden
            className="text-[var(--color-faint)] group-hover:text-[#f59e0b] transition-colors duration-200"
          />
        </div>
      </div>
    </Link>
  );
}

// // features/home/WritingSection/FeaturedPostCard.jsx
// // RSC — no client directive required.
// //
// // Expanded editorial display for the primary featured post.
// // Distinct from PostCard (components/ui/PostCard) — that component is a
// // uniform grid card. This is the anchor piece: large title, reading time
// // visualised as a progress bar, amber accent throughout.
// //
// // The amber accent palette is intentional: lime (--color-accent) belongs to
// // the engineering/system sections. Amber signals editorial territory —
// // warmth, thought, writing. The contrast helps the user understand they've
// // moved from "what was built" to "how it was thought about."
// //
// // Layout:
// //   Mobile  — stacked column, generous padding
// //   Desktop — two-column: [metadata + title left 55%] | [summary + CTA right 45%]

// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { cn } from "@/lib/utils";

// // ── Helpers ────────────────────────────────────────────────────────────────────

// /**
//  * Formats an ISO 8601 date string to "Month DD, YYYY".
//  * Runs server-side to avoid hydration mismatch.
//  */
// function formatDate(iso) {
//   return new Intl.DateTimeFormat("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   }).format(new Date(iso));
// }

// // ── Sub-components ─────────────────────────────────────────────────────────────

// /**
//  * ReadingTimeBar
//  *
//  * Visualises reading time as a thin filled bar.
//  * Max ceiling: 15 minutes. Articles longer than 15min fill the bar completely.
//  * This is the only instance of a "progress" metaphor in the system — it is
//  * justified here because reading time has a natural finite scale.
//  *
//  * The bar uses amber as its fill color to reinforce the writing palette.
//  */
// function ReadingTimeBar({ minutes }) {
//   const MAX_MINUTES = 15;
//   const fillPercent = Math.min((minutes / MAX_MINUTES) * 100, 100);

//   return (
//     <div className="flex flex-col gap-1.5">
//       {/* Track */}
//       <div
//         className="h-px w-full rounded-full overflow-hidden"
//         style={{ background: "var(--color-border)" }}
//         aria-hidden="true"
//       >
//         {/* Fill */}
//         <div
//           className="h-full rounded-full"
//           style={{
//             width: `${fillPercent}%`,
//             background:
//               "linear-gradient(to right, #f59e0b, rgba(181,242,61,0.6))",
//           }}
//         />
//       </div>

//       {/* Label */}
//       <span
//         style={{
//           fontFamily: "var(--font-mono)",
//           fontSize: "0.5625rem",
//           letterSpacing: "0.07em",
//           color: "var(--color-faint)",
//         }}
//       >
//         {minutes} min read
//       </span>
//     </div>
//   );
// }

// /**
//  * PostTag
//  *
//  * Primary tag rendered in amber to distinguish writing taxonomy
//  * from the lime-colored engineering tags used in ProjectCard.
//  */
// function PostTag({ tag }) {
//   return (
//     <div className="inline-flex items-center gap-1.5">
//       <span
//         aria-hidden="true"
//         className="w-1 h-1 rounded-full shrink-0"
//         style={{ background: "#f59e0b" }}
//       />
//       <span
//         style={{
//           fontFamily: "var(--font-mono)",
//           fontSize: "var(--text-xs)",
//           letterSpacing: "0.07em",
//           textTransform: "uppercase",
//           color: "#f59e0b",
//         }}
//       >
//         {tag}
//       </span>
//     </div>
//   );
// }

// // ── Main export ────────────────────────────────────────────────────────────────

// /**
//  * FeaturedPostCard
//  *
//  * Editorial anchor for the WritingSection. Renders the primary featured post
//  * at full-width with an expanded two-column layout on desktop.
//  *
//  * This component is used once — at the top of the WritingSection.
//  * The supporting posts below use the standard PostCard from components/ui/.
//  *
//  * @param {Object} post          - Post data object from lib/data/posts.js
//  * @param {string} post.slug
//  * @param {string} post.title
//  * @param {string} post.summary
//  * @param {string} post.publishedAt  - ISO 8601
//  * @param {number} post.readingTime  - Minutes
//  * @param {string[]} post.tags
//  */
// export function FeaturedPostCard({ post }) {
//   const { slug, title, summary, publishedAt, readingTime, tags } = post;
//   const primaryTag = tags?.[0] ?? null;

//   return (
//     <Link
//       href={`/writing/${slug}`}
//       className={cn(
//         "group relative flex flex-col lg:flex-row",
//         "bg-[var(--color-surface)]",
//         "hover:bg-[var(--color-surface-2)]",
//         "transition-colors duration-200",
//         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
//         "focus-visible:ring-[var(--color-accent)]",
//         "overflow-hidden",
//       )}
//     >
//       {/* Decorative amber glow — top-left corner, contained within card */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[70px]"
//         style={{ background: "#f59e0b", opacity: 0.06 }}
//       />

//       {/* ── Left column: tag, date, title, reading time ─────────────── */}
//       <div
//         className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[55%] lg:border-r"
//         style={{ borderColor: "var(--color-border-sub)" }}
//       >
//         {/* Header row: tag + meta */}
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             {/* Featured label */}
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "0.5625rem",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 color: "var(--color-faint)",
//                 background: "var(--color-surface-2)",
//                 border: "1px solid var(--color-border)",
//                 padding: "2px 7px",
//                 borderRadius: "3px",
//               }}
//             >
//               Featured
//             </span>

//             {primaryTag && <PostTag tag={primaryTag} />}
//           </div>

//           {/* Arrow — directional reveal on hover */}
//           <ArrowUpRight
//             size={15}
//             aria-hidden
//             className={cn(
//               "shrink-0",
//               "opacity-0 -translate-x-[3px] translate-y-[3px]",
//               "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
//               "transition-all duration-200",
//             )}
//             style={{ color: "#f59e0b" }}
//           />
//         </div>

//         {/* Title */}
//         <div>
//           <Heading
//             as="h3"
//             size="3"
//             // balance
//             className="transition-colors duration-200"
//             style={{
//               color: "var(--color-fg)",
//             }}
//           >
//             <span className="group-hover:[color:#f59e0b] transition-colors duration-200">
//               {title}
//             </span>
//           </Heading>

//           {/* Amber accent line — expands on hover */}
//           <div
//             aria-hidden
//             className={cn(
//               "h-px rounded-[1px] mt-3",
//               "w-8 group-hover:w-16",
//               "transition-[width] duration-[400ms]",
//               "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
//             )}
//             style={{ background: "#f59e0b" }}
//           />
//         </div>

//         {/* Reading time bar */}
//         <ReadingTimeBar minutes={readingTime} />
//       </div>

//       {/* ── Right column: date, summary, CTA ───────────────────────── */}
//       <div
//         className="flex flex-col gap-5 p-7 lg:p-8 lg:w-[45%] border-t lg:border-t-0"
//         style={{ borderColor: "var(--color-border-sub)" }}
//       >
//         {/* Date */}
//         <Text
//           as="time"
//           dateTime={publishedAt}
//           size="sm"
//           color="faint"
//           style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.03em" }}
//         >
//           {formatDate(publishedAt)}
//         </Text>

//         {/* Summary — flex-1 pushes CTA to the bottom */}
//         <Text size="base" color="muted" className="flex-1 line-clamp-4">
//           {summary}
//         </Text>

//         {/* CTA */}
//         <div className="flex items-center gap-2 mt-auto pt-2">
//           <span
//             className="transition-colors duration-200"
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.07em",
//               textTransform: "uppercase",
//               color: "var(--color-faint)",
//             }}
//           >
//             Read article
//           </span>
//           <ArrowUpRight
//             size={12}
//             aria-hidden
//             className="text-[var(--color-faint)] group-hover:text-[#f59e0b] transition-colors duration-200"
//           />
//         </div>
//       </div>
//     </Link>
//   );
// }
