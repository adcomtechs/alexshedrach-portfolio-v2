// lib/utils/projects.js
//
// Condition evaluation and data transformation functions for the projects index.
//
// All functions are pure — they accept data as arguments and return results.
// No imports from the data layer — callers pass project arrays in.
// No side effects, no async, no global state.
//
// This file is the single source of truth for all gate logic. (DEC-031)
// page.jsx calls these functions and passes results as props to components.
// Components do not evaluate conditions — they render what they receive.
//
// Call order enforced by page.jsx:
//   1. parseFilters(searchParams)           → { domain, status, page }
//   2. filterProjects(ALL_PROJECTS, filters) → filteredProjects[]
//   3. evaluateConditions(ALL_PROJECTS, filteredProjects) → conditions
//   4. paginateProjects(filteredProjects, page) → { items, ...pagination }

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
//
// Condition thresholds — per DEC-031 condition registry.
// Change these values to adjust activation behaviour across the entire system.
// Do not hardcode threshold numbers in components or page files.

/** Page size for pagination. Per DEC-027. */
export const PAGE_SIZE = 8;

// Minimum distinct qualifying domains before the domain filter renders.
const DOMAIN_FILTER_MIN_QUALIFYING = 1;
// Minimum projects within a domain for that domain to qualify.
const DOMAIN_FILTER_MIN_PROJECTS_PER_DOMAIN = 1;
// Minimum total projects before the stack filter renders.
const STACK_FILTER_MIN_TOTAL = 10;
// Minimum distinct status values before the status filter renders.
const STATUS_FILTER_MIN_DISTINCT = 2;
// Filtered project count must exceed this for pagination to render.
const PAGINATION_MIN_COUNT = 2;

// Valid status values — enforced during searchParams parsing.
// Matches the enum in lib/data/projects.js and ProjectCard STATUS_CONFIG.
const VALID_STATUSES = new Set(["live", "wip", "archived"]);

// ─────────────────────────────────────────────────────────────────────────────
// Domain normalization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getPrimaryDomain
 *
 * Extracts the top-level domain segment from a compound domain string.
 *
 *   "EdTech / Marketplace"          → "EdTech"
 *   "Fintech / Personal Finance"    → "Fintech"
 *   "Enterprise"                    → "Enterprise"
 *
 * Projects share a primary domain even when their sub-domains differ.
 * This is the value used for filter pills and distribution counting —
 * not the full domain string stored on the project record.
 *
 * @param   {string} domain - Full domain string from the project record.
 * @returns {string}          Primary domain. Empty string if input is falsy.
 */
