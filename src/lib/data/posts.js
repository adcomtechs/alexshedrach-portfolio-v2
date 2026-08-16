// lib/data/posts.js
// Server-only — uses Node.js fs. Never imported on the client.
// The server-only package throws a build-time error if this file
// is accidentally included in a client bundle.
//
// This is the canonical source of truth for writing post data.
// It replaces the static array that previously lived here.
// features/writing/posts.js is deleted — this file is its permanent home,
// consistent with the lib/data/ placement of all data utilities
// (projects.js, lab.js) per AI_CONTEXT.md.
//
// Public API:
//   getAllPosts()          → PostMeta[]   sorted newest-first, drafts excluded
//   getFeaturedPosts()    → PostMeta[]   first 3 published posts (home section)
//   getPostBySlug(slug)   → PostFull | null
//   getPostSlugs()        → string[]     for generateStaticParams

import "server-only";

import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

// ── Constants ────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "writing");

// Reading speed for technical content. Standard consumer prose uses ~250wpm;
// technical posts with code blocks are read more slowly. 200wpm is the right
// calibration — verified against actual read times on technical blogs.
const WORDS_PER_MINUTE = 200;

// Maximum featured posts surfaced on the Home writing section.
// getFeaturedPosts() returns this many posts — the most recently published.
// No frontmatter field required: newest posts are always the most relevant.
//
// DEC-049 amendment note: the static posts.js used an explicit featured boolean.
// The filesystem version derives featuring from recency. Three is the maximum
// the WritingSection layout accommodates (1 FeaturedPostCard + 2 grid cards).
const FEATURED_POST_LIMIT = 3;

// ── Shiki custom themes ──────────────────────────────────────────────────────
//
// These objects implement the color values specified in the --code-* token
// block in themes.css. They are the bridge between the design system
// specification and the rehype-pretty-code pipeline.
//
// Dual-theme output: rehype-pretty-code renders both light and dark values
// as inline CSS custom properties on each token span:
//   style="--shiki-light:#value;--shiki-dark:#value"
//
// The CSS selectors in themes.css activate the correct variable per the
// active [data-theme] attribute. No preset theme is adopted — DEC-011.

const CODE_THEME_DARK = {
  name: "portfolio-dark",
  type: "dark",
  colors: {
    "editor.background": "#111113", // --code-bg dark
    "editor.foreground": "#e4e4e7", // --code-text dark
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#52525b", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.control.flow",
        "storage.type",
        "storage.modifier",
        "keyword.other.using",
        "keyword.other.async",
      ],
      settings: { foreground: "#b5f23d" },
    },
    {
      scope: [
        "string",
        "string.quoted.double",
        "string.quoted.single",
        "string.template",
        "string.regexp",
      ],
      settings: { foreground: "#86efac" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
      ],
      settings: { foreground: "#93c5fd" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
        "support.function.builtin",
        "entity.name.method",
      ],
      settings: { foreground: "#c4b5fd" },
    },
    {
      scope: [
        "keyword.operator",
        "keyword.operator.arithmetic",
        "keyword.operator.comparison",
        "keyword.operator.logical",
        "keyword.operator.assignment",
        "keyword.operator.type",
      ],
      settings: { foreground: "#a1a1aa" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.interface",
        "support.type",
        "support.class",
        "storage.type.interface.ts",
        "storage.type.class.ts",
        "entity.other.inherited-class",
        "meta.type.annotation",
      ],
      settings: { foreground: "#67e8f9" },
    },
    {
      scope: ["support.class.component", "entity.name.tag", "meta.tag.custom"],
      settings: { foreground: "#67e8f9" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.definition.tag",
        "punctuation.separator",
        "punctuation.terminator",
        "meta.brace",
        "meta.delimiter",
      ],
      settings: { foreground: "#71717a" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.other.readwrite",
        "variable.other.object",
        "variable.other.property",
        "variable.parameter",
      ],
      settings: { foreground: "#e4e4e7" },
    },
    {
      scope: [
        "keyword.other.DML",
        "keyword.other.DDL",
        "keyword.other.sql",
        "support.function.aggregate.sql",
      ],
      settings: { foreground: "#b5f23d" },
    },
  ],
};

