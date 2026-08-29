# Design Principles — cross-sns-audience-flow-analyzer

Judged under review §4 (Simplification). General design catalogue: `review-checklists` skill.

## Architecture of this codebase (not inferable from any single file)
- **Layer direction is one-way**: ui → store → api → core. No import cycles; a low-level or shared
  module never imports a higher layer.
- **Pure core, impure edges**: logic deterministic; I/O, network and model calls at the boundary,
  behind an interface.
- **Illegal states unrepresentable**: prefer types / enums / validated constructors over runtime
  checks scattered across call sites.

## Scope discipline
- Do the change that was asked for: no abstraction for hypothetical futures, no surrounding cleanup
  a bug fix did not need, no named pattern unless real duplication already demands it.
- Deleting code is a valid design outcome.
