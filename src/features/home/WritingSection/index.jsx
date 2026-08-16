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
          <Text as="span" size="base" color="faint">
            All writing is grounded in real project decisions no thought
            experiments, no hypotheticals.
          </Text>
        </div>
      </Container>
    </Section>
  );
}

export default WritingSection;
