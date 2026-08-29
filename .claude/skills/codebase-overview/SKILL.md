---
name: codebase-overview
description: "cross-sns-audience-flow-analyzer architecture, directories, naming. Triggers: where is, project structure, directory layout, codebase, onboarding."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# cross-sns-audience-flow-analyzer overview

> **Do not load this skill while entries are TODO** (knowledge-capturer fills them in after project init).

- Source: src
- Architecture: monorepo — `apps/web` (Next.js 15 App Router UI + BFF), `services/engine`
  (FastAPI: SNS connectors, analysis engine, Celery jobs), `packages/contracts` (OpenAPI-generated
  TS client). Postgres/TimescaleDB + Redis via docker-compose. Backend-first: API contract frozen
  before frontend work (`docs/development-stack.md`).
- Key directories: `specs/` (canonical requirements, linted by `validate/check_specs.py`),
  `apps/web/src/` (frontend), `services/engine/` (Python), `packages/contracts/`,
  `.claude/` (agent env), `evidence/` (spec sources).
- Naming: TypeScript strict camelCase / components PascalCase; Python snake_case (ruff/mypy);
  spec IDs REQ/AC scoped per feature dir; limits LIM-*, evidence E-*, contracts CT-*.

> Use to grasp "where things are" without reading files. Details via tree/rg/LSP on demand.
