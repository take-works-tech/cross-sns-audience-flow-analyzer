---
status: active
updated: 2026-08-29
---

# Contract: UrlClassification

### CT-007 - UrlClassification
- purpose: the engine's answer to a pasted URL — normalization, @Platform match, @Node kind, and the @Metadata fetch state that decides whether the node is complete or provisional
- schema: schema/CT-007.json
- version: 1.0.0
- strictness: unknown fields rejected
- compatibility: same-build client and server only (CT-008)
- migration: none — classifications are recomputed on demand; only the @Node created from one (CT-001) persists
- decidedness: Bounded

Semantics the schema cannot carry:

- `normalized_url` is the cache and dedup key: the same normalized URL requested again within LIM-007 answers from cache without contacting the target site
- `metadata.state` is `pending` when the LIM-006 timeout elapsed — the node is created provisional, marked title-pending, with manual retry offered; `failed` carries `metadata.reason`
- `metadata.source` records which path filled the fields: `opengraph` (E-015 (T1)) first, the `oembed` fallback (E-016 (T1)) second; null while state is `pending`
- `platform` is null and `resource_kind` is `generic` when the URL is well-formed but matches no known @Platform pattern
- `resource_kind` values map one-to-one onto the `kind` values of CT-001
