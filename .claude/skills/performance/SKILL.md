---
name: performance
description: "Optimize code speed: output-invariant, baseline-first, profile-driven. Use when making something faster, profiling, or removing a bottleneck. Triggers: performance, perf, optimize, bottleneck, profile, slow, latency, speedup, make it faster."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Performance — cross-sns-audience-flow-analyzer

- **Baseline-first**: take a profile + output/metric Baseline before any optimization. Choose targets from data, not intuition.
- **Output-invariant**: optimization must not change results (values and rendering must be bit-identical). Changing visual/output is a design change — requires prior agreement.
- One bottleneck at a time. Verify against Baseline after each change.
- Avoid premature optimization. Confirm the bottleneck by profile metrics before starting.
- Normalize by computational complexity when comparing (beware improvements that only look fast due to parallelism or extra resources).
