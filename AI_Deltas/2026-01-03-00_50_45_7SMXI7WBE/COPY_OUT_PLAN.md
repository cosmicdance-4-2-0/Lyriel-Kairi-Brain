---
DeltaID: 2026-01-03-00_50_45_7SMXI7WBE
Purpose: Human-executed copy-out checklist for planning artifacts
Sources:
- AI_Deltas/2026-01-03-00_50_45_7SMXI7WBE/NEXT_STEPS.md
- AI_Deltas/2026-01-03-00_50_45_7SMXI7WBE/RUN.md
- AI_Deltas/2026-01-03-00_50_45_7SMXI7WBE/CHANGELOG.md
Notes:
- Do not execute copy-out automatically; human verification required
- Copy/merge targets assume creation of documentation subfolders if absent
---

# Copy-Out Plan

| Action | Source | Target Destination | Mode | Notes |
| --- | --- | --- | --- | --- |
| Copy planning notes into docs | `AI_Deltas/2026-01-03-00_50_45_7SMXI7WBE/NEXT_STEPS.md` | `docs/notes/2026-01-03-00_50_45_7SMXI7WBE_NEXT_STEPS.md` | COPY | Create `docs/notes/` if it does not exist. Intended as living iteration guide without altering specs. |
| Copy run instructions into tooling docs | `AI_Deltas/2026-01-03-00_50_45_7SMXI7WBE/RUN.md` | `tools/RUN.md` | MERGE | Append or integrate guidance into any future tooling runner doc; currently repository file is empty. |
| Archive delta changelog | `AI_Deltas/2026-01-03-00_50_45_7SMXI7WBE/CHANGELOG.md` | `docs/notes/2026-01-03-00_50_45_7SMXI7WBE_CHANGELOG.md` | COPY | Keeps provenance of this planning-only delta alongside other notes. |

## Manual Edits After Copy
- Verify that any newly created `docs/notes/` directory is linked from `README.md` if documentation navigation is desired.
- Ensure copied files retain the `DeltaID` header and are not interpreted as spec changes.

## Rollback Plan
- Delete the copied files from `docs/notes/` and revert any `README.md` cross-links if added.
- Remove any appended content from `tools/RUN.md` (restore previous version) if the merge introduces issues.
- Run `git status` to confirm the working tree matches the pre-copy state except for intentional removals.
