---
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Document the baseline-ready modules added in this delta for PhaseCube and Hearing.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/20_Repo_Layout.md (copied as mirror)
Notes:
- Files live under the delta directory; copy-out steps are documented separately.
- Defaults preserve baseline behavior and boundedness.
---

# PhaseCube Core and Hearing Modules

This delta adds minimal, baseline-aligned modules ready for copy-out:

- `core/prng.mjs` — seeded LCG for deterministic runs.
- `core/phasecube.mjs` — Dreaming core with Path B bias coupling.
- `hearing/bias_field.mjs` — Hearing bias field with decay, injections, and pB clamping.

## Usage (after copy-out)

```js
import { createPhaseCubeRunner } from './src/core/phasecube.mjs';
import { createHearingBias } from './src/hearing/bias_field.mjs';

const bias = createHearingBias({ gridSize: 18 });
const runner = createPhaseCubeRunner({ gridSize: 18, seed: 42 });

// inject features then tick the core
bias.ingest({ left: [0.3, 0.8], right: [0.5, 0.6] });
runner.tick(bias.getField());
```

Keep clamps and defaults unchanged unless updating the baseline with proper change control.
