---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Specify boundary topology for PhaseCube grids to prevent drift across ports.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/20_Repo_Layout.md (copied as mirror)
Notes:
- Codifies the toroidal boundary choice already implied by the baseline spec.
- Provides guidance for conformance fixtures and future deltas.
---

# ADR 0002 — Boundary Topology

## Status
Accepted (baseline).

## Context
Baseline behavior depends on explicit boundary handling for neighbor lookups and coordinate wrapping. The existing ADR file was empty, leaving ambiguity for implementers when building conformance tests or ports.

## Decision
Use toroidal (modular) wrapping on all three axes for grid indexing in PhaseCube baseline implementations. Indices beyond `[0, grid_size-1]` wrap using modular arithmetic before neighbor access. Non-wrapping boundaries are considered baseline-breaking variants and must be documented separately.

## Rationale
- Matches the Dreaming baseline recommendation and common reference implementations.
- Preserves spatial continuity without edge effects that could cause drift or collapse.
- Keeps deterministic behavior for seeded runs and golden traces.

## Consequences
- Conformance tests should assert correct wrapping for boundary-adjacent cells.
- Implementers must avoid clamping-to-edge or reflective boundaries unless authoring an explicit delta.
- Any change to wrapping requires new ADR entries plus spec and fixture updates.

## Notes
This ADR does not alter update equations or parameter defaults; it records the baseline topology for reproducibility.
