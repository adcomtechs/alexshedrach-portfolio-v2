// features/projects/ProjectIndex/ProjectIndex.jsx
// RSC — no client directive required.
//
// Static sorted list — no filter logic here. (DEC-019 amendment)
// Receives already-filtered, paginated projects from page.jsx. (DEC-031)
// Two columns at desktop within wide Container, one column mobile. (DEC-023)
// List variant activates when view prop is "list". (DEC-028)
//
// The gap-px grid trick is consistent across both views:
//   Grid — gap-px creates 1px column and row lines between cards
//   List — gap-px creates 1px horizontal dividers between stacked cards
// The wrapper background (border-sub) bleeds through the gaps in both cases.

import { ProjectCard } from "@/components/ui/Cards/ProjectCard";

/**
 * ProjectIndex
 *
 * Renders a filtered, paginated slice of projects in either grid or list layout.
 * Layout variant is driven by the `view` prop set in page.jsx from searchParams.
 *
 * Does not import from the data layer — all data comes from the page.
 * Does not evaluate conditions — renders what it receives.
 *
 * @param {Object[]} projects  - Paginated, filtered project slice from page.jsx.
 * @param {"grid"|"list"} view - Layout variant. Defaults to "grid". (DEC-028)
 */
export function ProjectIndex({ projects, view = "grid" }) {
  if (!projects?.length) return null;

  const isList = view === "list";

  return (
    <div
      className={
        isList
          ? "flex flex-col gap-px"
          : "grid grid-cols-1 md:grid-cols-2 gap-px"
      }
      style={{ background: "var(--color-border-sub)" }}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={project.index}
          variant={isList ? "list" : "grid"}
        />
      ))}
    </div>
  );
}

// // features/projects/ProjectIndex.jsx
// // RSC — no client directive required.
// //
// // Static sorted list — no filter UI, no use client. (DEC-019)
// // Two columns at desktop within wide Container, one column mobile. (DEC-023)
// // wide Container applied at the page level — per DEC-024.

// import { ALL_PROJECTS } from "@/lib/data/projects";
// import { ProjectCard } from "@/components/ui/Cards/ProjectCard";

// /**
//  * ProjectIndex
//  *
//  * Renders all projects as a static two-column grid. Sorted by project.index —
//  * order is fixed at build time per DEC-019. No filter state, no client JS.
//  *
//  * Grid lines are achieved via gap-px against a border-sub background —
//  * the cards' surface background reveals the gap as a 1px separator.
//  * This reads as a unified surface rather than individual floating cards,
//  * consistent with ProjectCard's intentional absence of border-radius.
//  */
// export function ProjectIndex() {
//   return (
//     <div
//       className="grid grid-cols-1 md:grid-cols-2 gap-px"
//       style={{ background: "var(--color-border-sub)" }}
//     >
//       {ALL_PROJECTS.map((project) => (
//         <ProjectCard
//           key={project.slug}
//           project={project}
//           index={project.index}
//         />
//       ))}
//     </div>
//   );
// }
