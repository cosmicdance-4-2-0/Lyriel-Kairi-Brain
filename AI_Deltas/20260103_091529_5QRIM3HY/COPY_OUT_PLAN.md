---
DeltaID: 20260103_091529_5QRIM3HY
Purpose: Manual instructions for integrating the renderer module into the main repository.
Sources:
- docs/CODEX_Rules/20_Repo_Layout.md
- docs/specs/DREAMING_BASELINE.md
Notes:
- Copy actions are descriptive only; do not perform them inside the sandbox.
- Paths assume repository root context.
---

## Copy-Out Checklist
1. **Create renderer directory**
   - **Action:** Create `src/modules/renderer/` in the main repository if it does not already exist.
   - **Mode:** COPY (new directory)
   - **Source:** `AI_Deltas/20260103_091529_5QRIM3HY/src/modules/renderer/`
   - **Target:** `src/modules/renderer/`

2. **Add renderer module**
   - **Action:** Copy the renderer implementation file.
   - **Mode:** COPY
   - **Source:** `AI_Deltas/20260103_091529_5QRIM3HY/src/modules/renderer/phasecube_renderer.js`
   - **Target:** `src/modules/renderer/phasecube_renderer.js`

3. **Reference core for context (optional)**
   - **Action:** Review mirrored `phasecube/index.js` to confirm compatibility before wiring.
   - **Mode:** REVIEW ONLY
   - **Source:** `AI_Deltas/20260103_091529_5QRIM3HY/mirrors/src/core/phasecube/index.js`
   - **Target:** _No copy_; use for alignment while connecting renderer inputs.

4. **Wire into harness** (manual code edits outside this delta)
   - Import `createRenderer` where rendering is initialized (e.g., web harness or pipeline runner).
   - Instantiate with the grid size/scale used by `PhaseCubeRunner`.
   - Pass state arrays `{ plasma, liquid, parity }` to `render(state, ctx, timeSeconds)` each frame.

## Post-Copy Verification
- Run any existing rendering or conformance checks to ensure baseline behavior remains intact.
- Confirm that the renderer does not mutate core state and respects visibility thresholds.

## Rollback Plan
- Delete `src/modules/renderer/phasecube_renderer.js` and remove any wiring changes introduced during integration.
- Remove the `src/modules/renderer/` directory if it was newly created and is empty after deletion.
- Re-run the project to confirm previous rendering behavior is restored.
