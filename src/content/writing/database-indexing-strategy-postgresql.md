---
title: "PostgreSQL indexing strategy: what EXPLAIN ANALYZE is actually telling you"
summary: "Most PostgreSQL performance problems are indexing problems. Reading EXPLAIN ANALYZE correctly and knowing which index type to reach for closes the gap between a query that works and one that scales."
published: "2026-05-08"
tags: ["PostgreSQL", "Database", "Performance"]
---

A query that takes 800ms in development and 12 seconds in production is almost always an indexing problem. The data shape is different, the plan the query planner chose changed, and the developer who wrote the query never read the execution plan.

Reading `EXPLAIN ANALYZE` output is not optional for engineers who write SQL that runs in production. This is how to do it correctly.

## What EXPLAIN ANALYZE outputs

```sql
EXPLAIN ANALYZE
SELECT e.*, c.credit_units
FROM enrollments e
JOIN courses c ON c.id = e.course_id
WHERE e.student_id = 'abc-123'
  AND e.session = '2023/2024';
```

Abbreviated output:

```
Hash Join  (cost=8.32..24.17 rows=12 width=64) (actual time=0.842..1.203 rows=15 loops=1)
  Hash Cond: (e.course_id = c.id)
  ->  Seq Scan on enrollments e  (cost=0.00..15.80 rows=12 width=48)
            (actual time=0.021..0.634 rows=15 loops=1)
        Filter: ((student_id = 'abc-123') AND (session = '2023/2024'))
        Rows Removed by Filter: 8423
  ->  Hash  (cost=4.20..4.20 rows=120 width=16)
            (actual time=0.185..0.185 rows=120 loops=1)
        ->  Seq Scan on courses c  (cost=0.00..4.20 rows=120 width=16)
                (actual time=0.008..0.092 rows=120 loops=1)
Planning Time: 0.312 ms
Execution Time: 1.247 ms
```

The critical line is `Seq Scan on enrollments e ... Rows Removed by Filter: 8423`. PostgreSQL read all 8,438 enrollment rows to return 15. As the table grows to 100,000 rows, this query reads 100,000 rows to return the same 15. The execution time scales linearly with the table size.

**The vocabulary you need:**

