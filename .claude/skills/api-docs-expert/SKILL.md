---
name: api-docs-expert
description: API documentation guardrail. Triggers: OpenAPI, Swagger, GraphQL schema, SDL, API documentation, contract, response_model.
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# API Documentation Guardrail

> verified: 2026-08-09. stability=stable. Re-verify quarterly via `cckit verify-skills`.

## Use when
- Authoring or reviewing OpenAPI / Swagger specs (REST) or GraphQL SDL.
- Setting up code-first (FastAPI, Nest, tRPC) vs schema-first toolchains.
- Adding contract tests or breaking-change detection in CI.

## Anti-patterns to refuse
- Do NOT ship endpoints that exist in code but are missing from the spec — undocumented endpoints become shadow APIs (no rate limit, no auth audit, no client SDK coverage).
- Do NOT document only the 200 response. Every endpoint MUST document 4xx error schemas (400, 401, 403, 404, 409, 422 as applicable) with a stable error envelope — clients cannot handle errors they did not know existed.
- Do NOT make a breaking change (remove field, narrow type, change required-ness, rename) without a version bump or a deprecation period — silent breakage breaks every client at once.
- Do NOT mix `camelCase` and `snake_case` in the same spec — pick one and enforce in CI. Consumer SDK generators do not normalise; you get both flavours leaking into client code.
- Do NOT publish a schema without `examples` for non-trivial requests — generated docs (Swagger UI, Redoc) become unusable without them, and contract tests have nothing to fixture against.

## Common pitfalls
- Code-first vs schema-first drift: code-first (FastAPI, NestJS decorators) regenerates the spec each build — easy to stay in sync but easy to silently break clients. Schema-first (write OpenAPI by hand, generate stubs) guarantees the contract but adds friction. Either way, run a CI job that diffs the spec against `main` and flags breaking changes (oasdiff, graphql-inspector).
- Optional vs required: OpenAPI defaults a field to optional unless listed in `required`. A field "always present in code" but missing from `required` lets clients code defensively (or crash). Add it.
- `additionalProperties: true` vs `false`: default `true` lets servers ship unexpected fields silently (good for forward-compat) but lets typos pass validation. For strict request bodies, set `false`.
- Examples vs defaults vs nullable: an `example` is documentation only; `default` is applied by some validators; `nullable: true` (OAS 3.0) or `type: ["string", "null"]` (OAS 3.1) are different things across spec versions.
- Contract testing: a spec is worthless if nothing checks the server obeys it. Add schemathesis (REST) or graphql-cop (GraphQL) in CI against a running test instance.
- GraphQL `null` propagation: a nullable field's resolver throwing makes only that field null; a non-null field throwing nullifies the whole parent object. Choose nullability carefully — non-null by default is convenient but blast-radius is large.

## When in doubt
> Read the official spec FIRST (links below). OpenAPI 3.0 vs 3.1 differ on `nullable`, `examples`, JSON Schema alignment — pick a version and enforce it in CI.

## Authoritative references
- https://spec.openapis.org/oas/v3.1.0
- https://spec.openapis.org/oas/v3.0.3
- https://graphql.org/learn/schema/
- https://spec.graphql.org/

## cross-sns-audience-flow-analyzer project notes
- Contract-first: the engine (FastAPI) owns the OpenAPI 3.1 spec; freeze it before frontend work
  (dev order in `docs/development-stack.md`). Generated TS client lives in `packages/contracts`
  (openapi-typescript); the frontend never hand-writes fetch types.
- Data contracts (Node / FlowEdge shapes) are versioned under `specs/contracts/` with JSON schemas —
  API responses conform to them, never redefine them.
- Flow semantics in responses: every flow value carries `kind` (observed | estimated) and
  `confidence` (0..1). Never emit a bare number for a flow.
