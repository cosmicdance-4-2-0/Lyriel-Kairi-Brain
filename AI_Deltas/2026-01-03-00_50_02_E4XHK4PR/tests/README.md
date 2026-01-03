---
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Describe the conformance/unit test coverage added in this delta.
Sources:
- docs/CODEX_Rules/40_Conformance_Tests.md (copied as mirror)
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
Notes:
- Tests target the new baseline implementations under `src/`.
- Files use ES modules (`.mjs`) to avoid package-level toggles.
---

# Test Coverage

- `conformance/dreaming_conformance.test.mjs` — boots the PhaseCube core, checks shape/bounds, and verifies seeded determinism for metrics.
- `conformance/hearing_conformance.test.mjs` — validates bias decay, clamp behavior, and Path B coupling bounds.
- `unit/prng_sanity.test.mjs` — ensures seeded PRNG repeatability and bounded outputs.

## Running Tests (from repo root)

```sh
node --test AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/tests/**/*.test.mjs
```

After copy-out, adjust the glob to point at `tests/**/*.test.mjs` in the canonical tree. Node.js ≥ 18 is recommended; no external dependencies are required.
