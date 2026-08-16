// features/writing/PostLayout.jsx
// RSC — no client directive required.
//
// Data-coupled to PostFull schema from getPostBySlug.
// Lives in features/writing/ — same reasoning as CaseStudyLayout in
// features/projects/ (DEC-016): schema-coupled components belong in their
// feature directory, not in components/layout/.
//
// SectionBackground variants: per DEC-053.
//   Hero section:    "editorial"
//   Content section: "minimal"

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

/**
 * PostLayout
 *
 * Full page layout for individual writing posts at /writing/[slug].
 * Receives a fully resolved PostFull object — content is already-rendered
 * HTML from the remark/rehype pipeline.
 *
 * dangerouslySetInnerHTML is safe here: content originates from our own
 * markdown files on the filesystem, not from user input. No sanitization
 * step is required.
 *
 * relatedProject is resolved by the parent page (app/writing/[slug]/page.jsx)
 * from post.project slug via getAllProjects(). PostLayout has no knowledge of
 * the projects data layer — same boundary established for PostCard.
 *
 * @param {PostFull}  post                   - Full post data from getPostBySlug.
 * @param {Object}    [relatedProject]        - Optional. Resolved by the parent.
 * @param {string}    relatedProject.slug     - Project slug for href construction.
 * @param {string}    relatedProject.title    - Display name of the related project.
 */
