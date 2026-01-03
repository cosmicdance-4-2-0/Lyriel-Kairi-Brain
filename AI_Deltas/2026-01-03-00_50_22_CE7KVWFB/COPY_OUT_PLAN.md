---
DeltaID: 2026-01-03-00_50_22_CE7KVWFB
Purpose: Enumerate the human-only steps to apply this delta without touching the canonical files automatically.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
- docs/CODEX_Rules/PROMPT_System.md
Notes:
- All actions are manual and reversible; no automated copy-out has been performed.
- Target locations are suggested to improve readiness while respecting baseline protections.
---

# COPY-OUT PLAN (Human-Executed Only)

## Target Destinations and Actions
1. **Obvious next steps note**
   - **Source:** `AI_Deltas/2026-01-03-00_50_22_CE7KVWFB/obvious_next_steps.md`
   - **Target:** `docs/OBVIOUS_NEXT_STEPS.md` (new file)
   - **Action:** COPY (create the target file with identical contents).
   - **Post-copy manual edit:** None required; treat as guidance for populating currently empty scaffolding.

2. **Run instructions helper**
   - **Source:** `AI_Deltas/2026-01-03-00_50_22_CE7KVWFB/RUN.md`
   - **Target:** `docs/RUN_DELTA_2026-01-03-00_50_22_CE7KVWFB.md` (new file)
   - **Action:** COPY.
   - **Post-copy manual edit:** Optionally link this run note from the root `README.md` under a “Delta drops” section (manual edit not included in this plan).

3. **Changelog archival**
   - **Source:** `AI_Deltas/2026-01-03-00_50_22_CE7KVWFB/CHANGELOG.md`
   - **Target:** `docs/deltas/2026-01-03-00_50_22_CE7KVWFB.md` (new directory/file)
   - **Action:** COPY.
   - **Post-copy manual edit:** If a deltas index exists later, add an entry referencing this file.

## Rollback Plan
- Delete any copied files created at the target locations above.
- If you created intermediate directories (`docs/deltas/`), remove them if now empty.
- Re-run `git status` to confirm the working tree is clean after deletions.
