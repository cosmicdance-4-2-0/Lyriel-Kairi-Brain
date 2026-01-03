---
DeltaID: 20260103_092700_FQ3KYTYN
Purpose: How to exercise the renderer mapping helpers.
Sources:
- AI_Deltas/20260103_092700_FQ3KYTYN/modules/render/stateRenderer.js
Notes:
- No runnable binary exists; usage is demonstrated via import snippets.
---

## Using the renderer helpers

1. Import the module:
   ```js
   import { writeRgbaFromState, writeNormalizedRgba } from './modules/render/stateRenderer.js';
   ```
2. Prepare a state object with `plasma`, `liquid`, `solid`, and `parity` arrays (Float32Array/Int8Array are fine).
3. Generate a buffer for `ImageData`:
   ```js
   const rgba = writeRgbaFromState({ plasma, liquid, solid, parity });
   const image = new ImageData(rgba, gridSize, gridSize * gridSize); // adjust dimensions to your projection
   ```
4. For GPU pipelines, emit normalized floats:
   ```js
   const textureData = writeNormalizedRgba({ plasma, liquid, solid, parity });
   ```

No additional build steps or dependencies are required.
