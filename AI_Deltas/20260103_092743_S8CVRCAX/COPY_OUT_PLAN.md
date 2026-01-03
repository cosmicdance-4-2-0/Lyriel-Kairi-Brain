---
DeltaID: 20260103_092743_S8CVRCAX
Purpose: Human checklist for applying the renderer delta to the main repository.
Sources:
- docs/specs/DREAMING_BASELINE.md
Notes:
- Follow sandbox rule: all edits occur via copy-out, not automated file moves.
---

# COPY-OUT PLAN

## Target Destinations
- **Copy** `AI_Deltas/20260103_092743_S8CVRCAX/src/modules/render/phase_color_renderer.js` → `src/modules/render/phase_color_renderer.js`
  - Create `src/modules/render/` if it does not exist.

## Manual Edits After Copy
- Import the renderer where visualization occurs (e.g., web harness or pipeline renderer) and feed it the phase state arrays: `{ plasma, liquid, solid, parity }`.
- Replace any existing color mapping with `mapPhasesToRgba(state)` or `colorAt(state, idx)` outputs.
- Adjust alpha scaling during integration if partial transparency is preferred; the module currently uses parity directly as 0/255.

## Rollback Plan
- Delete `src/modules/render/phase_color_renderer.js` (and the render folder if it was newly created).
- Revert any imports or wiring added during manual integration.
- Verify `git status` is clean after removal.
