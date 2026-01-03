---
DeltaID: 2026-01-03-01_17_36_YE9AZ79B
Purpose: Record the authored artifacts for this delta and their intended integration steps.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/adr/0001-neighborhood.md
- docs/adr/0003-clamp-policy.md
- docs/adr/0004-prng-and-determinism.md
Notes:
- Focused on preparing a baseline-conformant PhaseCube core runner and integration guidance.
- No existing repository files were modified; all changes live under the delta directory.
---

## Summary
This delta introduces a seeded, clamp-respecting PhaseCube core runner aligned with the Dreaming baseline and readies it for copy-out into `src/core/phasecube/`. It also provides run and copy-out guidance to keep integration bounded and reversible.

## Files Created
- `src/core/phasecube/index.js` — baseline PhaseCube runner with seeded PRNG, clamp01 enforcement, and Path B bias modulation hook.
- `RUN.md` — quick-start instructions for exercising the runner inside the delta.
- `COPY_OUT_PLAN.md` — explicit steps for copying the new runner into the main repository.

## Files Mirrored
- None (all references point to existing repository docs without duplication).

## Known Limitations / TODOs
- Metrics omit a tick counter; add `t` tracking when integrating with renderers or conformance fixtures.
- Witness sampling and fixture export are not implemented; conformance tests will need those hooks wired during copy-out.
- Bias handling expects a full-length field; add validation or reshaping if alternate coupling surfaces are introduced.
- PRNG is local to the core; if other modules need determinism, thread the same seed through their factories during integration.

## Copy-Out Plan
See `COPY_OUT_PLAN.md` for the exact destination paths and rollback steps.
