// components/ui/Cards/PostCard.jsx
// RSC — no client directive required.
//
// Shared primitive. Renders on both the Home WritingSection and the
// /writing index page. Per DEC-006 precedent, components serving multiple
// route contexts belong in components/ui/, not a feature directory.
//
// This replaces the previous individual-props version of PostCard.
// The API has moved to a single `post` object matching the PostMeta shape
// returned by getAllPosts() in lib/data/posts.js. This eliminates the
// prop-spreading that previously coupled the component to both data shapes
// (static posts.js and filesystem posts.js).
//
// features/writing/PostCard.jsx is now deleted — this is its permanent home.
//
// Composition:
//   <article> (group wrapper)
//     └── <a> (single interaction target — full card is the link)
//           └── Card
//                 └── CardContent
//                       ├── Meta row — date left, readTime right
//                       ├── Title row — heading + hover arrow
//                       ├── Summary
//                       └── Footer — tags + optional related project reference
//
// Accessible name: aria-labelledby on the <a> points to the title element.
// Screen readers announce the title as the link name in navigation mode;
// full card content remains available in reading mode.
//
// @param {PostMeta}  post                     — Full PostMeta shape from getAllPosts.
// @param {Object}    [relatedProject]          — Optional. Resolved by the parent.
// @param {string}    relatedProject.title      — Display name of the related project.
// @param {string}    [className]               — Layout overrides only (grid span, margin).

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export function PostCard({ post, relatedProject = null, className }) {
  const titleId = `post-title-${post.slug}`;

  return (
    <article className={cn("group", className)}>
      {/*
        The <a> wraps Card entirely — single interaction target, no z-index overlay.
        Focus ring lives on the <a>; rounded-xl matches Card's border radius
        so the ring traces the card edge precisely.
      */}
      <a
        href={`/writing/${post.slug}`}
        aria-labelledby={titleId}
        className={cn(
          "block rounded-xl",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        )}
      >
        <Card variant="default" interactive className="h-full">
          <CardContent noPadding className="p-6">
            {/* ── Meta row ──────────────────────────────────────────────
                date left · readTime right.
                Both mono — signals data precision, not editorial flair.
                faint color recedes below the title without disappearing. */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <time
                dateTime={post.published}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.04em",
                }}
                className="text-[var(--color-faint)]"
              >
                {post.publishedFormatted}
              </time>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                }}
                className="shrink-0 text-[var(--color-faint)]"
              >
                {post.readTime}
              </span>
            </div>

            {/* ── Title row ─────────────────────────────────────────────
                Arrow translates 2px right on hover — directional signal,
                consistent with DEC-004 (motion must explain, not decorate).
                motion-reduce suppresses both transitions for affected users. */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <Heading
                as="h3"
                size="3"
                id={titleId}
                className={cn(
                  "transition-colors duration-200",
                  "group-hover:text-[var(--color-accent)]",
                  "motion-reduce:transition-none",
                )}
              >
                {post.title}
              </Heading>

              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0 mt-[3px]",
                  "text-[var(--color-accent)]",
                  "text-base leading-none",
                  "opacity-0 translate-x-0",
                  "group-hover:opacity-100 group-hover:translate-x-0.5",
                  "transition-[opacity,transform] duration-200",
                  "motion-reduce:transition-none motion-reduce:translate-x-0",
                )}
              >
                →
              </span>
            </div>

            {/* ── Summary ───────────────────────────────────────────────
                One sentence. muted color — below title in hierarchy but
                readable. leading-relaxed gives prose breathing room.     */}
            <Text size="sm" color="muted" className="mb-5 leading-relaxed">
              {post.summary}
            </Text>

            {/* ── Footer row ────────────────────────────────────────────
                Tags left · relatedProject right.
                Top border separates from the prose body — same treatment
                as CardFooter, applied directly to avoid double-padding.

                Tags: taxonomy display only. No filter interaction at this
                scale — per spec, categories ship only when posts divide
                into genuinely distinct groups.

                relatedProject: informational only. The accent dot signals
                the connection to /projects without a competing link inside
                the card boundary.                                        */}
            <div
              className={cn(
                "flex items-center justify-between gap-4 flex-wrap",
                "pt-4 border-t border-[var(--color-border-sub)]",
              )}
            >
              {post.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                      }}
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-md",
                        "bg-[var(--color-surface-2)]",
                        "text-[var(--color-faint)]",
                        "border border-[var(--color-border-sub)]",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {relatedProject && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                  }}
                  className="shrink-0 flex items-center gap-1.5 text-[var(--color-faint)]"
                >
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-[var(--color-accent)] opacity-50"
                  />
                  {relatedProject.title}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </article>
  );
}

