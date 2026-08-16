// app/lab/[slug]/page.jsx
// RSC — no client directive required.
//
// Thin shell. Data resolution and adjacent entry computation live here.
// LabEntryLayout receives fully resolved props — no data fetching inside it.
//
// Prev/Next computed from ALL_ENTRIES at build time — same pattern as DEC-035.

import { notFound } from "next/navigation";
import {
  getAllLabEntries,
  getAllLabSlugs,
  getLabEntryBySlug,
} from "@/lib/data/lab";
import { LabEntryLayout } from "@/features/lab/LabEntryLayout";

// generateStaticParams — pre-renders all lab entry routes at build time.
export function generateStaticParams() {
  return getAllLabSlugs();
}

// generateMetadata — per-entry title and description.
// Async required: Next.js 15 made params a Promise.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getLabEntryBySlug(slug);

  if (!entry) {
    return { title: "Not Found" };
  }

  return {
    title: `${entry.title} | Lab`,
    description: entry.summary,
    alternates: {
      canonical: `/lab/${entry.slug}`,
    },
  };
}

// Async required: Next.js 15 made params a Promise.
// Accessing params.slug synchronously returns undefined — getLabEntryBySlug
// finds no match and triggers notFound() even on valid slugs.
export default async function LabEntryPage({ params }) {
  const { slug } = await params;
  const entry = getLabEntryBySlug(slug);

  if (!entry) notFound();

  // Compute adjacent entries for prev/next navigation — per DEC-035 pattern.
  const allEntries = getAllLabEntries();
  const currentIndex = allEntries.findIndex((e) => e.slug === slug);
  const previous = allEntries[currentIndex - 1] ?? null;
  const next = allEntries[currentIndex + 1] ?? null;

  return <LabEntryLayout entry={entry} previous={previous} next={next} />;
}
