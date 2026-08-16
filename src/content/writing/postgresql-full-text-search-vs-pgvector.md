---
title: "pgvector vs full-text search: choosing the right PostgreSQL search strategy"
summary: "Full-text search and vector similarity search answer different questions. Picking the wrong one produces a system that works in testing and fails the user in production."
published: "2026-05-12"
tags: ["PostgreSQL", "Database", "EdTech"]
project: "gradeforge"
---

I built a document retrieval system for an academic platform. The initial requirement was search — students should be able to find course materials by topic, keyword, or concept. Simple enough. The implementation decision turned out to be neither simple nor obvious.

The instinct was to reach for semantic search with vector embeddings, because that is what the recent discourse recommends. After building and testing both approaches against the actual query patterns, the answer was a hybrid — but not for the reasons I expected.

## What full-text search actually does

PostgreSQL's built-in full-text search uses `tsvector` and `tsquery` with a GIN index. The mechanism: documents are reduced to a set of normalised lexemes (stemmed, stopword-filtered root forms), and queries match against those lexemes.

```sql
-- Create a tsvector column for search
ALTER TABLE documents ADD COLUMN search_vector tsvector;

-- Populate it — combining title (weight A) and content (weight B)
UPDATE documents SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'B');

-- GIN index on the tsvector column
CREATE INDEX idx_documents_search ON documents USING GIN(search_vector);

-- Keep it current on insert/update
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_search_vector_update
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

Querying with ranking:

```sql
SELECT
  id,
  title,
  ts_rank(search_vector, query) AS rank
FROM documents,
  to_tsquery('english', 'database & indexing') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

The `ts_rank` function ranks results by how frequently the query terms appear and their weighted position (A > B > C > D). A document where "database indexing" appears in the title ranks higher than one where it appears only in the body.

**What full-text search is good at:** exact keyword matching, known terminology, technical documentation, proper nouns, code identifiers. A student searching for "CGPA calculation" or "B-tree index" gets exactly what they asked for.

**Where it fails:** synonyms, paraphrasing, conceptual queries. "What is the memory organisation of a computer?" does not match a document about "RAM architecture and cache hierarchy" — the lexemes do not overlap. The student knows what they mean; the search engine does not.

## What vector search actually does

`pgvector` stores dense vector embeddings alongside your data and queries by cosine similarity (or L2 distance). An embedding is a fixed-length numerical vector where semantic proximity maps to geometric proximity.

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column
ALTER TABLE documents ADD COLUMN embedding vector(1536);
-- 1536 dimensions = OpenAI text-embedding-3-small output size

-- HNSW index for approximate nearest neighbor search
-- Trades perfect recall for query speed — acceptable for most use cases
CREATE INDEX idx_documents_embedding ON documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

Generating and storing embeddings:

```js
// Batch embedding generation — runs once per document at ingest time
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8191), // token limit
  });
  return response.data[0].embedding;
}

async function indexDocument(doc) {
  const embeddingInput = `${doc.title}\n\n${doc.content.slice(0, 4000)}`;
  const embedding = await generateEmbedding(embeddingInput);

  await db.query("UPDATE documents SET embedding = $1 WHERE id = $2", [
    JSON.stringify(embedding),
    doc.id,
  ]);
}
```

Querying by semantic similarity:

```sql
-- Query embedding generated from the user's search string
SELECT
  id,
  title,
  1 - (embedding <=> $1::vector) AS similarity
FROM documents
WHERE 1 - (embedding <=> $1::vector) > 0.75  -- similarity threshold
ORDER BY embedding <=> $1::vector  -- cosine distance, ascending
LIMIT 10;
```

**What vector search is good at:** conceptual queries, paraphrasing, cross-domain retrieval, finding documents the user cannot precisely name. "How does memory work?" retrieves documents about RAM, cache, and virtual memory even if the query contains none of those words.

**Where it fails:** precision retrieval of specific terms. An embedding for "B-tree index" and "hash index" may be similar enough that searching for one returns both — correct semantically, wrong for the user who knows exactly which index type they need. Proper nouns and technical identifiers are particularly problematic — the embedding model may not have seen them in training and produces noisy representations.

## The right question to ask

Before choosing a strategy, determine what the user's query represents:

