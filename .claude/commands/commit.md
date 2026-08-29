---
description: Create a conventional commit for the staged changes.
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*)
---

Create a conventional commit for cross-sns-audience-flow-analyzer.

- Stage only the relevant changes (review `git status` / `git diff` first).
- Message format: `<type>(<scope>): <subject>` — type ∈ feat/fix/docs/test/refactor/chore/perf.
- Subject: imperative, <=72 chars. Body explains *why*, not *what*.
- Do NOT commit to the default branch; branch first if needed.

$ARGUMENTS
