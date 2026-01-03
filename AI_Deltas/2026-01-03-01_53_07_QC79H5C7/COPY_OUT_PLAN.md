---
DeltaID: 2026-01-03-01_53_07_QC79H5C7
Purpose: Human checklist to integrate Input baseline spec updates.
Sources:
- AI_Deltas/2026-01-03-01_53_07_QC79H5C7/docs/specs/INPUT_BASELINE.md
Notes:
- Do not execute automatically; human review required.
---

# Copy-Out Plan (Human-Executed)

## Targets and Actions
1. **Create/Replace Input baseline spec**
   - **Target:** `docs/specs/INPUT_BASELINE.md` (new canonical spec)
   - **Source:** `AI_Deltas/2026-01-03-01_53_07_QC79H5C7/docs/specs/INPUT_BASELINE.md`
   - **Action:** COPY (new file). If keeping legacy filename, add a redirect/note in `HEARING_BASELINE.md` pointing to Input baseline.

2. **Update imported-baseline README cross-reference**
   - **Target:** `docs/specs/IMPORTED_BASELINE/README.md`
   - **Source:** `AI_Deltas/2026-01-03-01_53_07_QC79H5C7/docs/specs/IMPORTED_BASELINE/README.md`
   - **Action:** OVERWRITE existing file to reflect new canonical naming while preserving historical disclaimers.

3. **Add terminology mapping note**
   - **Target:** `docs/specs/TERMINOLOGY_MAPPING_INPUT.md` (or preferred location under `docs/specs/` or `docs/notes/`)
   - **Source:** `AI_Deltas/2026-01-03-01_53_07_QC79H5C7/notes/TERMINOLOGY_MAPPING.md`
   - **Action:** COPY (new file). Adjust filename/location as desired.

4. **Update references**
   - After copying, search for canonical references to `HEARING_BASELINE.md` in specs and update them to `INPUT_BASELINE.md`, retaining historical context where appropriate.

## Manual Edits After Copy
- If `docs/specs/HEARING_BASELINE.md` remains for backward compatibility, add a short note at the top indicating supersession by `INPUT_BASELINE.md`.
- Re-run any internal spec link checks to ensure references resolve.

## Rollback Plan
- Delete copied files and restore originals from version control.
- Revert any notes added to legacy `HEARING_BASELINE.md` if created during integration.

