---
DeltaID: 2026-01-03-01_53_07_QC79H5C7
Purpose: Record of spec reframing from Hearing to Input (Audio).
Sources:
- docs/specs/HEARING_BASELINE.md (mirrored)
- docs/specs/IMPORTED_BASELINE/README.md (mirrored)
Notes:
- Documents intent to treat audio as an Input modality and rename the baseline accordingly.
---

# Changelog
- **Date/Time:** $(date -Iseconds)
- **Goal:** Rename and reframe the Hearing baseline as the Input baseline (Audio), align terminology across specs, and document mapping.

## Files Created
- `docs/specs/INPUT_BASELINE.md` — rewritten baseline spec emphasizing Input as module seam.
- `docs/specs/IMPORTED_BASELINE/README.md` — updated canonical references to Input baseline.
- `notes/TERMINOLOGY_MAPPING.md` — concise Hearing→Input terminology mapping.
- `RUN.md` — review instructions for this documentation-only delta.
- `COPY_OUT_PLAN.md` — human copy-out checklist.
- `CHANGELOG.md` — this log.

## Files Mirrored
- `mirrors/docs/specs/HEARING_BASELINE.md`
- `mirrors/docs/specs/IMPORTED_BASELINE/README.md`

## Known Limitations / TODOs
- No edits to runtime code; coupling remains described at spec level only.
- Historical imported artifacts still use Hearing wording; maintained for provenance.
- Additional spec cross-references may be needed if future modules cite Hearing explicitly.

## Copy-Out Plan
See `COPY_OUT_PLAN.md` for explicit, human-executed copy steps.