const CODE_THEME_LIGHT = {
  name: "portfolio-light",
  type: "light",
  colors: {
    "editor.background": "#f4f4f5", // --code-bg light
    "editor.foreground": "#18181b", // --code-text light
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#a1a1aa", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.control.flow",
        "storage.type",
        "storage.modifier",
        "keyword.other.using",
        "keyword.other.async",
      ],
      settings: { foreground: "#4d7c0f" },
    },
    {
      scope: [
        "string",
        "string.quoted.double",
        "string.quoted.single",
        "string.template",
        "string.regexp",
      ],
      settings: { foreground: "#15803d" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
      ],
      settings: { foreground: "#1d4ed8" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
        "support.function.builtin",
        "entity.name.method",
      ],
      settings: { foreground: "#6d28d9" },
    },
    {
      scope: [
        "keyword.operator",
        "keyword.operator.arithmetic",
        "keyword.operator.comparison",
        "keyword.operator.logical",
        "keyword.operator.assignment",
        "keyword.operator.type",
      ],
      settings: { foreground: "#52525b" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.interface",
        "support.type",
        "support.class",
        "storage.type.interface.ts",
        "storage.type.class.ts",
        "entity.other.inherited-class",
        "meta.type.annotation",
      ],
      settings: { foreground: "#0e7490" },
    },
    {
      scope: ["support.class.component", "entity.name.tag", "meta.tag.custom"],
      settings: { foreground: "#0e7490" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.definition.tag",
        "punctuation.separator",
        "punctuation.terminator",
        "meta.brace",
        "meta.delimiter",
      ],
      settings: { foreground: "#a1a1aa" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.other.readwrite",
        "variable.other.object",
        "variable.other.property",
        "variable.parameter",
      ],
      settings: { foreground: "#18181b" },
    },
    {
      scope: [
        "keyword.other.DML",
        "keyword.other.DDL",
        "keyword.other.sql",
        "support.function.aggregate.sql",
      ],
      settings: { foreground: "#4d7c0f" },
    },
  ],
};

// ── Pipeline configuration ────────────────────────────────────────────────────

const PRETTY_CODE_OPTIONS = {
  theme: {
    light: CODE_THEME_LIGHT,
    dark: CODE_THEME_DARK,
  },
  // keepBackground: false — --code-bg token owns the block background.
  // The theme's editor.background is intentionally ignored.
  keepBackground: false,
  // defaultLang: "text" — code blocks without a language tag get plain rendering.
  defaultLang: "text",
};

// behavior: "append" — anchor link added as last child of the heading element.
// Pairs with the .prose h2 > a selector in utilities.css.
// aria-hidden and tabIndex: -1 — decorative for mouse users, excluded from
// the accessibility tree. Screen readers navigate headings by element.
const AUTOLINK_OPTIONS = {
  behavior: "append",
  properties: {
    "aria-hidden": "true",
    tabIndex: -1,
  },
  content: {
    type: "element",
    tagName: "span",
    properties: {},
    children: [{ type: "text", value: " #" }],
  },
};

// ── Private helpers ───────────────────────────────────────────────────────────

// Date formatter. Uses local noon to prevent UTC midnight from displaying
// the previous calendar date in negative UTC offset timezones.
function formatDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// readTime derived from word count.
// Minimum 1 min — a 50-word note should not display "0 min read".
function deriveReadTime(rawContent) {
  const wordCount = rawContent.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

// Read and parse a single .md file to PostMeta.
// Returns null when the file has draft: true — callers filter these out.
function parsePostMeta(filename) {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (data.draft === true) return null;

  return {
    slug,
    title: data.title,
    summary: data.summary,
    published: data.published,
    publishedFormatted: formatDate(data.published),
    tags: Array.isArray(data.tags) ? data.tags : [],
    project: data.project ?? null,
    readTime: deriveReadTime(content),
  };
}

// Run the full remark/rehype pipeline on a markdown string.
// This is the only function that pays the Shiki initialization cost.
async function processContent(content) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, AUTOLINK_OPTIONS)
    .use(rehypePrettyCode, PRETTY_CODE_OPTIONS)
    .use(rehypeStringify)
    .process(content);

  return String(result);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * getAllPosts
 *
 * Returns all published posts sorted by published date descending.
 * Draft posts (draft: true in frontmatter) are excluded entirely —
 * they do not appear in the index and have no route at runtime.
 *
 * Wrapped with React's cache() for request-level memoization.
 * Multiple callers within one request (WritingSection, nav, writing index)
 * receive the same array without re-reading the filesystem.
 *
 * @returns {PostMeta[]}
 */
export const getAllPosts = cache(function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((f) => parsePostMeta(f))
    .filter(Boolean)
    .sort((a, b) => new Date(b.published) - new Date(a.published));
});

/**
 * getFeaturedPosts
 *
 * Returns the most recently published posts for the Home writing section.
 * Capped at FEATURED_POST_LIMIT (3) — the maximum the WritingSection
 * layout accommodates: 1 FeaturedPostCard + 2 supporting grid cards.
 *
 * Featuring is derived from recency rather than an explicit frontmatter flag.
 * The most recent posts are always the most relevant signal on a portfolio.
 *
 * @returns {PostMeta[]}
 */
export function getFeaturedPosts() {
  return getAllPosts().slice(0, FEATURED_POST_LIMIT);
}

/**
 * getPostBySlug
 *
 * Returns the full PostFull shape including rendered HTML content.
 * Returns null when the slug does not exist or the post is a draft.
 * The page calls notFound() on null — this function does not throw.
 *
 * cache() ensures generateMetadata and the page component share one
 * pipeline execution per request. Shiki initialization is not repeated.
 *
 * @param {string} slug
 * @returns {Promise<PostFull | null>}
 */
