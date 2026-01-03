---
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Manual copy instructions for integrating this delta into the canonical repo.
Sources:
- AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/CHANGELOG.md
Notes:
- Actions default to COPY; OVERWRITE is explicit where placeholders already exist.
- Mirrors are for provenance only and do not need to be copied.
---

# Copy-Out Plan

## Targets and Actions
1. **Core implementation (new):**
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/src/core/prng.mjs` → `src/core/prng.mjs`
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/src/core/phasecube.mjs` → `src/core/phasecube.mjs`

2. **Hearing bias (new):**
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/src/hearing/bias_field.mjs` → `src/hearing/bias_field.mjs`

3. **Developer guidance (OVERWRITE placeholders where present):**
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/src/README.md` → `src/README.md` (OVERWRITE empty placeholder)
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/tests/README.md` → `tests/README.md` (OVERWRITE empty placeholder)
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/RUN.md` → `RUN.md`

4. **Tests (prefer OVERWRITE if older scaffolds exist):**
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/tests/conformance/dreaming_conformance.test.mjs` → `tests/conformance/dreaming_conformance.test.mjs`
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/tests/conformance/hearing_conformance.test.mjs` → `tests/conformance/hearing_conformance.test.mjs`
   - Copy `AI_Deltas/2026-01-03-00_50_02_E4XHK4PR/tests/unit/prng_sanity.test.mjs` → `tests/unit/prng_sanity.test.mjs`

## Manual Follow-Ups After Copy
- Remove older `.test.js` scaffolds (if present from prior deltas) to avoid double-running variants.
- Align `gridSize` between Hearing and Dreaming when wiring the runtime harness.
- Add a package-level ESM declaration or keep the `.mjs` extensions when expanding the codebase.
- Wire a renderer or CLI harness as needed; this delta only supplies core logic and tests.

## Rollback Plan
- Revert copied files in the canonical repo using `git checkout -- <paths>` or `git restore <paths>`.
- Delete newly added files (`src/core/*.mjs`, `src/hearing/bias_field.mjs`, `tests/**/*.mjs`, `RUN.md`) if removal is preferred.
- Verify a clean working tree with `git status` after rollback.
