// app/projects/page.jsx
// No raw Tailwind — page composes layout primitives and feature components only.
// Layout contract: Section → Container → Feature Content. (DEC-024)
//
// Changes from previous version:
//   + statusBreakdown computed from ALL_PROJECTS and passed to ProjectsHero.
//   + domains (domainsForSidebar) also passed to ProjectsHero for the panel.
//   ProjectsHero is now two-column — data flows from page as before. (DEC-031)

import { ALL_PROJECTS } from "@/lib/data/projects";
import { siteConfig } from "@/lib/config/site";
import {
  parseFilters,
  filterProjects,
  evaluateConditions,
  paginateProjects,
  hasActiveFilters,
  getPrimaryDomain,
} from "@/lib/utils/projects";
import { ProjectsIndexSections } from "@/features/projects/ProjectsIndexSections";

export const metadata = {
  title: "Projects",
  description:
    "Engineering case studies — systems designed, constraints navigated, decisions documented.",
};

export default async function ProjectsPage({ searchParams }) {
  const params = await searchParams;

  // ── 1. Parse ──────────────────────────────────────────────────────────────
  const filters = parseFilters(params);
  const view = params?.view === "list" ? "list" : "grid";

  // ── 2. Filter ─────────────────────────────────────────────────────────────
  const filteredProjects = filterProjects(ALL_PROJECTS, filters);

  // ── 3. Evaluate conditions ────────────────────────────────────────────────
  const conditions = evaluateConditions(ALL_PROJECTS, filteredProjects);

  // ── 4. Paginate ───────────────────────────────────────────────────────────
  const pagination = paginateProjects(filteredProjects, filters.page);

  // ── 5. Domain data ────────────────────────────────────────────────────────
  //
  // Keyed on getPrimaryDomain(p.domain) — not p.domain.
  // filterProjects compares getPrimaryDomain against filters.domain, so the
  // sidebar row value must be a primary domain string to match.
  const domainMap = ALL_PROJECTS.reduce((acc, p) => {
    const primary = getPrimaryDomain(p.domain);
    if (primary) acc[primary] = (acc[primary] ?? 0) + 1;
    return acc;
  }, {});

  const domainsForSidebar = Object.entries(domainMap).map(
    ([domain, count]) => ({
      value: domain,
      label: domain,
      count,
    }),
  );

  // ── 6. Status breakdown — for ProjectsHero intelligence panel ─────────────
  //
  // Count projects per status value. Per DEC-015: "live" | "wip" | "archived".
  // Passed to ProjectsHero; the panel renders it as a status breakdown row.
  const statusBreakdown = ALL_PROJECTS.reduce((acc, p) => {
    if (p.status) acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  // ── 7. Derived flags ──────────────────────────────────────────────────────
  const filtersActive = hasActiveFilters(filters);

  return (
    <ProjectsIndexSections
      available={siteConfig.available}
      availableFrom={siteConfig.availableFrom}
      projectCount={ALL_PROJECTS.length}
      domains={domainsForSidebar}
      statusBreakdown={statusBreakdown}
      conditions={conditions}
      filters={filters}
      view={view}
      pagination={pagination}
      filtersActive={filtersActive}
    />
  );
}
