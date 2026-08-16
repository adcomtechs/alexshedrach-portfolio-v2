// features/writing/WritingHero.jsx
//
// RSC. Owns layout and copy only. The animated statistics panel is a
// separate client leaf — see WritingMetaPanel.jsx — so this file ships
// zero client JS, matching the DEC-008 pattern already established for
// the Home hero (RSC shell, CSS-only staggered entrance).
//
// Fixed from the previous version: the file-level `"use client"` directive
// silently made this entire component (and its layout/copy) client-side,
// contradicting the RSC intent documented in its own comments. Splitting
// the client boundary down to WritingMetaPanel restores the actual
// server-first contract.
//
// SectionBackground variant: "editorial" — per DEC-048 (previous comment
// cited DEC-053, which does not exist; DEC-053 is the next *unassigned*
// decision ID per DECISIONS.md §8, not a real record — corrected).
// Container: "default" (896px) — owned by app/writing/page.jsx, unchanged.
//
// Props (unchanged data contract — computed server-side in page.jsx):
//   postCount      — total published posts
//   latestPost     — { slug, title, publishedFormatted, readTime } | null
//   topTags        — string[] — trimmed to 5 here, so callers can pass the
//                    full tag list without duplicating the cap decision
//   quickCount     — posts with readTime <= 5 min
//   deepCount      — posts with readTime >= 8 min
//   totalReadTime  — sum of all post readTimeMinutes; 0/omitted hides the stat

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { WritingMetaPanel } from "./WritingMetaPanel";

export function WritingHero({
  postCount,
  latestPost = null,
  topTags = [],
  quickCount = 0,
  deepCount = 0,
  totalReadTime = 0,
}) {
  const hasPosts = postCount > 0;
  const postLabel = postCount === 1 ? "post" : "posts";

  return (
    <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
      {/* ── Left column — text content ────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Eyebrow — CSS-only entrance via hero-animate (animations.css) */}
        <div
          className="hero-animate flex items-center gap-2"
          style={{ marginBottom: "1.25rem" }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            Writing
          </span>
        </div>

        <Heading
          as="h1"
          size="1"
          balance
          className="hero-animate"
          style={{
            marginBottom: "1.25rem",
            maxWidth: "30rem",
            animationDelay: "80ms",
          }}
        >
          Technical writing rooted in real decisions
        </Heading>

        <Text
          size="lg"
          color="muted"
          balance
          className="hero-animate"
          style={{
            marginBottom: "2rem",
            maxWidth: "34rem",
            animationDelay: "150ms",
          }}
        >
          Each post is tied to a system built, a decision made, or a tradeoff
          navigated. No opinion pieces. No tutorials without a production
          origin.
        </Text>

        {hasPosts ? (
          <>
            <div
              className="hero-animate flex items-center gap-3 flex-wrap"
              style={{ animationDelay: "220ms" }}
            >
              {latestPost && (
                <Button
                  href={`/writing/${latestPost.slug}`}
                  variant="outline"
                  size="md"
                >
                  Read latest →
                </Button>
              )}
              <Button href="#writing-posts" variant="ghost" size="md">
                Browse {postCount} {postLabel} ↓
              </Button>
            </div>

            <p
              className="hero-animate"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.04em",
                color: "var(--color-success)",
                marginTop: "1.25rem",
                animationDelay: "280ms",
              }}
            >
              Each post rooted in production work
            </p>
          </>
        ) : (
          <p
            className="hero-animate"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.04em",
              color: "var(--color-faint)",
              animationDelay: "220ms",
            }}
          >
            First post publishing soon.
          </p>
        )}
      </div>

      {/* ── Right column — animated statistics panel (client leaf) ─────── */}
      {hasPosts && (
        <div className="w-full lg:w-72 xl:w-80 lg:shrink-0">
          <WritingMetaPanel
            postCount={postCount}
            quickCount={quickCount}
            deepCount={deepCount}
            topTags={topTags.slice(0, 5)}
            latestPost={latestPost}
            totalReadTime={totalReadTime}
          />
        </div>
      )}
    </div>
  );
}
