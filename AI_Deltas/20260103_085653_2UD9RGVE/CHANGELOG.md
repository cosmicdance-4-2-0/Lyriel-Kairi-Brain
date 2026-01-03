---
DeltaID: 20260103_085653_2UD9RGVE
Purpose: Document the delta contents assembled to deliver a runnable PhaseCube + Hearing prototype for web hosting.
Sources:
- web/index.html (mirrored)
- web/main.js (mirrored)
- src/core/phasecube/index.js (mirrored)
- src/core/prng.js (mirrored)
- src/modules/bias/hearing.js (mirrored)
Notes:
- Captures the files required to stand up the current prototype without touching the live tree.
- Mirrors keep original behavior intact; no semantic edits were applied.
---

# CHANGELOG

## Summary
- Created a sealed delta directory containing mirrored web and core assets so the PhaseCube + Hearing prototype can be staged on an end-user webhost without modifying the repository root.
- Added COPY_OUT_PLAN.md and RUN.md to describe how to deploy and exercise the prototype from this delta.

## Files Created
- `CHANGELOG.md` (this file)
- `COPY_OUT_PLAN.md`
- `RUN.md`
- Mirrors:
  - `mirrors/web/index.html`
  - `mirrors/web/main.js`
  - `mirrors/src/core/phasecube/index.js`
  - `mirrors/src/core/prng.js`
  - `mirrors/src/modules/bias/hearing.js`

## Files Mirrored
- `web/index.html`
- `web/main.js`
- `src/core/phasecube/index.js`
- `src/core/prng.js`
- `src/modules/bias/hearing.js`

## Goal
Provide a self-contained snapshot of the current PhaseCube dreaming core, Hearing bias module, and web harness so a human can copy these assets to a target web host and run the prototype without relying on additional build steps.

## Known Limitations / TODOs
- Audio capture requires user permission in the browser and may be blocked by some hosts or mixed-content policies.
- No new conformance fixtures or automation are bundled; tests should be run from the main tree after copy-out.
- The prototype assumes ES module support and HTTPS for microphone access.

## Copy-Out Plan (Summary)
- See `COPY_OUT_PLAN.md` for the detailed checklist. In brief: copy the mirrored files to the same relative paths in the repo or a static host root, then serve `/web/index.html` over HTTP(S).
