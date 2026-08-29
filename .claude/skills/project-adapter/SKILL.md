---
name: project-adapter
description: "Stage 2 init pass: read this project (README / package files / src structure), fill codebase-overview TODOs, add project-specific conventions to CLAUDE.md, propose project-specific skills. Triggers: adapt project, fill project specifics, setup project-specific skills, /adapt-project."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Project Adapter — cross-sns-audience-flow-analyzer

Stage 2 of the setup ladder. `setup-env` (Stage 1) generated a zero-token deterministic baseline.
This skill is the **opt-in LLM-driven adaptation pass** that personalises that baseline to THIS project.

Run ONCE per project, immediately after `setup-env`. The output is local edits to be reviewed and committed by a human.

## Use when

- Right after `setup-env --addon project-adapter` finished, before the first feature work.
- The user invokes `/adapt-project` or asks "fill in project specifics / adapt to this codebase".
- Re-running after a major architecture shift (rare; usually `knowledge-capturer` covers ongoing additions).

## Anti-patterns to refuse

- Do NOT modify any **generic** skill body (`coding-standards`, `testing-policy`, `review-checklists`, `security-guidelines`, `webapp-testing`, `consult-mode`, `document-skills`, `knowledge-capturer`, `issue-execution-flow`, `codebase-overview` except its TODO stubs, and any framework expert skill that came from an addon). Regeneration via `setup-env --force` would overwrite them; project content goes in **new** files under a project namespace instead.
- Do NOT touch GOVERNANCE files: `.claude/settings.json`, `.claude/hooks/*`, `.claude/agents/*` (generic ones), `.github/workflows/*`, `.claude/platform-manifest.yaml` if present. These are AI-restricted by design (`billing_mode_guard` enforces the boundary).
- Do NOT auto-commit or push. Leave changes in the working tree for the human to review.
- Do NOT invent project facts that are not directly inferable from the read sources. Mark uncertain claims `[confidence: Low]` so the human spots them.
- Do NOT scaffold project-specific skills when the project is too small to need them (≤ ~500 LOC src, no specific architecture). Just fill codebase-overview and stop.

## Procedure (4 steps)

### Step 1 — Read project facts (read-only)

Grep / Read in this order; stop when you have enough signal:

1. **`README.md`** — purpose / install / dev workflow.
2. **Package manifest**: `pyproject.toml` / `setup.cfg` / `package.json` / `Cargo.toml` / `pubspec.yaml` / `Package.swift` / `build.gradle.kts` — declared dependencies, framework versions.
3. **`src/` top-level structure** (or `lib/`, `Sources/`, etc.): list 1 level deep with `ls -F` or `tree -L 1 src/`. Note key module names.
4. **Architecture / spec docs**, if present: `docs/architecture/*.md`, `docs/specs/*.md`, `docs/adr/*.md`. Skim, don't deep-read.
5. **One representative source file** per top-level module: read first 100 lines via `Read` with `limit=100` to grasp naming conventions (snake_case vs PascalCase, file layout).

Budget cap: **≤ 30K tokens** of input across all reads. If the project is larger, stop and ask the human which areas to focus on.

### Step 2 — Fill `codebase-overview` SKILL TODO stubs

The default-generated `.claude/skills/codebase-overview/SKILL.md` has three TODO lines:

```
- Architecture: TODO: fill in (key modules and responsibilities)
- Key directories: TODO: fill in
- Naming: TODO: fill in
```

Replace each with a **terse, factual** description sourced from Step 1. Examples:

- `Architecture: FastAPI app served by uvicorn; SQLAlchemy 2.x async ORM against PostgreSQL; Pydantic v2 schemas; pytest-asyncio for tests.`
- `Key directories: src/api/ (routes), src/db/ (models + migrations), src/services/ (business logic, pure functions), tests/ (mirrors src/).`
- `Naming: snake_case modules and functions; PascalCase Pydantic models; tests prefixed with test_<module>_<scenario>.`

Each entry: 1 line, ≤ 200 chars. **No marketing language**.

### Step 3 — Add a "Project conventions" section to CLAUDE.md

Append a new section at the end of CLAUDE.md (before `## Memory & state`):

```markdown
## Project conventions
- <constraint 1 derived from Step 1>
- <constraint 2>
- ...
```

Only include constraints that are **enforced** in the project — e.g.:
- `Pydantic v2 only (do not use .dict() / class Config — use model_dump() / model_config).`
- `Async-only DB access (no sync SQLAlchemy Session in route handlers).`
- `All public functions must have type hints (mypy --strict is wired in CI).`

Skip aspirational guidelines. Pick **≤ 5 lines**. CLAUDE.md is always-injected — every line costs tokens every turn.

If you cannot identify any project-specific enforced constraint, **skip this step entirely**. An empty section is worse than no section.

### Step 4 — Propose project-specific skills (conditional)

Only if Step 1 surfaced a genuinely project-specific pattern that isn't covered by an existing skill. Examples:

- Project uses an in-house framework (e.g., custom event bus) → create `.claude/skills/<project-name>-eventbus/SKILL.md`
- Project has a unique deployment pipeline / release ritual → `.claude/skills/<project-name>-release/SKILL.md`
- Domain-specific vocabulary that crosses many modules → `.claude/skills/<project-name>-domain/SKILL.md`

**Naming**: ALWAYS prefix with `<project-name>-` to keep the project namespace separate from generic / framework skills. This protects `setup-env --force` idempotency — your additions won't collide with regenerated generic skills.

Each new skill: ≤ 60 lines, follows the standard frontmatter (name / description / verified_date / stability), and is honest about its scope (no broad-claim descriptions).

If nothing project-specific surfaced, **skip this step**. Default skills cover ~80% of needs.

## Output to the user

After completing the procedure, summarise in 4 short bullets:

1. Files modified: `<path>` (X TODO stubs filled / Y conventions added)
2. New files: `<path>` (Z project-specific skills — or "none")
3. What was intentionally NOT touched (governance files / generic skills): list, very short
4. Next step: "Review the diff (`git diff`), commit if happy, or rollback with `git checkout -- <files>`"

Then STOP. Do not iterate further. The human reviews and decides.

## Token budget

Aim for ≤ 50K tokens total (input + output). If you find yourself exceeding it, stop and report what you have — the human can re-invoke for the remaining areas.

## When in doubt

- Project too small / generic to need adaptation → say so honestly, do nothing, exit.
- Architecture unclear from sources → ask the human one focused question, then proceed or exit.
- Two interpretations of a pattern possible → record both in `[confidence: Low]` and let human decide.
- Tempted to modify a generic skill → don't; create a project-specific one instead.

## Project notes
TODO: list any project-specific overrides for this skill (e.g. additional source roots to scan, files to exclude from adaptation).
