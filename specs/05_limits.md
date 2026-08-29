---
status: active
updated: 2026-08-29
---

# Capacity limits

Every numeric bound in this spec set lives here (INV-008); acceptance criteria cite a LIM id, never an
inline literal. `source_of_truth` stays `planned:` until the symbol exists in code — frontend-facing
limits land in packages/contracts/src/limits.ts, engine-facing limits in
services/engine/app/limits.py, one home each.

### LIM-001 - Max practical node count
- value: 100
- unit: nodes
- source_of_truth: planned: packages/contracts/src/limits.ts:MAX_NODES
- rationale: v1.0 §14.1 operability bound for one @Project graph
- on_exceed: the @Canvas keeps rendering; congestion aids aggregate small nodes into group badges until the visible count is within this limit (canvas/REQ-004), and the aggregation is announced
- decidedness: Fixed
- basis: E-001 (T1)

### LIM-002 - Max practical edge count
- value: 300
- unit: edges
- source_of_truth: planned: packages/contracts/src/limits.ts:MAX_EDGES
- rationale: v1.0 §14.1 rendering bound for usable interaction
- on_exceed: display thresholds (LIM-013) hide the weakest automatic edges first and the edge panel names how many are hidden; a @Pinned edge is never hidden (INV-006)
- decidedness: Fixed
- basis: E-001 (T1)

### LIM-003 - Interaction frame-rate target
- value: 60
- unit: fps
- source_of_truth: planned: packages/contracts/src/limits.ts:TARGET_FPS
- rationale: v1.0 §14.1 pan/zoom/drag target; the FPS governor aims here
- on_exceed: a target, not a cap; a sustained rate below LIM-004 triggers the degradation ladder in flow-animation/REQ-002
- decidedness: Fixed
- basis: E-001 (T1)

### LIM-004 - Frame-rate degradation floor
- value: 30
- unit: fps
- source_of_truth: planned: packages/contracts/src/limits.ts:FPS_FLOOR
- rationale: below this, animation spectacle costs more than it informs; quality is reduced before interaction handling is touched
- on_exceed: while below the floor, @Particle count steps down and at minimum quality particles become static directional dashes (flow-animation/AC-005); recovery restores one step at a time
- decidedness: Bounded

### LIM-005 - Initial load budget
- value: 3
- unit: s
- source_of_truth: planned: packages/contracts/src/limits.ts:INITIAL_LOAD_S
- rationale: v1.0 §14.1 first interactive render of the @Canvas for a saved @Project
- on_exceed: a slower load fails canvas/AC-009; while loading, the designed loading state renders — never a blank pane
- decidedness: Fixed
- basis: E-001 (T1)

### LIM-006 - Metadata fetch timeout
- value: 5
- unit: s
- source_of_truth: planned: services/engine/app/limits.py:METADATA_TIMEOUT_S
- rationale: keeps node creation responsive; beyond it a provisional node is created (v1.0 §18.3)
- on_exceed: the @Metadata fetch is cancelled, a provisional @Node marked title-pending is created, and manual retry is offered (url-nodes/AC-005)
- decidedness: Bounded

### LIM-007 - Metadata cache TTL
- value: 24
- unit: h
- source_of_truth: planned: services/engine/app/limits.py:METADATA_CACHE_TTL_H
- rationale: Redis cache balances freshness against load on target sites
- on_exceed: an entry older than the TTL is a cache miss; the next request re-fetches from the target site and replaces the entry
- decidedness: Bounded

### LIM-008 - Autosave debounce
- value: 5
- unit: s
- source_of_truth: planned: packages/contracts/src/limits.ts:AUTOSAVE_DEBOUNCE_S
- rationale: persists shortly after the last change without write storms; the save state is always shown (projects/REQ-002)
- on_exceed: further edits inside the window restart the timer; the save indicator shows pending until the write lands
- decidedness: Bounded

### LIM-009 - Recalculation debounce
- value: 3
- unit: s
- source_of_truth: planned: services/engine/app/limits.py:RECALC_DEBOUNCE_S
- rationale: coalesces bursts of v1.0 §10.4 triggers into one engine job (flow-analysis/REQ-003)
- on_exceed: triggers arriving inside the window join the pending @Recalculation instead of enqueuing new jobs
- decidedness: Bounded

