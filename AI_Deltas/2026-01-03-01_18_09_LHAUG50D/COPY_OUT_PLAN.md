---
DeltaID: 2026-01-03-01_18_09_LHAUG50D
Purpose: Define manual copy-out steps for landing the readiness notes into the main docs tree without altering core code.
Sources:
- AI_Deltas/2026-01-03-01_18_09_LHAUG50D/NEXT_STEP_READINESS.md
- AI_Deltas/2026-01-03-01_18_09_LHAUG50D/CHANGELOG.md
Notes:
- Copy-out must be performed by a human; do not modify files outside the delta automatically.
- Plan keeps baseline equations/constants untouched.
---

# COPY-OUT PLAN — 2026-01-03-01_18_09_LHAUG50D

## Target Destinations
1. **Create documentation drop-in**  
   - **Target:** `docs/deltas/2026-01-03-01_18_09_LHAUG50D/` (new directory)  
   - **Action:** COPY  
   - **Source:** `AI_Deltas/2026-01-03-01_18_09_LHAUG50D/NEXT_STEP_READINESS.md`  
   - **Notes:** Keep filename casing; directory is new.

2. **Archive change log alongside notes**  
   - **Target:** `docs/deltas/2026-01-03-01_18_09_LHAUG50D/CHANGELOG.md`  
   - **Action:** COPY  
   - **Source:** `AI_Deltas/2026-01-03-01_18_09_LHAUG50D/CHANGELOG.md`  
   - **Notes:** Serves as provenance for the delta packet.

3. **Provide run guidance placeholder**  
   - **Target:** `docs/deltas/2026-01-03-01_18_09_LHAUG50D/RUN.md`  
   - **Action:** COPY  
   - **Source:** `AI_Deltas/2026-01-03-01_18_09_LHAUG50D/RUN.md`  
   - **Notes:** Clarifies that no runnable artifacts are produced yet.

## Manual Edits After Copy
- If `docs/deltas/` does not exist, create it before copying (no other structure changes required).
- Update any site or docs index that should reference the new delta folder (optional, only if such index exists).

## Rollback Plan
- Delete the newly created `docs/deltas/2026-01-03-01_18_09_LHAUG50D/` directory if the copy-out is reverted.
- Re-run `git status` to confirm no other paths were touched; discard any staged files outside the target directory.
