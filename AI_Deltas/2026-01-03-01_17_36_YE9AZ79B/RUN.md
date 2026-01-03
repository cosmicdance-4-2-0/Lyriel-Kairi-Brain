---
DeltaID: 2026-01-03-01_17_36_YE9AZ79B
Purpose: Show how to exercise the PhaseCube runner inside this delta for quick sanity checks.
Sources:
- AI_Deltas/2026-01-03-01_17_36_YE9AZ79B/src/core/phasecube/index.js
Notes:
- Commands run entirely inside the delta directory and do not touch repository files.
- Uses Node's ESM loader via `--input-type=module`.
---

## Quick Sanity Check
From the repository root:

```sh
node --input-type=module -e "import { createPhaseCubeRunner } from './AI_Deltas/2026-01-03-01_17_36_YE9AZ79B/src/core/phasecube/index.js'; const r = createPhaseCubeRunner({ seed: 1234 }); console.log(r.tick());"
```

You should see a metrics object with bounded means (all values in `[0,1]`). Re-run with the same seed to confirm deterministic initialization. Bias coupling is optional; pass a `Float32Array` of length `gridSize^3` to `tick(biasField)` to modulate `pB` within `[pBMin,pBMax]`.
