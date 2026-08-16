# DECISIONS-PHASE3.5.md — Phase 3.5 Decisions: Writing System

**Project:** alexshedrach.dev
**Version:** 1.0.0
**Last Updated:** 2026
**Classification:** Phase 3.5 Engineering Memory — Load When Working on Writing System

---

## 0. About This File

This file contains decisions made during **Phase 3.5 — Writing System** development. It covers the content rendering strategy, post schema and frontmatter specification, dependency selection, and the code token system that implements DEC-011.

**Prerequisites:** Load `DECISIONS.md` and `DECISIONS-CORE.md` before this file. Cross-reference DEC-010 (`DECISIONS-PHASE2.md`) — the decision that established writing as a first-class section — and DEC-011 (`DECISIONS-PHASE2.md`) — the decision that governs syntax highlighting token strategy. Both are upstream constraints this file implements.

**Scope:** DEC-048 to DEC-051

**Numbering note:** The writing system planning session proposed this decision as DEC-044. That ID was already assigned to the About page layout decision (Phase 4) before this file was created. Writing System decisions are renumbered DEC-048 through DEC-051 to preserve index integrity. The master `DECISIONS.md` index reflects the correct numbering.

For the complete decision index and protocol, see `DECISIONS.md`.

---

## 1. Quick Reference — Writing System Architecture

```
Writing System
│
├── content/writing/                       Source — .md files with YAML frontmatter
│   ├── modular-monolith-over-microservices.md
│   ├── double-entry-bookkeeping-for-engineers.md
│   ├── nigerian-university-cgpa-architecture.md
│   └── offline-first-unreliable-connectivity.md
│
├── /lib/data/posts.js                     Utilities — server-side fs access
│   ├── getAllPosts()     → PostMeta[]      Index page — frontmatter only
│   └── getPostBySlug()  → PostFull        Detail page — full pipeline
│
├── /writing                               Index route — PostCard grid
└── /writing/[slug]                        Detail route — PostLayout
```

---

## 2. Field Origin Map

| Field                | Source               | Notes                                                 |
| -------------------- | -------------------- | ----------------------------------------------------- |
| `slug`               | Filename             | `.md` extension stripped — filename is canonical      |
| `title`              | Frontmatter          | Required                                              |
| `summary`            | Frontmatter          | Required — one sentence                               |
| `published`          | Frontmatter          | Required — ISO date `YYYY-MM-DD`                      |
| `publishedFormatted` | Derived in utility   | Human-readable — never in frontmatter                 |
| `tags`               | Frontmatter          | Required — array, minimum one                         |
| `project`            | Frontmatter          | Optional — related project slug                       |
| `draft`              | Frontmatter          | Optional — consumed by utility, never in return shape |
| `readTime`           | Derived from content | Computed at ~200 wpm — never in frontmatter           |
| `content`            | Derived from content | `getPostBySlug` only — rendered HTML                  |

---

## 3. Pipeline Order

```
gray-matter
  strips frontmatter → returns { data, content }

unified()
  .use(remark)                    1. Parse markdown → mdast
  .use(remarkGfm)                 2. GFM extensions — tables, strikethrough
  .use(remarkRehype)              3. Convert mdast → hast
  .use(rehypeSlug)                4. Add id attributes to headings
  .use(rehypeAutolinkHeadings)    5. Wrap headings in anchor links
  .use(rehypePrettyCode, config)  6. Syntax highlight code blocks
  .use(rehypeStringify)           7. Serialize hast → HTML string
```

This pipeline runs **only inside `getPostBySlug`**. `getAllPosts` reads frontmatter via `gray-matter` only — the full pipeline never runs on the index page.

---

## 4. What Does Not Ship With Phase 3.5

| Feature                    | Status                          | Reason                                                            |
| -------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| MDX / JSX in content files | ❌ Not shipping                 | Explicit decision — DEC-048                                       |
| Shiki preset theme         | ❌ Not shipping                 | DEC-011 — no preset, Design System owns all token values          |
| Pagination on index        | ❌ Not shipping                 | Ships when 6+ posts exist — per spec                              |
| Post categories            | ❌ Not shipping                 | Ships when posts genuinely divide into distinct groups — per spec |
| `/writing` linked in nav   | ❌ Not until first post is live | Launch requirement — per DEC-010                                  |

