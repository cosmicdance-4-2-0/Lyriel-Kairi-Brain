---
DeltaID: 20260103_092707_2V7T4EPC
Purpose: Quick usage notes for the RGBA renderer module.
---

## Usage
1. Copy `src/modules/render/rgbRenderer.js` into the main repo (see `COPY_OUT_PLAN.md`).
2. Import the mapper in your render loop:
   ```js
   import { mapRunnerStateToRgba } from '../src/modules/render/rgbRenderer.js';

   const rgba = mapRunnerStateToRgba(runner.state, { alphaOff: 64, alphaOn: 255 });
   // Feed `rgba` into your canvas/WebGL upload step.
   ```
3. The mapping is direct: plasma→R, liquid→G, solid→B, parity→A. Values are clamped to [0,1] before scaling to 0–255.

## Notes
- The helper assumes the PhaseCube state arrays are the same length; it throws if they are not.
- Adjust `alphaOff`/`alphaOn` to keep parity-zero cells partially visible if desired.
