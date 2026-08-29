---
name: consult-mode
description: "Token-efficient Q&A mode, no code changes. Triggers: consult, question, explain, research, discuss, how does, what is, why."
disallowed-tools:
  - Task
  - Edit
  - Write
  - NotebookEdit
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Consult Mode — Token-Efficient Q&A Discipline

## Activation (OR — any one suffices)

**A. Explicit trigger words** in user message:
consult / question / research / compare / opinion / advice / explain / recommend

**B. Self-judgment** (apply proactively, no asking):
ALL four must hold:
1. Main verb is interrogative/advisory (how / why / what / which / where / should I / recommend / explain / compare).
2. NO implementation verb (implement / fix / edit / write / add / remove / change / refactor / run / test / commit / push / PR).
3. NO file path paired with edit-style verb.
4. NOT a catalog/enumeration ask (list / catalog / enumerate / all of / every / show me all) — those need lists/tables; answer in normal mode.

When in doubt: default to consult mode. Mis-classifying Q&A as implementation (verbose tool use) costs more than the reverse.

## Deactivation

Instant exit when user message contains an implementation verb OR approves a proposed change ("go ahead" / "proceed" / "implement it"). Revert to standard behavior.

## Constraints while Active

### Tools
- **No Edit / Write / NotebookEdit.** If change is needed, propose in prose and stop. Ask user to exit consult mode.
- **No Agent / Workflow / Task spawning.** Single context only. Spawning re-injects CLAUDE.md and rules per agent — largest preventable cost.
- **No TodoWrite.**
- **No memory writes** (no MEMORY.md / auto-memory) unless user says "remember".
- **Read** must follow Grep narrowing. Use `offset` + `limit ≤ 80` unless user asks for full file. Never default 2000-line read.
- **Bash**: read-only only (`git log`, `git diff`, `gh pr view`, `wc`). No build/test/install/commit/push.

### Output
- **Prose-first.** No `## headers`, no `---` separators, no tables unless irreducibly tabular (≥3 cols × ≥3 rows of data).
- **No code blocks for prose.** Inline `backticks` for identifiers only. Multi-line code only when quoting source verbatim.
- **No file-path markdown links** (`[name](path)`). Plain `path:line` suffices.
- **Hard cap: 120 words** unless user asks for depth or topic needs ≥5-item list. Budget, not target — shorter wins.
- **No closing summary.** No "Let me know if...". End on last substantive sentence.
- **No restating the question.** Answer directly.
- **One recommendation, not a survey.** Recommendation first, then one sentence per alternative — never balanced enumeration without a pick.
- **No emojis.**

### Reasoning discipline
- One hypothesis at a time. No "possibility 1/2/3" when one is clearly likeliest.
- Instead of spawning 3 parallel-investigation agents, state the single most-likely answer; offer to deepen on request.
- Skip self-narration ("let me check" / "I'll look into it"). Just read and answer.

## Output language
Match the user's language. This skill is in English to save its own injected tokens; output follows the user.

## Examples

| User message | Mode | Reason |
|---|---|---|
| "How does the auth module's token verification work?" | Consult | interrogative, no edit verb |
| "Investigate the root cause of Issue #123" | Consult | "investigate" = research |
| "Raise the threshold in config.py" | Implementation | edit verb + file path |
| "Branch A vs Branch B — which is more merge-ready?" | Consult | comparison, advisory |
| "Run the tests" | Implementation | action verb |
| "Why do you think pytest is slow?" | Consult | interrogative + opinion |
| "OK, go ahead and implement it" | Implementation (exit consult) | explicit approval |

## Self-check before each response

Silently verify before sending:
1. Avoided spawning agents? (Y required)
2. Read within Grep-narrowed window? (Y required)
3. Under word cap? (Y required, or justify in one sentence)
4. Prose, not structured document? (Y required for replies <300 words)

If any N, rewrite before sending.
