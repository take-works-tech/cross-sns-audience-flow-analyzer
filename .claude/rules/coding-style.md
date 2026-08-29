# Coding Style — cross-sns-audience-flow-analyzer

Scope: src

## Invariants
- catch/except must terminate control flow (return/raise/exit)
- Constants/defaults live in one shared SSoT module (e.g. `constants` / `config` / `defaults`); never redefine the same literal across files (import it)