---

## 5. Decision Records

---

### DEC-048 — Content Rendering Strategy: Markdown over MDX

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture / Data

#### Context

Phase 3.5 requires a content rendering strategy for the writing system. Two approaches were evaluated: MDX (Markdown with embedded JSX) and plain Markdown with a remark/rehype pipeline. The choice governs the file format, tooling stack, content storage location, and the degree of coupling between content and component implementation.

DEC-010 established the writing system as a first-class section. DEC-011 established that syntax highlighting must use CSS variable output with no Shiki preset. The rendering strategy must satisfy both upstream constraints.

#### Options Considered

| Option                                    | Summary                                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| MDX with `@next/mdx` or `next-mdx-remote` | Full JSX in content files — embeds React components in posts |
| Markdown with remark/rehype pipeline      | Pure prose content — pipeline produces HTML server-side      |

#### Decision

**Markdown with remark/rehype pipeline.** Posts stored as `.md` files with YAML frontmatter in `content/writing/`. `/lib/data/posts.js` exports server-side filesystem utilities. `rehype-pretty-code` configured with CSS variable output to honour DEC-011. MDX explicitly rejected.

#### Reasoning

**JSX in content provides no value for the planned post types.**
The four planned posts are technical prose with code blocks:

- "Why I chose a modular monolith over microservices"
- "Double-entry bookkeeping explained for engineers"
- "The real architecture of Nigerian university CGPA calculation"
- "Building offline-first apps for unreliable connectivity"

None has a defensible use case for embedded JSX. A React component mid-paragraph in the bookkeeping post adds nothing. MDX's core value proposition is entirely unused here.

**Content/component coupling is a maintenance liability.**
Allowing JSX in content files violates the same principle that prohibits raw Tailwind in page files — content and component implementation are separate concerns. When a component API changes, it can silently break a published post. That coupling is not acceptable for content that should remain stable independent of implementation changes.

**RSC alignment.**
Markdown files are pure data. A remark/rehype pipeline runs server-side, produces HTML, and keeps the rendering layer firmly in Server Components with no client boundary required. MDX with `next-mdx-remote` introduces serialization overhead and requires careful boundary management to remain RSC-compatible. Plain Markdown requires none of this.

**DEC-011 compliance.**
`rehype-pretty-code` supports CSS variable output mode — token colors come from custom properties set by `themes.css` rather than inline hex values. This is the correct DEC-011 implementation: the Shiki engine handles tokenization, the Design System owns every color value. No preset is adopted.

**The MDX exception case.**
The one scenario where MDX would win: posts that embed interactive demos — a live code sandbox, a sortable table, a canvas animation. If that requirement surfaces, it is handled at the `PostLayout` level as a slot or injection point keyed to the slug — not by migrating all content to MDX. This preserves the architecture for the general case while enabling the exception when it is genuinely warranted.

#### Content Storage

```
content/
  writing/
    modular-monolith-over-microservices.md
    double-entry-bookkeeping-for-engineers.md
    nigerian-university-cgpa-architecture.md
    offline-first-unreliable-connectivity.md
```

The `content/` directory is project root — not inside `src/`. It is not a route. It is source data read server-side via Node `fs`. The filesystem is the CMS.

#### Consequences

- ✅ No content/component coupling — component API changes cannot break published posts
- ✅ RSC-compatible by default — no serialization overhead, no client boundary management
- ✅ DEC-011 compliant — CSS variable output mode preserves Design System ownership of all token values
- ✅ Pure data files — posts are readable, version-controlled, portable
- ✅ Pipeline is auditable — every transformation step is explicit and ordered
- ⚠️ Interactive content (demos, sandboxes) requires a PostLayout slot mechanism — not MDX
- ⚠️ All unified / remark / rehype packages in current major versions are ESM-only — confirm no CommonJS conflict at install time
- ⚠️ Shiki language grammars load explicitly — wildcard loading is prohibited per dependency discipline

