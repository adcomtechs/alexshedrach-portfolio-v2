// lib/utils/writing.js
//
// Condition evaluation and data transformation functions for the writing index.
//
// All functions are pure — they accept data as arguments and return results.
// No imports from the data layer — callers pass post arrays in.
// No side effects, no async, no global state.
//
// This is the single source of truth for all writing index gate logic. (DEC-054)
// page.jsx calls these functions and passes results as props to components.
// Components do not evaluate conditions — they render what they receive.
//
// Call order enforced by app/writing/page.jsx:
//   1. parseWritingFilters(searchParams)            → { tag, readTime, sort, page }
//   2. filterPosts(allPosts, filters)               → filteredPosts[]
//   3. evaluateConditions(allPosts, filteredPosts)  → conditions
//   4. paginatePosts(filteredPosts, page)           → { items, ...pagination }

// ─────────────────────────────────────────────────────────────────────────────
// Constants — DEC-055
// ─────────────────────────────────────────────────────────────────────────────

/** Items per page. Consistent with the projects system (DEC-027). */
export const PAGE_SIZE = 4;

// Minimum distinct qualifying tags before the tag filter renders.
const TAG_FILTER_MIN_QUALIFYING = 2;
// Minimum posts per tag for that tag to qualify for the filter.
const TAG_FILTER_MIN_POSTS_PER_TAG = 2;
// Minimum published posts before the read time filter renders.
const READ_TIME_FILTER_MIN_POSTS = 2;
// Minimum published posts before the sort toggle renders.
// Below this threshold, sort order is not meaningfully different to the reader.
const SORT_TOGGLE_MIN_POSTS = 5;
// Filtered post count must exceed PAGE_SIZE for pagination to render.
const PAGINATION_THRESHOLD = PAGE_SIZE;

// Valid URL param values — per DEC-056.
const VALID_READ_TIMES = new Set(["quick", "deep"]);
const VALID_SORTS = new Set(["oldest"]);

// Read time bucket thresholds — per DEC-055.
// Posts between QUICK_MAX and DEEP_MIN (i.e. 6–7 min) fall into neither bucket.
const QUICK_READ_MAX_MINUTES = 5;
const DEEP_READ_MIN_MINUTES = 8;

// ─────────────────────────────────────────────────────────────────────────────
// Read time helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * parseReadMinutes
 *
 * Extracts the integer minute count from the "N min read" string
 * produced by deriveReadTime() in lib/data/posts.js.
 *
 *   "8 min read" → 8
 *   "1 min read" → 1
 *
 * parseInt stops at the first non-digit character, so the " min read"
 * suffix is safely ignored. Returns 0 for malformed input.
 *
 * @param   {string} readTime
 * @returns {number}
 */
export function parseReadMinutes(readTime) {
  const n = parseInt(readTime, 10);
  return Number.isFinite(n) ? n : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag distribution and extraction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getTagDistribution
 *
 * Returns a map of tag → post count across the provided post list.
 * Used by shouldShowTagFilter and passed to WritingFilterBar for
 * informational display alongside each pill.
 *
 *   { Architecture: 3, "Systems Design": 2, Fintech: 1 }
 *
 * @param   {PostMeta[]} posts
 * @returns {Record<string, number>}
 */
export function getTagDistribution(posts) {
  return posts.reduce((acc, post) => {
    for (const tag of post.tags ?? []) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }
    return acc;
  }, {});
}

/**
 * getUniqueTags
 *
 * Returns all distinct tag values across the post list, in the order they
 * first appear (post index order → tag array index order).
 *
 * Used to render tag filter pills. The condition check (shouldShowTagFilter)
 * separately determines whether the filter row renders at all.
 *
 * @param   {PostMeta[]} posts
 * @returns {string[]}
 */