| Query type          | Example                         | Better strategy  |
| ------------------- | ------------------------------- | ---------------- |
| Known term lookup   | "CGPA formula Nigeria"          | Full-text search |
| Identifier search   | "CSC 301", "Professor Adeyemi"  | Full-text search |
| Conceptual query    | "how grades are calculated"     | Vector search    |
| Paraphrased concept | "cumulative average for degree" | Vector search    |
| Mixed intent        | "GPA calculation methods"       | Hybrid           |

For the academic platform, the query patterns were mixed. Students searching with exact course codes and lecturer names needed keyword precision. Students exploring topics they could not precisely name needed semantic retrieval. Both patterns appeared in the actual search logs.

## Hybrid search

Hybrid search combines both signals: full-text rank and vector similarity, fused into a single score.

The standard approach is Reciprocal Rank Fusion (RRF) — it combines ranked lists without requiring the scores to be on the same scale:

```sql
-- Hybrid search using RRF
WITH
fts AS (
  -- Full-text search results with rank positions
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY ts_rank(search_vector, fts_query) DESC) AS rank
  FROM documents, to_tsquery('english', $2) AS fts_query
  WHERE search_vector @@ fts_query
  LIMIT 50
),
semantic AS (
  -- Vector similarity results with rank positions
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS rank
  FROM documents
  WHERE 1 - (embedding <=> $1::vector) > 0.6
  LIMIT 50
)
SELECT
  COALESCE(fts.id, semantic.id) AS id,
  -- RRF score: 1/(k + rank), summed across both result sets
  -- k=60 is the standard constant — dampens outlier rank differences
  COALESCE(1.0 / (60 + fts.rank), 0) +
  COALESCE(1.0 / (60 + semantic.rank), 0) AS rrf_score
FROM fts
FULL OUTER JOIN semantic ON fts.id = semantic.id
ORDER BY rrf_score DESC
LIMIT 10;
```

The RRF formula `1 / (k + rank)` assigns diminishing returns to lower-ranked results. A document ranked 1st in full-text and 5th in semantic search scores higher than one ranked 3rd in both. Documents appearing in only one result set still contribute — the missing rank contributes 0.

RRF does not require normalising scores from different systems, which is what makes it practical. Comparing a `ts_rank` of 0.38 to a cosine similarity of 0.84 is meaningless. Comparing rank positions is not.

## Performance characteristics

With 200,000 documents:

| Strategy              | Index type | Query time (p95) | Index size |
| --------------------- | ---------- | ---------------- | ---------- |
| Full-text search      | GIN        | 8ms              | 180MB      |
| Vector search (exact) | None       | 890ms            | 1.1GB      |
| Vector search (HNSW)  | HNSW       | 22ms             | 1.4GB      |
| Hybrid (FTS + HNSW)   | GIN + HNSW | 31ms             | 1.6GB      |

The HNSW index is the critical piece for vector search at scale. Without it, pgvector performs an exact nearest-neighbor scan — O(n) across all embeddings. HNSW uses a hierarchical graph structure for approximate nearest-neighbor search, trading a small recall loss (typically 95-99% recall depending on `ef_search`) for logarithmic query time.

The hybrid approach costs roughly 31ms — slightly more than HNSW alone because of the FULL OUTER JOIN, but within acceptable range for a search endpoint. The quality improvement over either approach alone was measurable in user testing: more relevant results for conceptual queries, more precise results for known-term queries.

## The operational cost that is easy to miss

Vector search has an embedding generation cost that full-text search does not.

Every document must be embedded at ingest time. This costs API calls (or GPU compute if self-hosted). Re-embedding is required if you change the embedding model — a model migration means regenerating vectors for your entire corpus.

Every search query must also be embedded before the similarity search runs. For a fast response, the embedding call must be low-latency — `text-embedding-3-small` averages 80ms on a warm connection. That 80ms adds to every search response time.

```js
// The full search pipeline latency budget
// text-embedding-3-small: ~80ms
// HNSW query: ~22ms
// Network + serialization: ~10ms
// Total p50: ~115ms

// With FTS fallback (no embedding wait):
// GIN query: ~8ms
// Network: ~5ms
// Total p50: ~13ms
```

For applications where the corpus is relatively static and queries are conceptual, the embedding cost is worth it. For applications where queries are keyword-oriented and documents are updated frequently, full-text search is simpler, faster, cheaper, and more precise.

For the academic platform, the hybrid approach was correct — but the embedding generation cost was a non-trivial operational line item that I had not fully accounted for in the initial estimate.
