// lib/data/lab.js
//
// Lab entry data. Schema defined per DEC-038.
// Every field is required unless marked optional.
//
// Content fields (entry.*) must be populated with real content before
// /lab is linked in site navigation — mirrors the writing section rule
// from DEC-010.
//
// STATUS ENUM
//   "active"    — experiment is ongoing
//   "complete"  — concluded with documented findings
//   "abandoned" — stopped, with honest documentation of why
//
// TYPE ENUM
//   "experiment"    — hypothesis-driven technical investigation
//   "tool"          — utility built for a specific problem
//   "visualization" — data or system made visible
//   "exploration"   — open-ended investigation of a technology or pattern

export const LAB_ENTRIES = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    slug: "offline-sync-conflict-resolution",
    title: "Conflict Resolution Strategies for Offline-First Sync",
    summary:
      "Tested three conflict resolution approaches for data sync under intermittent connectivity to determine which preserved user intent without data loss.",
    type: "experiment",
    status: "complete",
    tags: ["Offline-first", "CRDTs", "IndexedDB", "Sync", "PWA", "JavaScript"],
    year: "2025",
    featured: true,

    entry: {
      exploration:
        "I was building an offline-first application for users on unreliable mobile networks — the kind of connectivity common in West Africa where requests drop mid-flight, devices switch between data and WiFi without warning, and sync windows are short and unpredictable. The standard advice is last-write-wins. I didn't trust it. I wanted to test three approaches against each other before committing to one: last-write-wins with timestamps, a field-level merge strategy, and a simplified operational transform approach where the intent of the write — not just the value — is preserved. The hypothesis was that timestamp-based resolution would fail in practice because device clocks on budget Android phones are frequently skewed by minutes, sometimes by hours.",

      findings:
        "The hypothesis was correct, but the failure mode was worse than I expected. Last-write-wins with device timestamps silently discarded valid writes whenever two devices had clock drift beyond the sync window — which happened on roughly 30% of test device pairs. The field-level merge strategy handled concurrent edits to different fields correctly but produced nonsensical results when two users edited the same field with opposing intent: a quantity field decremented by one user and incremented by another resolved to the later timestamp's value, which could be either. The operational transform approach was the only one that preserved intent across all test cases, but it required a server-authoritative operation log to order concurrent writes. Without the log, OT degrades to last-write-wins anyway. The real finding was that the choice of conflict strategy is inseparable from the server architecture — you cannot choose a client strategy without first deciding what the server will guarantee.",

      influenced:
        "The offline-first project adopted server-authoritative operation logging with intent-based conflict resolution at the field level. We eliminated device timestamps as a tiebreaker entirely and used server-assigned sequence numbers instead. The sync implementation is more complex than last-write-wins, but it is correct — and correctness was the constraint that could not be traded away.",
    },

    demoUrl: "",
    repoUrl: "",
    sourceUrl: "https://josephg.com/blog/crdts-are-the-future/",
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    slug: "pgvector-latency-under-corpus-growth",
    title: "pgvector Latency as Document Corpora Scale",
    summary:
      "Measured how pgvector query latency degrades as a document corpus grows from 200 to 10,000 embeddings, and whether HNSW indexing could hold sub-200ms p95 at production scale.",
    type: "experiment",
    status: "complete",
    tags: [
      "pgvector",
      "PostgreSQL",
      "HNSW",
      "Embeddings",
      "Search",
      "Performance",
    ],
    year: "2025",
    featured: true,

    entry: {
      exploration:
        "ScholarHive uses pgvector for semantic document search against an academic corpus. At 200 documents, search felt instant. The question I needed to answer before scaling the document ingestion pipeline was: at what corpus size does pgvector cease to be viable without dedicated search infrastructure, and can HNSW indexing extend that threshold enough to avoid introducing a second service? The naive assumption is that latency scales with document count. I suspected the real variable was embedding dimensionality times corpus size — not document count alone. I seeded test corpora at 200, 1,000, 2,500, 5,000, and 10,000 documents using text-embedding-3-small (1,536 dimensions) and measured p50, p95, and p99 query latency at each size with and without HNSW indexing.",

      findings:
        "Without HNSW, latency was acceptable at 200 documents (p95: 38ms) but degraded sharply past 2,500 (p95: 340ms) and became untenable at 10,000 (p95: 1,140ms). The degradation curve was superlinear — each doubling of corpus size increased latency by roughly 2.4x, not 2x, which matched the dimensionality-aware cost model. With HNSW indexing (m=16, ef_construction=64), p95 stayed under 140ms at every corpus size up to 10,000 documents. The cost was recall: HNSW returned the approximate nearest neighbours, not exact ones. At ef_search=40, recall against exact results was 94% — acceptable for document discovery, unacceptable for anything requiring exact match. The other finding was that HNSW index build time at 10,000 documents and 1,536 dimensions took 4.2 minutes on a Neon serverless instance — which means index rebuild cannot happen inline with ingestion at any meaningful scale.",

      influenced:
        "ScholarHive's ingestion pipeline was redesigned to build the HNSW index asynchronously after batch ingestion rather than incrementally per document. The recall tradeoff at ef_search=40 was accepted for semantic search — the use case is discovery, not exact retrieval. We deferred external search infrastructure until the corpus exceeds 50,000 documents, where the approximate recall loss would require revisiting.",
    },

    demoUrl: "",
    repoUrl: "",
    sourceUrl: "https://www.pgvector.com/docs/index-types",
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    slug: "suspense-boundary-granularity",
    title: "Suspense Boundary Granularity and Perceived Performance",
    summary:
      "Investigated whether fine-grained Suspense boundaries improve perceived performance in Next.js App Router even when they measurably reduce Lighthouse scores.",
    type: "exploration",
    status: "complete",
    tags: ["Next.js", "React", "Suspense", "RSC", "Streaming", "Performance"],
    year: "2026",
    featured: false,

    entry: {
      exploration:
        "Next.js App Router's streaming model allows components to be suspended individually while the rest of the page renders. The conventional guidance is to place Suspense boundaries coarsely — one per page section or per route — to avoid excessive streaming overhead. I wanted to test the perceptual opposite: whether wrapping each data-dependent component in its own boundary, even at the cost of more concurrent data fetches and a lower Lighthouse score, actually felt faster to users. The suspicion was that Lighthouse measures technical completeness — when the DOM is fully settled — but users evaluate loading differently: they care about when content becomes readable, not when the last element paints. Fine-grained boundaries let content appear progressively. Coarse boundaries produce a fast initial paint followed by a jarring flush of content.",

      findings:
        "Coarse boundaries (one Suspense per route) produced a Lighthouse Performance score of 94. Fine-grained boundaries (one per async data dependency) produced 89. The five-point gap was reproducible. But manual observation told a different story: the coarse boundary page felt slower because the entire content area was blank for 800ms before everything appeared at once. The fine-grained page showed a page skeleton immediately, then filled in sections over 600ms as each data fetch resolved. The result that surprised me was that this approach required careful fallback design to avoid layout shift. Fallbacks that do not match the rendered content dimensions cause CLS spikes that wipe out any perceptual gains. The boundary granularity is the right call; the fallback fidelity is where the work actually lives.",

      influenced:
        "Adopted fine-grained Suspense boundaries in ScholarHive's dashboard with high-fidelity skeleton fallbacks that match the rendered component dimensions. Lighthouse dropped by four points. Perceived performance is meaningfully better and CLS stayed within the 0.1 target because the fallbacks were sized correctly from the start.",
    },

    demoUrl: "",
    repoUrl: "",
    sourceUrl: "https://react.dev/reference/react/Suspense",
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    slug: "cgpa-scale-normalizer",
    title: "Programmatic CGPA Scale Normalizer",
    summary:
      "Attempted to build a tool that could normalize CGPA scores across Nigerian university grading scales without manual institution-by-institution configuration.",
    type: "tool",
    status: "abandoned",
    tags: ["JavaScript", "CLI", "Data normalization", "EdTech", "Tooling"],
    year: "2025",
    featured: false,

    entry: {
      exploration:
        "Nigerian universities operate across at least three distinct CGPA scales — 4.0, 5.0, and 7.0 — with non-uniform grade boundaries within each scale. A 3.5 on a 5.0 scale is not the same quality of result as a 3.5 on a 4.0 scale, and the conversion between them is not a simple proportion. While building GradeForge, I wanted a normalization layer that could take a raw CGPA, a source scale, and a target scale, and output a calibrated equivalent — something that could power cross-institution comparisons without requiring the user to know the boundary tables for every school. I started with a CLI that accepted scale identifiers and grade inputs, intending to encode NUC and institution-specific grade boundary tables as structured data.",

      findings:
        "The problem is not solvable programmatically without an authoritative, institution-level data source that does not exist in a machine-readable form. NUC publishes general scale specifications, but grade-to-GPA boundary tables — the actual lookup tables that convert a raw score like 68 to a grade point like 3.5 — vary per institution and are not published in any centralized, accessible registry. I spent two weeks manually transcribing boundaries from institutional handbooks, student union publications, and faculty documents before accepting that the data surface was too large and too inconsistent to encode accurately. The tool would have required ongoing manual maintenance per institution, which made it a content problem masquerading as an engineering one. The hardest version of the problem — cross-institution normalization with verified boundaries — is not a tool that can be built once and trusted.",

      influenced:
        "GradeForge was redesigned to treat each grading scale as a first-class, opinionated implementation rather than a parameterized normalization function. The 4.0, 5.0, and 7.0 scales each have their own boundary tables encoded directly and verified against multiple institutional sources. Cross-scale comparison was scoped out of the product entirely — a deliberate constraint that made the remaining scope trustworthy. Knowing what not to build was the outcome.",
    },

    demoUrl: "",
    repoUrl: "",
    sourceUrl: "",
  },
];

// ─── Utilities ───────────────────────────────────────────────────────────────
// All condition logic lives in lib/utils/lab.js — not in page.jsx.
// These are data accessors only.

/**
 * Returns all lab entries in index order.
 */
export function getAllLabEntries() {
  return LAB_ENTRIES;
}

/**
 * Returns entries marked as featured — used by the Home page Lab teaser.
 */
export function getFeaturedLabEntries() {
  return LAB_ENTRIES.filter((entry) => entry.featured);
}

/**
 * Returns a single entry by slug, or null if not found.
 * Used in /app/lab/[slug]/page.jsx.
 */
export function getLabEntryBySlug(slug) {
  return LAB_ENTRIES.find((entry) => entry.slug === slug) ?? null;
}

/**
 * Returns all slugs — used in generateStaticParams.
 */
export function getAllLabSlugs() {
  return LAB_ENTRIES.map((entry) => ({ slug: entry.slug }));
}
