---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Describe the minimal web harness expectations for PhaseCube visualization.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/30_Code_Style.md (copied as mirror)
Notes:
- Focuses on structure; does not implement rendering.
- Web harness must remain thin glue over the core.
---

# Web Harness Guidelines

The web layer should stay minimal and avoid duplicating core logic:

- `index.html` — container elements, canvas, and minimal controls for toggling modules.
- `main.js` — initializes the PhaseCube core, wires Hearing bias (optional), and handles render loop scheduling.
- `renderer/` (optional) — projection and color mapping utilities that consume core state without mutating it.

## Baseline Constraints
- Keep visualization separate from simulation; no DOM access inside `src/` core modules.
- Clamp and bounds enforcement remain in the core; the web harness should only read state.
- Audio input (if enabled) must map to bias injection, not direct state writes.

## Suggested Next Steps
- Add a minimal canvas renderer that projects points and colors by plasma/parity.
- Provide UI toggles for seeded runs and for enabling/disabling Hearing bias injection.
- Keep all new knobs documented and defaulted to baseline behavior.
