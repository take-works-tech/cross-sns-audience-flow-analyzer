---
name: issue-execution-flow
description: "Epic/Issue flow from plan to enqueue. Triggers: epic, issue, execution plan, sprint, roadmap, worktree, merge queue."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Issue Execution Flow — Plan-First, Loop-Until-Clean Discipline

Phased execution discipline for any non-trivial Issue. Front-loads planning to cut token waste, enforces local quality loops before PR to keep CI cost low, and ends with merge-queue enqueue (humans / GitHub perform the actual merge).

## Use when

- New feature, bug fix, refactor, or any change estimated > 30 minutes.
- A user-facing "implement X" request without an existing detailed plan.
- Resuming work on an Issue without a saved plan file.

Skip (full flow not needed):
- One-line typo / dependency bump (≤ 10 LOC, no behavior change). Apply directly.
- Pure investigation / Q&A (use the consult-mode skill instead).

## Anti-patterns to refuse

- Editing files **before** writing the 30-minute plan markdown.
- Spawning a multi-agent "review team" by default. Single-agent first; spawn a second reviewer only when the change crosses two unrelated concerns or the initial pass yielded zero findings on a complex diff.
- Treating "AI merges" as in-scope. The flow ends at `enqueue`; the actual merge is performed by GitHub branch-protection + merge queue after re-verifying required checks.
- Skipping local CR/CI loops to "save time" — every fix-on-CI round-trip costs more tokens than a local loop.
- Running the full CI loop inside the same context that just implemented the change without `/clear` when the implementation context is already large (> 60% used).

## Pre-execution heavy-think gates

**Vocabulary** (used below): *Deep-research* = `/deep-research <question>`. *Reasoning-depth tool* = `ultrathink` OR `effort=high` (or `/effort auto` for mixed workload) — **pick ONE, never stack** (they overlap; stacking has diminishing returns).

### Phase A (project-level plan) — MANDATORY

Run BOTH **deep-research** AND **one reasoning-depth tool** before drafting `parallel_cap` / Epic list / wave schedule. Highest-leverage decision point; cost amortises across the whole batch. Optional for autonomy ≥ A1: `/goal "all Epics filed and acknowledged"` to keep the loop running unattended (stop with `/goal clear`).

**Skip only when**: estimated total Issues ≤ 5 AND project is a direct continuation of an established pattern. Record justification in `docs/parallel-budget.md`.

### Phase B (Epic decomposition) / C2 (30-min plan) — CONDITIONAL

Invoke ONE tool only when a trigger below fires.

**Use deep-research when** (industry knowledge is decisive):
- New domain the codebase hasn't touched (auth / payments / real-time / ML / billing / encryption).
- Architectural decision crossing 2+ subsystems where a wrong call is hard to reverse.
- Algorithm or data-structure selection with multiple plausible candidates.
- Public API contract design (irreversible after release).
- Adopting a new load-bearing third-party library / framework.

**Use a reasoning-depth tool when** (depth matters but no external lookup):
- Root-cause analysis where symptom and bug are far apart.
- Cross-cutting refactor planning (3+ files, behaviour-preserving).
- Designing a security-sensitive boundary (input validation / authz / sandbox).
- Reconciling conflicting constraints (perf vs. memory vs. clarity, etc.).

**Forbidden to invoke either** (skip conditions):
- Bug fix limited to a single function with a clear failing test.
- Typo / wording / i18n / dependency bump (minor or patch).
- Pattern already established locally — `rg` for 3+ examples; if found, follow them.
- Issue has clear AC AND a documented happy-path in skills/rules.

Forcing heavy tools on routine work multiplies cost 5–10× without improving outcomes and dilutes trigger reliability. Treat them as scarce escalation paths.

---

## Phase A — Project plan (once per Epic batch)

