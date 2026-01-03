---
DeltaID: 2026-01-03-01_17_21_E69CSI40
Purpose: Capture a minimal, scoped readiness checklist to unblock the next implementation pass without altering baseline behavior.
Sources:
- src/README.md
- tests/README.md
- tests/conformance/dreaming_conformance.test.js
- tests/conformance/hearing_conformance.test.js
- tests/unit/prng_sanity.test.js
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
Notes:
- Checklist favors bounded, non-collapsing defaults and avoids touching update equations.
- Keep implementations modular so conformance tests can wire in without UI entanglement.
---

# Next-Step Readiness Checklist

## Current State Snapshot
- **Core implementation missing:** `src/` only contains layout guidance; no `core/phasecube` runtime exists.
- **Tests scaffolded but skipped:** Conformance and PRNG sanity tests under `tests/` throw TODOs until factories are supplied.
- **Specs authoritative:** DREAMING and HEARING baselines define clamps, boundedness, and coupling; no constants have been codified in code yet.

## Priority Work Items
1. **Implement deterministic PRNG wrapper**
   - Location: `src/core/phasecube/prng.js` (new) with a simple seeded generator (e.g., mulberry32) returning floats in `[0,1)`. Wire to accept an explicit `seed`.
   - Wire `createPrng` into `tests/unit/prng_sanity.test.js` by exporting the factory.
2. **Build minimal PhaseCube core runner**
   - Location: `src/core/phasecube/index.js` with state arrays `plasma`, `liquid`, `solid`, `parity`, plus `tick()` implementing the two-stage update per `docs/specs/DREAMING_BASELINE.md` (clamp to `[0,1]`, parity bit in `{0,1}`).
   - Ensure toroidal neighbor sampling and parameter surface (`flip_p`, `parity_p`, `path_b_p`, `parity_gain`, `alpha`, `grid_size`).
   - Expose `state` and `tick()` so `tests/conformance/dreaming_conformance.test.js` can import a `createPhaseCubeRunner` factory.
3. **Add Hearing bias field module**
   - Location: `src/modules/bias/hearing/index.js` producing a bias array with decay→inject→clamp and coupling `couple(base)` that clamps `pB` within `[0.05, 0.95]` per `docs/specs/HEARING_BASELINE.md`.
   - Provide `ingest({ left, right })`, `tick()`, and `getField()`; no direct writes to core state arrays.
4. **Wire conformance scaffolds**
   - Update `tests/conformance/*` placeholders to import the new factories and remove `test.skip` once behavior matches bounds/shape expectations.
   - Keep randomness seeded for reproducibility during tests.
5. **Prepare fixtures (manual follow-up)**
   - Add baseline parameters, seed, and witness traces under `tests/fixtures/` to lock behavior; update conformance tests to compare against these once the core stabilizes.

## Guardrails and Constraints
- Do **not** alter baseline equations or default bounds without an ADR and spec updates.
- Keep bias influence limited to Path B probability modulation; avoid plasma/liquid/solid overwrites.
- Preserve modularity: `src/core/` must remain DOM-free; `web/` should import from core without duplicating logic.

## Quick Dependency Notes
- Node built-in `node:test` runner is sufficient; no new dependencies required for the initial pass.
- Static serving via `python -m http.server` remains the intended web entry point until a bundler is needed.

## Validation Targets (post-implementation)
- **Boot/shape/bounds/no-NaN** checks in `tests/conformance/dreaming_conformance.test.js` should pass without skips.
- **Bias decay/clamp/coupling** checks in `tests/conformance/hearing_conformance.test.js` should pass without injecting collapse or runaway excitation.
- **PRNG repeatability** in `tests/unit/prng_sanity.test.js` should produce identical sequences for identical seeds.
