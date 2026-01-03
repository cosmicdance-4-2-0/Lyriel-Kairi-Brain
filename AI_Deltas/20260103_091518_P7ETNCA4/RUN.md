---
DeltaID: 20260103_091518_P7ETNCA4
Purpose: Describe how to use the renderer module for manual testing.
Sources:
- mirrors/src/core/phasecube/index.js
- mirrors/web/main.js
Notes:
- No runnable harness is included; instructions assume consumer wiring.
---

# RUN INSTRUCTIONS

1. Copy the renderer into the repo (see `COPY_OUT_PLAN.md`).
2. In a browser harness (e.g., `web/main.js`), import:
   - `import { PhaseCubeRenderer } from './modules/render/phasecube_renderer.js';`
3. Create a `PhaseCubeRenderer` instance with matching `gridSize`, `scale`, and `pointSize` to your simulation parameters.
4. On each resize, call `renderer.resize(width, height)` after updating the canvas backing size and transform.
5. On each frame:
   - Optionally call `renderer.advanceHue(deltaSeconds)` to progress the time-based color cycle.
   - Call `renderer.render(ctx, phaseCubeRunner.state)` providing the 2D context and current state.
6. Manage input, animation cadence, and bias modules in the host harness; the renderer is draw-only.