| Node                 | Meaning                                                       |
| -------------------- | ------------------------------------------------------------- |
| `Seq Scan`           | Full table read — all rows examined                           |
| `Index Scan`         | Index consulted, heap fetched for matching rows               |
| `Index Only Scan`    | Index covers all needed columns — no heap fetch               |
| `Bitmap Heap Scan`   | Multiple index entries collected, heap fetched in bulk        |
| `cost=X..Y`          | Estimated: X = startup cost, Y = total cost (planner's guess) |
| `actual time=X..Y`   | Measured: X = first row returned, Y = all rows returned       |
| `rows=N` (in cost)   | Planner's estimate of matching rows                           |
| `rows=N` (in actual) | True count — divergence here means stale statistics           |

A `Seq Scan` is not always wrong — on a small table, it is faster than an index lookup. The problem is when `Rows Removed by Filter` is large relative to returned rows.

## Composite index column order matters

The most common indexing mistake: creating a composite index with columns in the wrong order.

```sql
-- Existing index
CREATE INDEX idx_enrollments_session_student
  ON enrollments (session, student_id);

-- Query that does NOT use it effectively
SELECT * FROM enrollments
WHERE student_id = 'abc-123';
-- Seq scan — the index starts with session, student_id alone can't use it
```

PostgreSQL's composite index uses a **leftmost prefix** rule. An index on `(session, student_id)` can be used by:

- Queries filtering on `session` alone
- Queries filtering on `session` AND `student_id`

It cannot be used by queries filtering on `student_id` alone. The left column is the first sorted dimension.

```sql
-- Correct index for the primary query pattern
CREATE INDEX idx_enrollments_student_session
  ON enrollments (student_id, session);

-- Now this uses the index effectively
SELECT * FROM enrollments
WHERE student_id = 'abc-123'
  AND session = '2023/2024';
-- Index Scan — student_id narrows the range, session narrows further

-- And so does this
SELECT * FROM enrollments
WHERE student_id = 'abc-123';
-- Index Scan — leftmost prefix used alone
```

**Column order heuristic:** highest-cardinality column first when queries filter on both, unless one column is consistently an equality condition and one is a range — then equality first, range second.

```sql
-- Equality on status, range on created_at
CREATE INDEX idx_orders_status_created
  ON orders (status, created_at);

-- Uses index efficiently
SELECT * FROM orders
WHERE status = 'pending'
  AND created_at > NOW() - INTERVAL '7 days';
```

## Partial indexes: index what you actually query

A partial index covers only rows matching a `WHERE` clause. For tables with a small "active" subset that accounts for most queries, a partial index is dramatically smaller and faster than a full index.

```sql
-- Full table: 500,000 orders
-- Active orders (status = 'pending'): 3,200

-- Full index — covers all 500,000 rows
CREATE INDEX idx_orders_created ON orders (created_at);

-- Partial index — covers 3,200 rows
CREATE INDEX idx_orders_pending_created ON orders (created_at)
  WHERE status = 'pending';
```

The partial index is roughly 99% smaller. The planner chooses it automatically for queries that filter on `status = 'pending'`:

```sql
-- Uses the partial index
SELECT * FROM orders
WHERE status = 'pending'
  AND created_at > NOW() - INTERVAL '1 hour';

-- Falls back to a full scan or full index
-- (partial index is not applicable)
SELECT * FROM orders
WHERE status = 'shipped'
  AND created_at > NOW() - INTERVAL '1 hour';
```

Practical applications: soft-deleted records (`WHERE deleted_at IS NULL`), status-driven queues (`WHERE status = 'pending'`), recent data (`WHERE created_at > '2025-01-01'`).

## Covering indexes: eliminating heap fetches

An `Index Scan` in PostgreSQL involves two steps: look up matching entries in the index, then fetch the actual row data from the heap (the main table storage). The heap fetch is a random I/O operation — it can be slow when many rows match or when the heap is large.

An `Index Only Scan` eliminates the heap fetch by storing all needed column values in the index itself.

```sql
-- Query: student name and score for a session
SELECT s.name, e.score
FROM enrollments e
JOIN students s ON s.id = e.student_id
WHERE e.student_id = 'abc-123'
  AND e.session = '2023/2024';
```

If the query only needs `student_id`, `session`, and `score`, an index that includes all three columns can satisfy it without touching the heap:

```sql
-- Covering index — includes score in addition to the filter columns
CREATE INDEX idx_enrollments_student_session_score
  ON enrollments (student_id, session)
  INCLUDE (score);
```

The `INCLUDE` clause (PostgreSQL 11+) adds non-indexed columns to the leaf pages of the index. They cannot be used for filtering or ordering, but they can be returned directly — no heap fetch required.

```sql
EXPLAIN ANALYZE
SELECT student_id, session, score
FROM enrollments
WHERE student_id = 'abc-123'
  AND session = '2023/2024';

-- Output includes:
-- Index Only Scan using idx_enrollments_student_session_score
-- Heap Fetches: 0
```

`Heap Fetches: 0` confirms the index is covering the query entirely.

## The indexing workflow

When a query is slow, the investigation follows a fixed sequence:

```sql
-- 1. Run EXPLAIN ANALYZE — never EXPLAIN alone (estimates only)
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT ...;

-- 2. Look for Seq Scan with high Rows Removed by Filter
-- 3. Check whether an index exists on the filter columns
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'enrollments';

-- 4. Check table statistics — stale stats produce bad plans
SELECT relname, last_analyze, last_autoanalyze, n_live_tup
FROM pg_stat_user_tables
WHERE relname = 'enrollments';

-- 5. Manually update statistics if stale
ANALYZE enrollments;

-- 6. Create the index and re-run EXPLAIN ANALYZE
CREATE INDEX CONCURRENTLY idx_enrollments_student_session
  ON enrollments (student_id, session);
-- CONCURRENTLY builds without locking the table — use this in production
```

`EXPLAIN (ANALYZE, BUFFERS)` adds `Buffers: shared hit=N read=N` to every node. `read` means disk I/O; `hit` means the page was already in PostgreSQL's buffer cache. A high `read` count on a node that runs frequently is a cache pressure problem — the working set exceeds `shared_buffers`.

## When not to add an index

Indexes have write overhead. Every `INSERT`, `UPDATE`, and `DELETE` on a table must update all indexes on that table. A table with 12 indexes pays 12 write costs per mutation.

Add an index when: the query runs frequently, the table is large, the query filters on the indexed column(s), and the filtered subset is meaningfully smaller than the full table.

Do not add an index on: low-cardinality columns used alone (`true/false`, `status` with 2 values), tables with fewer than a few thousand rows (seq scan wins), columns rarely used as filter predicates, or tables that are write-heavy and read-rarely.

The query planner makes the decision — but it makes it based on the indexes available and the statistics it has. Your job is to give it the right index and keep the statistics current.