export function getPrimaryDomain(domain) {
  if (!domain) return "";
  const separatorIndex = domain.indexOf(" / ");
  return separatorIndex === -1
    ? domain.trim()
    : domain.slice(0, separatorIndex).trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Distribution analysis
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getDomainDistribution
 *
 * Returns a map of primary domain → project count across the full project list.
 * Used internally by shouldShowDomainFilter and getUniquePrimaryDomains.
 *
 *   { EdTech: 3, Enterprise: 1, Retail: 1, Fintech: 1 }
 *
 * @param   {Object[]} projects
 * @returns {Record<string, number>}
 */
export function getDomainDistribution(projects) {
  return projects.reduce((acc, project) => {
    const primary = getPrimaryDomain(project.domain);
    if (primary) acc[primary] = (acc[primary] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * getStatusDistribution
 *
 * Returns a map of status value → project count across the full project list.
 * Used internally by shouldShowStatusFilter.
 *
 *   { wip: 5, live: 1 }
 *
 * @param   {Object[]} projects
 * @returns {Record<string, number>}
 */
export function getStatusDistribution(projects) {
  return projects.reduce((acc, project) => {
    const { status } = project;
    if (status) acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});
}

// ─────────────────────────────────────────────────────────────────────────────
// Unique value extraction — for filter pill rendering
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getUniquePrimaryDomains
 *
 * Returns all distinct primary domain values present in the project list,
 * in insertion order (i.e., project index order).
 *
 * Used to render domain filter pills. This returns ALL unique domains —
 * the condition check (shouldShowDomainFilter) separately determines
 * whether the filter row renders at all.
 *
 * @param   {Object[]} projects
 * @returns {string[]}
 */
export function getUniquePrimaryDomains(projects) {
  const seen = new Set();
  const result = [];
  for (const project of projects) {
    const primary = getPrimaryDomain(project.domain);
    if (primary && !seen.has(primary)) {
      seen.add(primary);
      result.push(primary);
    }
  }
  return result;
}

/**
 * getUniqueStatuses
 *
 * Returns all distinct status values present in the project list,
 * in insertion order.
 *
 * Used to render status filter pills. The condition check
 * (shouldShowStatusFilter) separately determines whether the filter renders.
 *
 * @param   {Object[]} projects
 * @returns {string[]}
 */
export function getUniqueStatuses(projects) {
  const seen = new Set();
  const result = [];
  for (const project of projects) {
    if (project.status && !seen.has(project.status)) {
      seen.add(project.status);
      result.push(project.status);
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual condition checks
// ─────────────────────────────────────────────────────────────────────────────
//
// Each function answers a single yes/no question about whether a UI feature
// should render. They are exported individually so page.jsx can call them
// selectively if needed, but evaluateConditions() is the primary entry point.

/**
 * shouldShowDomainFilter
 *
 * Returns true when 2+ distinct primary domains each have 2+ projects.
 * A single dominant domain does not justify a domain filter — the filter
 * only creates signal when multiple domains have enough projects to compare.
 *
 * Per DEC-019 amendment and DEC-031.
 *
 * @param   {Object[]} projects - Full unfiltered project list.
 * @returns {boolean}
 */
export function shouldShowDomainFilter(projects) {
  const distribution = getDomainDistribution(projects);
  const qualifyingCount = Object.values(distribution).filter(
    (count) => count >= DOMAIN_FILTER_MIN_PROJECTS_PER_DOMAIN,
  ).length;
  return qualifyingCount >= DOMAIN_FILTER_MIN_QUALIFYING;
}

/**
 * shouldShowStatusFilter
 *
 * Returns true when 2+ distinct status values exist across the project list.
 * A uniform status (all WIP) produces a filter with one effective option —
 * not worth the UI weight.
 *
 * Per DEC-031.
 *
 * @param   {Object[]} projects - Full unfiltered project list.
 * @returns {boolean}
 */
export function shouldShowStatusFilter(projects) {
  const distribution = getStatusDistribution(projects);
  return Object.keys(distribution).length >= STATUS_FILTER_MIN_DISTINCT;
}

/**
 * shouldShowStackFilter
 *
 * Returns true when the total project count reaches 10+.
 * Stack filtering is only meaningful when there is enough project volume
 * that a specific technology appears across multiple projects.
 *
 * Per DEC-031.
 *
 * @param   {Object[]} projects - Full unfiltered project list.
 * @returns {boolean}
 */
export function shouldShowStackFilter(projects) {
  return projects.length >= STACK_FILTER_MIN_TOTAL;
}

/**
 * shouldShowPagination
 *
 * Returns true when the filtered project count exceeds 8.
 * Operates on the FILTERED list — active filters may reduce the count
 * below the threshold even when the total index is large.
 *
 * Per DEC-027 and DEC-031.
 *
 * @param   {Object[]} filteredProjects - Project list after filter operations.
 * @returns {boolean}
 */
export function shouldShowPagination(filteredProjects) {
  return filteredProjects.length > PAGINATION_MIN_COUNT;
}

// ─────────────────────────────────────────────────────────────────────────────
// Currently building detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getCurrentlyBuilding
 *
 * Returns the project with currentlyBuilding: true, or null if none is set.
 * If multiple projects carry the flag (schema does not enforce uniqueness),
 * the first match by index order wins.
 *
 * Per DEC-030.
 *
 * @param   {Object[]} projects - Full unfiltered project list.
 * @returns {Object|null}
 */
export function getCurrentlyBuilding(projects) {
  return projects.find((p) => p.currentlyBuilding === true) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Condition aggregation — primary entry point for page.jsx
// ─────────────────────────────────────────────────────────────────────────────

/**
 * evaluateConditions
 *
 * Runs all condition checks in a single call. This is what page.jsx calls —
 * condition logic does not live anywhere else. (DEC-031)
 *
 * Accepts both the full project list (for filter condition checks, which must
 * reflect the total index — not the filtered subset) and the already-filtered
 * list (for pagination, which operates on the filtered result count).
 *
 * @param   {Object[]} allProjects      - Full unfiltered project list.
 * @param   {Object[]} filteredProjects - Project list after filterProjects().
 * @returns {{
 *   showDomainFilter:  boolean,  — render domain filter pills
 *   showStatusFilter:  boolean,  — render status filter pills
 *   showStackFilter:   boolean,  — render stack filter (future)
 *   showFilterRow:     boolean,  — render the filter row container
 *   showPagination:    boolean,  — render pagination controls
 *   currentlyBuilding: Object|null, — project with currentlyBuilding: true
 *   uniqueDomains:     string[], — distinct primary domains for pills
 *   uniqueStatuses:    string[], — distinct status values for pills
 * }}
 */
export function evaluateConditions(allProjects, filteredProjects) {
  const showDomainFilter = shouldShowDomainFilter(allProjects);
  const showStatusFilter = shouldShowStatusFilter(allProjects);
  const showStackFilter = shouldShowStackFilter(allProjects);

  return {
    showDomainFilter,
    showStatusFilter,
    showStackFilter,
    // Filter row only renders when at least one control is visible.
    // Rendering an empty filter row would be a layout error.
    showFilterRow: showDomainFilter || showStatusFilter || showStackFilter,
    // Pagination uses the filtered count — active filters may push the
    // result set below the threshold even if the total index is large.
    showPagination: shouldShowPagination(filteredProjects),
    currentlyBuilding: getCurrentlyBuilding(allProjects),
    uniqueDomains: getUniquePrimaryDomains(allProjects),
    uniqueStatuses: getUniqueStatuses(allProjects),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * filterProjects
 *
 * Applies active filters to a project list and returns the filtered array.
 * Called server-side in page.jsx before condition evaluation and pagination.
 * Components never call this — they receive already-filtered data as props.
 *
 * Per DEC-025.
 *
 * @param   {Object[]} projects
 * @param   {{ domain?: string|null, status?: string|null }} filters
 * @returns {Object[]}
 */
export function filterProjects(projects, filters) {
  const { domain, status } = filters ?? {};
  return projects.filter((project) => {
    if (domain && getPrimaryDomain(project.domain) !== domain) return false;
    if (status && project.status !== status) return false;
    return true;
  });
}

/**
 * hasActiveFilters
 *
 * Returns true when any filter value is currently set.
 * Used to gate the "clear filters" link and the dynamic project count display.
 *
 * Per DEC-031. Page param is explicitly excluded — navigating pages does not
 * count as an active filter for the purposes of "clear" link visibility.
 *
 * @param   {{ domain?: string|null, status?: string|null }} filters
 * @returns {boolean}
 */
export function hasActiveFilters(filters) {
  const { domain, status } = filters ?? {};
  return Boolean(domain || status);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

/**
 * paginateProjects
 *
 * Slices a project array into a single page and returns the page items
 * alongside all metadata needed to render pagination controls.
 *
 * Always operates on the already-filtered list — pagination is the last
 * transformation applied before rendering.
 *
 * Page number is clamped to [1, totalPages] so malformed URL params
 * (e.g., ?page=999) degrade gracefully without throwing.
 *
 * Per DEC-027.
 *
 * @param   {Object[]} projects - Already-filtered project list.
 * @param   {number}   page     - Current page number. 1-indexed.
 * @param   {number}   pageSize - Items per page. Defaults to PAGE_SIZE.
 * @returns {{
 *   items:       Object[], — the projects for this page
 *   currentPage: number,  — clamped current page
 *   totalPages:  number,  — total page count
 *   totalCount:  number,  — total filtered project count
 *   hasNext:     boolean,
 *   hasPrev:     boolean,
 * }}
 */
export function paginateProjects(projects, page = 1, pageSize = PAGE_SIZE) {
  const totalCount = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * pageSize;
  const items = projects.slice(start, start + pageSize);

  return {
    items,
    currentPage,
    totalPages,
    totalCount,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchParams parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * parseFilters
 *
 * Normalizes Next.js searchParams into a clean, typed filters object.
 * This is the first call in page.jsx — all downstream functions receive
 * the result of this, never raw searchParams.
 *
 * Defensive handling:
 *   - Unknown status values are coerced to null (not silently passed through)
 *   - Non-integer page values fall back to 1
 *   - Empty string domain is treated as null (no active filter)
 *   - Array values (e.g., ?domain=EdTech&domain=Fintech) take first value only
 *
 * Per DEC-025.
 *
 * @param   {Object} searchParams - Next.js searchParams from page props.
 * @returns {{ domain: string|null, status: string|null, page: number }}
 */
export function parseFilters(searchParams) {
  const params = searchParams ?? {};

  // Resolve string value — Next.js can surface arrays for repeated params
  const raw = (key) => {
    const val = params[key];
    if (Array.isArray(val)) return val[0] ?? null;
    return typeof val === "string" ? val : null;
  };

  const rawDomain = raw("domain");
  const rawStatus = raw("status");
  const rawPage = raw("page");

  const domain = rawDomain?.trim() || null;

  const status = rawStatus && VALID_STATUSES.has(rawStatus) ? rawStatus : null;

  const parsedPage = parseInt(rawPage, 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return { domain, status, page };
}
