// app/projects/[slug]/page.jsx
// No raw Tailwind — page composes layout primitives and feature components only.
// Layout contract: Section → Container → Feature Content.
//
// Two-column layout at lg+: StickyOutline left, CaseStudyLayout right. (DEC-034)
// NextPrevNavigation renders below CaseStudyLayout in the right column. (DEC-035)
// default Container (896px) for both hero and content sections. (DEC-024)

import { notFound } from "next/navigation";
import {
  ALL_PROJECTS,
  getProjectBySlug,
  getAllProjectSlugs,
} from "@/lib/data/projects";
import {
  CaseStudySections,
  SECTION_MAP,
} from "@/features/projects/CaseStudyLayout";

export function generateStaticParams() {
  return getAllProjectSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // ── Adjacent project computation — per DEC-035 ────────────────────────────
  //
  // ALL_PROJECTS is already sorted by index (see lib/data/projects.js).
  // findIndex is O(n) on a small fixed array — no optimisation needed.

  const currentIndex = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const previous = ALL_PROJECTS[currentIndex - 1] ?? null;
  const next = ALL_PROJECTS[currentIndex + 1] ?? null;

  // ── StickyOutline section list — per DEC-034 ──────────────────────────────
  //
  // Built from SECTION_MAP filtered to populated fields, plus optional
  // Challenges and Testimonial sections appended conditionally.
  // StickyOutline receives a flat array — it does not read the project schema.

  const outlineSections = [
    ...SECTION_MAP.filter(({ key }) => Boolean(project.caseStudy?.[key])).map(
      ({ key, label }) => ({ id: key, label }),
    ),

    ...(project.challenges?.length > 0
      ? [{ id: "challenges", label: "Challenges" }]
      : []),

    ...(project.testimonial?.quote
      ? [{ id: "testimonial", label: "Testimonial" }]
      : []),
  ];

  return (
    <CaseStudySections
      project={project}
      outlineSections={outlineSections}
      previous={previous}
      next={next}
    />
  );
}
