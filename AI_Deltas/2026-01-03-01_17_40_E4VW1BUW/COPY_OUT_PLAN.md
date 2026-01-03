---
DeltaID: 2026-01-03-01_17_40_E4VW1BUW
Purpose: Provide manual instructions for integrating the delta artifacts into the main repository.
Sources:
- AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/core/phasecube.js
- AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/modules/bias/hearing_bias.js
Notes:
- Do not perform these actions inside the delta; they are for human execution in the repo.
- All actions are COPY operations; no in-place edits were made to repository files.
---

# Copy-Out Checklist

| Target Destination | Source (Delta) Path | Action | Notes |
| --- | --- | --- | --- |
| `src/core/phasecube.js` | `AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/core/phasecube.js` | COPY | Creates the baseline PhaseCube core implementation. Ensure ESM import paths in tests or harnesses align. |
| `src/modules/bias/hearing_bias.js` | `AI_Deltas/2026-01-03-01_17_40_E4VW1BUW/src/modules/bias/hearing_bias.js` | COPY | Adds Hearing bias field; requires caller-provided audio feature arrays. |

## Post-Copy Steps
- Wire `createPhaseCubeRunner` into `tests/conformance/dreaming_conformance.test.js` where the placeholder factory is referenced.
- Wire `HearingBiasField` into `tests/conformance/hearing_conformance.test.js` for bias decay and clamp assertions.
- Consider adding a PRNG factory export to satisfy `tests/unit/prng_sanity.test.js` (the core exposes `createMulberry32`).

## Manual Edits (if needed)
- Update any import maps or bundler configs if the project later adopts ESM path aliases.
- Verify parameter defaults match any project-specific configuration before enabling in production harnesses.

## Rollback Plan
- Delete the copied files from `src/core/phasecube.js` and `src/modules/bias/hearing_bias.js` if integration causes issues.
- Revert any test imports that were pointed at the new modules.
- Run `git checkout -- <path>` on affected files to restore the pre-copy state if committed.
