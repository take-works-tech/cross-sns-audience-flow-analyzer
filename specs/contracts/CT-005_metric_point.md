---
status: active
updated: 2026-08-29
---

# Contract: MetricPoint

### CT-005 - MetricPoint
- purpose: one row of the TimescaleDB hypertable (E-012 (T2)) — the unit of every @Metric series that the sync workers write and the analysis core reads
- schema: schema/CT-005.json
- version: 1.0.0
- strictness: unknown keys rejected at the ingestion boundary; the hypertable columns are fixed by migration, so an unexpected key means the fetcher and the store disagree
- compatibility: columns are additive only — rows written under any earlier version stay valid under every later one, so readers never branch on row age
- migration: Alembic forward-only migrations, run by deploy before the new engine starts; a failed migration halts the deploy and the previous image keeps serving
- decidedness: Bounded

Semantics the schema cannot carry:

- `ts` is the platform-reported observation time in UTC, not the fetch time; estimation aligns series on `ts`
- `fetch_batch_id` groups the rows of one sync run, for dedup and for the deferral accounting that keeps YouTube inside LIM-011
- rows outlive their @Connection — disconnect deletes tokens and stops fetching, but ingested series remain until the user deletes them
- one (`node_id`, `metric`, `ts`) triple holds at most one row; a re-fetch overwrites in place rather than duplicating
