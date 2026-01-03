---
DeltaID: 20260103_092707_AW0M53MV
Purpose: Usage notes for the renderer module.
Sources:
- AI_Deltas/20260103_092707_AW0M53MV/mirrors/src/modules/render/phasecubeRenderer.js
Notes:
- No runtime dependencies beyond standard JS.
---

# RUN / USAGE — PhaseCubeRenderer

## Import
```js
import { createPhaseCubeRenderer } from './src/modules/render/phasecubeRenderer.js';
// or
import { PhaseCubeRenderer } from './src/modules/render/phasecubeRenderer.js';
```

## Render RGBA Buffer
```js
const renderer = createPhaseCubeRenderer({ gridSize: 16 });
const rgba = renderer.renderToRgba({
  plasma: state.plasma,
  liquid: state.liquid,
  solid: state.solid,
  parity: state.parity,
});
// `rgba` is a Uint8ClampedArray of length gridSize^3 * 4 (RGBA order).
```

## Notes
- Inputs must be arrays of equal length; when `gridSize` is provided, the renderer enforces `gridSize^3` length.
- Channels are clamped to `[0,1]` before packing; parity is treated as alpha.
