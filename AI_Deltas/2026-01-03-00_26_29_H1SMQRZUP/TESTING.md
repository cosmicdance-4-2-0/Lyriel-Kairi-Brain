---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Document the testing approach, coverage goals, and enablement steps for baseline conformance.
Sources:
- docs/CODEX_Rules/40_Conformance_Tests.md (copied as mirror)
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
Notes:
- Focuses on scaffolding; actual assertions remain skipped until the core is integrated.
- Emphasizes baseline invariants: boot, shape, bounds, no-NaN, probability clamps.
---

# Testing Approach

The scaffold targets the minimum required conformance checks:
- **Boot**: Dreaming core ticks without exceptions for a fixed number of frames.
- **Shape**: `grid_size^3` arrays preserve length before/after ticks.
- **Bounds**: `plasma`, `liquid`, `solid`, and bias fields remain within their clamped ranges.
- **No-NaN/No-Infinity**: finite values enforced for state and bias arrays.
- **Probability clamps**: Path B probability respects `pB_min/pB_max` after bias coupling.

## Enabling the Tests

1. Wire the PhaseCube core into `tests/conformance/dreaming_conformance.test.js` by replacing the `createPhaseCubeRunner` placeholder.
2. Wire the Hearing bias module into `tests/conformance/hearing_conformance.test.js` by replacing `createHearingBias`.
3. Provide deterministic seed and parameter fixtures matching the DREAMING and HEARING baselines.
4. Remove `test.skip` wrappers incrementally as implementations become available.

## Running

```sh
node --test tests/conformance/*.test.js
node --test tests/unit/*.test.js
```

Optional: set `NODE_OPTIONS=--experimental-vm-modules` for ESM.

## Extension Hooks
- Add witness trace comparisons once baseline fixtures are generated.
- Introduce RNG snapshot tests in `tests/unit/prng_sanity.test.js` after selecting a PRNG.
- Include renderer-independent metrics assertions (means/variances) to guard against drift.
