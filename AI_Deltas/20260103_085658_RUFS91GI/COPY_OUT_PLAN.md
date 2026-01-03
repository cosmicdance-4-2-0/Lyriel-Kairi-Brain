---
DeltaID: 20260103_085658_RUFS91GI
Purpose: Manual checklist to relocate the hostable PhaseCube prototype bundle into the live repository without violating the sandbox.
Sources:
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/index.html
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/main.js
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/core/prng.js
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/core/phasecube.js
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/modules/hearing.js
Notes:
- Actions must be performed by a human; this delta does not touch files outside AI_Deltas/.
- Destinations are suggestions; adjust to house style if a different web directory is preferred.
---

# Copy-Out Checklist

1) **Add the hostable prototype bundle**
- **Source:** `AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/`
- **Destination (suggested):** `web/hostable/phasecube/`
- **Action:** COPY the entire directory tree.
- **Manual edits after copy:** None required; imports are relative within the folder. If you place the bundle elsewhere, ensure `index.html` still references `./main.js`.

2) **Document run instructions for maintainers**
- **Source:** `AI_Deltas/20260103_085658_RUFS91GI/RUN.md`
- **Destination (suggested):** `web/hostable/RUN_PHASECUBE.md`
- **Action:** COPY
- **Manual edits after copy:** Update the destination path references if you rename the folder in step 1.

3) **Record provenance**
- **Source:** `AI_Deltas/20260103_085658_RUFS91GI/CHANGELOG.md`
- **Destination (suggested):** `web/hostable/CHANGELOG_PHASECUBE.md`
- **Action:** COPY
- **Manual edits after copy:** Optional—trim sections if you maintain a separate project-level changelog.

# Rollback Plan
- Delete the copied `web/hostable/phasecube/` folder (or whichever destination was used).
- Remove the copied `RUN_PHASECUBE.md` and `CHANGELOG_PHASECUBE.md` files if added.
- No code changes elsewhere are required; the bundle is self-contained.