---

### DEC-049 — Post Schema and Frontmatter Specification

**Date:** 2026
**Status:** `Accepted`
**Area:** Data

#### Context

DEC-048 established that posts are `.md` files with YAML frontmatter. The schema must be defined before any utility function or component is built — the same sequencing principle that governed the project data schema in DEC-009.

Two fields from the spec schema (`slug`, `readTime`) require explicit decisions about their source of truth. If both are stored in frontmatter, two sync failure vectors are introduced. The correct approach derives them from the filesystem and content respectively.

#### Frontmatter Field Specification

```yaml
---
title: string # REQUIRED. Post title.
summary: string # REQUIRED. One sentence. Renders on PostCard and in <meta>.
published: string # REQUIRED. ISO date YYYY-MM-DD. Sort order + datetime attr.
tags: string[] # REQUIRED. Minimum one. Topics and technologies.
project: string # OPTIONAL. Slug of a related project in projects.js.
draft: boolean # OPTIONAL. Defaults false when absent.
---
```

Six fields. Four required, two optional. No field that duplicates derived data.

#### Fields Deliberately Absent from Frontmatter

**`slug`** — derived from filename. `content/writing/modular-monolith-over-microservices.md` yields `modular-monolith-over-microservices`. Storing slug in frontmatter creates a sync failure vector — filename and frontmatter value can diverge silently. The filesystem is the canonical source. `getAllPosts` strips the `.md` extension.

**`readTime`** — computed from content word count at parse time (~200 wpm for technical content, rounded up, minimum "1 min read"). Manual specification creates a maintenance obligation — a substantially edited post requires the author to remember to update a number. Computation happens once in the utility, never in frontmatter.

#### `draft` Field Behaviour

`draft: true` excludes the post from `getAllPosts` entirely. Draft posts do not exist at runtime — no 404, simply absent. The `draft` field is consumed and discarded by the utility — it never appears in `PostMeta` or `PostFull`. Draft status is a data pipeline concern, not a UI concern.

#### `PostMeta` — Shape Returned by `getAllPosts`

The index page and `PostCard` consume this shape. No content body included — parsing the full pipeline for every post on the index page would be wasteful and incorrect.

```js
{
  // Derived from filename
  slug:               string,   // "modular-monolith-over-microservices"

  // From frontmatter
  title:              string,   // "Why I chose a modular monolith over microservices"
  summary:            string,   // One sentence — what this post argues or explains
  published:          string,   // "2026-05-01" — ISO, for sort order + datetime attr
  tags:               string[], // ["Architecture", "Node.js", "System Design"]
  project:            string | null,  // "scholarhive" | null

  // Derived in utility
  publishedFormatted: string,   // "1 May 2026" — for display
  readTime:           string,   // "8 min read"
}
```

`publishedFormatted` is derived in the utility, not frontmatter. The component needs both: `published` for the `<time datetime="">` accessibility attribute, `publishedFormatted` for rendered display. Formatting logic belongs once in the utility — not duplicated across components.

`getAllPosts` returns `PostMeta[]` sorted by `published` descending. Draft posts are filtered before the return — they do not appear in the array under any condition.

#### `PostFull` — Shape Returned by `getPostBySlug`

The `/writing/[slug]` page consumes this shape. Extends `PostMeta` with the rendered content body.

```js
{
  // Everything in PostMeta
  slug:               string,
  title:              string,
  summary:            string,
  published:          string,
  publishedFormatted: string,
  tags:               string[],
  project:            string | null,
  readTime:           string,

  // Added by getPostBySlug only
  content:            string,   // Rendered HTML from the full remark/rehype pipeline
}
```

`content` is the fully processed HTML string. The remark/rehype pipeline — including `rehype-pretty-code` with CSS variable output — runs only inside `getPostBySlug`. The index never pays this cost.

#### Relationship to Spec Schema