**A1. Host capacity probe** (once per machine, cached). Run on host shell:
- CPU logical cores: `nproc` (Linux/macOS) / `(Get-CimInstance Win32_Processor).NumberOfLogicalProcessors` (PowerShell)
- Free RAM (GB): `free -g` / `(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB`
- Disk free on repo volume.

**A2. Derive parallel cap** (deterministic formula, no LLM):
```
parallel_cap = min(
  floor(cores / 2),       # leave headroom for build + tests
  floor(free_gb / 4),     # ~4 GB per agent's node_modules / venv
  6                       # hard ceiling to keep coordination cost finite
)
```
Save to `docs/parallel-budget.md` with timestamp, cores, RAM, derived cap, and any manual override reason.

**A3. Enumerate work units** at Epic granularity (3–10 Epics typical). For each: title, why, success criteria, est. issue count, dependency graph.

**A4. Schedule for parallelism**. Group Epics into waves where wave N's Epics have no dependency on each other. Wave width ≤ `parallel_cap`.

**A5. File Epic Issues** (one `gh issue create` per Epic) with labels `epic`, `wave-<n>`, body listing planned child Issues.

## Phase B — Epic decomposition (once per Epic)

For each Epic Issue:

**B1.** Enumerate child Issues. Each child = one branch, one PR, one mergeable unit (≤ ~500 LOC diff target).

**B2.** Dependency-sort children. Note which children must wait on which.

**B3.** File all child Issues (`gh issue create`) with labels `epic:<parent-#>`, `wave-<n>`, acceptance criteria.

**B4.** Add child list back to Epic body as a checklist (`gh issue edit <epic#> --body-file ...`).

## Phase C — Per-Issue execution

**C1. Worktree (optional).** When parallel agents will work simultaneously or the change is large enough that branch-switching costs context:
```bash
git worktree add ../worktrees/<issue#>-<slug> -b <type>/<issue#>-<short-description> main
```
Skip for small single-agent changes — extra disk + setup is wasted.

**C2. 30-minute plan markdown** (mandatory). Before any code edit, write `docs/planning/issue-<#>-plan.md` from the template below. Include: files to edit (full paths), edit locations (line ranges), invariants, test list, watch-outs. Granularity = each section is a 30-minute slot.

Alternative entry: `/plan "<issue title>"` enters Claude Code plan mode directly. Both end with a saved `docs/planning/issue-<#>-plan.md`; pick whichever fits your style — the file is the contract, the tool is the means.

**C3. Test-first.** For every behavior change, write the failing test first. Confirm RED state by running it. Only then implement.

**C4. Implementation.** Follow the 30-minute plan. If you deviate, update the plan file in the same commit.

## Phase D — Local quality loop (before push)

**D1. Local review (single-agent first).**
- Run `claude /review` (CLI) on the diff.
- Apply findings.
- Two separate questions, and conflating them is why reviews end early:
  - **may it merge?** Critical = High = Medium = 0. Best-Practices remarks may remain.
  - **has looking finished?** Two consecutive rounds finding **zero new** issues. One clean round
    only shows the last fixes landed; it says nothing about the surface nobody has read yet.
- The count resets per reviewer. Local convergence is not a substitute for an independent pass —
  a diff can converge in five local rounds and still return ten findings from a reviewer that has
  not been staring at it.

**D2. Cross-perspective check (conditional).** Spawn a second reviewer agent only if (i) the diff crosses two unrelated concerns (e.g. UI + persistence), OR (ii) the first pass returned zero findings on a > 200 LOC diff. Otherwise skip.

**D2-sec. Security-review trigger (conditional).** Run `/security-review` between D1 and D3 ONLY when the diff touches any of: `auth/` · `crypto/` · `secrets/` · IPC layer (preload / contextBridge / messageChannel) · network boundary (request handlers, fetch wrappers, CORS config) · permission/authorization checks · serial / socket / subprocess invocation. Skip for unrelated changes — running it everywhere dilutes its signal and burns tokens.

**D3. Full local CI.** Run the project's local CI script (typically `scripts/ci-local.ps1` / `scripts/ci-local.sh`). Loop fix → re-run until clean.

