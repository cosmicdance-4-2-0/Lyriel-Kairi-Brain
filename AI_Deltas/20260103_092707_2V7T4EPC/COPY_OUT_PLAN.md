---
DeltaID: 20260103_092707_2V7T4EPC
Purpose: Describe how to integrate the RGBA renderer module into the main repository without breaking the sandbox rule.
---

## Targets and Actions
1. **Action:** COPY
   - **Source:** `AI_Deltas/20260103_092707_2V7T4EPC/src/modules/render/rgbRenderer.js`
   - **Destination:** `src/modules/render/rgbRenderer.js`
   - **Notes:** Ensure the destination directory exists; create `src/modules/render/` if absent. No other files need modification.

## Manual Integration Notes
- After copying, update any render loop to import `mapStateToRgba` or `mapRunnerStateToRgba` and feed the resulting `Uint8ClampedArray` to your canvas/WebGL pipeline.
- If parity-driven alpha should never be fully transparent, pass non-zero `alphaOff` when calling the mapper.

## Rollback Plan
- Delete `src/modules/render/rgbRenderer.js` from the main repository if the integration causes issues.
- Revert any application code that imports the renderer to the prior state.
