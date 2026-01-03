---
DeltaID: 2026-01-03-00_50_22_CE7KVWFB
Purpose: Outline minimal, bounded next actions to make the repo implementation-ready without altering baselines.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
- docs/CODEX_Rules/10_Baseline_Conformance.md
- docs/CODEX_Rules/40_Conformance_Tests.md
Notes:
- Focuses on filling empty scaffolding (`src/`, `tests/`, `web/`, `tools/`) with baseline-aligned starters.
- Avoids proposing any baseline constant or equation changes.
---

# Obvious Next-Step Readiness Checklist

Use this list to populate the empty directories while preserving the canonical baselines. Each item is intentionally small and reversible.

## 1) Document the ADR stubs
- Populate `docs/adr/0001-neighborhood.md`, `0002-boundary-topology.md`, `0003-clamp-policy.md`, and `0004-prng-and-determinism.md` with one-paragraph summaries mirroring the specs. Keep them descriptive, not normative, to avoid spec drift.

## 2) Minimal core scaffold (non-executable placeholder)
- Add a stub `src/core/phasecube.js` that exports named constants and empty functions matching the Dreaming baseline API shape (initialization, tick, metrics). Include comments citing the spec sections for each invariant. Defaults should only **reference** the baseline constants; do not hardcode new values.

## 3) Conformance test harness shell
- Under `tests/conformance/`, add a smoke-test file that asserts shapes and bounds using placeholder arrays until the core exists. Keep the assertions tied to config values so the harness stays aligned once real state is added.

## 4) Web harness skeleton
- Under `web/`, add `index.html` and `main.js` with only enough structure to load the future module (e.g., import `phasecube.js`, log a placeholder). Avoid UI or rendering logic until the core stabilizes.

## 5) Tooling placeholder
- In `tools/`, add a short script stub (e.g., `lint.sh` or `format.sh`) that simply echoes its intent. This keeps the directory meaningful without imposing tooling choices.

## 6) Conformance guardrails
- When implementing any of the above, add tiny in-file comments reminding contributors to keep: boundedness, clamps, non-collapse, and deterministic seed options per specs (`DREAMING_BASELINE` §§6–9, `HEARING_BASELINE` §§4–5).

## 7) Future copy-out caution
- Before copying any scaffold into the main tree, re-read `docs/CODEX_Rules/50_Audio_Hearing.md` to ensure hearing-related stubs never overwrite core state and only bias probabilities.

These steps make the repository “ready to build” without changing semantics and keep follow-on diffs small and traceable.
