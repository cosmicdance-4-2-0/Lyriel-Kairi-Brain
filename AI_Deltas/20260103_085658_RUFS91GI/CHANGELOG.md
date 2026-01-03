---
DeltaID: 20260103_085658_RUFS91GI
Purpose: Track the artifacts generated to supply a web-hostable PhaseCube prototype without touching live repo files.
Sources:
- src/core/prng.js
- src/core/phasecube/index.js
- src/modules/bias/hearing.js
- web/index.html
- web/main.js
Notes:
- All files are confined to AI_Deltas/20260103_085658_RUFS91GI/ per sandbox rule.
- Mirrors preserve baseline behavior; headers were added for provenance.
---

# Change Log

- **Timestamp:** 2026-01-03 08:56:58 (local runtime)
- **Goal:** Provide a self-contained, browser-ready PhaseCube + Hearing prototype bundle and manual copy-out instructions for deployment on an end-user web host.

## Files Created
- `prototype/phasecube/index.html` — static entrypoint with inline styles and module loading for the demo.
- `prototype/phasecube/main.js` — browser glue wiring PhaseCube core, Hearing bias, and canvas renderer.
- `prototype/phasecube/core/prng.js` — seeded Mulberry32 PRNG for deterministic runs in the bundle.
- `prototype/phasecube/core/phasecube.js` — baseline PhaseCube runner logic for the bundle.
- `prototype/phasecube/modules/hearing.js` — bounded Hearing bias field implementation for the bundle.
- `RUN.md` — instructions to serve and verify the prototype bundle locally.
- `COPY_OUT_PLAN.md` — manual checklist to integrate the bundle into the live repo without violating sandbox rules.

## Files Mirrored
- `src/core/prng.js`
- `src/core/phasecube/index.js`
- `src/modules/bias/hearing.js`
- `web/index.html`
- `web/main.js`

## Known Limitations / TODOs
- Audio capture still depends on browser permissions; hosts must allow microphone access for mic mode.
- No automated build pipeline is included; the bundle is designed for static hosting as-is.
- Integration requires manual copy-out per `COPY_OUT_PLAN.md`.

## Copy-Out Plan
- See `AI_Deltas/20260103_085658_RUFS91GI/COPY_OUT_PLAN.md` for destinations, actions, and rollback steps.
