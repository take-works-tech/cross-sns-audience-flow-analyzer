---
status: active
updated: 2026-08-29
---

# Decisions

Project-level decisions and why the alternatives lost. A feature-level choice belongs in that
feature's spec; this file holds the ones that constrain more than one feature. The Open questions
section defines OPEN-001..OPEN-007, the single place every `open:` attribute resolves to.

**A superseded decision is marked, never deleted.** Delete it and the next agent re-proposes the
option that already lost, because nothing records that it lost.

### XC-070 - Monorepo with three surfaces
- decided: 2026-08-29
- status: active
- decision: one pnpm-workspace repository: apps/web (Next.js App Router application, E-010 (T2)), services/engine (FastAPI API plus Celery workers), packages/contracts (frozen OpenAPI document, generated TypeScript client, shared limit constants); module boundaries and import direction are MOD-001..MOD-006 in 01_boundaries.md
- alternatives: separate frontend and backend repositories lost — the contract (CT-008) must version atomically with both of its sides, and a polyrepo makes contract drift the default state; Nx or Turborepo lost — pnpm workspaces cover the need without a second build system to maintain
- affects: MOD-001, MOD-002, MOD-003, MOD-004, MOD-005, MOD-006, CT-008
- decidedness: Bounded

### XC-071 - React Flow for the graph canvas
- decided: 2026-08-29
- status: active
- decision: the @Canvas is built on `@xyflow/react` v12: one custom React component per @Node kind, built-in pan, zoom, and selection, and edge geometry from its bezier path utilities, which the @Flow animation overlay samples
- alternatives: Cytoscape.js lost — its nodes are canvas-drawn, so the kind-specific card designs of canvas/REQ-002 would be rebuilt as sprites without React composition; D3 from scratch lost — re-implements drag, zoom, and hit-testing that React Flow already ships; Sigma.js (WebGL) lost — buys scale far beyond LIM-001 and LIM-002 at the cost of DOM node rendering, which the node cards require
- basis: E-009 (T2)
- affects: canvas/REQ-001, canvas/REQ-002, canvas/REQ-003, flow-animation/REQ-001
- decidedness: Fixed

### XC-072 - Particles on one canvas overlay, not SVG or DOM
- decided: 2026-08-29
- status: active
- decision: the @Flow animation renders every @Particle on a single full-viewport canvas element kept in sync with the React Flow viewport transform, sampling @Edge bezier paths (E-009 (T2)); per-frame control is what lets the governor of flow-animation/REQ-002 degrade quality stepwise
- alternatives: one SVG or DOM element per @Particle lost — thousands of retained elements break the LIM-003 frame budget well before the LIM-016 ceiling; CSS offset-path animation lost — no per-frame control, so stepwise degradation at the LIM-004 floor cannot be enforced; WebGL particle system lost — named out of scope for r1 in the flow-animation spec, and unnecessary at LIM-016 scale
- basis: E-001 (T1), E-009 (T2)
- affects: LIM-016, flow-animation/REQ-001, flow-animation/REQ-002
- decidedness: Fixed

### XC-073 - TimescaleDB hypertables for metric storage
- decided: 2026-08-29
- status: active
- decision: every @Metric series row (CT-005) lives in a TimescaleDB hypertable on PostgreSQL; time partitioning, retention, and time-bucket aggregation come from the extension (E-012 (T2))
- alternatives: vanilla PostgreSQL lost — hand-built partitioning and window queries duplicate what hypertables provide; InfluxDB lost — a second datastore and query language for data that must join relational @Project and @Node rows; ClickHouse lost — operational weight beyond a single-team MVP
- basis: E-012 (T2)
- affects: CT-005, MOD-006
- decidedness: Fixed

### XC-074 - Celery workers with beat scheduling
- decided: 2026-08-29
- status: active
- decision: engine background work runs on Celery workers over a Redis broker; celery beat drives the LIM-010 ingestion schedule (E-013 (T2)); @Recalculation jobs (CT-006) are Celery tasks debounced per LIM-009
- alternatives: RQ lost — no built-in periodic scheduler, so beat would be rebuilt by hand; BullMQ lost — moves worker code into Node and away from the pandas analysis core (MOD-004); in-process APScheduler lost — dies with the API process and cannot scale workers independently of it
- basis: E-013 (T2)
- affects: MOD-003, CT-006, LIM-009, LIM-010, sns-connection/REQ-002, flow-analysis/REQ-003
- decidedness: Fixed