export function PostLayout({ post, relatedProject = null }) {
  return (
    <>
      {/* ── Post Hero ──────────────────────────────────────────────────────────
          SectionBackground variant: "editorial" — per DEC-053.
          Container: "default" (896px) — hero framing at full prose width.
          The content section below narrows to "narrow" (672px) per DEC-052
          for optimal long-form reading line length.                         */}
      <Section as="header" spacing="sm" className="relative">
        <SectionBackground variant="editorial" />

        <Container size="wide">
          {/* Back link — above the title, establishes navigation context */}
          <div className="mb-10">
            <Link
              href="/writing"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.04em",
              }}
              className={cn(
                "inline-flex items-center gap-2",
                "text-[var(--color-faint)]",
                "hover:text-[var(--color-muted)]",
                "transition-colors duration-150",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
                "rounded-sm",
              )}
            >
              <span aria-hidden="true">←</span>
              Writing
            </Link>
          </div>

          {/* Tags eyebrow — taxonomy above the title, consistent with PostCard */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-5">
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

          {/* Title */}
          <Heading as="h1" size="1" balance className="mb-4 max-w-2xl">
            {post.title}
          </Heading>

          {/* Summary — deck treatment: larger than body, muted */}
          <Text size="lg" color="muted" balance className="mb-8 max-w-xl">
            {post.summary}
          </Text>

          {/* Meta strip ─────────────────────────────────────────────────────
              date · readTime · [related project]
              All three are low-hierarchy metadata. Separated by a mid-dot
              rendered as aria-hidden so screen readers don't announce it.
              The related project link is actionable here — full page gives
              it the room that PostCard's single-link constraint does not.   */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
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
              aria-hidden="true"
              className="text-[var(--color-border)] text-xs select-none"
            >
              ·
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
              }}
              className="text-[var(--color-faint)]"
            >
              {post.readTime}
            </span>

            {relatedProject && (
              <>
                <span
                  aria-hidden="true"
                  className="text-[var(--color-border)] text-xs select-none"
                >
                  ·
                </span>
                <a
                  href={`/projects/${relatedProject.slug}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.04em",
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5",
                    "text-[var(--color-accent)]",
                    "hover:text-[var(--color-fg)]",
                    "transition-colors duration-150",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
                    "rounded-sm",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-current opacity-70"
                  />
                  {relatedProject.title}
                </a>
              </>
            )}
          </div>
        </Container>
      </Section>

      {/* ── Post Content ───────────────────────────────────────────────────────
          SectionBackground variant: "minimal" — per DEC-053.
          Container: "narrow" (672px) — per DEC-052. Optimal line length
          for long-form technical prose. Mixed container sizes within one
          page are permitted per DEC-024: hero uses "default" (896px),
          content uses "narrow" (672px).

          dangerouslySetInnerHTML: safe — content originates from filesystem
          markdown files we control. Not user input, no sanitization required.
          The HTML is processed by rehype-pretty-code, rehype-slug, and
          rehype-autolink-headings before reaching this component.
          The .prose class applies the typography system from utilities.css. */}
      <Section spacing="sm" className="relative">
        <SectionBackground variant="minimal" />

        <Container size="default">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Container>
      </Section>

      {/* ── Post Footer ────────────────────────────────────────────────────────
          Container "narrow" matches the content section — the footer reads
          as part of the content column, not a page-level element.
          Two actions: back to the writing index, and (when present) a CTA
          to the related project case study.                                 */}
      <Section spacing="sm" as="footer">
        <Container size="default">
          <div
            className={cn(
              "flex items-center justify-between gap-4 flex-wrap",
              "pt-8 border-t border-[var(--color-border-sub)]",
            )}
          >
            <Button
              href="/writing"
              variant="ghost"
              size="sm"
              leftIcon={<span aria-hidden="true">←</span>}
            >
              All writing
            </Button>

            {relatedProject && (
              <Button
                href={`/projects/${relatedProject.slug}`}
                variant="outline"
                size="sm"
                rightIcon={<span aria-hidden="true">↗</span>}
              >
                See the case study
              </Button>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

// // features/writing/PostLayout.jsx
// // RSC — no client directive required.
// //
// // Data-coupled to PostFull schema from getPostBySlug.
// // Lives in features/writing/ — same reasoning as CaseStudyLayout in
// // features/projects/ (DEC-016): schema-coupled components belong in their
// // feature directory, not in components/layout/.

// import { cn } from "@/lib/utils";
// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { SectionBackground } from "@/components/ui/SectionBackground";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { Button } from "@/components/ui/Button";

// /**
//  * PostLayout
//  *
//  * Full page layout for individual writing posts at /writing/[slug].
//  * Receives a fully resolved PostFull object — content is already-rendered
//  * HTML from the remark/rehype pipeline.
//  *
//  * dangerouslySetInnerHTML is safe here: content originates from our own
//  * markdown files on the filesystem, not from user input. No sanitization
//  * step is required.
//  *
//  * relatedProject is resolved by the parent page (app/writing/[slug]/page.jsx)
//  * from post.project slug via getAllProjects(). PostLayout has no knowledge of
//  * the projects data layer — same boundary established for PostCard.
//  *
//  * @param {PostFull}  post                   - Full post data from getPostBySlug.
//  * @param {Object}    [relatedProject]        - Optional. Resolved by the parent.
//  * @param {string}    relatedProject.slug     - Project slug for href construction.
//  * @param {string}    relatedProject.title    - Display name of the related project.
//  */
// export function PostLayout({ post, relatedProject = null }) {
//   return (
//     <>
//       {/* ── Post Hero ──────────────────────────────────────────────────────────
//           DEC-045 REQUIRED before production:
//           SectionBackground variant for /writing/[slug] hero is unassigned.
//           See DECISIONS.md — writing surfaces are explicitly listed as
//           "Unassigned" and require a logged decision entry.
//           Proposal: variant="editorial" (consistent with /projects index hero —
//           document, evidence, precision character). Using "minimal" as the safe
//           baseline until DEC-045 is logged.                                   */}
//       <Section as="header" spacing="lg" className="relative">
//         <SectionBackground
//           variant="minimal"
//           /* TODO DEC-045: replace with agreed variant */
//         />

//         <Container size="default">
//           {/* Back link — above the title, establishes navigation context */}
//           <div className="mb-10">
//             <a
//               href="/writing"
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.04em",
//               }}
//               className={cn(
//                 "inline-flex items-center gap-2",
//                 "text-[var(--color-faint)]",
//                 "hover:text-[var(--color-muted)]",
//                 "transition-colors duration-150",
//                 "focus-visible:outline-none",
//                 "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
//                 "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
//                 "rounded-sm",
//               )}
//             >
//               <span aria-hidden="true">←</span>
//               Writing
//             </a>
//           </div>

//           {/* Tags eyebrow — taxonomy above the title, consistent with PostCard */}
//           {post.tags.length > 0 && (
//             <div className="flex items-center gap-1.5 flex-wrap mb-5">
//               {post.tags.map((tag) => (
//                 <span
//                   key={tag}
//                   style={{
//                     fontFamily: "var(--font-mono)",
//                     fontSize: "var(--text-xs)",
//                   }}
//                   className={cn(
//                     "inline-block px-2 py-0.5 rounded-md",
//                     "bg-[var(--color-surface-2)]",
//                     "text-[var(--color-faint)]",
//                     "border border-[var(--color-border-sub)]",
//                   )}
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Title */}
//           <Heading as="h1" size="1" balance className="mb-4 max-w-2xl">
//             {post.title}
//           </Heading>

//           {/* Summary — deck treatment: larger than body, muted */}
//           <Text size="lg" color="muted" balance className="mb-8 max-w-xl">
//             {post.summary}
//           </Text>

//           {/* Meta strip ─────────────────────────────────────────────────────
//               date · readTime · [related project]
//               All three are low-hierarchy metadata. Separated by a mid-dot
//               rendered as aria-hidden so screen readers don't announce it.
//               The related project link is real here (unlike in PostCard) —
//               full page gives it the room to be actionable.                */}
//           <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
//             <time
//               dateTime={post.published}
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.04em",
//               }}
//               className="text-[var(--color-faint)]"
//             >
//               {post.publishedFormatted}
//             </time>

//             <span
//               aria-hidden="true"
//               className="text-[var(--color-border)] text-xs select-none"
//             >
//               ·
//             </span>

//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//               }}
//               className="text-[var(--color-faint)]"
//             >
//               {post.readTime}
//             </span>

//             {relatedProject && (
//               <>
//                 <span
//                   aria-hidden="true"
//                   className="text-[var(--color-border)] text-xs select-none"
//                 >
//                   ·
//                 </span>
//                 <a
//                   href={`/projects/${relatedProject.slug}`}
//                   style={{
//                     fontFamily: "var(--font-mono)",
//                     fontSize: "var(--text-xs)",
//                     letterSpacing: "0.04em",
//                   }}
//                   className={cn(
//                     "inline-flex items-center gap-1.5",
//                     "text-[var(--color-accent)]",
//                     "hover:text-[var(--color-fg)]",
//                     "transition-colors duration-150",
//                     "focus-visible:outline-none",
//                     "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
//                     "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
//                     "rounded-sm",
//                   )}
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="size-1 rounded-full bg-current opacity-70"
//                   />
//                   {relatedProject.title}
//                 </a>
//               </>
//             )}
//           </div>
//         </Container>
//       </Section>

//       {/* ── Post Content ───────────────────────────────────────────────────────
//           DEC-045 REQUIRED before production:
//           SectionBackground variant for /writing/[slug] content section is
//           unassigned. Using "minimal" as baseline.

//           Container size="narrow" (672px) — optimal line length for long-form
//           technical prose. Mixed container sizes within a page are permitted
//           per DEC-024: hero uses default (896px), content uses narrow (672px).

//           dangerouslySetInnerHTML: safe — content originates from filesystem
//           markdown files we control. Not user input, no sanitization required.
//           The HTML is already processed by rehype-pretty-code, rehype-slug,
//           and rehype-autolink-headings before reaching this component.       */}
//       <Section spacing="lg" className="relative">
//         <SectionBackground
//           variant="minimal"
//           /* TODO DEC-045: variant assignment required */
//         />

//         <Container size="narrow">
//           <div
//             className="prose"
//             dangerouslySetInnerHTML={{ __html: post.content }}
//           />
//         </Container>
//       </Section>

//       {/* ── Post Footer ────────────────────────────────────────────────────────
//           Minimal navigation. Back to writing index and, when relevant,
//           a CTA to the related project case study.
//           Container size="narrow" matches the content section — the footer
//           reads as part of the content column, not a page-level element.    */}
//       <Section spacing="md" as="footer">
//         <Container size="narrow">
//           <div
//             className={cn(
//               "flex items-center justify-between gap-4 flex-wrap",
//               "pt-8 border-t border-[var(--color-border-sub)]",
//             )}
//           >
//             <Button
//               href="/writing"
//               variant="ghost"
//               size="sm"
//               leftIcon={<span aria-hidden="true">←</span>}
//             >
//               All writing
//             </Button>

//             {relatedProject && (
//               <Button
//                 href={`/projects/${relatedProject.slug}`}
//                 variant="outline"
//                 size="sm"
//                 rightIcon={<span aria-hidden="true">↗</span>}
//               >
//                 See the case study
//               </Button>
//             )}
//           </div>
//         </Container>
//       </Section>
//     </>
//   );
// }
