---
DeltaID: 20260103_092700_FQ3KYTYN
Purpose: Human steps to integrate the renderer mapping module into the main repository.
Sources:
- AI_Deltas/20260103_092700_FQ3KYTYN/modules/render/stateRenderer.js
Notes:
- Do not perform these steps inside the delta directory; they are instructions for a human maintainer.
---

## Targets and Actions
1. **Add renderer module**
   - Target destination: `src/modules/render/stateRenderer.js`
   - Source path: `AI_Deltas/20260103_092700_FQ3KYTYN/modules/render/stateRenderer.js`
   - Action: COPY (create the `src/modules/render/` directory if it does not exist).
   - Manual edits required after copy: Wire imports in the rendering pipeline to call `writeRgbaFromState` or `writeNormalizedRgba` when constructing canvas `ImageData` or GPU textures.

2. **Retain spec mirror for provenance (optional)**
   - Target destination: none (reference only)
   - Source path: `AI_Deltas/20260103_092700_FQ3KYTYN/mirrors/docs/specs/DREAMING_BASELINE.md`
   - Action: COPY is not required; keep as provenance if desired.

## Rollback Plan
- Delete `src/modules/render/stateRenderer.js` if copied.
- Remove any import statements or usage sites referencing the module.
- No other files are touched by this copy-out; reverting these steps restores the prior state.
