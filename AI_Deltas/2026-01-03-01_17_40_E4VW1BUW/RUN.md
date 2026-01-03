---
DeltaID: 2026-01-03-01_17_40_E4VW1BUW
Purpose: Outline how to exercise the PhaseCube core and Hearing bias modules contained in this delta.
Sources:
- AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/core/phasecube.js
- AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/modules/bias/hearing_bias.js
Notes:
- Commands assume Node 18+ with ES module support.
- Modules are standalone and do not require DOM or audio APIs.
---

# Quickstart

From the repository root (after copy-out or by referencing the delta paths directly), you can experiment with the modules in Node:

```sh
node --input-type=module -e "import { createPhaseCubeRunner } from './AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/core/phasecube.js'; const runner = createPhaseCubeRunner({ seed: 1234, gridSize: 8 }); console.log(runner.tick()); console.log(runner.state.plasma.length);"
```

For the Hearing bias field:

```sh
node --input-type=module -e "import { HearingBiasField } from './AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/modules/bias/hearing_bias.js'; const bias = new HearingBiasField({ gridSize: 8, binCount: 8 }); bias.ingest({ left: Array(8).fill(0.5), right: Array(8).fill(0.25) }); console.log({ sample: bias.getField()[0], coupled: bias.couple(0.65)[0] });"
```

## Notes
- The snippets above run directly from the delta directory. After copy-out, update paths to `src/core/phasecube.js` and `src/modules/bias/hearing_bias.js`.
- No build step is required; both modules are ESM and avoid DOM dependencies.
- Tests in `tests/conformance/` and `tests/unit/` will need to import these modules manually to replace placeholder factories.
