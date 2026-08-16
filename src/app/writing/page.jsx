// app/writing/page.jsx
// RSC — no client directive required.
//
// Thin shell for the /writing index page.
// All data resolution and condition evaluation happens here, server-side,
// before any component renders. No logic beyond the pipeline lives in this file.
//

import { getAllPosts } from "@/lib/data/posts";
import { getAllProjects } from "@/lib/data/projects";
import {
  parseWritingFilters,
  filterPosts,
  evaluateConditions,
  paginatePosts,
  hasActiveFilters,
  buildFilterDescription,
} from "@/lib/utils/writing";
import { WritingPageSections } from "@/features/writing/WritingPageSections";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Writing",
  description:
    "Technical posts rooted in real engineering decisions — systems built, tradeoffs navigated, decisions documented.",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function WritingPage({ searchParams }) {
  // ── Data ────────────────────────────────────────────────────────────────────
  //
  // getAllPosts: cache()-wrapped, filesystem-based. Returns published posts only,
  // sorted newest-first. Draft posts excluded at the utility layer.
  //
  // getAllProjects: sync, cache()-wrapped. Passed to WritingIndex for
  // relatedProject resolution per post — PostCard has no data layer knowledge.

  const allPosts = getAllPosts();
  const allProjects = getAllProjects();

  // ── Filter pipeline ─────────────────────────────────────────────────────────
  //
  // searchParams must be awaited before property access — Next.js App Router
  // requirement. parseWritingFilters normalises the raw params into a typed
  // object and coerces invalid values to null (DEC-056).

  const resolvedParams = await searchParams;
  const filters = parseWritingFilters(resolvedParams);

  // filterPosts applies tag, readTime, and sort in that order.
  // Input array is never mutated — a copy is created inside filterPosts.
  const filteredPosts = filterPosts(allPosts, filters);

  // evaluateConditions computes all UI gate values in one call.
  // allPosts (not filteredPosts) is used for filter condition checks — the
  // tag distribution and control visibility must reflect the total index, not
  // the filtered subset.
  const conditions = evaluateConditions(allPosts, filteredPosts);

  // paginatePosts operates on the filtered list. Page is clamped to
  // [1, totalPages] so malformed page params degrade gracefully.
  const pagination = paginatePosts(filteredPosts, filters.page);

  // ── Derived values ──────────────────────────────────────────────────────────

  // activeFilters excludes page — the filter bar and summary do not
  // consider page navigation an "active filter" (DEC-056).
  const activeFilters = {
    tag: filters.tag,
    readTime: filters.readTime,
    sort: filters.sort,
  };

  // filtersActive drives the FilterSummary "N of M" display.
  // Sort alone does not narrow the result set — excluded (DEC-056).
  const filtersActive = hasActiveFilters({
    tag: filters.tag,
    readTime: filters.readTime,
  });

  // filterDesc is the human-readable summary of active narrowing filters.
  // null when no narrowing filters are active.
  const filterDesc = buildFilterDescription(activeFilters);

  return (
    <WritingPageSections
      postCount={allPosts.length}
      posts={pagination.items}
      projects={allProjects}
      conditions={conditions}
      activeFilters={activeFilters}
      filterDesc={filterDesc}
      totalCount={pagination.totalCount}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
    />
  );
}