The spec (`PORTFOLIO_V2_SPEC.md Section 6.3`) defines these fields:

```js
{
  (slug, title, summary, readTime, published, project, tags);
}
```

The implementation honours all seven. `slug` and `readTime` are derived rather than stored — the spec defines the shape of the data, not the mechanism of its origin. Both fields are present in every `PostMeta` and `PostFull` object.

#### Consequences

- ✅ Schema is stable before any component is built — no mid-build amendments
- ✅ No sync failure vectors — derived fields have a single canonical source
- ✅ `draft` is a pipeline-only concern — UI components never need to handle draft state
- ✅ `publishedFormatted` derived once in utility — not duplicated across components
- ✅ Full pipeline cost paid only on detail pages — index is lightweight
- ⚠️ Filenames are the canonical slug source — filename changes break URLs. Slugs must be stable after publication
- ⚠️ `getAllPosts` must strip `.md` extension and sort by `published` descending — both are utility responsibilities, not component responsibilities

---

### DEC-050 — Dependency Selection and Pipeline Order

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

DEC-048 selected the remark/rehype pipeline. The specific packages and their execution order must be logged before implementation begins — both to satisfy the dependency discipline in `AI_CONTEXT.md` and to establish the correct pipeline order, which is not arbitrary.

#### Dependency Justification

| Package                    | Purpose                        | Bundle                   | Justification                                                                                                                                        |
| -------------------------- | ------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gray-matter`              | Frontmatter parsing            | ~15KB, zero dependencies | De facto standard. Parses YAML frontmatter from `.md` files. No viable lighter alternative.                                                          |
| `unified`                  | Pipeline orchestration         | ~5KB                     | Required by the entire remark/rehype ecosystem — not optional.                                                                                       |
| `remark`                   | Markdown → mdast               | ~20KB                    | Core parser. No alternative within this ecosystem.                                                                                                   |
| `remark-gfm`               | GFM extensions                 | ~15KB                    | Tables are required — the bookkeeping post needs them. Strikethrough and autolinks are reasonable given the cost is already paid.                    |
| `remark-rehype`            | mdast → hast bridge            | ~10KB                    | Required bridge between the remark and rehype layers.                                                                                                |
| `rehype-slug`              | Heading anchor IDs             | ~2KB                     | Adds `id` attributes to h2–h6. Enables in-post navigation and direct section linking — consistent with the anchor ID pattern established in DEC-036. |
| `rehype-autolink-headings` | Anchor links on headings       | ~3KB                     | Wraps heading text in anchor links. Pairs with `rehype-slug`. Enables shareable section links in long technical posts.                               |
| `rehype-pretty-code`       | Syntax highlighting            | Shiki-dependent          | The only Shiki-backed highlighter that supports the CSS variable output mode required by DEC-011. No alternative satisfies that constraint.          |
| `rehype-stringify`         | hast → HTML string             | ~5KB                     | Serializes the processed hast tree to the HTML string `getPostBySlug` returns. Required final step.                                                  |
| `shiki`                    | Tokenization engine (peer dep) | Varies by language       | Required by `rehype-pretty-code`. Language loading is explicit — only languages the posts actually use are registered.                               |

#### Shiki Language Budget

Shiki loads language grammars on demand. The posts define the language ceiling: JavaScript, JSX, TypeScript, CSS, JSON, Bash, SQL. Each grammar is a few KB. The bundle cost scales with the registered language set — no wildcard loading.

#### ESM Note

All unified, remark, and rehype packages in their current major versions are ESM-only. Next.js App Router handles this without `transpilePackages`. Confirm at install time that no CommonJS-only package surfaces in the dependency graph.

#### Pipeline Order and Reasoning

```
gray-matter
  strips frontmatter → returns { data, content }

unified()
  .use(remark)                             1. Parse markdown string → mdast
  .use(remarkGfm)                          2. Extend mdast with GFM nodes
  .use(remarkRehype)                       3. Convert mdast → hast
  .use(rehypeSlug)                         4. Add id attributes to headings
  .use(rehypeAutolinkHeadings, config)     5. Wrap headings in anchor links
  .use(rehypePrettyCode, config)           6. Syntax highlight code blocks
  .use(rehypeStringify)                    7. Serialize hast → HTML string
