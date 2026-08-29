---
description: Drive a feature from spec to implementation via clarify -> plan -> todo -> execute. Boris Cherny pattern.
allowed-tools: Read, Grep, Glob, TodoWrite, Edit, Write, Bash(git status:*), Bash(git diff:*)
---

<!-- Source: https://every.to/podcast/how-to-use-claude-code-like-the-people-who-built-it -->

Feature development for cross-sns-audience-flow-analyzer. Drive `$ARGUMENTS` through four phases. Do NOT skip ahead; complete each phase before the next.

## Phase 1 - Clarify spec / acceptance criteria

- Restate the request in your own words.
- List acceptance criteria as bullets.
- If any input is ambiguous (scope, file targets, edge cases, success metric), ASK the user clarifying questions and STOP. No fabrication, no guessing.

## Phase 2 - Plan (cheapest model first)

- Enumerate concrete files to read/edit/create (absolute paths).
- For each file: one-line reason.
- Identify dependencies and test files.
- No code yet. Plan must be reviewable in <30s.

## Phase 3 - Todo list

- Use `TodoWrite` to register atomic tasks (one verb each, e.g. "Edit X to add Y", "Add unit test for Z").
- Order by dependency. Tests precede implementation when test-first applies.
- Each todo maps to a single phase 4 checkpoint.

## Phase 4 - Sequential execution with checkpoints

- Mark one todo `in_progress`, execute, mark `completed`, then proceed.
- After each completed todo: report a one-line status. If a step reveals a planning error, STOP and revise the plan before continuing.
- Final checkpoint: run `npm test --silent` and report pass/fail.

$ARGUMENTS
