---
status: active
updated: 2026-08-29
---

# Glossary and units

One word, one meaning. Reference a term from any other spec by writing `@Term`. Multi-word terms are
sentence case (`@Observed flow`, `@Node kind`) so the reference resolves here.

### GL-001 - Node
- definition: an element on the @Canvas representing an SNS account, post, video, or web page; classified by a @Node kind and owned by one @Project
- not: the live platform resource it points to - a Node is the analyzer's representation of it
- decidedness: Bounded

### GL-002 - Node kind
- definition: the classification of a @Node (account, post, video, generic URL, product page, site top) that selects its visual style and metadata fields
- not: @Platform - kind says what the resource is, Platform says which SNS hosts it
- decidedness: Bounded

### GL-003 - Edge
- definition: a directed line from a source @Node to a target @Node representing @Flow for one @Period; carries count, rate, type, and @Confidence
- not: an undirected link - every Edge names its source and its target
- decidedness: Bounded

### GL-004 - Flow
- definition: audience movement from one @Node to another, quantified as inflow count and inflow rate over a @Period
- not: an @Edge - the Edge is the stored and rendered form of a Flow
- decidedness: Bounded

### GL-005 - Observed flow
- definition: @Flow backed by platform-reported traffic-source data; never inferred
- not: @Estimated flow, which is a model output
- decidedness: Fixed
- basis: E-002 (T1)

### GL-006 - Estimated flow
- definition: @Flow inferred from time-series lag correlation and posting events; always labeled Estimated and rendered dashed and desaturated
- not: @Observed flow - an Estimated value never comes from a platform report
- decidedness: Bounded

### GL-007 - Confidence
- definition: a score from 0 to 1 attached to every @Edge, computed from data completeness, correlation strength, and @Lag plausibility
- not: a probability of causation - it grades evidence quality for display and thresholds
- decidedness: Bounded

### GL-008 - Traffic source
- definition: a platform-reported origin category attributing views to a referrer, e.g. YouTube Analytics insightTrafficSourceType
- not: an HTTP referrer header - it is the platform's own attribution, not raw request data
- decidedness: Fixed
- basis: E-002 (T1)

### GL-009 - Project
- definition: a named workspace owned by one user, saving nodes, positions, edges, thresholds, filters, @Period, and pinned state
- not: a @Connection - Connections belong to the user account, not to one Project
- decidedness: Bounded

### GL-010 - Canvas
- definition: the central pane where nodes are placed and edges and the @Flow animation render; pan, zoom, and selection happen here
- not: the HTML canvas element - the @Particle overlay uses one, but Canvas names the pane
- decidedness: Bounded

### GL-011 - Connection
- definition: an authorized server-side OAuth link between the engine and one @Platform account, holding encrypted tokens; never exposes tokens to the client
- not: the user's app login - signing in to the analyzer creates no Connection
- decidedness: Bounded

### GL-012 - Platform
- definition: a supported external SNS: YouTube, Instagram, TikTok, or X
- not: an EC platform (Shopify, BASE, Etsy) - those are a separate, later connection kind
- decidedness: Bounded

### GL-013 - Recalculation
- definition: the debounced engine job that recomputes flow edges for a @Project after a trigger (v1.0 §10.4)
- not: metric sync or @Metadata fetch - Recalculation reads already ingested data and fetches nothing
- decidedness: Bounded

### GL-014 - Flow animation
- definition: the particle overlay on edges encoding volume as density, intensity as speed and brightness, and @Confidence as opacity
- not: decoration - every animated property encodes an @Edge value
- decidedness: Bounded

### GL-015 - Particle
- definition: one moving dot of the @Flow animation; a rendering unit only, it carries no data of its own
- not: an @Edge or @Flow record - dropping particles under load loses no data
- decidedness: Bounded

### GL-016 - Pinned edge
- definition: a manual @Edge that is always displayed, exempt from automatic hiding and from removal by @Recalculation
- not: an @Analysis-assist edge - that kind is recalculated and threshold-filtered
- decidedness: Bounded

### GL-017 - Analysis-assist edge
- definition: a manual @Edge hypothesizing a relation; included in @Recalculation and subject to display thresholds
- not: a @Pinned edge - an assist edge may be hidden when it misses thresholds
- decidedness: Bounded

### GL-018 - Unplaced node
- definition: a generated @Node listed in the left pane, not yet on the @Canvas and excluded from analysis
- not: a deleted @Node - it stays listed, searchable, and placeable
- decidedness: Bounded

### GL-019 - Metric series
- definition: the time-ordered values of one metric for one @Node, stored in the TimescaleDB hypertable
- not: a @Flow - a series describes one Node; a Flow relates two
- decidedness: Bounded

### GL-020 - Period
- definition: the user-selected time range over which flows are computed and displayed
- not: the correlation lag window (LIM-015) - Period scopes display, the window bounds estimation
- decidedness: Bounded

### GL-021 - Lag
- definition: the time offset between a source event and a target response, used by estimation and reported on @Edge detail
- not: system latency - Lag is a property of audience behavior, not of the app
- decidedness: Bounded

### GL-022 - Metadata fetch
- definition: the server-side retrieval of title, thumbnail, and OpenGraph/oEmbed data for a URL, with timeout LIM-006 and cache TTL LIM-007
- not: metric ingestion - it retrieves page descriptors, never counts
- decidedness: Bounded

## Units

| Quantity | Unit | Suffix in names | Example |
|---|---|---|---|
| audience count | persons | `_count` | `inflow_count` |
| rate, share | % | `_pct` | `inflow_rate_pct` |
| score | ratio 0..1 | `_ratio` | `confidence_ratio` |
| time (UI motion) | ms | `_ms` | `transition_ms` |
| time (debounce, timeout) | s | `_s` | `autosave_debounce_s` |
| sync interval | min | `_min` | `sync_interval_min` |
| lag window | h | `_h` | `lag_window_h` |
| frame rate | fps | `_fps` | `target_fps` |
| screen length | px | `_px` | `min_viewport_px` |

A name with no unit suffix is a defect: it becomes a second, implicit definition of the unit.