export function getUniqueTags(posts) {
  const seen = new Set();
  const result = [];
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      if (!seen.has(tag)) {
        seen.add(tag);
        result.push(tag);
      }
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual condition checks — DEC-055
// ─────────────────────────────────────────────────────────────────────────────

/**
 * shouldShowTagFilter
 *
 * Returns true when 2+ distinct tags each appear on 2+ posts.
 * A single dominant tag or many single-post tags do not justify
 * a filter — the filter only creates signal when multiple tags
 * have enough posts to compare meaningfully.
 *
 * @param   {PostMeta[]} posts — Full unfiltered post list.
 * @returns {boolean}
 */
export function shouldShowTagFilter(posts) {
  const dist = getTagDistribution(posts);
  const qualifying = Object.values(dist).filter(
    (count) => count >= TAG_FILTER_MIN_POSTS_PER_TAG,
  ).length;
  return qualifying >= TAG_FILTER_MIN_QUALIFYING;
}

/**
 * shouldShowReadTimeFilter
 *
 * Returns true when 2+ published posts exist.
 * Every reader has a time budget — the read time filter is useful
 * as soon as there is more than one post to filter between.
 *
 * @param   {PostMeta[]} posts — Full unfiltered post list.
 * @returns {boolean}
 */
export function shouldShowReadTimeFilter(posts) {
  return posts.length >= READ_TIME_FILTER_MIN_POSTS;
}

/**
 * shouldShowSortToggle
 *
 * Returns true when 5+ published posts exist.
 * Below this threshold, the order difference between newest and oldest
 * is not meaningful — the full list fits on one screen.
 *
 * @param   {PostMeta[]} posts — Full unfiltered post list.
 * @returns {boolean}
 */
export function shouldShowSortToggle(posts) {
  return posts.length >= SORT_TOGGLE_MIN_POSTS;
}

/**
 * shouldShowPagination
 *
 * Returns true when the filtered post count exceeds PAGE_SIZE.
 * Operates on the filtered list — active filters may reduce the count
 * below the threshold even when the total index is large.
 *
 * @param   {PostMeta[]} filteredPosts — Post list after filterPosts().
 * @returns {boolean}
 */
export function shouldShowPagination(filteredPosts) {
  return filteredPosts.length > PAGINATION_THRESHOLD;
}

// ─────────────────────────────────────────────────────────────────────────────
// Condition aggregation — primary entry point for page.jsx
// ─────────────────────────────────────────────────────────────────────────────

/**
 * evaluateConditions
 *
 * Runs all condition checks in a single call. This is what page.jsx calls —
 * condition logic does not live anywhere else. (DEC-054)
 *
 * Accepts both the full post list (for filter condition checks, which must
 * reflect the total index — not the filtered subset) and the already-filtered
 * list (for pagination, which operates on the filtered result count).
 *
 * @param   {PostMeta[]} allPosts       — Full unfiltered post list.
 * @param   {PostMeta[]} filteredPosts  — Post list after filterPosts().
 * @returns {{
 *   showTagFilter:      boolean,
 *   showReadTimeFilter: boolean,
 *   showSortToggle:     boolean,
 *   showFilterRow:      boolean,
 *   showPagination:     boolean,
 *   uniqueTags:         string[],
 *   tagDistribution:    Record<string, number>,
 * }}
 */
export function evaluateConditions(allPosts, filteredPosts) {
  const showTagFilter = shouldShowTagFilter(allPosts);
  const showReadTimeFilter = shouldShowReadTimeFilter(allPosts);
  const showSortToggle = shouldShowSortToggle(allPosts);

  return {
    showTagFilter,
    showReadTimeFilter,
    showSortToggle,
    // Filter row only renders when at least one control is visible.
    // An empty filter row is a layout error.
    showFilterRow: showTagFilter || showReadTimeFilter || showSortToggle,
    // Pagination uses the filtered count — active filters may push the
    // result set below the threshold even if the total index is large.
    showPagination: shouldShowPagination(filteredPosts),
    // Pre-computed for WritingFilterBar — avoids re-deriving in the component.
    uniqueTags: getUniqueTags(allPosts),
    tagDistribution: getTagDistribution(allPosts),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * filterPosts
 *
 * Applies active filters to a post list and returns the filtered array.
 * Called server-side in page.jsx before condition evaluation and pagination.
 * Components never call this — they receive already-filtered data as props.
 *
 * Operation order:
 *   1. Tag filter  — subset by tag membership
 *   2. Read time   — subset by minute threshold
 *   3. Sort        — reorder the result (input is newest-first from getAllPosts)
 *
 * The sort step is last so it applies to the filtered subset, not the full list.
 * The input array is never mutated — a copy is created before any operation.
 *
 * @param   {PostMeta[]} posts
 * @param   {{ tag?: string|null, readTime?: string|null, sort?: string|null }} filters
 * @returns {PostMeta[]}
 */
export function filterPosts(posts, filters) {
  const { tag, readTime, sort } = filters ?? {};

  // Work on a copy — never mutate the input from React cache()
  let result = [...posts];

  if (tag) {
    result = result.filter((p) => p.tags?.includes(tag));
  }

  if (readTime === "quick") {
    result = result.filter(
      (p) => parseReadMinutes(p.readTime) <= QUICK_READ_MAX_MINUTES,
    );
  } else if (readTime === "deep") {
    result = result.filter(
      (p) => parseReadMinutes(p.readTime) >= DEEP_READ_MIN_MINUTES,
    );
  }

  // sort=oldest reverses the newest-first order from getAllPosts.
  // No sort param or sort=newest → input order is already correct.
  if (sort === "oldest") {
    result.reverse();
  }

  return result;
}

/**
 * hasActiveFilters
 *
 * Returns true when any filter value is currently set.
 * Used to gate the clear-filters link and the active filter summary.
 *
 * The page param is explicitly excluded — navigating pages is not an
 * active filter for the purposes of the clear link. (DEC-056)
 *
 * @param   {{ tag?: string|null, readTime?: string|null, sort?: string|null }} filters
 * @returns {boolean}
 */
export function hasActiveFilters(filters) {
  const { tag, readTime, sort } = filters ?? {};
  return Boolean(tag || readTime || sort);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

/**
 * paginatePosts
 *
 * Slices a post array into a single page and returns the page items
 * alongside all metadata needed to render pagination controls.
 *
 * Always operates on the already-filtered list — pagination is the last
 * transformation applied before rendering.
 *
 * Page number is clamped to [1, totalPages] so malformed URL params
 * (e.g., ?page=999) degrade gracefully without throwing.
 *
 * @param   {PostMeta[]} posts    — Already-filtered post list.
 * @param   {number}     page     — Current page, 1-indexed.
 * @param   {number}     pageSize — Items per page. Defaults to PAGE_SIZE.
 * @returns {{
 *   items:       PostMeta[],
 *   currentPage: number,
 *   totalPages:  number,
 *   totalCount:  number,
 *   hasNext:     boolean,
 *   hasPrev:     boolean,
 * }}
 */
export function paginatePosts(posts, page = 1, pageSize = PAGE_SIZE) {
  const totalCount = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: posts.slice(start, start + pageSize),
    currentPage,
    totalPages,
    totalCount,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchParams parsing — DEC-056
// ─────────────────────────────────────────────────────────────────────────────

/**
 * parseWritingFilters
 *
 * Normalises Next.js searchParams into a clean, typed filters object.
 * This is the first call in page.jsx — all downstream functions receive
 * the result of this, never raw searchParams.
 *
 * Defensive handling:
 *   - Unknown readTime values are coerced to null
 *   - sort=newest is not a valid param — absence is the default (DEC-056)
 *   - Non-integer page values fall back to 1
 *   - Empty string tag treated as null (no active filter)
 *   - Array values (e.g., ?tag=A&tag=B) take first value only
 *
 * @param   {Object} searchParams — Next.js searchParams from page props.
 * @returns {{ tag: string|null, readTime: string|null, sort: string|null, page: number }}
 */
export function parseWritingFilters(searchParams) {
  const params = searchParams ?? {};

  const raw = (key) => {
    const val = params[key];
    if (Array.isArray(val)) return val[0] ?? null;
    return typeof val === "string" ? val : null;
  };

  const rawTag = raw("tag");
  const rawReadTime = raw("readTime");
  const rawSort = raw("sort");
  const rawPage = raw("page");

  const tag = rawTag?.trim() || null;
  const readTime =
    rawReadTime && VALID_READ_TIMES.has(rawReadTime) ? rawReadTime : null;
  const sort = rawSort && VALID_SORTS.has(rawSort) ? rawSort : null;
  const parsedPage = parseInt(rawPage, 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return { tag, readTime, sort, page };
}

// ─────────────────────────────────────────────────────────────────────────────
// Active filter description — for the filter summary line
// ─────────────────────────────────────────────────────────────────────────────

/**
 * buildFilterDescription
 *
 * Builds a human-readable description of the active filters for the
 * filter summary line rendered above the post grid.
 *
 *   { tag: "Architecture", readTime: "quick" }
 *   → "tagged Architecture · quick reads"
 *
 *   { sort: "oldest" }
 *   → null (sort alone does not change the result set, only order)
 *
 * Returns null when no filters narrow the result set.
 * Sort is intentionally excluded — it reorders but does not narrow.
 *
 * @param   {{ tag?: string|null, readTime?: string|null }} filters
 * @returns {string | null}
 */
export function buildFilterDescription(filters) {
  const { tag, readTime } = filters ?? {};
  const parts = [];

  if (tag) parts.push(`tagged ${tag}`);
  if (readTime === "quick") parts.push("quick reads");
  if (readTime === "deep") parts.push("in-depth reads");

  return parts.length > 0 ? parts.join(" · ") : null;
}