```

**Why this order is enforced:**

`remarkGfm` must run before `remarkRehype` — it operates on the mdast, not the hast. Once the tree is converted to hast at step 3, GFM extensions can no longer be applied.

`rehypeSlug` must run before `rehypeAutolinkHeadings` — the autolink plugin reads the `id` attributes that `rehypeSlug` creates. Running autolink first produces anchor elements with no target.

`rehypePrettyCode` runs after `rehypeSlug` — code blocks and headings are separate elements, ordering between these two is not strictly enforced, but slug-before-code is the conventional ecosystem order.

`rehypeStringify` is always last — it consumes the fully processed hast tree and produces the output string.

#### DEC-011 Compliance Mechanism

`rehype-pretty-code` accepts a `theme` option. When two custom theme objects are passed — one keyed `light`, one keyed `dark` — Shiki outputs inline styles as CSS custom properties on each token span:

```html
<span style="--shiki-light:#value;--shiki-dark:#value">token</span>
```

These `--shiki-light` and `--shiki-dark` properties are then controlled by CSS selectors in `themes.css`. The CSS layer activates the correct variable set based on the `[data-theme]` attribute — which is the existing theming mechanism established in the project.

The two custom Shiki theme objects (`codeThemeDark` and `codeThemeLight`) are committed as configuration, not imported presets. Their token color values are set to match the `--code-*` design tokens defined in `themes.css`. This is the DEC-011 contract: token values are owned and specified in `themes.css`, the Shiki theme objects implement those values, no preset is adopted.

#### Consequences

- ✅ Every dependency is justified against a specific requirement
- ✅ Pipeline order is deterministic — no ordering ambiguity during implementation
- ✅ Shiki language loading is explicit — no wildcard grammar loading
- ✅ DEC-011 compliance mechanism is fully specified — implementable without interpretation
- ⚠️ ESM-only packages — confirm no CommonJS conflict at install time
- ⚠️ `rehypeAutolinkHeadings` config requires explicit `behavior` setting — default wrapping behavior may conflict with prose styling

---

### DEC-051 — themes.css Code Token Block and Shiki Integration

**Date:** 2026
**Status:** `Accepted`
**Area:** Design System

#### Context

DEC-011 established that syntax highlighting token colors must live inside the Design System — no Shiki preset. DEC-050 established the CSS variable output mechanism. This decision specifies the exact token values, their rationale, and the CSS integration block that wires Shiki's inline variable output to the active theme.

This is the implementation of DEC-011. The decisions are upstream — this entry records the specific values chosen and why.

#### Token Groups

Two groups of tokens serve different consumers:

| Group         | Tokens                                                                                                          | Consumer                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Syntax tokens | `text`, `comment`, `keyword`, `string`, `number`, `function`, `operator`, `type`, `punctuation`, `variable`     | Shiki custom theme objects — read at build time to construct `codeThemeDark` and `codeThemeLight` |
| Block tokens  | `bg`, `border`, `padding`, `line-highlight`, `line-highlight-border`, `line-number`, `inline-bg`, `inline-text` | CSS only — applied directly to `pre`, `code`, and `[data-highlighted-line]` elements              |

Syntax tokens flow: `themes.css` (specification) → Shiki config objects (implementation) → `--shiki-dark` / `--shiki-light` inline styles (output).
Block tokens flow: `themes.css` → CSS selectors → rendered elements. No Shiki involvement.

#### Dark Theme Token Values — `:root`

```css
/* ===========================
   CODE TOKEN SYSTEM
   Syntax tokens → Shiki theme objects
   Block tokens  → CSS selectors below
=========================== */
:root {
  /* Block tokens */
  --code-bg: #111113;
  --code-border: #27272a;
  --code-padding: 1.25rem 1.5rem;
  --code-line-highlight: rgba(181, 242, 61, 0.06);
  --code-line-highlight-border: #b5f23d;
  --code-line-number: #3f3f46;
  --code-inline-bg: #18181b;
  --code-inline-text: #b5f23d;

  /* Syntax tokens */
  --code-text: #e4e4e7;
  --code-comment: #52525b;
  --code-keyword: #b5f23d;
  --code-string: #86efac;
  --code-number: #93c5fd;
  --code-function: #c4b5fd;
  --code-operator: #a1a1aa;
  --code-type: #67e8f9;
  --code-punctuation: #71717a;
  --code-variable: #e4e4e7;
}
```

#### Light Theme Token Values — `[data-theme="light"]`

```css
[data-theme="light"] {
  /* Block tokens */
  --code-bg: #f4f4f5;
  --code-border: #e4e4e7;
  --code-line-highlight: rgba(163, 230, 53, 0.12);
  --code-line-highlight-border: #65a30d;
  --code-line-number: #d4d4d8;
  --code-inline-bg: #e4e4e7;
  --code-inline-text: #4d7c0f;

  /* Syntax tokens */
  --code-text: #18181b;
  --code-comment: #a1a1aa;
  --code-keyword: #4d7c0f;
  --code-string: #15803d;
  --code-number: #1d4ed8;
  --code-function: #6d28d9;
  --code-operator: #52525b;
  --code-type: #0e7490;
  --code-punctuation: #a1a1aa;
  --code-variable: #18181b;

  /* --code-padding not redefined — layout is theme-invariant */
}
```

#### Color Rationale

**Dark theme:** The lime accent (`#b5f23d`) is assigned to keywords — the most semantically significant tokens in any code block. String literals use adjacent green (`#86efac`) rather than the same lime, creating a sibling relationship without collision. Types land in cyan, functions in violet — both infrequent enough to carry a distinct color without visual noise. Punctuation is aggressively muted — it structures code but carries no semantic meaning for the reader.

