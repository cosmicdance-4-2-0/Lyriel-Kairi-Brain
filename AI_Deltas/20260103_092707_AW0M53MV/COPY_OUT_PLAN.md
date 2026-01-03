---
DeltaID: 20260103_092707_AW0M53MV
Purpose: Manual copy-out instructions for integrating the renderer.
Sources:
- AI_Deltas/20260103_092707_AW0M53MV/mirrors/src/modules/render/phasecubeRenderer.js
Notes:
- Do not perform copy-out inside the delta; instructions are for humans.
---

# COPY-OUT PLAN — 20260103_092707_AW0M53MV

## Targets and Actions
1. **Copy** `AI_Deltas/20260103_092707_AW0M53MV/mirrors/src/modules/render/phasecubeRenderer.js`  
   → to `src/modules/render/phasecubeRenderer.js`
   - Action: COPY (create the `render` directory if missing).
   - Post-copy: Ensure module exports are wired into any consumers as needed.

## Manual Edits After Copy
- None required for baseline usage; consumers may optionally add import/export wiring to existing pipelines or tests.

## Rollback Plan
1. Delete `src/modules/render/phasecubeRenderer.js` if added during copy-out.
2. Revert any downstream import/export wiring introduced during integration.