**D4. Live app verification (UI projects only).** When `app_type` is `web` / `desktop`, run `/run` (launch project) or `/verify` (run the app and observe behaviour) to catch regressions the diff review cannot — runtime errors, layout breakage, broken interactions. Skip for pure backend / library changes.

**D5. Review escalation (conditional).** If `/code-review` returns Medium+ findings twice in the same area, escalate ONCE with `/code-review ultra` (cloud-depth multi-agent review). Do not iterate on `ultra` — it is the escalation, not the loop. If `ultra` still finds Medium+ issues, the change needs a redesign, not another review.

Local CI must cover (at minimum): lint + type-check + unit tests + build. E2E may be deferred to CI when the local environment lacks a runner.

**Context hygiene**: if the implementing context is > 60% used after D1, `/clear` and resume D2/D3 in a fresh context with the plan file as the only carry-over.

## Phase E — PR and merge-queue enqueue

**E1. Push and create Draft PR**:
```bash
git push -u origin <branch>
gh pr create --draft --title "<type>(<scope>): <subject> (#<issue>)" --body-file <plan-file>
```

**E2. Mark Ready** (`gh pr ready`) only after Phase D passed locally — this is what triggers CI on a constrained runner.

**E3. Wait for CI + Claude Code Review.** Poll `gh pr checks` and `gh pr view --json reviews`. Do not iterate locally during this wait — pick up another Issue from the wave instead.

**E4. Triage results.**
- CI fail OR Claude Code Review findings at Medium+ → return to Phase D with the new findings. Push fix. Loop.
- All checks green AND review is Best-Practices-only → proceed to E5.

**E5. Enqueue for merge.**
```bash
gh pr merge <pr#> --auto --squash      # enqueues into merge queue
```
The actual merge is performed by GitHub branch-protection + merge queue after re-verifying required checks. The flow ends here; do not attempt to perform the merge directly.

## 30-minute plan template (Phase C2)

```markdown
# Issue #<num> — <title>

## Goal (1 sentence)
What "done" looks like, behaviorally.

## Acceptance criteria
- [ ] AC-1
- [ ] AC-2

## Files to edit
| Path | Lines | Change |
|---|---|---|
| src/.../foo.ts | 42-68 | extract handler into pure fn |

## Tests to add / change
| Path | Case | Expected |
|---|---|---|

## Invariants to preserve
- API surface unchanged.
- Output bit-exact on existing fixtures.

## Watch-outs
- Cross-cutting: also touches X — re-run integration suite.

## 30-min slots
1. (00:00–00:30) RED — write failing tests, run.
2. (00:30–01:00) GREEN — implement, run tests.
3. (01:00–01:30) Review pass 1 (`claude /review`), apply.
4. (01:30–02:00) Local full CI, push, open Draft PR.

## Rollback plan
If the change breaks <component>, revert by `git revert <sha>` and re-open issue with note.
```

## Authoritative references

- Cherny — *How Boris uses Claude Code* (Anthropic eng blog) — adaptive routing + "ruthless skill editing" justifies single-agent default.
- arXiv 2512.08296 — multi-agent setups regress vs single agent at >= 45% baseline accuracy.
- This project's `autonomous-dev-env-spec.md` §3 (1-Epoch loop) and `…-blueprint-v2.md` §6 (safety hooks) — establish the "AI does not merge" invariant respected by Phase E.

## When in doubt

- Plan unclear → write the 30-min plan first, refine after, do not edit code.
- Whether to spawn a second reviewer → default no; spawn only when D2 criteria explicitly trigger.
- Whether to use a worktree → default no for single-agent work; yes when parallelism is active.
- Local CI keeps failing on the same point → `/clear` and restart from the plan file. Two failed iterations is the rewrite signal.

## Project notes
TODO: list any project-specific overrides (e.g. local CI script path, parallel cap override, additional reviewer roles).