**Light theme:** The lime accent shifts two steps darker (`#4d7c0f` lime-800 vs `#b5f23d`) to maintain contrast on the light background. Every other syntax color follows the same principle — semantic role is consistent across themes, only luminosity shifts. All syntax tokens meet WCAG AA (4.5:1) against their respective `--code-bg` values.

#### Shiki Integration CSS

This block belongs at the end of the code token section in `themes.css`. It wires the `--shiki-*` inline styles output by `rehype-pretty-code` to the active theme.

```css
/* ===========================
   SHIKI INTEGRATION
   Switches --shiki-dark / --shiki-light
   based on active [data-theme] attribute
=========================== */

/* Token spans — dark active by default */
pre > code span {
  color: var(--shiki-dark);
}

/* Token spans — light active when data-theme="light" */
[data-theme="light"] pre > code span {
  color: var(--shiki-light);
}

/* Code block container */
pre {
  background-color: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: var(--code-padding);
  overflow-x: auto;
}

pre > code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  background: transparent;
  border: none;
  padding: 0;
}

/* Highlighted lines — set via {1,3} meta in fenced code */
[data-highlighted-line] {
  background-color: var(--code-line-highlight);
  border-left: 2px solid var(--code-line-highlight-border);
  padding-left: calc(1.5rem - 2px);
  margin-left: -1.5rem;
  padding-right: 1.5rem;
  margin-right: -1.5rem;
}

/* Line numbers — enabled via showLineNumbers meta */
[data-line-number]::before {
  content: attr(data-line-number);
  display: inline-block;
  width: 1.5rem;
  margin-right: 1.5rem;
  text-align: right;
  color: var(--code-line-number);
  user-select: none;
}

/* Inline code — :not(pre) excludes fenced blocks */
:not(pre) > code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background-color: var(--code-inline-bg);
  color: var(--code-inline-text);
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
}
```

#### What Step 4 (Shiki Config) Reads From This

When `PostLayout` configures `rehype-pretty-code`, the Shiki custom theme objects are built using the syntax token values defined above. The mapping is direct:

