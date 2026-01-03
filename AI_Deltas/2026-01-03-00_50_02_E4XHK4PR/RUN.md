---
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Quick-start guidance for exercising the baseline modules delivered in this delta.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- tests/README.md (this delta)
Notes:
- Uses ES modules (`.mjs`) with no external dependencies.
- Commands assume the files remain under the delta directory; adjust paths after copy-out.
---

# Run Instructions

1. Ensure Node.js ≥ 18 is installed (no additional packages required).
2. From the repository root, execute the test suites:
   ```sh
   node --test AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/tests/**/*.test.mjs
   ```
3. To experiment with the core manually:
   ```js
   import { createPhaseCubeRunner } from './AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/src/core/phasecube.mjs';
   const runner = createPhaseCubeRunner({ gridSize: 10, seed: 2026 });
   runner.tick(); // advances one frame
   console.log(runner.metrics);
   ```
4. For Hearing coupling, create a bias field and pass it into `tick(bias.getField())` as needed.

## Notes
- Defaults mirror the baseline; avoid changing constants without revisiting specs and conformance tests.
- After copy-out, rerun the same commands with the paths adjusted to the canonical `src/` and `tests/` locations.
