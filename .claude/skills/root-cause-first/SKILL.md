---
name: root-cause-first
description: "Plan before changing code, then fix the cause. Triggers: implement, fix, refactor, bug, root cause, plan, redesign, stopgap."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Root cause first — cross-sns-audience-flow-analyzer

Two failures this exists to prevent: shipping a patch that hides a cause, and starting a change
whose blast radius nobody measured. Both look like progress and cost more later.

## Before changing existing code

1. **Decompose to ≤2h units.** Anything larger is still a guess. Name what runs in parallel and
   what blocks what. If a unit is ≥4h after decomposition, the design is unsettled — raise it.
2. **Enumerate the consumers.** List every caller of what you are about to touch. Shared code
   (helpers, base classes, schemas, status enums, shared fits) reaches every consumer, so the
   impact is the *set of features that move*, not the file you are editing. Where the project
   declares modules, start from the reverse direction — whoever names your module in `depends_on`
   is the blast radius (`module-architecture` skill).
3. **Dig out the contract before you change it.** Read the spec, the invariants, the ADRs and the
   findings on the path you are about to modify — "this never raises", "this sign convention",
   "this schema is strict", "this format is frozen". A change that breaks a contract nobody
   restated is the classic second-order bug.
4. **Clear the blockers first.** Verify the current behaviour by running it, not by reading it.
5. **Agree the approach before writing code** when behaviour or an algorithm changes.

## When fixing

- **Fix the cause.** A symptom-level patch is acceptable only as an explicitly labelled stopgap
  with the real fix written down — never as the recommendation.
- **Do not offer a partial fix as an option.** If the clean fix is out of scope, say that plainly
  and stop. Presenting "quick partial" beside "proper fix" pushes the cost onto the person least
  able to see it.
- **One definition, one owner.** When the same value or rule exists in two places, the fix is to
  give it a single home and have the other side import it — not to update both.
- **Leave the structure clean.** If the correct fix needs a small refactor, do the refactor. If it
  needs a large one, say so and propose it separately rather than smearing it into this change.

## Before calling it done

State what you verified and how. If something is unverified, say which part and why. A change is
not finished because it compiles — it is finished when the thing it was supposed to fix is
observably fixed and nothing that depended on the old behaviour broke.
