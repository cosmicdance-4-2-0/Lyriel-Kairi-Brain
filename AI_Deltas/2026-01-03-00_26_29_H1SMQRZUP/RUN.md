---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Quick-start guide for running the baseline scaffolds after copy-out.
Sources:
- tests/README.md (copied as mirror)
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
Notes:
- Assumes Node.js ≥ 18 with built-in `node:test` runner.
- Commands will remain skipped until core modules are wired.
---

# Run Instructions

1. Install Node.js ≥ 18 (no extra dependencies required for the scaffold).
2. From repository root, execute conformance and unit suites once the core is wired:
   ```sh
   node --test tests/conformance/*.test.js
   node --test tests/unit/*.test.js
   ```
3. If ECMAScript modules are used in the implementation, add:
   ```sh
   export NODE_OPTIONS=--experimental-vm-modules
   ```
4. Provide seed/parameter fixtures to un-skip the tests when ready.

## Notes
- Tests are currently marked `test.skip` to avoid false negatives until core wiring is complete.
- Keep runtime defaults aligned with the DREAMING and HEARING baselines when enabling tests.
