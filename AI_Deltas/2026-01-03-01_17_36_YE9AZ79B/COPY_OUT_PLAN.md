---
DeltaID: 2026-01-03-01_17_36_YE9AZ79B
Purpose: Human-executable checklist for copying this delta into the main repository.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/adr/0003-clamp-policy.md
Notes:
- Actions are COPY-only; no deletions or edits to existing repository files are performed by the agent.
- Apply steps manually to keep collateral scope minimal.
---

## Targets and Actions
| Target destination (repo) | Source (delta) | Action | Notes |
| --- | --- | --- | --- |
| `src/core/phasecube/index.js` | `AI_Deltas/2026-01-03-01_17_36_YE9AZ79B/src/core/phasecube/index.js` | COPY / OVERWRITE if file exists | Introduces seeded baseline runner with clamp01 enforcement and Path B bias hook. Ensure Node ESM settings are respected if importing from tests. |

## Manual Edits Required After Copy
- Update `tests/conformance/dreaming_conformance.test.js` to import `createPhaseCubeRunner` from `src/core/phasecube/index.js` and remove `test.skip` gating once fixtures are available.
- Thread a shared seed into any additional modules (e.g., Hearing) to maintain deterministic runs per ADR 0004.
- Add witness sampling / metrics export hooks in the runner if conformance fixtures require them.

## Rollback Plan
1. Remove or revert `src/core/phasecube/index.js` to its previous state (delete if it did not exist).
2. Revert any test wiring changes introduced during integration.
3. Run `git status` to confirm no unintended files outside the target path remain modified.
