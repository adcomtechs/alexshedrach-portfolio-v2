// features/home/WritingSection.jsx
// RSC — no client directive required.
//
// Data source: lib/data/posts.js — canonical filesystem-based source.
// PostCard: components/ui/Cards/PostCard — unified post-object API.
//
// Changes from the previous version:
//   - getFeaturedPosts / getAllPosts from lib/data/posts (filesystem, not static)
//   - PostCard receives <PostCard post={post} /> — not individual props
//   - No local formatDate needed — publishedFormatted is on the PostMeta object
//   - FeaturedPostCard updated field names handled in FeaturedPostCard.jsx

import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { PostCard } from "@/components/ui/Cards/PostCard";
import { getFeaturedPosts, getAllPosts } from "@/lib/data/posts";
import { WritingBackground } from "./WritingBackground";
import { FeaturedPostCard } from "./FeaturedPostCard";

// ── Sub-components ─────────────────────────────────────────────────────────────

/**
 * SectionAccentLine
 *
 * Amber → lime horizontal rule that frames the card grid from the header.
 * Distinct from the info-blue line in ProofOfWork — colour signals section change.
 */
function SectionAccentLine() {
  return (
    <div
      aria-hidden="true"
      className="relative h-px w-full"
      style={{ background: "var(--color-border-sub)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #f59e0b 0%, rgba(181,242,61,0.4) 45%, transparent 75%)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

/**
 * SectionFooter
 *
 * Post count + "View all writing" CTA.
 * Mirrors the GridFooter pattern from SelectedSystemsSection.
 */
function SectionFooter({ totalCount }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-6 py-4"
      style={{ borderTop: "1px solid var(--color-border-sub)" }}
    >
      <Text size="sm" color="faint">
        {totalCount} article{totalCount !== 1 ? "s" : ""} published
      </Text>

      <Button
        href="/writing"
        variant="ghost"
        size="sm"
        rightIcon={<ArrowRight />}
      >
        View all writing
      </Button>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * WritingSection
 *
 * Home page section 5. Surfaces featured technical writing.
 * Positioned after ProofOfWork — shifts register from "what was built"
 * to "how I think about building."
 *
 * Data flow:
 *   getFeaturedPosts() → PostMeta[] (3 newest published posts)
 *   getAllPosts()       → PostMeta[] (total count for footer)
 *
 * Layout:
 *   [primaryPost]     → FeaturedPostCard (full width, editorial scale)
 *   [gridPosts 0–1]   → PostCard grid (2-column, max 2 cards)
 *
 * Renders nothing when no posts are published.
 */
export async function WritingSection() {
  const featured = getFeaturedPosts();
  const allPosts = getAllPosts();

  // No posts published — section is absent. Per spec, the Home writing
  // section does not render until minimum one post exists.
  if (!featured.length) return null;

  const [primaryPost, ...supportingPosts] = featured;
  // Cap at 2 supporting posts — 3 total maintains reading pace
  const gridPosts = supportingPosts.slice(0, 2);

  return (
    <Section
      spacing="md"
      id="writing"
      aria-label="Technical writing"
      className="relative"
    >
      <WritingBackground />

      <Container size="wide" className="relative">
        {/* ── Section header row ───────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-6 mb-8">
          <SectionHeader
            label="Writing"
            title="Thinking in public"
            description="Technical decisions, architectural tradeoffs, and system explanations rooted in real project work — not opinion pieces."
            className="mb-0"
          />

          <div className="hidden md:flex items-center gap-3 shrink-0 pb-1">
            <Text as="span" size="sm" color="faint">
              {allPosts.length} published
            </Text>
            <Button
              href="/writing"
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight />}
            >
              View all
            </Button>
          </div>
        </div>

        {/* ── Article grid ─────────────────────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid var(--color-border-sub)",
            background: "var(--color-surface)",
          }}
        >
          <SectionAccentLine />

          {/* Featured article — FeaturedPostCard receives a PostMeta object */}
          <FeaturedPostCard post={primaryPost} />

          {/* Supporting articles — PostCard now receives post object, not props */}
          {gridPosts.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2"
              style={{ borderTop: "1px solid var(--color-border-sub)" }}
            >
              {gridPosts.map((post, i) => (
                <div
                  key={post.slug}
                  style={{
                    borderRight:
                      i < gridPosts.length - 1
                        ? "1px solid var(--color-border-sub)"
                        : undefined,
                  }}
                >
                  {/*
                    PostCard no longer receives individual props.
                    It receives the full PostMeta object and builds the
                    href from post.slug internally.
                    relatedProject not passed here — home section does not
                    resolve project cross-references, that is the writing
                    index's responsibility.
                  */}
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}

          <SectionFooter totalCount={allPosts.length} />
        </div>

        {/* ── Section footnote ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mt-5">
          <div
            aria-hidden="true"
            className="h-px w-6 shrink-0 rounded-full"
            style={{
              background: "linear-gradient(to right, #f59e0b, transparent)",
            }}
          />
          <Text as="span" size="sm" color="faint">
            All writing is grounded in real project decisions — no thought
            experiments, no hypotheticals.
          </Text>
        </div>
      </Container>
    </Section>
  );
}

export default WritingSection;

// // features/home/WritingSection/index.jsx
// // RSC — no client directive required.
// // Async RSC — fetches featured posts server-side via getFeaturedPosts().
// //
// // Section identity:
// //   Hero              → lime + blue parallax glows
// //   SelectedSystems   → bordered grid, no glow
// //   PrinciplesSection → diagonal lime + emerald glow field
// //   ProofOfWork       → cold blue centered spotlight
// //   WritingSection    → warm amber → lime editorial atmosphere
// //
// // Layout:
// //   ┌── Top accent bar (amber → lime gradient) ──────────────────┐
// //   │  Section header (left)                        [View all →] │
// //   ├── FeaturedPostCard (full width, editorial) ────────────────┤
// //   ├── Supporting posts (2-column grid) ───────────────────────┤
// //   └── Footer: post count + CTA ───────────────────────────────┘
// //
// // The section renders null if no featured posts exist — prevents
// // an empty section frame during early development or content gaps.

// import { ArrowRight } from "lucide-react";
// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { Button } from "@/components/ui/Button";
// import { Text } from "@/components/ui/Text";
// import { PostCard } from "@/components/ui/Cards/PostCard";
// import { getFeaturedPosts, getAllPosts } from "@/lib/data/posts";
// import { WritingBackground } from "./WritingBackground";
// import { FeaturedPostCard } from "./FeaturedPostCard";

// // ── Sub-components ─────────────────────────────────────────────────────────────

// /**
//  * SectionAccentLine
//  *
//  * Amber → lime horizontal rule that frames the card grid from the header.
//  * Distinct from the info-blue line in ProofOfWork — colour signals section change.
//  */
// function SectionAccentLine() {
//   return (
//     <div
//       aria-hidden="true"
//       className="relative h-px w-full"
//       style={{ background: "var(--color-border-sub)" }}
//     >
//       <div
//         className="absolute inset-0"
//         style={{
//           background:
//             "linear-gradient(to right, #f59e0b 0%, rgba(181,242,61,0.4) 45%, transparent 75%)",
//           opacity: 0.7,
//         }}
//       />
//     </div>
//   );
// }

// /**
//  * SectionFooter
//  *
//  * Post count + "View all writing" CTA.
//  * Separated from the card grid by a top border.
//  * Mirrors the GridFooter pattern from SelectedSystemsSection.
//  */
// function SectionFooter({ totalCount }) {
//   return (
//     <div
//       className="flex items-center justify-between gap-4 px-6 py-4"
//       style={{ borderTop: "1px solid var(--color-border-sub)" }}
//     >
//       <Text size="sm" color="faint">
//         {totalCount} article{totalCount !== 1 ? "s" : ""} published
//       </Text>

//       <Button
//         href="/writing"
//         variant="ghost"
//         size="sm"
//         rightIcon={<ArrowRight />}
//       >
//         View all writing
//       </Button>
//     </div>
//   );
// }

// // ── Main export ────────────────────────────────────────────────────────────────

// /**
//  * WritingSection
//  *
//  * Home page section 5. Surfaces featured technical writing.
//  * Positioned after ProofOfWork — shifts register from "what was built"
//  * to "how I think about building."
//  *
//  * Data flow:
//  *   getFeaturedPosts() → [featured (post[0]), ...supporting (post[1–2])]
//  *   getAllPosts()       → total count for footer
//  *
//  * PostCard grid renders a maximum of 2 supporting posts.
//  * If only 1 featured post exists, no grid renders — only FeaturedPostCard.
//  */
// export async function WritingSection() {
//   const featured = getFeaturedPosts();
//   const allPosts = getAllPosts();

//   if (!featured.length) return null;

//   const [primaryPost, ...supportingPosts] = featured;
//   // Cap at 2 supporting posts — 3 total maintains reading pace without overwhelming
//   const gridPosts = supportingPosts.slice(0, 2);

//   return (
//     <Section
//       spacing="md"
//       id="writing"
//       aria-label="Technical writing"
//       className="relative"
//     >
//       {/* Amber → lime background layer */}
//       <WritingBackground />

//       <Container size="wide" className="relative">
//         {/* ── Section header row ───────────────────────────────────────── */}
//         <div className="flex items-end justify-between gap-6 mb-8">
//           <SectionHeader
//             label="Writing"
//             title="Thinking in public"
//             description="Technical decisions, architectural tradeoffs, and system explanations rooted in real project work not opinion pieces."
//             className="mb-0"
//           />

//           {/* Desktop CTA — in sync with SelectedSystemsSection pattern */}
//           <div className="hidden md:flex items-center gap-3 shrink-0 pb-1">
//             <Text as="span" size="sm" color="faint">
//               {allPosts.length} published
//             </Text>
//             <Button
//               href="/writing"
//               variant="outline"
//               size="sm"
//               rightIcon={<ArrowRight />}
//             >
//               View all
//             </Button>
//           </div>
//         </div>

//         {/* ── Article grid ─────────────────────────────────────────────── */}
//         {/*
//           Bordered container — same structural language as SelectedSystemsSection.
//           Cards are cells in a unified frame, not floating individually.
//           The amber → lime accent line at the top distinguishes this from
//           the info-blue accent of ProofOfWork.
//         */}
//         <div
//           className="rounded-xl overflow-hidden"
//           style={{
//             border: "1px solid var(--color-border-sub)",
//             background: "var(--color-surface)",
//           }}
//         >
//           {/* Accent gradient line */}
//           <SectionAccentLine />

//           {/* Featured article — full width, editorial scale */}
//           <FeaturedPostCard post={primaryPost} />

//           {/* Supporting articles — 2-column grid */}
//           {gridPosts.length > 0 && (
//             <div
//               className="grid grid-cols-1 sm:grid-cols-2"
//               style={{ borderTop: "1px solid var(--color-border-sub)" }}
//             >
//               {gridPosts.map((post, i) => (
//                 <div
//                   key={post.slug}
//                   style={{
//                     borderRight:
//                       i < gridPosts.length - 1
//                         ? "1px solid var(--color-border-sub)"
//                         : undefined,
//                   }}
//                 >
//                   <PostCard
//                     title={post.title}
//                     summary={post.summary}
//                     publishedAt={post.publishedAt}
//                     readingTime={post.readingTime}
//                     tags={post.tags}
//                     href={`/writing/${post.slug}`}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Footer — post count + mobile CTA */}
//           <SectionFooter totalCount={allPosts.length} />
//         </div>

//         {/* ── Section footnote ─────────────────────────────────────────── */}
//         <div className="flex items-center gap-2 mt-5">
//           <div
//             aria-hidden="true"
//             className="h-px w-6 shrink-0 rounded-full"
//             style={{
//               background: "linear-gradient(to right, #f59e0b, transparent)",
//             }}
//           />
//           <Text as="span" size="sm" color="faint">
//             All writing is grounded in real project decisions — no thought
//             experiments, no hypotheticals.
//           </Text>
//         </div>
//       </Container>
//     </Section>
//   );
// }

// export default WritingSection;

// // // features/home/WritingSection/WritingSection.jsx
// // // RSC — no client directive required.
// // //
// // // Home page Writing section. Surfaces 3 featured posts with a "View all" CTA.
// // // Data is fetched server-side via getFeaturedPosts() — no client fetch, no
// // // loading state, no useEffect.
// // //
// // // Layout contract:
// // //   Section → Container → SectionHeader + PostCard grid + CTA
// // //
// // // Container size is "wide" (1152px) — matches the SelectedSystems section
// // // for consistent horizontal rhythm across home sections.

// // import { getFeaturedPosts } from "@/lib/data/posts";
// // import { Section } from "@/components/layout/Section";
// // import { Container } from "@/components/layout/Container";
// // import { SectionHeader } from "@/components/ui/SectionHeader";
// // import { PostCard } from "@/components/ui/Cards/PostCard";
// // import { Button } from "@/components/ui/Button/Button";

// // // Inline ArrowRight SVG — avoids a lucide-react dependency for a single icon.
// // // 16×16 viewport, 1.5px stroke, matches the Button's "md" icon slot size class (w-4 h-4).
// // function ArrowRight() {
// //   return (
// //     <svg
// //       xmlns="http://www.w3.org/2000/svg"
// //       width="16"
// //       height="16"
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="1.75"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       aria-hidden="true"
// //     >
// //       <path d="M5 12h14" />
// //       <path d="m12 5 7 7-7 7" />
// //     </svg>
// //   );
// // }

// // export async function WritingSection() {
// //   const posts = getFeaturedPosts();

// //   // Guard — section does not render if no featured posts exist.
// //   // Prevents an empty section frame during early development.
// //   if (!posts.length) return null;

// //   return (
// //     <Section as="section" spacing="md" id="writing">
// //       <Container size="wide">
// //         {/* ── Section header ──────────────────────────────────────────── */}
// //         <SectionHeader
// //           label="Writing"
// //           title="Thinking in public."
// //           description="Technical decisions, architectural tradeoffs, and system explanations rooted in real project work — not opinion pieces."
// //           align="left"
// //         />

// //         {/* ── Post grid ───────────────────────────────────────────────── */}
// //         {/*
// //          * 3-column desktop / 2-column tablet / 1-column mobile.
// //          * gap-5 aligns with the 4px/8px base grid (20px = 5 × 4px).
// //          * items-stretch ensures cards of varying title length
// //          * fill the row height uniformly.
// //          */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
// //           {posts.map((post) => (
// //             <PostCard
// //               key={post.slug}
// //               title={post.title}
// //               summary={post.summary}
// //               publishedAt={post.publishedAt}
// //               readingTime={post.readingTime}
// //               tags={post.tags}
// //               href={`/writing/${post.slug}`}
// //             />
// //           ))}
// //         </div>

// //         {/* ── CTA ─────────────────────────────────────────────────────── */}
// //         {/*
// //          * mt-10 maintains breathing room between the grid and the CTA
// //          * without introducing a new spacing primitive.
// //          * ghost variant — intentionally low weight against the card grid.
// //          */}
// //         <div className="mt-10">
// //           <Button
// //             href="/writing"
// //             variant="ghost"
// //             size="sm"
// //             rightIcon={<ArrowRight />}
// //           >
// //             View all writing
// //           </Button>
// //         </div>
// //       </Container>
// //     </Section>
// //   );
// // }
