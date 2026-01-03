---
DeltaID: 20260103_085653_2UD9RGVE
Purpose: Human-run checklist to copy the mirrored PhaseCube prototype files into place for hosting.
Sources:
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/web/index.html
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/web/main.js
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/core/phasecube/index.js
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/core/prng.js
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/modules/bias/hearing.js
Notes:
- All actions are COPY/OVERWRITE; no edits are applied to the live tree by the agent.
- Ensure the target host serves ES modules with the same relative paths.
---

# COPY-OUT PLAN

## Targets and Actions
1. **web assets**
   - Source: `AI_Deltas/20260103_085653_2UD9RGVE/mirrors/web/index.html`
   - Destination: `web/index.html`
   - Action: **OVERWRITE** existing file (or place in host root preserving `web/` path).
2. **web script**
   - Source: `AI_Deltas/20260103_085653_2UD9RGVE/mirrors/web/main.js`
   - Destination: `web/main.js`
   - Action: **OVERWRITE** existing file.
3. **PhaseCube core runner**
   - Source: `AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/core/phasecube/index.js`
   - Destination: `src/core/phasecube/index.js`
   - Action: **OVERWRITE** existing file.
4. **PRNG utility**
   - Source: `AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/core/prng.js`
   - Destination: `src/core/prng.js`
   - Action: **OVERWRITE** existing file.
5. **Hearing bias module**
   - Source: `AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/modules/bias/hearing.js`
   - Destination: `src/modules/bias/hearing.js`
   - Action: **OVERWRITE** existing file.

## Manual Steps After Copy
- Serve the repository root with a static server (see `RUN.md`) and open `/web/index.html`.
- Grant microphone permissions when prompted to enable live audio biasing; otherwise use the test tone.
- Verify that the UI shows non-zero steps and that points render on the canvas.

## Rollback Plan
- If issues arise, restore the original files from version control:
  - Run `git checkout -- web/index.html web/main.js src/core/phasecube/index.js src/core/prng.js src/modules/bias/hearing.js`
  - Alternatively, re-copy the previous known-good versions from your backups.
