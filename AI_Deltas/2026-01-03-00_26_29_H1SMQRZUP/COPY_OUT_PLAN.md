---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Manual copy instructions for integrating the hygiene delta into the canonical repo.
Sources:
- AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/CHANGELOG.md
Notes:
- Do not run these steps inside the sandboxed delta; perform them in the real repo.
- Actions default to COPY; OVERWRITE is explicit where existing placeholders will be replaced.
---

# Copy-Out Plan

## Targets and Actions
1. **ADR content (OVERWRITE existing placeholders):**
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/docs/adr/0001-neighborhood.md` → `docs/adr/0001-neighborhood.md`
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/docs/adr/0002-boundary-topology.md` → `docs/adr/0002-boundary-topology.md`
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/docs/adr/0003-clamp-policy.md` → `docs/adr/0003-clamp-policy.md`
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/docs/adr/0004-prng-and-determinism.md` → `docs/adr/0004-prng-and-determinism.md`

2. **Testing scaffold (COPY/OVERWRITE as noted):**
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/tests/README.md` → `tests/README.md` (OVERWRITE placeholder)
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/tests/conformance/dreaming_conformance.test.js` → `tests/conformance/dreaming_conformance.test.js`
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/tests/conformance/hearing_conformance.test.js` → `tests/conformance/hearing_conformance.test.js`
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/tests/unit/prng_sanity.test.js` → `tests/unit/prng_sanity.test.js`

3. **Developer guidance (OVERWRITE placeholders / add new):**
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/src/README.md` → `src/README.md` (OVERWRITE placeholder)
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/web/README.md` → `web/README.md` (OVERWRITE placeholder)
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/RUN.md` → `RUN.md` (new)
   - Copy `AI_Deltas/2026-01-03-00_26_29_H1SMQRZUP/TESTING.md` → `TESTING.md` (new)

## Manual Follow-Ups After Copy
- Wire real implementations into the test placeholders (`createPhaseCubeRunner`, `createHearingBias`, `createPrng`).
- Generate and store baseline fixtures (seed, parameters, witness traces, metrics) once core is available.
- Remove `test.skip` annotations incrementally when implementations are ready.

## Rollback Plan
- Revert the copied files in the canonical repo using `git checkout -- <paths>` for any overwritten targets.
- Delete newly added files (`RUN.md`, `TESTING.md`, `tests/conformance/*`, `tests/unit/*`) if rollback is required.
- Confirm a clean working tree with `git status` after rollback.
