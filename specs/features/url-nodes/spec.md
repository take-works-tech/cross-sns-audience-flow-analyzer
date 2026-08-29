---
status: active
updated: 2026-08-29
---

# Feature: URL registration and node generation

## Users and purpose

- intended user: a creator who wants any URL they care about (own post, product page, blog article) on the analysis graph
- job to be done: paste a URL and get a correctly classified node within seconds, with no manual data entry
- success condition: a @Node appears in the @Unplaced node list with title and thumbnail, or a provisional @Node appears with a stated reason

## Out of scope

- crawling links beyond the submitted URL
- JavaScript rendering or screenshots of target pages
- own-site tracking script (v1.0 §20 future)
- bulk URL import

## Files and interfaces involved

- planned: services/engine/app/services/url_classify.py (normalization and @Platform / @Node kind classification)
- planned: services/engine/app/services/metadata.py (@Metadata fetch with Redis cache)
- CT-007, the intake result: input URL, normalized URL, platform, resource kind, metadata state
- CT-001, the created @Node resource
- metadata sources: OpenGraph (E-015 (T1)) with oEmbed fallback (E-016 (T1))

## Requirements

### REQ-001 - URL normalization and classification
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-001: When the user pastes a URL, the system shall normalize it and classify @Platform and @Node kind before creating the @Node
  - AC-002: If the input is not a valid URL, then the system shall show the reason under the input field with a correction hint
  - AC-003: If the URL is well-formed but matches no known @Platform pattern, then the system shall create a generic URL @Node

Bound: normalization strips tracking parameters and resolves canonical hosts so the same resource maps to one @Node; pattern tables live server-side behind CT-007.

### REQ-002 - Metadata fetch with cache
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-004: When a @Node is created, the system shall run a @Metadata fetch (OpenGraph or oEmbed) server-side within the timeout LIM-006
  - AC-005: If the @Metadata fetch fails or times out, then the system shall create a provisional @Node marked title-pending and offer manual retry
  - AC-006: When the same normalized URL is requested again within LIM-007, the system shall serve cached metadata without contacting the target site

Bound: OpenGraph is the primary source (E-015 (T1)) with oEmbed as fallback (E-016 (T1)); the fetch is robots-aware and never runs in the browser.

### REQ-003 - Unplaced node list
- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-007: When a @Node is generated, the system shall add it to the @Unplaced node list in the left pane, searchable and sortable by @Node kind
  - AC-008: While a @Node is unplaced, the system shall exclude it from @Recalculation

Bound: exclusion keeps exploratory pasting free of side effects; a @Node enters analysis only when placed on the @Canvas (canvas/AC-001).

## End-to-end verification

Paste a YouTube video URL and observe a video @Node in the @Unplaced node list with title and thumbnail; paste a malformed string and observe the reason under the input field; paste an unknown blog URL and observe a generic URL @Node. Point the fetch at a server that stalls past LIM-006 and observe a title-pending provisional @Node with a retry control; paste the same URL again inside LIM-007 and observe no outbound request. Confirm an @Unplaced node stays out of @Recalculation until it is dragged onto the @Canvas.