### XC-075 - Auth.js for app login
- decided: 2026-08-29
- status: active
- decision: end-user login uses Auth.js v5 in apps/web with two providers, Google OAuth and email magic link (E-014 (T2)); platform-side OAuth for each @Connection is a separate server-side flow in the engine and never shares tokens or sessions with app login (INV-001, INV-010)
- alternatives: hand-rolled sessions lost — re-implements CSRF defense, token rotation, and provider quirks a maintained library covers; Clerk and Auth0 lost — per-user pricing and a hosted dependency for exactly two providers; Keycloak lost — operating an identity server outweighs the requirement
- basis: E-014 (T2)
- affects: MOD-001, INV-004, INV-010
- decidedness: Fixed

### XC-076 - Backend-first behind a frozen OpenAPI contract
- decided: 2026-08-29
- status: active
- decision: build order follows docs/development-stack.md: data model, then the complete engine API with tests, then the OpenAPI 3.1 document FastAPI generates (E-011 (T2)) is frozen into packages/contracts (CT-008), and apps/web is built only against the TypeScript client generated from it (INV-009)
- alternatives: frontend-first against mocks lost — the mock becomes an unversioned second contract that drifts from the engine; both sides free-running lost — every engine change breaks the web build mid-flight; GraphQL lost — a second contract technology when OpenAPI generation is native to the chosen backend
- basis: E-011 (T2)
- affects: MOD-005, CT-008, INV-009
- decidedness: Fixed

### XC-077 - Calm-instrument design system
- decided: 2026-08-29
- status: active
- decision: dark-first UI with light and high-contrast themes from CSS-variable tokens; cool zinc neutrals; one cyan accent reserved for interactive elements and @Observed flow; @Estimated flow is always dashed and desaturated (INV-003); 4px spacing grid; 8px card and 6px control radii; 1px borders instead of shadows; lucide icons only; motion within LIM-018, particles the only continuous animation; forbidden outright: purple-pink gradients, glassmorphism, emoji in UI, marketing-hero layouts, decorative shadows. Latitude inside these bounds is judged by 04_principles.md, XC-001 first
- alternatives: stock shadcn/ui theming lost — undifferentiated, and not tuned for an instrument where the graph must outrank the chrome; dashboard-template styling lost — competes with the @Canvas for attention, against XC-001; platform brand colors as theme lost — brand color stays node identity only, or text contrast falls under LIM-017
- affects: INV-003, LIM-017, LIM-018, canvas/REQ-002, edges/REQ-004
- decidedness: Bounded

## Open questions

### OPEN-001 - X API tier at launch
- question: which X API tier is supported at launch? Read caps under credit-based pricing may force X to @Estimated flow only with on-demand reads, or out of r1 entirely (E-006 (T1))
- where: specs/features/sns-connection/spec.md, specs/06_external.md
- status: active

### OPEN-002 - Instagram insights without advanced access
- question: which Instagram insights metrics are obtainable without App Review advanced access, and does the answer change the capability label between @Observed flow and @Estimated flow (E-004 (T1))?
- where: specs/features/sns-connection/spec.md, evidence/sources.md
- status: active

### OPEN-003 - Sample-data onboarding project
- question: what dataset ships as the sample-data onboarding project of v1.0 §16.1?
- where: specs/features/projects/spec.md, specs/11_ui.md
- status: active

### OPEN-004 - Auto-layout algorithm
- question: which auto-layout algorithm backs the layout toggle of canvas/REQ-001 — dagre, elkjs, or d3-force — given the overlap-avoidance requirement?
- where: specs/features/canvas/spec.md, specs/09_technology.md
- status: active

### OPEN-005 - Estimated person count model
- question: how is correlation strength converted into an estimated person count — rate-only display, or a modeled absolute count?
- where: specs/features/flow-analysis/spec.md
- status: active

### OPEN-006 - TikTok historical series
- question: which TikTok Display API fields provide historical view series usable for estimation, and at what granularity (E-005 (T1))?
- where: specs/features/sns-connection/spec.md, specs/06_external.md
- status: active

### OPEN-007 - Production cloud provider
- question: which cloud provider and managed-service split (database, Redis, container runtime) hosts production?
- where: specs/10_delivery.md
- status: active

To retire a decision, set `status: superseded` and name its replacement in `superseded_by`; leave
everything else in place. The record of a decision that turned out wrong says the ground was already
walked.
