---
status: active
updated: 2026-08-29
---

# Modules and dependency direction

The vertical split is capability (one module, one spec area). The horizontal split is layer.
Dependencies point downward only; an upward dependency is a defect, not a shortcut. Nothing imports
the web client. A change inside one module is reviewed inside that module; the modules that list it
in `depends_on` are the blast radius of that change.

## Layers, top to bottom

| Layer | May depend on | Modules |
|---|---|---|
| web | contract | MOD-001 |
| contract | service (generation time only) | MOD-005 |
| service | domain, data | MOD-002, MOD-003 |
| domain | data | MOD-004 |
| data | nothing | MOD-006 |

## Modules

### MOD-001 - Web client (apps/web)
- layer: web
- owns: three-pane UI, @Canvas rendering and interaction, @Flow animation overlay, @Unplaced node list, detail panel, client state
- depends_on: MOD-005
- notes: reaches the engine only through the generated client in MOD-005 (INV-009); never holds a platform token (INV-001)
- decidedness: Bounded

### MOD-002 - Engine API (FastAPI)
- layer: service
- owns: HTTP surface, app auth and per-user authorization (INV-004), @Project and @Connection persistence, platform OAuth callbacks and token storage, the OpenAPI source that CT-008 freezes
- depends_on: MOD-004, MOD-006
- decidedness: Bounded

### MOD-003 - Engine workers (Celery + beat)
- layer: service
- owns: scheduled @Metric series ingestion, @Recalculation jobs, @Metadata fetch execution, retry and deferral bookkeeping
- depends_on: MOD-004, MOD-006
- decidedness: Bounded

### MOD-004 - Analysis core (pandas, numpy, scipy)
- layer: domain
- owns: @Observed flow mapping from @Traffic source rows, @Estimated flow lag correlation, @Confidence scoring, @Lag reporting; pure computation, no HTTP and no scheduling
- depends_on: MOD-006
- decidedness: Bounded

### MOD-005 - Shared contracts (packages/contracts)
- layer: contract
- owns: the frozen OpenAPI file for CT-008, the generated TypeScript client and types, shared limit constants (planned:packages/contracts/src/limits.ts)
- depends_on: MOD-002 (generation time only; no runtime import)
- decidedness: Bounded

### MOD-006 - Datastores (Postgres + TimescaleDB, Redis)
- layer: data
- owns: relational persistence, the @Metric series hypertable (CT-005), Redis cache and job queues
- depends_on: nothing
- decidedness: Bounded

Before adding a dependency, in order: push the shared thing down into a common module, lift it up
into the shell, or accept that the two modules are really one. **Bidirectional dependency is never
allowed** - if neither direction can be removed, a third module is waiting to be extracted.
