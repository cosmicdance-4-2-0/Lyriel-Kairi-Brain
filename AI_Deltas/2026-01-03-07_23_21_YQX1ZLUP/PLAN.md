# PLAN

- **Goals**
  - Provide a runnable PhaseCube core aligned with the DREAMING baseline (bounded, toroidal, seeded).
  - Implement a baseline Hearing bias field that only modulates Path B probability with decay/clamp semantics.
  - Enable conformance/unit tests to execute without skips and bump the project iteration marker to v0.0.2.

- **Constraints**
  - Do not modify existing repository files directly; emit artifacts only under `AI_Deltas/`.
  - Preserve baseline clamps, boundedness, and non-goal-directed behavior per specs/ADRs.
  - Use ES modules without introducing external dependencies or build steps.
  - Bias may influence Path B probability only; no direct writes to core state.

- **Inputs read (paths)**
  - docs/CODEX_Rules/README.md
  - docs/CODEX_Rules/10_Baseline_Conformance.md
  - docs/CODEX_Rules/20_Repo_Layout.md
  - docs/CODEX_Rules/30_Code_Style.md
  - docs/CODEX_Rules/40_Conformance_Tests.md
  - docs/CODEX_Rules/50_Audio_Hearing.md
  - docs/CODEX_Rules/90_PR_Checklist.md
  - docs/CODEX_Rules/PROMPT_System.md
  - docs/specs/DREAMING_BASELINE.md
  - docs/specs/HEARING_BASELINE.md
  - docs/adr/0001-neighborhood.md
  - docs/adr/0002-boundary-topology.md
  - docs/adr/0003-clamp-policy.md
  - docs/adr/0004-prng-and-determinism.md
  - README.md
  - tests/README.md
  - src/README.md
  - web/README.md

- **Strategy (steps)**
  1. Add a deterministic PRNG utility with clamp helper to support seeded runs.
  2. Implement PhaseCube core runner with toroidal neighbor sampling, perturbation + transition stages, and optional bias-clamped Path B selection.
  3. Implement Hearing bias field with decay, Gaussian-like kernel injection, and coupling that only modulates Path B probability.
  4. Replace test scaffolds with active conformance/unit tests wired to the new modules and add package metadata to enable ES modules and v0.0.2 tagging.

- **Acceptance criteria**
  - New core and hearing modules expose factories and maintain bounded state/bias per specs.
  - Tests import concrete implementations and run without skipped cases; PRNG deterministic test passes conceptually.
  - Package metadata reflects v0.0.2 and ESM configuration without extra dependencies.

- **Rollback plan**
  - Remove the `AI_Deltas/2026-01-03-07_23_21_YQX1ZLUP` directory and ignore its contents; no repository files were modified in place.