### LIM-010 - Metric sync interval
- value: 60
- unit: min
- source_of_truth: planned: services/engine/app/limits.py:SYNC_INTERVAL_MIN
- rationale: freshness versus platform API quotas; one Celery beat schedule per @Connection (E-013, T2)
- on_exceed: a run due while the previous one is still executing is skipped and recorded; the next run happens on schedule
- decidedness: Bounded

### LIM-011 - YouTube Data API daily unit budget
- value: 10000
- unit: units/day
- source_of_truth: planned: services/engine/app/limits.py:YOUTUBE_DAILY_UNITS
- rationale: platform default quota for the shared non-search endpoint pool; sync planning must fit inside it
- on_exceed: remaining YouTube fetches are deferred to the next quota window and the deferral is recorded (sns-connection/AC-006)
- decidedness: Fixed
- basis: E-003 (T1)

### LIM-012 - Minimum re-sync gap per connection
- value: 15
- unit: min
- source_of_truth: planned: services/engine/app/limits.py:RESYNC_MIN_GAP_MIN
- rationale: rate-limit protection across all platforms regardless of manual refresh requests
- on_exceed: a manual refresh inside the gap is refused with a message naming this limit and the time remaining
- decidedness: Bounded

### LIM-013 - Default minimum confidence for auto edges
- value: 0.3
- unit: ratio 0..1
- source_of_truth: planned: packages/contracts/src/limits.ts:DEFAULT_MIN_CONFIDENCE
- rationale: hides statistical noise while keeping exploratory edges; user-adjustable per @Project and per @Edge
- on_exceed: an automatic @Edge whose @Confidence is below the threshold is not displayed; if nothing passes, the nodes stay rendered and the empty state names the threshold (edges/AC-003)
- decidedness: Bounded

### LIM-014 - Minimum overlapping series points for estimation
- value: 8
- unit: points
- source_of_truth: planned: services/engine/app/limits.py:MIN_SERIES_POINTS
- rationale: below this, lag cross-correlation is not meaningful
- on_exceed: with fewer overlapping points the engine emits no automatic @Edge and records the reason for the detail panel (flow-analysis/AC-006)
- decidedness: Bounded

### LIM-015 - Maximum correlation lag window
- value: 72
- unit: h
- source_of_truth: planned: services/engine/app/limits.py:MAX_LAG_WINDOW_H
- rationale: cross-SNS referral effects decay within days; larger windows inflate false positives
- on_exceed: candidate @Lag values beyond the window are not evaluated and produce no @Estimated flow
- decidedness: Bounded

### LIM-016 - Particle count ceiling
- value: 2000
- unit: particles
- source_of_truth: planned: packages/contracts/src/limits.ts:PARTICLE_CEILING
- rationale: keeps the @Flow animation overlay inside the frame budget at LIM-002 edge scale
- on_exceed: the @Particle budget is reapportioned across edges by volume share; density saturates and the total never exceeds the ceiling (flow-animation/AC-003)
- decidedness: Bounded

### LIM-017 - Minimum text contrast ratio
- value: 4.5:1
- unit: contrast ratio
- source_of_truth: planned: packages/contracts/src/limits.ts:MIN_TEXT_CONTRAST
- rationale: WCAG 2.2 AA SC 1.4.3; applies to all themes including labels on @Platform brand colors
- on_exceed: a token pair below the ratio fails the token test (canvas/AC-005) and the theme value is changed; the ratio is never waived per screen
- decidedness: Fixed
- basis: E-007 (T1)

### LIM-018 - Micro-transition duration
- value: 150-250
- unit: ms
- source_of_truth: planned: packages/contracts/src/limits.ts:TRANSITION_MS
- rationale: design-system band with ease-out timing; perceptible but never laggy — particles are the only continuous animation
- on_exceed: a transition outside the band is a design defect; anything longer becomes an immediate state change plus a progress indicator
- decidedness: Bounded

### LIM-019 - Three-pane minimum viewport width
- value: 1024
- unit: px
- source_of_truth: planned: packages/contracts/src/limits.ts:THREE_PANE_MIN_PX
- rationale: below this the side panes cannot hold their content next to the @Canvas
- on_exceed: below the width the side panes collapse into drawers (canvas/AC-014); the @Canvas keeps full interaction
- decidedness: Bounded
