---
DeltaID: 2026-01-03-00_50_45_7SMXI7WBE
Purpose: Provide a scoped, baseline-aligned to-do list to bootstrap implementation
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
Notes:
- Keep changes small and bounded; do not alter baseline equations or constants
- Favor seeded determinism hooks and conformance tests once code exists
---

# Next-Step Readiness Guide

## Observations
- Repository currently contains only documentation stubs (`src/`, `web/`, `tests/`, `tools/` are empty), so the first implementation pass can start cleanly without refactors.
- Specs emphasize boundedness, non-collapse, and influence-only audio coupling; defaults must match the documented baseline parameters.

## Immediate Actions (Suggested Ordering)
1. **Core scaffold (Dreaming)**
   - Create `src/core/phasecube.js` (ES module) implementing the baseline `PhaseGrid` with `plasma/liquid/solid/parity` arrays, toroidal neighbors, seeded initialization, and clamp-based updates (no modulo in baseline).
   - Expose a `tick(bias?)` API and minimal metrics (`mean_plasma`, `mean_liquid`, `mean_solid`, `parity_ratio`).
   - Keep randomness injectable (e.g., `Math.random` wrapper) to support later seeded runs.

2. **Bias seam wiring (Hearing-ready, optional initially)**
   - Define an interface in `src/pipeline/bias.js` that accepts a bias field or scalar deltas without touching core arrays; default should be a no-op to preserve baseline autonomy when audio is absent.
   - Avoid adding smoothing that alters feel unless gated and default-off.

3. **Minimal web harness**
   - Build `web/index.html` + `web/main.js` that imports the core module, instantiates a grid with default parameters, runs the tick loop at target FPS, and renders via 2D canvas projection per spec (perspective, parity-influenced hue).
   - Keep UI minimal: pause/resume, snapshot, and optional FPS overlay.

4. **Conformance scaffolding**
   - Under `tests/conformance/`, add smoke tests for boot, shape, bounds, and NaN checks using a fixed seed and small grid (e.g., `grid_size=8`).
   - Prepare fixture placeholders (`tests/fixtures/`) for future golden witness traces; initial tests can assert bounded ranges and array lengths until fixtures exist.

5. **Hearing module stub (non-intrusive)**
   - Create `src/modules/hearing/bias_field.js` that maintains a decaying bias field per HEARING_BASELINE §4.4 with clamp bounds; default hook should modulate `path_b_p` only.
   - Provide a simple feature-ingest stub that accepts `{left,right}` arrays but keeps ears off by default to avoid baseline changes.

6. **Tooling notes**
   - Update `tools/RUN.md` after integration to document how to launch the web harness and run tests (e.g., `npm`-free, pure static serve).
   - Add a short `README` note in `tests/` to clarify conformance intent once tests land.

## Boundedness / Safety Reminders
- Do **not** change default parameter values from the specs without ADR + conformance updates.
- Clamp `pB` within `[0.05, 0.95]` when bias is applied; clamp bias field within `[−0.38, 0.38]`.
- Keep perturbation separate from transition; bias may influence probabilities but not overwrite state directly.

## Seed & Determinism Hooks
- Provide an optional seeded PRNG (e.g., `mulberry32`) wired into perturbation and branch choices; expose the seed via constructor parameter and record it in metrics for reproducibility.

## Delivery Scope
- Aim for the smallest runnable harness plus smoke tests; defer advanced UI or smoothing until baseline behavior is verified.
