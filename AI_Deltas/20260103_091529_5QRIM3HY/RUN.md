---
DeltaID: 20260103_091529_5QRIM3HY
Purpose: Describe how to exercise the renderer module after copy-out.
Sources:
- src/core/phasecube/index.js (mirrored)
- docs/specs/DREAMING_BASELINE.md
Notes:
- Assumes a browser-based harness using native ES modules and a 2D canvas context.
---

## Quick Usage Sketch
1. **Instantiate the core runner**
   ```js
   import { createPhaseCubeRunner } from './src/core/phasecube/index.js';
   import { createRenderer } from './src/modules/renderer/phasecube_renderer.js';

   const runner = createPhaseCubeRunner({ gridSize: 16, seed: 42 });
   const renderer = createRenderer({ gridSize: 16, scale: 24, pointSize: 4 });
   ```

2. **Prepare the canvas**
   ```js
   const canvas = document.querySelector('canvas');
   const ctx = canvas.getContext('2d');
   const dpr = Math.min(window.devicePixelRatio || 1, 2);
   canvas.width = canvas.clientWidth * dpr;
   canvas.height = canvas.clientHeight * dpr;
   renderer.setViewport(canvas.width, canvas.height, dpr);
   ```

3. **Render each frame**
   ```js
   let last = performance.now();
   function frame(now) {
     const dt = (now - last) / 1000;
     last = now;
     runner.tick();
     renderer.render(runner.state, ctx, now / 1000);
     requestAnimationFrame(frame);
   }
   requestAnimationFrame(frame);
   ```

## Notes
- The renderer is read-only: it consumes `{ plasma, liquid, parity }` arrays and does not mutate them.
- Visibility and hue parameters can be tuned via the `createRenderer` options; defaults match the baseline visualization guidance.
- No build tooling is required; the module uses native ES module syntax.
