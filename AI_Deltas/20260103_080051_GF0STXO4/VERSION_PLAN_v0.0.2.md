---
DeltaID: 20260103_080051_GF0STXO4
Purpose: Outline the tasks required to move Lyriel-Kairi-Brain from v0.0.1 to v0.0.2 without touching the live tree.
Sources:
- README.md
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
- src/core/phasecube/index.js
- src/modules/bias/hearing.js
- tests/conformance/dreaming_conformance.test.js
- tests/conformance/hearing_conformance.test.js
Notes:
- No repository files were modified; this plan lives only under AI_Deltas/.
- The plan preserves baseline semantics and highlights additive, gated changes for the minor bump.
---

# v0.0.2 Iteration Plan

## Current State (v0.0.1 assumptions)
- Core Dreaming runner and Hearing bias module exist as ES modules with seeded determinism and clamps, but no version metadata is present in the repo root.
- Tests cover PRNG repeatability and basic boundedness/shape/decay sanity checks, yet no package-level test runner wiring or fixtures for witness traces exist.
- The web harness is only described in `web/README.md`; no runnable HTML/JS is present in the live tree.
- Top-level `README.md` is incomplete (code block is unterminated) and does not advertise how to run tests or the baseline seed/params.

## v0.0.2 Goals (delta-classified)
- **Baseline-preserving:** add missing scaffolding and docs without changing default dynamics or clamp ranges.
- **Portability:** provide a minimal static web harness that consumes the existing core and bias modules with native ESM imports.
- **Testability:** make conformance tests runnable (fixtures + npm script or node command), retaining optional seed control.
- **Versioning:** introduce explicit version metadata and release notes for v0.0.2.

## Recommended Work Breakdown

1) **Version metadata + changelog**
- Add `VERSION` (or package version field) set to `0.0.2` and a `CHANGELOG.md` entry describing the minor release scope (docs/web harness/test wiring, no behavior changes).
- Note in the changelog that baseline dynamics remain unchanged; reference DREAMING/HEARING specs.

2) **Web harness bootstrap**
- Create `web/index.html` and `web/main.js` that import `PhaseCubeRunner` and `HearingBiasField` via relative ESM paths.
- Implement projection/render loop matching the baseline renderer requirements: toroidal grid positions, hue based on parity+plasma, visibility threshold on liquid/plasma.
- Add minimal UI controls: start/pause, seed input (optional), toggle Hearing bias (stub ingest with random or placeholder bins if no audio yet), snapshot button.
- Keep all logic in JS; no bundler or dependencies.

3) **Test wiring + fixtures**
- Add `package.json` scripts (or a `Makefile` recipe) to run `node --test tests/...` with ESM flags if needed.
- Provide deterministic fixtures: baseline parameter set (seed, grid size, probabilities) and a short witness trace snapshot (e.g., first 5 ticks of plasma mean/variance) to guard regressions.
- Extend conformance tests to validate witness trace within tolerance while keeping existing bounds checks.

4) **Documentation cleanup**
- Finish `README.md` run instructions (close code block, include `node --test` command, note baseline defaults and deterministic seed option).
- Add a short `web/` README section describing how to launch the static harness (e.g., `python -m http.server 8000` and open `/web/index.html`).
- Document how Hearing bias is gated (off by default; on requires user gesture for audio).

5) **Release checklist for v0.0.2**
- Verify conformance tests pass locally.
- Manually sanity-check web harness for bounded visuals at default params and with Hearing bias toggled.
- Tag the repo with `v0.0.2` after merge.

## Risk/Scope Guardrails
- Do **not** change default parameter values, clamp ranges, or neighborhood/topology semantics.
- Keep Hearing coupling limited to Path B probability; no direct plasma/liquid/solid writes.
- Avoid introducing build steps or dependencies; rely on native browser modules and Node built-ins.
- Any future bias smoothing or additional couplings must be gated and documented as non-baseline if enabled.

## Acceptance Criteria
- Version metadata and release notes exist and reflect a baseline-preserving minor bump.
- Web harness runs in a modern browser without tooling, rendering bounded motion by default.
- Conformance tests are runnable via a single documented command and include deterministic fixtures.
- Documentation accurately reflects the runnable state and baseline constraints.

