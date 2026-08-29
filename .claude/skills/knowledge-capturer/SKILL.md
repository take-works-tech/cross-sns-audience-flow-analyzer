---
name: knowledge-capturer
description: "Capture knowledge after a merge. Triggers: PR merged, post-merge, ADR, pattern, finding, retrospective."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Knowledge Capturer — cross-sns-audience-flow-analyzer

After a PR merges or a significant decision is made, capture reusable knowledge.

- **ADR** (Architecture Decision Record): context → decision → consequences, for non-obvious choices.
- **Pattern**: a reusable solution discovered (when to use, trade-offs).
- **Finding**: a bug/root-cause worth remembering (symptom → cause → fix → guard).
- Store under `docs/knowledge/`. Keep entries short and link related ones.
- Capture only what is non-obvious from code/git history (no duplication).