export const getPostBySlug = cache(async function getPostBySlug(slug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (data.draft === true) return null;

  const processedContent = await processContent(content);

  return {
    slug,
    title: data.title,
    summary: data.summary,
    published: data.published,
    publishedFormatted: formatDate(data.published),
    tags: Array.isArray(data.tags) ? data.tags : [],
    project: data.project ?? null,
    readTime: deriveReadTime(content),
    content: processedContent,
  };
});

/**
 * getPostSlugs
 *
 * Returns all published post slugs.
 * Used by generateStaticParams in app/writing/[slug]/page.jsx.
 *
 * @returns {string[]}
 */
export function getPostSlugs() {
  return getAllPosts().map((p) => p.slug);
}

// // lib/data/posts.js
// // Server-only data module. Never import from a client component.
// //
// // Schema contract:
// //   slug          — URL identifier. Must match the .md filename in /content/writing/
// //   title         — Full post title
// //   summary       — One sentence. Surfaced on PostCard and meta tags
// //   publishedAt   — ISO 8601. Used for ordering and formatted display
// //   readingTime   — Minutes. Calculated at authoring time — kept in sync manually
// //   status        — "published" | "draft". Drafts excluded from all public surfaces
// //   relatedProject— Slug reference to /projects/[slug]. Null until Phase 3 ships
// //   tags          — Controlled vocabulary. Index 0 is the primary display tag
// //   featured      — Whether surfaced in the Home writing section

// export const posts = [
//   {
//     slug: "modular-monolith-vs-microservices-marketplace",
//     title:
//       "Why I Chose a Modular Monolith Over Microservices for My First Marketplace Build",
//     summary:
//       "The case for starting with a modular monolith when the product is unvalidated and microservices would cost iteration speed before you'd earned the complexity.",
//     publishedAt: "2026-04-10",
//     readingTime: 8,
//     status: "published",
//     relatedProject: null,
//     tags: ["Architecture", "Systems Design"],
//     featured: true,
//   },
//   {
//     slug: "double-entry-bookkeeping-for-engineers",
//     title: "Double-Entry Bookkeeping Explained for Software Engineers",
//     summary:
//       "A precise technical walkthrough of the accounting model that powers every financial system explained through data structures, not accounting textbooks.",
//     publishedAt: "2026-03-22",
//     readingTime: 6,
//     status: "published",
//     relatedProject: null,
//     tags: ["Fintech", "Systems Design"],
//     featured: true,
//   },
//   {
//     slug: "offline-first-apps-unreliable-connectivity",
//     title:
//       "Building Offline-First Apps for Unreliable Connectivity Environments",
//     summary:
//       "How to architect applications that remain functional when the network doesn't sync strategies, conflict resolution, and the tradeoffs that matter in practice.",
//     publishedAt: "2026-03-05",
//     readingTime: 10,
//     status: "published",
//     relatedProject: null,
//     tags: ["Architecture", "Mobile"],
//     featured: true,
//   },
//   {
//     slug: "nigerian-university-cgpa-architecture",
//     title: "The Real Architecture of Nigerian University CGPA Calculation",
//     summary:
//       "A systems breakdown of how cumulative GPA is actually computed in Nigerian universities — and why rebuilding it in software is less straightforward than it appears.",
//     publishedAt: "2026-02-18",
//     readingTime: 7,
//     status: "published",
//     relatedProject: null,
//     tags: ["Systems Design", "Education"],
//     featured: false,
//   },
// ];

// /**
//  * Returns all published posts sorted by publishedAt descending.
//  * Drafts are excluded regardless of environment — production safety by default.
//  *
//  * @returns {Array} Published posts, newest first
//  */
// export function getAllPosts() {
//   return posts
//     .filter((p) => p.status === "published")
//     .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
// }

// /**
//  * Returns the featured posts for the home Writing section.
//  * Preserves the publishedAt sort order within the featured set.
//  *
//  * @returns {Array} Featured published posts, newest first
//  */
// export function getFeaturedPosts() {
//   return getAllPosts().filter((p) => p.featured);
// }

// /**
//  * Returns a single post by slug.
//  * Returns undefined if not found — callers must handle the undefined case
//  * and invoke notFound() from next/navigation for 404 behaviour.
//  *
//  * @param {string} slug
//  * @returns {Object|undefined}
//  */
// export function getPostBySlug(slug) {
//   return posts.find((p) => p.slug === slug && p.status === "published");
// }

// /**
//  * Returns all published post slugs.
//  * Used by generateStaticParams in /writing/[slug]/page.jsx.
//  *
//  * @returns {string[]}
//  */
// export function getPostSlugs() {
//   return getAllPosts().map((p) => p.slug);
// }
