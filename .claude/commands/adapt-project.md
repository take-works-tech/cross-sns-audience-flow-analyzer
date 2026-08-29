---
description: Stage 2 init pass — read this project and personalise the baseline env (codebase-overview TODOs / CLAUDE.md conventions / project-specific skills). Run once per project, right after setup-env.
allowed-tools: Read, Grep, Glob, Bash(ls:*), Bash(tree:*), Bash(git diff:*), Bash(git status:*), Edit, Write
---

Invoke the **project-adapter** skill (see `.claude/skills/project-adapter/SKILL.md`) to perform the Stage 2 init pass on cross-sns-audience-flow-analyzer.

Follow the procedure strictly:

1. Read project facts (README + manifest + src/ top-level + one representative source per module), ≤ 30K tokens of input.
2. Fill the three TODO stubs in `.claude/skills/codebase-overview/SKILL.md` (Architecture / Key directories / Naming) — terse and factual.
3. Append a "Project conventions" section to `CLAUDE.md` (≤ 5 lines, enforced constraints only — skip if nothing applies).
4. Propose project-specific skills under `.claude/skills/<project>-*` ONLY if a genuinely project-specific pattern surfaced (skip otherwise).

Do NOT modify generic skills. Do NOT touch governance files. Do NOT auto-commit. Leave changes in the working tree for the human to review.

When done, summarise in 4 bullets:
- Files modified
- New files (if any)
- What was intentionally not touched
- Next step (`git diff` review)

$ARGUMENTS
