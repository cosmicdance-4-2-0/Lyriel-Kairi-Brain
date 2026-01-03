# CHANGES

- **Target repo path:** package.json
  - **Change type:** NEW
  - **Summary:** Add ESM-enabled package metadata marking version v0.0.2 and wiring Node test script.
  - **Rationale:** Needed to run ES module-based tests and record the iteration bump.
  - **Notes for the human applying it:** Create at repo root; no external dependencies added.

- **Target repo path:** src/core/prng.js
  - **Change type:** NEW
  - **Summary:** Provide a seedable Mulberry32 PRNG helper with clamp utility for bounded simulations.
  - **Rationale:** Baseline requires deterministic runs and explicit PRNG selection.
  - **Notes for the human applying it:** Module is dependency-free; export names are `createPrng` and `clamp01`.

- **Target repo path:** src/core/phasecube/index.js
  - **Change type:** NEW
  - **Summary:** Implement PhaseCube runner with seeded initialization, toroidal 6-neighbor sampling, perturbation + transition stages, and bias-clamped Path B selection.
  - **Rationale:** Moves project from scaffold to runnable core aligning with DREAMING baseline and ADRs.
  - **Notes for the human applying it:** Uses typed arrays; accepts optional `biasField` for Path B modulation only.

- **Target repo path:** src/modules/bias/hearing.js
  - **Change type:** NEW
  - **Summary:** Add Hearing bias field with decay, Gaussian-like spatial kernel, clamping, and Path B coupling helper.
  - **Rationale:** Satisfies HEARING baseline by providing bounded influence without direct state writes.
  - **Notes for the human applying it:** Defaults align with spec suggestions; adjust parameters in constructor if needed.

- **Target repo path:** tests/conformance/dreaming_conformance.test.js
  - **Change type:** REPLACE
  - **Summary:** Activate conformance smoke tests to exercise the new PhaseCube runner for boot, shape, and boundedness.
  - **Rationale:** Ensure baseline invariants are checked against the implemented core.
  - **Notes for the human applying it:** Imports from `src/core/phasecube/index.js`; run with Node's built-in test runner.

- **Target repo path:** tests/conformance/hearing_conformance.test.js
  - **Change type:** REPLACE
  - **Summary:** Activate boundedness and coupling tests for the Hearing bias field, removing placeholder skips.
  - **Rationale:** Validates decay/clamp behavior and Path B modulation per hearing baseline.
  - **Notes for the human applying it:** Imports from `src/modules/bias/hearing.js`; uses small grids for speed.

- **Target repo path:** tests/unit/prng_sanity.test.js
  - **Change type:** REPLACE
  - **Summary:** Enable deterministic PRNG repeatability test using the new PRNG helper.
  - **Rationale:** Confirms seeding expectations captured in ADR 0004.
  - **Notes for the human applying it:** No dependencies; runs via Node test harness.
