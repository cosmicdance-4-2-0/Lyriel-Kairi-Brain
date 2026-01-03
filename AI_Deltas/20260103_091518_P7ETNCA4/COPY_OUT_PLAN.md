---
DeltaID: 20260103_091518_P7ETNCA4
Purpose: Human instructions to copy the renderer module into the repo.
Sources:
- mirrors/docs/specs/DREAMING_BASELINE.md
- mirrors/src/core/phasecube/index.js
- mirrors/web/main.js
Notes:
- Do not perform these steps inside the delta; copy-out is manual.
---

# COPY_OUT_PLAN

## Targets
- Destination: `src/modules/render/phasecube_renderer.js`
  - Source: `AI_Deltas/20260103_091518_P7ETNCA4/src/modules/render/phasecube_renderer.js`
  - Action: COPY (new file)

## Post-Copy Checks
- Ensure imports in consumers point to `src/modules/render/phasecube_renderer.js`.
- Keep renderer decoupled from DOM/event logic per baseline renderer guidance.

## Manual Edits After Copy
- None required.

## Rollback Plan
- Delete `src/modules/render/phasecube_renderer.js` if added.
- Revert any import wiring performed during integration (not part of this delta).