// // components/ui/PostCard/PostCard.jsx
// // RSC — no client directive required.
// //
// // Shared primitive. Renders on both the Home Writing section and the
// // /writing index page. Per DEC-006 precedent, components serving multiple
// // route contexts belong in components/ui/, not a feature directory.
// //
// // Composition:
// //   Link (Next.js) — route wrapper, renders as <a>
// //     └── Card — visual container
// //           ├── CardHeader — tag + title
// //           ├── CardContent — summary (flex-1 pushes footer down)
// //           └── CardFooter — date · read time
// //
// // Hover contract:
// //   The Link carries the `group` class. Card and Heading respond to
// //   group-hover via className — no JavaScript required.
// //   Focus ring is surfaced on the Link, not the Card, to avoid
// //   double-ring artifacts from the Card's own focus-visible styles.
// //
// // @param {string}   title        — Post title. Required.
// // @param {string}   summary      — One-sentence description. Required.
// // @param {string}   publishedAt  — ISO 8601 date string. Required.
// // @param {number}   readingTime  — Integer minutes. Required.
// // @param {string[]} tags         — Tag array. Index 0 is the primary display tag.
// // @param {string}   href         — Destination path. Required.
// // @param {string}   className    — Layout overrides only (grid span, margin).

// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/Cards/Card";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { Badge } from "@/components/ui/Badge";

// /**
//  * Formats an ISO 8601 date string to a readable display value.
//  * Runs server-side — no locale mismatch between server and client.
//  * Output example: "Apr 10, 2026"
//  *
//  * @param {string} isoString
//  * @returns {string}
//  */
// function formatDate(isoString) {
//   return new Intl.DateTimeFormat("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   }).format(new Date(isoString));
// }

// export function PostCard({
//   title,
//   summary,
//   publishedAt,
//   readingTime,
//   tags,
//   href,
//   className,
// }) {
//   const primaryTag = tags?.[0] ?? null;

//   return (
//     <Link
//       href={href}
//       className={cn(
//         // Layout
//         "group block h-full",
//         // Focus ring on the link — not the card — prevents double-ring
//         "rounded-xl",
//         "focus-visible:outline-none",
//         "focus-visible:ring-2",
//         "focus-visible:ring-[var(--color-accent)]",
//         "focus-visible:ring-offset-2",
//         "focus-visible:ring-offset-[var(--color-bg)]",
//         className,
//       )}
//     >
//       <Card
//         variant="default"
//         className={cn(
//           // Fill the link wrapper height
//           "h-full flex flex-col",
//           // Respond to group hover — border and shadow lift
//           "transition-[border-color,box-shadow,transform] duration-200",
//           "group-hover:-translate-y-0.5",
//           "group-hover:border-[var(--color-border)]",
//           "group-hover:shadow-[var(--shadow-lg)]",
//         )}
//       >
//         {/* ── Header — tag + title ──────────────────────────────────── */}
//         <CardHeader>
//           {primaryTag && (
//             <div className="mb-3">
//               <Badge variant="muted" size="sm">
//                 {primaryTag}
//               </Badge>
//             </div>
//           )}

//           <Heading
//             as="h3"
//             size="4"
//             balance
//             className="transition-colors duration-150 group-hover:text-[var(--color-accent)]"
//           >
//             {title}
//           </Heading>
//         </CardHeader>

//         {/* ── Content — summary, flex-1 pushes footer to bottom ────── */}
//         <CardContent className="flex-1 pt-0">
//           <Text size="sm" color="muted">
//             {summary}
//           </Text>
//         </CardContent>

//         {/* ── Footer — date · read time ─────────────────────────────── */}
//         <CardFooter>
//           <div className="flex items-center gap-2">
//             <Text as="span" size="sm" color="faint">
//               {formatDate(publishedAt)}
//             </Text>

//             {/* Separator — aria-hidden, decorative */}
//             <span
//               aria-hidden="true"
//               className="text-[var(--color-faint)]"
//               style={{ fontSize: "var(--text-xs)" }}
//             >
//               ·
//             </span>

//             <Text as="span" size="sm" color="faint">
//               {readingTime} min read
//             </Text>
//           </div>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// }
