---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Describe the testing scaffold for baseline conformance and sanity checks.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/40_Conformance_Tests.md (copied as mirror)
Notes:
- Provides runnable guidance using Node's built-in test runner.
- Actual core modules must be wired in by a human after copy-out.
---

# Testing Scaffold Overview

This directory establishes a minimal, dependency-free test scaffold aligned to the Dreaming and Hearing baselines. Tests use Node's built-in `node:test` harness and are initially marked as `skip` until the core and hearing modules are connected.

## Structure
- `conformance/` — baseline conformance skeletons (boot/shape/bounds/no-NaN).
- `unit/` — targeted sanity checks for helpers and derived utilities.

## Running Tests (once wired)

```sh
node --test tests/conformance/*.test.js
node --test tests/unit/*.test.js
```

Add `NODE_OPTIONS=--experimental-vm-modules` if ECMAScript modules are used and your Node version requires it.

## Next Steps
- Replace placeholders in the conformance tests with imports from the PhaseCube core and Hearing bias pipeline.
- Provide fixtures (seed, parameters, witness traces) to enable non-skipped runs.
- Extend unit tests as helpers/utilities are implemented.
