---
DeltaID: 2026-01-03-00_50_02_E4XHK4PR
Purpose: Record artifacts produced to make the Dreaming/Hearing baselines runnable with minimal collateral.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/* (copied as mirror)
Notes:
- All changes are confined to the delta directory; canonical files remain untouched.
- Defaults and equations follow the baseline without introducing new constants.
---

# Changelog

- **DeltaID:** 2026-01-03-00_50_02_E4XHK4PR  
- **Generated:** 2026-01-03 00:50:02 (local)  
- **Goal:** Deliver baseline-aligned PhaseCube and Hearing implementations with runnable conformance/unit tests, without modifying the canonical repository tree.

## Files Created
- `src/core/prng.mjs`
- `src/core/phasecube.mjs`
- `src/hearing/bias_field.mjs`
- `src/README.md`
- `tests/conformance/dreaming_conformance.test.mjs`
- `tests/conformance/hearing_conformance.test.mjs`
- `tests/unit/prng_sanity.test.mjs`
- `tests/README.md`
- `RUN.md`
- `COPY_OUT_PLAN.md`
- `CHANGELOG.md`

## Files Mirrored
- `docs/specs/DREAMING_BASELINE.md`
- `docs/specs/HEARING_BASELINE.md`
- `docs/CODEX_Rules/README.md`
- `docs/CODEX_Rules/10_Baseline_Conformance.md`
- `docs/CODEX_Rules/20_Repo_Layout.md`
- `docs/CODEX_Rules/30_Code_Style.md`
- `docs/CODEX_Rules/40_Conformance_Tests.md`
- `docs/CODEX_Rules/50_Audio_Hearing.md`
- `docs/CODEX_Rules/90_PR_Checklist.md`
- `docs/CODEX_Rules/PROMPT_System.md`

## Known Limitations / TODOs
- No audio capture harness is provided; Hearing tests rely on synthetic feature vectors.
- Renderer integration remains out of scope; web wiring is still a placeholder.
- Bias coupling expects grid sizes to match between Hearing and Dreaming; callers must align configs.

## Copy-Out Plan
See `COPY_OUT_PLAN.md` in the same directory for manual integration steps and rollback guidance.