```
--code-keyword     → tokenColors scope "keyword"
--code-string      → tokenColors scope "string"
--code-comment     → tokenColors scope "comment"
--code-number      → tokenColors scope "constant.numeric"
--code-function    → tokenColors scope "entity.name.function"
--code-operator    → tokenColors scope "keyword.operator"
--code-type        → tokenColors scope "support.type"
--code-punctuation → tokenColors scope "punctuation"
--code-variable    → tokenColors scope "variable"
```

Block tokens (`--code-bg`, `--code-border`, etc.) are never referenced in the Shiki config — they live entirely in CSS.

#### Consequences

- ✅ All code token colors are owned by `themes.css` — Design System contract upheld
- ✅ DEC-011 fully implemented — no preset, full token control
- ✅ WCAG AA contrast met across all syntax tokens on both themes
- ✅ Theme switching requires only CSS — no Shiki reconfiguration
- ✅ Inline code and block code handled separately — correct visual differentiation
- ⚠️ Token values must be re-evaluated if the base design palette changes — they reference specific hex values, not CSS custom properties
- ⚠️ The Shiki theme config objects must mirror these values exactly — drift between `themes.css` and the Shiki config produces incorrect output
- ⚠️ `--code-padding` is theme-invariant — do not redefine it in `[data-theme="light"]`

# DECISIONS-PHASE3.5.md — Append: Writing Index Upgrade

---

### DEC-054 — Writing System Utility Architecture

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

The writing index page requires server-side condition evaluation, filter logic, and pagination — the same concerns the projects system resolves in `lib/utils/projects.js`. Without a dedicated utility layer, this logic would accumulate in `app/writing/page.jsx`, violating the single-responsibility principle established for page shells across the project.

#### Decision

**`lib/utils/writing.js` is the single source of truth for all writing index gate logic, filter operations, and pagination.**

Parallel structure to `lib/utils/projects.js`. All functions are pure — they accept data as arguments and return results. No imports from the data layer; callers pass post arrays in. No side effects, no async, no global state.

#### Call order enforced by `app/writing/page.jsx`

```
1. parseWritingFilters(searchParams)           → { tag, readTime, sort, page }
2. filterPosts(allPosts, filters)              → filteredPosts[]
3. evaluateConditions(allPosts, filteredPosts) → conditions
4. paginatePosts(filteredPosts, page)          → { items, ...pagination }
```

#### Exported API

| Function                                      | Purpose                                       |
| --------------------------------------------- | --------------------------------------------- |
| `parseWritingFilters(searchParams)`           | Normalise URL params into typed filter object |
| `filterPosts(posts, filters)`                 | Apply tag, readTime, and sort filters         |
| `hasActiveFilters(filters)`                   | Gate the clear-filters link                   |
| `evaluateConditions(allPosts, filteredPosts)` | Run all condition checks, single call         |
| `paginatePosts(posts, page, pageSize)`        | Slice and return pagination metadata          |
| `getTagDistribution(posts)`                   | Tag → count map                               |
| `getUniqueTags(posts)`                        | Ordered distinct tags for filter pills        |
| `shouldShowTagFilter(posts)`                  | Tag filter condition                          |
| `shouldShowReadTimeFilter(posts)`             | Read time filter condition                    |
| `shouldShowSortToggle(posts)`                 | Sort toggle condition                         |
| `parseReadMinutes(readTime)`                  | Extract integer from "8 min read" string      |

#### Consequences

- ✅ Page shell stays thin — zero condition logic in `app/writing/page.jsx`
- ✅ All gate logic testable in isolation — pure functions, no mocking required
- ✅ Consistent with the pattern established in `lib/utils/projects.js`
- ⚠️ Thresholds defined as module-level constants — change there, not in components

---

### DEC-055 — Writing Index Conditional Feature Gates

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Architecture

#### Context

Per DEC-031, conditional UI is built now and activated by data. The writing index has its own distinct set of conditional features that differ from the projects system — the content type (prose posts vs engineering case studies) and the filtering dimensions (tags, read time, sort) are different.

#### Decision

All features are built in this phase. UI activates automatically when data meets the threshold.

