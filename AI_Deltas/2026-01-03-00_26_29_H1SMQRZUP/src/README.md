---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Outline the intended PhaseCube source layout for core and module seams.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/20_Repo_Layout.md (copied as mirror)
Notes:
- Provides structure guidance without implementing core logic.
- Keeps core free of UI and aligns with baseline extension seams.
---

# src/ Layout (Planned)

This directory should hold the baseline implementation and modular seams:

- `core/phasecube/` — core state, update loop, seeded PRNG, metrics.
- `modules/input/` — optional inputs (audio, scripted pulses) producing observations.
- `modules/bias/` — influence-only bias layers (Hearing baseline lives here).
- `modules/output/` — logging, witness capture, diagnostics (no state mutation).
- `pipeline/` — lightweight orchestration connecting input → bias → core → output.

## Implementation Notes
- Keep core logic independent of DOM/web APIs.
- Expose explicit clamps and bounds per DREAMING_BASELINE and HEARING_BASELINE.
- Provide a deterministic seed option that flows through all stochastic points.
- Prefer small, composable modules to preserve inspectability and testability.

## Next Steps
- Add `core/phasecube` implementation and wire to conformance tests.
- Provide a bias module that only modulates Path B probability and clamps to safe ranges.
- Document any deltas (non-baseline behavior) via ADR + conformance updates.
