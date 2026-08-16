// features/writing/WritingIndex.jsx
// RSC — no client directive required.
//
// LAYOUT:
//   ┌──────────────────────────────────────────────────────┐
//   │  WritingTopBar (full width)                          │
//   │  Read time · Sort · Post count · Clear               │
//   └──────────────────────────────────────────────────────┘
//   ┌────────────────┬─────────────────────────────────────┐
//   │ WritingSidebar │ Post grid                           │
//   │ 256px sticky   │                                     │
//   │                │ PostCard × n                        │
//   │                │                                     │
//   │                │ PaginationStrip                     │
//   └────────────────┴─────────────────────────────────────┘
//
// BUG FIX — Mobile sidebar duplication removed.
// The previous implementation rendered WritingSidebar twice:
// once inside a div[role="group"] for mobile (invalid nesting — <aside>
// inside a group div breaks ARIA) and once for desktop. Two instances of
// the same useRouter-backed component caused hydration mismatches and
// visual URL resets after pagination clicks.
//
// Fix: WritingSidebar renders once, desktop-only (hidden lg:flex).
// Mobile tag access is handled by a dedicated MobileTagRow component
// that is a lightweight pill scroller — NOT the full sidebar component.
// MobileTagRow is also "use client" but has no overlap with the sidebar.

import { cn } from "@/lib/utils";
import { PostCard } from "@/components/ui/Cards/PostCard";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import {
  WritingTopBar,
  WritingSidebar,
  MobileTagRow,
} from "./WritingFilterBar";

// ── WritingEmptyState ─────────────────────────────────────────────────────────

function WritingEmptyState({ tag, readTime }) {
  let message = "No posts match the current filters.";
  if (tag && !readTime) message = `No posts tagged "${tag}" yet.`;
  if (readTime === "quick" && !tag) message = "No quick reads published yet.";
  if (readTime === "deep" && !tag) message = "No in-depth reads published yet.";

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      {/* Minimal indicator */}
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="w-6 h-px"
          style={{ background: "var(--color-border)" }}
        />
        <div
          aria-hidden="true"
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--color-border)" }}
        />
        <div
          aria-hidden="true"
          className="w-6 h-px"
          style={{ background: "var(--color-border)" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text color="muted" size="sm">
          {message}
        </Text>
        <Text color="faint" size="sm">
          Try a different filter combination.
        </Text>
      </div>

      <Button href="/writing" variant="outline" size="sm">
        Clear all filters
      </Button>
    </div>
  );
}

// ── PaginationStrip ───────────────────────────────────────────────────────────
//
// Production-grade pagination. Three zones:
//   Left  — Previous (Newer posts)
//   Center — Page indicator with context
//   Right — Next (Older posts)
//
// Page indicator shows the window: "Page 2 of 5"
// Progress bar beneath shows position in the full result set.
// All navigation preserves active filter params in the URL.

