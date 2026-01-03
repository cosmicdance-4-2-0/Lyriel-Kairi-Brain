---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Capture the canonical clamp policy for PhaseCube channels and bias fields.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Reinforces boundedness and non-collapse constraints without altering equations.
- Guides conformance tests for bounds and NaN/Infinity checks.
---

# ADR 0003 — Clamp Policy

## Status
Accepted (baseline).

## Context
Boundedness is a hard rule for both Dreaming and Hearing baselines, but the previous ADR placeholder did not record the exact clamp policy. Implementers need a single reference to avoid silent drift in state ranges or bias coupling.

## Decision
- Core channels (`plasma`, `liquid`, `solid`) are clamped to `[0,1]` after each update path.
- Parity remains binary `{0,1}` with any toggling performed via XOR or equivalent.
- Hearing bias field values are clamped to a bounded symmetric range (baseline suggested `[-0.38, +0.38]`).
- Path B probability modulation uses clamps to `pB_min` / `pB_max` (baseline suggested `[0.05, 0.95]`).

Clamping is applied explicitly after computations rather than relying on implicit numeric behavior. Modulo wrapping of channel values is considered a non-baseline variant.

## Rationale
- Enforces the boundedness and non-collapse constraints from the baseline specs.
- Provides deterministic behavior for seeded runs and reproducible fixtures.
- Prevents NaN/Infinity cascades from propagating into renderer or metrics.

## Consequences
- Conformance tests must include bounds checks for core channels, bias fields, and branch probabilities.
- Any change to clamp ranges or policies is baseline-breaking and requires updated ADR + spec + fixtures.
- Implementations should document clamp sites near update logic to keep the behavior inspectable.

## Notes
This ADR records existing policy; it does not introduce new defaults or smoothing behavior.
