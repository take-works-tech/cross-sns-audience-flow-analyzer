---
status: active
updated: 2026-08-29
---

# Product principles

Ordered. When two conflict, the earlier one wins. This is what an agent judges a Bounded item by.

### XC-001 - Legibility over spectacle
- statement: when visual richness and readability conflict, readability wins: background effects and the @Flow animation never obscure node identity, direction, or numbers
- applies_when: tuning the @Flow animation, ambient background, or any @Canvas visual against reading the graph (v1.0 §14.2 makes legibility the top requirement)
- decidedness: Fixed
- basis: E-001 (T1)

### XC-002 - Honest uncertainty over confident guesses
- statement: when the data cannot support a claim, the product shows labeled uncertainty instead of a confident number: @Estimated flow is always labeled Estimated and carries visible @Confidence, and missing data is named, not interpolated away
- applies_when: rendering @Estimated flow, partial data (only the estimable range is shown), or any value whose source is a model rather than a @Traffic source report
- decidedness: Fixed
- basis: E-001 (T1)

### XC-003 - Immediate response over exact computation
- statement: when responsiveness and exact results conflict, the user gets an immediate, visibly provisional response: transitions animate, @Recalculation is debounced and runs behind the still-rendered previous result
- applies_when: any edit that triggers @Recalculation, autosave, or a value change on the @Canvas
- decidedness: Fixed
- basis: E-001 (T1)

### XC-004 - Never break the graph
- statement: when an external failure and a complete answer conflict, the graph survives: the last computed state stays rendered with a stale marker and a stated reason, never an empty @Canvas
- applies_when: @Platform API failure, quota exhaustion, or a failed @Recalculation (v1.0 §14.4; enforced as INV-005)
- decidedness: Fixed
- basis: E-001 (T1)

### XC-005 - Name the limit that refused you
- statement: when the system refuses, hides, or omits something, the message names the specific limit or cause that decided it, never a generic error
- applies_when: any refusal or gap - thresholds hiding all edges, fewer overlapping points than LIM-014, an invalid URL, an exhausted LIM-011 budget (v1.0 §14.4, §18)
- decidedness: Fixed
- basis: E-001 (T1)

These are what a Bounded item is judged by. flow-animation/REQ-001 fixes which channels carry data
but not the mapping curves: the implementer picks, and picks by XC-001 first, then XC-002.
