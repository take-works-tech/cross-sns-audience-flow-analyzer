---
name: review-checklists
description: "5-perspective review checklist + grep patterns. Triggers: code review, static review, pre-merge audit, CQ-, SEC-, ST-, CS-, FE-."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Review Checklists — cross-sns-audience-flow-analyzer

Apply EVERY perspective to EVERY changed file; state "N/A" rather than narrowing by gut feel.
Format: `[severity][confidence] file:line - finding`.

| # | Perspective | Detects |
|---|---|---|
| §1 | Code Quality | silent fallback, missing types/tests, leaks, magic numbers, a default literal duplicated across files (→ one shared SSoT module) |
| §2 | Security | secrets, injection, missing validation, info leakage |
| §3 | Spec Traceability | unimplemented spec, constant/term mismatch |
| §4 | Simplification | DRY, deep nesting, long methods, dead code, circular deps / low-level importing a higher layer |
| §5 | Frontend | grid, a11y, i18n, dispose, unsafe config — UI files only (.tsx/.jsx/.vue/.css/.html); otherwise state "N/A: no frontend" once |

Coverage over filtering: report uncertain findings as `[confidence: Low]`; never silently drop one.

## §1 Code Quality
silent fallback / swallowed exceptions / missing type / missing tests / resource leak / magic numbers /
duplicated constant or default literal across files (must live in one shared SSoT module — flag if redefined).

## §2 Security
hardcoded secrets / disabled TLS / injection (eval/shell) / missing input validation / info leakage.

## §3 Spec Traceability
unimplemented required behavior / constant mismatch / term inconsistency vs spec.

## §4 Simplification
DRY violation / deep nesting / long methods / dead code / unclear naming /
circular dependency or layer-direction violation (a low-level/shared module importing a higher layer).

## §5 Frontend (if applicable)
spacing grid / a11y (contrast, labels) / i18n leakage / missing dispose / unsafe config.

## When the changed file is itself a guard (CI check, hook, lint rule, frozen baseline)
A guard that cannot fail is indistinguishable from one that never runs — both read as enforcement.
- **Reverse-test it**: introduce the defect it names and watch it fail. Better, mutate the rule
  (flip the comparison, disable one resolution step) and confirm a test dies. A rule with a
  direction needs BOTH directions asserted; a comparison flipped the wrong way passes every
  same-direction case.
- **Select by meaning, not by message text.** `if "NEW" in error` silently misses the `increased:`
  case that reads identically to a human. Return a typed kind and branch on that.
- **A baseline must not be checked by the code that wrote it.** "The tree matches the frozen
  baseline" holds whichever way the comparison points — a smoke test, not a test of the rule.
- **Parse, don't pattern-match.** A regex over imports misses the forms the language allows
  (relative, parenthesised, conditional, inside a function). Use the real parser.
- **Read config, don't restate it.** An alias or root hardcoded in the guard drifts from the
  build's actual config, and the dead branch looks like coverage.
- **Report-only numbers are the ones free to grow.** A metric printed but not gated is the single
  quantity nothing constrains. Freeze it too, or state plainly that it is unbounded.
- **Exclusions delete edges.** An ignore list plus "skip anything unowned" can drop real findings;
  check what the exclusion removes from the graph, not just what it silences in the output.
- **Ratchet both ways**: growth fails, and so does an unrecorded improvement — otherwise the frozen
  numbers quietly drift into a lie.
- **Local-only enforcement is not enforcement.** A hook is copied into `.git/hooks` and skipped by
  `--no-verify`; the author who wrote the guard is the one most likely to bypass it. Put a check
  the author cannot switch off where the work lands — and say plainly what it does *not* block if
  the pipeline is advisory rather than a required check.
- **The advertised recovery must be reachable when the thing is broken.** If a corrupt frozen file
  makes the tool exit before it can re-freeze, the only documented fix is unreachable and the
  operator is left deleting files by hand.
- **Derive the trigger from the rule, not from a list.** When the guard binds `a/`, `b/`, `c/` but
  the pipeline enumerates two of them, the third subtree owes the rule and is never checked. One
  expression used by both sides cannot drift; two lists always will.

## When the same rule lives in more than one place
Duplicated enforcement drifts, and the drift is invisible: each copy passes its own tests.
- Fixing one copy is half the job. Ask what *other* implementations of this rule exist, and port
  the change to all of them in the same commit.
- Pin the copies against each other — the pattern strings and the verdict on identical input, not
  just the shared constant names. A test that only compares field names lets the extraction, the
  case handling and the scoping diverge underneath it.
- Adding a new enforcement script is adding a copy. Register it wherever the existing ones are
  registered (lint list, type-check list, CI step, docs) as part of adding it.

## Priority
Critical / High / Medium = block. Best Practices = approve-with-suggestion. Approve when C=H=M=0.

## §4 reference — design catalogue (load only when a finding needs backing)
Moved out of the always-injected rules layer: these are general engineering principles a capable
model already applies, so they cost tokens every session there and earn them only when you are
justifying a specific §4 finding.

- **Single responsibility**: one module = one reason to change; don't mix I/O, logic, presentation.
- **DRY**, balanced against premature abstraction — extract on the second real duplication, not the first guess.
- **KISS / YAGNI**: simplest design that works.
- **Dependency inversion**: depend on abstractions / ports; external edges behind interfaces.
- **Composition over inheritance**: compose small units; avoid deep hierarchies.
- **Deep modules**: simple interface over complex implementation; minimise dependencies and obscurity.
- **Boy Scout Rule**: leave touched code cleaner — without widening the change beyond what was asked.
- **Least astonishment**: no hidden side effects or surprising control flow.

Naming and comments follow the surrounding code rather than a fixed rule: match the file's existing
comment density and idiom, and reserve a comment for a constraint the code itself cannot show.
