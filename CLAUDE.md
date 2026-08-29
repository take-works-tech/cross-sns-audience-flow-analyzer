@AGENTS.md

# cross-sns-audience-flow-analyzer — Claude Code

<!-- Shared rules live in AGENTS.md, imported above. Keep this file to Claude-Code-only facts. -->

## Where things are
- Rules: `.claude/rules/coding-style.md` · `.claude/rules/design-principles.md`.
- Load the matching skill per task.
- UI work pipeline: frontend-design plugin (direction) → `design-system` skill (frozen 264SF tokens,
  non-negotiable) → `web-design-guidelines` audit → webapp-testing screenshot loop →
  `react-best-practices` perf pass. Never style blind; never invent colors/fonts outside the tokens.
- Skills are guardrails, not tutorials. For a fast-moving framework, read the official docs before
  coding — the API in training data may already be wrong.

## Session hygiene
- New task → `/clear`. Two failed fixes on the same thing → `/clear` and restart from the cause.

## Memory & state
Auto-memory (`~/.claude/projects/.../MEMORY.md`) is Anthropic-managed — do not write it from scripts.
Project-local runtime state goes in `.claude/state/`.
