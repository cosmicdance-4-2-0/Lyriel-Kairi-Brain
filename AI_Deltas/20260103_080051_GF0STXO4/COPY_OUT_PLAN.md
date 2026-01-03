---
DeltaID: 20260103_080051_GF0STXO4
Purpose: Manual checklist for integrating the v0.0.2 planning documents into the live repository.
Sources:
- AI_Deltas/20260103_080051_GF0STXO4/VERSION_PLAN_v0.0.2.md
- AI_Deltas/20260103_080051_GF0STXO4/RUN.md
Notes:
- Copy actions must be performed by a human; no files outside AI_Deltas/ were altered by this delta.
- Paths and actions are suggestions; adjust as needed for repository conventions.
---

# Copy-Out Checklist

1. **Add the iteration plan to repository docs**
   - **Source:** `AI_Deltas/20260103_080051_GF0STXO4/VERSION_PLAN_v0.0.2.md`
   - **Destination (suggested):** `docs/roadmap/VERSION_PLAN_v0.0.2.md`
   - **Action:** COPY
   - **Notes:** Ensure the destination directory exists; if not, create `docs/roadmap/`. Verify links to baseline specs remain correct after relocation.

2. **Include run/review instructions**
   - **Source:** `AI_Deltas/20260103_080051_GF0STXO4/RUN.md`
   - **Destination (suggested):** `docs/roadmap/RUN_v0.0.2.md`
   - **Action:** COPY
   - **Notes:** Update any internal references if you rename the file. This file only describes how to consume the planning notes; no code changes are implied.

# Post-Copy Steps
- Cross-check the planned tasks against current repository state and open tickets.
- Create implementation branches for each workstream (web harness, tests, docs, versioning) to keep changes small and reversible.
- Update the live changelog/release notes when work from the plan is merged.

# Rollback Plan
- If the copied files are not desired, delete the added documents from `docs/roadmap/` (or whichever destination you chose) and revert any references in other docs.
- No code paths are affected by these documents, so rollback is limited to file removal.

