---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Record the canonical neighborhood selection for PhaseCube baseline.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/10_Baseline_Conformance.md (copied as mirror)
Notes:
- Documents existing baseline intent; no behavior changes are introduced.
- Provides a reusable reference for conformance and test scaffolding.
---

# ADR 0001 — Neighborhood Definition

## Status
Accepted (baseline).

## Context
The Dreaming baseline requires an explicit neighborhood for plasma interactions to avoid drift across ports. The repository contained an empty placeholder ADR, leaving the canonical choice undocumented for implementers and testers.

## Decision
Adopt a 6-connected neighborhood (±X, ±Y, ±Z) with toroidal wrapping as the canonical topology for plasma neighbor sampling in PhaseCube. This aligns with Section 7.2 of the Dreaming baseline specification, which treats 6-connected as the default and 26-connected as a non-baseline variant.

## Rationale
- Matches the baseline spec and avoids ambiguity during refactors.
- Keeps computational cost minimal for reference implementations.
- Supports deterministic wrapping behavior required for conformance fixtures.

## Consequences
- Conformance tests and harnesses should validate neighbor sampling against the 6-connected toroidal rule.
- Any change to neighborhood size or boundary handling is baseline-breaking and must trigger a spec + ADR update and new golden fixtures.
- Implementations must document if they intentionally diverge (e.g., 26-connected) for experimental deltas.

## Notes
This ADR intentionally does not redefine update equations or constants; it captures the existing baseline choice for traceability.
