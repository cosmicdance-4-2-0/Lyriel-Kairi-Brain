---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Document deterministic seeding and PRNG expectations for PhaseCube runs.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Clarifies seeding obligations for both core and hearing modules.
- Enables reproducible conformance tests without altering runtime defaults.
---

# ADR 0004 — PRNG and Determinism Policy

## Status
Accepted (baseline).

## Context
The baseline requires deterministic runs when seeded, but the ADR placeholder lacked details. Reproducible behavior is necessary for witness traces, golden fixtures, and debugging across implementations.

## Decision
- Provide a deterministic seed option for the Dreaming core PRNG and for any stochastic operations in Hearing (e.g., feature noise or bias jitter if present).
- Default behavior may remain non-deterministic, but a seed parameter must exist and route through all stochastic call sites.
- Seeded runs must yield repeatable state evolution given identical parameters and inputs.
- PRNG implementation must be explicit (e.g., linear congruential, Mulberry32, or crypto PRNG), not implicit reliance on runtime globals.

## Rationale
- Determinism enables conformance fixtures and regression detection.
- Explicit seeding prevents accidental drift when porting or refactoring.
- Matches baseline requirement for optional deterministic mode.

## Consequences
- Test harnesses should expose a seeded mode and verify repeatability across multiple runs.
- Any change to PRNG algorithm or seeding pipeline requires updated ADR entries plus regenerated fixtures.
- Randomness used only for rendering should remain isolated from simulation PRNG to avoid cross-coupling.

## Notes
This ADR does not prescribe a specific PRNG algorithm; it records the need for a documented, seedable choice and consistent propagation through hearing/dreaming pipelines.
