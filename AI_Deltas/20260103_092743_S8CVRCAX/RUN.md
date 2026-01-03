---
DeltaID: 20260103_092743_S8CVRCAX
Purpose: Describe how to exercise the renderer module in isolation.
Sources:
- docs/specs/DREAMING_BASELINE.md
Notes:
- No live harness is provided; instructions assume a Node or browser module consumer.
---

# RUN / USAGE NOTES

1. Ensure your consumer supports ES modules.
2. Import the renderer:
   ```js
   import { mapPhasesToRgba, colorAt } from './src/modules/render/phase_color_renderer.js';
   ```
3. Prepare a state object with aligned arrays:
   ```js
   const state = {
     plasma: Float32Array.from([0.2, 0.8]),
     liquid: Float32Array.from([0.4, 0.6]),
     solid:  Float32Array.from([0.9, 0.1]),
     parity: Int8Array.from([0, 1]),
   };
   ```
4. Generate RGBA data for a canvas or WebGL texture:
   ```js
   const rgba = mapPhasesToRgba(state); // Uint8ClampedArray [51,102,230,0, 204,153,26,255]
   // Example: putImageData(...) on a 1D canvas strip, or upload to a texture.
   ```
5. To sample a single cell color:
   ```js
   const color = colorAt(state, 1); // { r: 204, g: 153, b: 26, a: 255 }
   ```
6. Clamp behavior:
   - Non-finite values are treated as 0.
   - All channels are clamped to `[0,1]` before scaling to `[0,255]`.

No additional dependencies or build steps are required.