function PaginationStrip({ currentPage, totalPages, activeFilters = {} }) {
  const { tag, readTime, sort } = activeFilters;

  function pageHref(page) {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (readTime) params.set("readTime", readTime);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/writing?${qs}` : "/writing";
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  // Progress: what fraction of the way through the set are we?
  const progress =
    totalPages > 1 ? ((currentPage - 1) / (totalPages - 1)) * 100 : 100;

  return (
    <nav aria-label="Writing pagination" className="mt-12">
      {/* Progress track */}
      <div
        className="w-full h-px mb-8 relative overflow-hidden rounded-full"
        style={{ background: "var(--color-border-sub)" }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, var(--color-accent), rgba(181,242,61,0.4))",
            transition: "width 400ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4">
        {/* Previous */}
        <div className="flex-1 flex justify-start">
          {hasPrev && (
            <a
              href={pageHref(currentPage - 1)}
              className={cn(
                "group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl",
                "border border-[var(--color-border-sub)]",
                "transition-[background,border-color,transform] duration-150",
                "hover:border-[var(--color-border)]",
                "hover:bg-[var(--color-surface-2)]",
                "hover:-translate-x-px",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[var(--color-bg)]",
              )}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-[var(--color-faint)] group-hover:text-[var(--color-muted)] transition-colors duration-150"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <div className="flex flex-col gap-px">
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-faint)",
                    lineHeight: 1,
                  }}
                >
                  Previous
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-muted)",
                    lineHeight: 1,
                  }}
                >
                  Newer posts
                </span>
              </div>
            </a>
          )}
        </div>

        {/* Center — page indicator */}
        <div className="flex flex-col items-center gap-2">
          {/* Page dots for small page counts */}
          {totalPages <= 7 ? (
            <div
              className="flex items-center gap-1.5"
              role="list"
              aria-label="Pages"
            >
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <a
                    key={page}
                    href={pageHref(page)}
                    aria-label={`Page ${page}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block rounded-full transition-[width,height,background] duration-200",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-[var(--color-bg)]",
                    )}
                    style={{
                      width: isActive ? "20px" : "6px",
                      height: "6px",
                      background: isActive
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    }}
                  />
                );
              })}
            </div>
          ) : null}

          {/* Numeric indicator */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.05em",
              color: "var(--color-faint)",
            }}
          >
            <span style={{ color: "var(--color-muted)" }} aria-current="page">
              {currentPage}
            </span>
            {" / "}
            {totalPages}
          </span>
        </div>

        {/* Next */}
        <div className="flex-1 flex justify-end z-45">
          {hasNext && (
            <a
              href={pageHref(currentPage + 1)}
              className={cn(
                "group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl",
                "border border-[var(--color-border-sub)]",
                "transition-[background,border-color,transform] duration-150",
                "hover:border-[var(--color-border)]",
                "hover:bg-[var(--color-surface-2)]",
                "hover:translate-x-px",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[var(--color-bg)]",
              )}
            >
              <div className="flex flex-col gap-px items-end">
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-faint)",
                    lineHeight: 1,
                  }}
                >
                  Next
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-muted)",
                    lineHeight: 1,
                  }}
                >
                  Older posts
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-[var(--color-faint)] group-hover:text-[var(--color-muted)] transition-colors duration-150"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── WritingIndex ──────────────────────────────────────────────────────────────

export function WritingIndex({
  posts,
  projects = [],
  conditions = {},
  activeFilters = {},
  filterDesc = null,
  allPostsCount = 0,
  totalCount = 0,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
}) {
  const { tag, readTime } = activeFilters;
  const narrowingFilterActive = Boolean(tag || readTime);

  const showSidebar = Boolean(conditions.showTagFilter);
  const showTopBar = Boolean(
    conditions.showFilterRow &&
    (conditions.showReadTimeFilter || conditions.showSortToggle),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      {showTopBar && (
        <WritingTopBar
          activeFilters={activeFilters}
          conditions={conditions}
          totalCount={totalCount}
          allPostsCount={allPostsCount}
          filterDesc={filterDesc}
          filtersActive={narrowingFilterActive}
        />
      )}

      {/* ── Mobile tag row ─────────────────────────────────────────────────
          Separate component — NOT WritingSidebar.
          Fixes the hydration mismatch from the previous double-render.
          Visible only on mobile (lg:hidden). Desktop uses the sidebar. */}
      {showSidebar && (
        <div className="lg:hidden">
          <MobileTagRow
            uniqueTags={conditions.uniqueTags ?? []}
            tagDistribution={conditions.tagDistribution ?? {}}
            activeFilters={activeFilters}
          />
        </div>
      )}

      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div
        className={cn(
          showSidebar
            ? "grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-10 lg:gap-12 items-start"
            : "flex flex-col",
        )}
      >
        {/* ── Sidebar — desktop only, rendered ONCE ─────────────────────── */}
        {showSidebar && (
          <div className="hidden lg:flex lg:sticky lg:top-24">
            <WritingSidebar
              uniqueTags={conditions.uniqueTags ?? []}
              tagDistribution={conditions.tagDistribution ?? {}}
              activeFilters={activeFilters}
              conditions={conditions}
            />
          </div>
        )}

        {/* ── Main column ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-0 min-w-0">
          {/* Post feed */}
          {posts.length === 0 ? (
            <WritingEmptyState tag={tag} readTime={readTime} />
          ) : (
            <div
              role="feed"
              aria-label="Writing posts"
              aria-busy={false}
              className="flex flex-col gap-5"
            >
              {posts.map((post) => {
                const relatedProject = post.project
                  ? (projects.find((p) => p.slug === post.project) ?? null)
                  : null;

                const resolvedProject = relatedProject
                  ? { slug: relatedProject.slug, title: relatedProject.title }
                  : null;

                return (
                  <PostCard
                    key={post.slug}
                    post={post}
                    relatedProject={resolvedProject}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {showPagination && posts.length > 0 && (
            <PaginationStrip
              currentPage={currentPage}
              totalPages={totalPages}
              activeFilters={activeFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
