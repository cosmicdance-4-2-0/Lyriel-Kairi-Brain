---
DeltaID: 2026-01-03-00_26_29_H1SMQRZUP
Purpose: Record artifacts produced for the ready-to-develop hygiene delta.
Sources:
- docs/specs/DREAMING_BASELINE.md (copied as mirror)
- docs/specs/HEARING_BASELINE.md (copied as mirror)
- docs/CODEX_Rules/* (copied as mirror)
Notes:
- Captures only new artifacts under AI_Deltas; no canonical files were modified.
- Mirrors provide provenance for referenced specs and rules.
---

# Changelog

- **DeltaID:** 2026-01-03-00_26_29_H1SMQRZUP
- **Generated:** 2026-01-03 00:26:29 (local)
- **Goal:** Establish ADR content and testing scaffolding for the Dreaming and Hearing baselines without touching canonical files. Provide ready-to-copy documentation (RUN/TESTING) and refreshed README stubs for `src/` and `web/`.

## Files Created
- `docs/adr/0001-neighborhood.md`
- `docs/adr/0002-boundary-topology.md`
- `docs/adr/0003-clamp-policy.md`
- `docs/adr/0004-prng-and-determinism.md`
- `tests/README.md`
- `tests/conformance/dreaming_conformance.test.js`
- `tests/conformance/hearing_conformance.test.js`
- `tests/unit/prng_sanity.test.js`
- `src/README.md`
- `web/README.md`
- `RUN.md`
- `TESTING.md`
- `COPY_OUT_PLAN.md`

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
- `docs/adr/0001-neighborhood.md`
- `docs/adr/0002-boundary-topology.md`
- `docs/adr/0003-clamp-policy.md`
- `docs/adr/0004-prng-and-determinism.md`
- `tests/README.md`
- `src/README.md`
- `web/README.md`

## Known Limitations / TODOs
- Conformance tests are intentionally `skip`-ped until the PhaseCube core and Hearing bias modules are wired.
- Golden fixtures (witness traces, metrics) are not generated yet.
- PRNG algorithm selection and implementation remain unspecified; placeholders point to integration sites.

## Copy-Out Plan
See `COPY_OUT_PLAN.md` in the same directory for the exact, manual copy instructions.
