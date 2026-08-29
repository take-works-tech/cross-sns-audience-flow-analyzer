---
status: active
updated: 2026-08-29
---

# Feature: Flow particle animation

## Users and purpose

- intended user: a creator reading the graph while the animation runs
- job to be done: read direction, strength, and change of flows at a glance from moving particles
- success condition: the animation informs — density, speed, brightness, and opacity are data — and never costs legibility or frame rate

## Out of scope

- sound
- WebGL/3D particle systems in r1
- exporting animation as video
- per-particle interactivity (clicking particles)

## Files and interfaces involved

- apps/web canvas particle overlay (planned) — 2D canvas layer drawing @Particle motion along React Flow edge paths (E-009), MOD-001
- apps/web frame-rate governor (planned) — monitor plus stepwise quality control consumed by canvas/REQ-003
- packages/contracts/src/limits.ts (planned) — frontend-facing limits LIM-003, LIM-004, LIM-016

## Requirements

### REQ-001 - Particle encoding on edges

Design intent: legibility over spectacle — the overlay encodes data, never occludes labels, and is
the only continuous animation in the product.

- priority: MUST
- phase: r1
- decidedness: Bounded
- acceptance:
  - AC-001: The system shall render particles on a canvas overlay following each @Edge path, with @Particle density mapped to flow volume, speed and brightness to intensity, and opacity to @Confidence
  - AC-002: When @Recalculation changes an @Edge value, the system shall animate thickness and @Particle density to the new value instead of replacing them instantly
  - AC-003: The system shall cap total particles at LIM-016 and keep node labels and values readable above the overlay

### REQ-002 - Performance auto-degradation
- priority: MUST
- phase: r1
- decidedness: Fixed
- basis: E-001 (T1)
- acceptance:
  - AC-004: The system shall monitor the frame rate continuously and target LIM-003 during interaction
  - AC-005: If the frame rate stays below LIM-004, then the system shall reduce @Particle count stepwise and, at minimum quality, replace particles with static directional dashes
  - AC-006: When the frame rate recovers, the system shall restore one quality step at a time

canvas/REQ-003 defers to this step-down order: animation quality is reduced before interaction
handling is.

### REQ-003 - Motion accessibility and background effect
- priority: MUST
- phase: r1
- decidedness: Fixed
- basis: E-008 (T1)
- acceptance:
  - AC-007: Where the OS reports prefers-reduced-motion, the system shall disable continuous @Particle motion and show static directional encoding
  - AC-008: The system shall provide an animation intensity setting and an on/off toggle for the background ambient flow
  - AC-009: If animation is disabled, then the system shall still convey direction and volume through arrowheads and edge thickness

## End-to-end verification

Open the seeded project with flows of known ordering and confirm @Particle density, speed,
brightness, and opacity follow the fixture ordering while total particles stay within LIM-016.
Throttle the CPU until the frame rate stays below LIM-004 and observe stepwise reduction ending in
static directional dashes, then recovery one step at a time when throttling ends. Enable
prefers-reduced-motion at the OS and observe particles stop while arrowheads and edge thickness
still convey direction and volume.
