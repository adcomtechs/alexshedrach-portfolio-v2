// app/writing/[slug]/page.jsx
// RSC — no client directive required.
//
// Thin shell. Data fetching only — no layout logic, no styling.
// PostLayout owns the full page structure.
//
// params is a Promise in Next.js 15 App Router. Both generateMetadata and
// the page component must await it before accessing any property.
// Accessing params.slug synchronously throws:
//   "params is a Promise and must be unwrapped with await"
//
// getPostBySlug (lib/data/posts.js) is async and returns the full PostFull
// shape including rendered HTML content. lib/writing.js is not required.

import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/data/posts";
import { getAllProjects } from "@/lib/data/projects";
import { PostLayout } from "@/features/writing/PostLayout";

// ── Static params ─────────────────────────────────────────────────────────────
// getAllPosts() reads the filesystem and filters drafts at the source.
// No separate getPostSlugs() helper required — getAllPosts already returns
// only published posts sorted by date.
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/writing/${post.slug}`,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function WritingPostPage({ params }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Resolve the related project from the post's frontmatter `project` field.
  // PostLayout receives a resolved { slug, title } object — no data layer
  // knowledge inside the component. Boundary enforced here at the page level.
  const relatedProject = post.project
    ? (() => {
        const match = getAllProjects().find((p) => p.slug === post.project);
        return match ? { slug: match.slug, title: match.title } : null;
      })()
    : null;

  return <PostLayout post={post} relatedProject={relatedProject} />;
}
