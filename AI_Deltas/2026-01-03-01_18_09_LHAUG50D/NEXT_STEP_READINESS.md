---
DeltaID: 2026-01-03-01_18_09_LHAUG50D
Purpose: Outline immediate, low-risk steps to wire Dreaming/Hearing scaffolds toward runnable conformance checks.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
- docs/CODEX_Rules/40_Conformance_Tests.md
- tests/README.md
- tests/conformance/dreaming_conformance.test.js
- tests/conformance/hearing_conformance.test.js
Notes:
- Recommendations avoid changing baseline equations or constants.
- Focus is on wiring and fixtures, not refactors.
---

# Next-Step Readiness Notes

This packet targets **wiring and fixture readiness** without touching core equations or default constants, keeping boundedness and non-collapse guarantees intact.

## Context Snapshot
- Conformance scaffolds exist but are `skip`-guarded (`tests/conformance/*.test.js`) and need real imports for Dreaming/Hearing modules.
- Specs require clamps and probability bounds to remain in place (see DREAMING_BASELINE §9, HEARING_BASELINE §4.4/§5).
- Baseline constants and update equations must stay frozen until an explicit change-control path (ADR + spec update) is invoked.

## Immediate Wiring Tasks (Low Risk)
1. **Expose a deterministic core runner**  
   - Provide a thin wrapper that constructs the PhaseCube state, seeds RNG (per ADR 0004), and surfaces `tick()` plus `state` snapshots.  
   - Keep boundary conditions toroidal and clamps `clamp01`-style (per DREAMING_BASELINE §6–§7).
2. **Connect hearing bias module**  
   - Implement `createHearingBias` to return a bias field with decay/injection/clamp semantics (`biasMin=-0.38`, `biasMax=0.38` defaults) and a `couple(base)` helper that clamps Path B probability to `[0.05, 0.95]`.  
   - Enforce influence-only coupling: no direct plasma/liquid/solid writes.
3. **Generate fixtures for conformance runs**  
   - Capture a golden witness trace (indices + plasma/liquid/solid/parity) for ~32–64 ticks using a fixed seed and canonical parameters.  
   - Store metrics (mean/variance) alongside the trace for tolerance-based assertions.
4. **Unskip tests with imports and fixtures**  
   - Wire `createPhaseCubeRunner` and `createHearingBias` factories into the conformance tests, swapping placeholders with actual modules.  
   - Keep clamps in tests aligned to spec ranges; avoid tightening tolerances until fixtures exist.
5. **Document tunable surfacing**  
   - Ensure any exposed config keeps defaults equal to baseline constants; add inline comments noting clamp ranges and deterministic seed options.

## Guardrails to Preserve Baseline Behavior
- Do **not** alter update equations, neighborhood definitions, or default constants; any deviation requires ADR + spec updates.
- Maintain boundedness: clamp plasma/liquid/solid to `[0,1]`, parity to `{0,1}`, bias to `[-0.38, 0.38]`, Path B probability to `[0.05, 0.95]`.
- Avoid internal smoothing that changes visual/behavioral feel unless a feature flag defaults to OFF.

## Suggested Deliverables After Copy-Out
- `src/core/phasecube/runner.js` (or equivalent) exposing `tick`/`state` with seeded initialization.
- `src/modules/hearing/bias.js` implementing decay/injection/clamp and `couple`.
- `tests/conformance/fixtures/` containing witness trace + metrics JSON for seeded runs.
- Updated `tests/conformance/*.test.js` with imports and fixture-driven assertions (remove `skip` once wired).

## Monitoring Checklist
- Boot/shape/bounds/NaN guards all passing under Node's test runner (`node --test`), with RNG seed reproducibility verified.
- Bias decay verified to trend toward zero with ears off; Path B modulation clamps verified via fixture replay.
- Renderer remains unaffected (UI-only changes should not touch core arrays).