| Feature               | Activates When                           | Hidden When                                                    |
| --------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| Tag filter pills      | 2+ distinct tags appear on 2+ posts each | Data distribution does not meet threshold                      |
| Read time filter      | 2+ published posts exist                 | Fewer than 2 posts                                             |
| Sort toggle           | 5+ published posts                       | Fewer than 5 posts — sort order is meaningless at small volume |
| Clear filters link    | Any filter param is active in URL        | No active filters                                              |
| Active filter summary | Any filter param is active               | No active filters                                              |
| Empty state           | Filtered results = 0                     | Results exist                                                  |
| Post count            | Always — shows total or "N of M"         | Never hidden                                                   |
| Pagination            | Filtered post count > 8                  | Filtered count ≤ 8                                             |

#### Read time buckets

| Param value | Label      | Threshold |
| ----------- | ---------- | --------- |
| `quick`     | Quick read | ≤ 5 min   |
| `deep`      | In-depth   | ≥ 8 min   |

The 6–7 minute range intentionally falls into neither bucket. Posts in that range are "neither quick nor deep" — no bucket is a correct characterisation. Users who don't filter see them; users filtering for quick or deep reads do not. This is the correct behaviour.

#### Consequences

- ✅ No future implementation session required to activate any feature
- ✅ Portfolio evolves automatically as the writing index grows
- ⚠️ Tag filter threshold (2 qualifying tags with 2+ posts each) must be re-evaluated at 20+ posts — may warrant lowering to 1 qualifying tag

---

### DEC-056 — Writing Index URL Contract and `use client` Ledger Entry

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture / UX

#### Context

Filter state must live in the URL per the pattern established in DEC-025. The writing system introduces three filter dimensions (tag, readTime, sort) that require a defined URL contract. The filter bar interaction requires `use client` — this entry defines the minimum client boundary and adds it to the ledger.

#### URL Contract

```
/writing?tag=Architecture&readTime=quick&sort=oldest&page=2
```

| Param      | Values                         | Default          | Notes                                              |
| ---------- | ------------------------------ | ---------------- | -------------------------------------------------- |
| `tag`      | Any string matching a post tag | null (no filter) | Unknown tags silently coerced to null              |
| `readTime` | `quick` \| `deep`              | null (no filter) | Other values coerced to null                       |
| `sort`     | `oldest`                       | null (newest)    | `newest` is never a param — absence is the default |
| `page`     | Integer ≥ 1                    | 1                | Clamped to [1, totalPages]                         |

#### `use client` boundary

**`WritingFilterBar`** — scoped to the filter control row only. Justification: `useRouter` for `router.push` on filter interaction. `WritingIndex` (RSC) receives `WritingFilterBar` as a child — the RSC/client boundary is at the filter bar component level, not the index level.

**`WritingFilterBar` is added to the `use client` ledger in `AI_CONTEXT.md`:**

```
WritingFilterBar | useRouter → router.push on filter/sort interaction | DEC-056
```

#### Page reset on filter change

Changing any filter param resets `page` to 1. This is enforced in `WritingFilterBar`'s `navigate()` helper — the page param is never carried forward on a filter change. This prevents the "filtered to 1 result on page 3" state.

#### Consequences

- ✅ Filter state is bookmarkable and shareable — URL is source of truth
- ✅ `WritingIndex` stays RSC — client boundary scoped to filter bar only
- ✅ Search engines index filtered views correctly
- ⚠️ Array params (`?tag=A&tag=B`) are rejected — first value wins per `parseWritingFilters`
- ⚠️ `sort=newest` is not a valid param — callers must omit sort for the default

---

## use client Ledger — Writing System Additions

| Component          | Justification                                          | Decision |
| ------------------ | ------------------------------------------------------ | -------- |
| `WritingFilterBar` | `useRouter` → `router.push` on filter/sort interaction | DEC-056  |

---

## 6. Proposed Amendments

> No amendments currently proposed.

---

## 7. Superseded Decisions

> None at this time.

---

## 8. Deprecated Decisions

> None at this time.
