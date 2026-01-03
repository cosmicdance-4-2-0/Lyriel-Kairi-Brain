---
DeltaID: 20260103_085653_2UD9RGVE
Purpose: Describe how to run the mirrored PhaseCube + Hearing prototype from this delta.
Sources:
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/web/index.html
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/web/main.js
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/core/phasecube/index.js
- AI_Deltas/20260103_085653_2UD9RGVE/mirrors/src/modules/bias/hearing.js
Notes:
- Browser must support ES modules and microphone APIs; serve over HTTPS for mic access.
---

# RUN INSTRUCTIONS

1. Copy the mirrored files into the repository as outlined in `COPY_OUT_PLAN.md`.
2. From the repo root, start a static server (examples):
   - Python 3: `python -m http.server 8000`
   - Node: `npx http-server . -p 8000`
3. Open `http://localhost:8000/web/index.html` in a modern browser.
4. Interact:
   - Drag on the canvas to rotate the cube.
   - Click **Enable Mic** to allow live audio biasing (HTTPS recommended), or **Test Tone** to inject a simple oscillator.
   - Click **Clear Bias** to mute input and let the dreaming substrate decay naturally.
5. Save a snapshot with **Save PNG**; pause/resume with **Pause**.

### Expected Behavior
- The cube renders animated point clouds whose motion continues even without audio input.
- When audio is enabled, Path B selection becomes biased; the HUD shows changing bias magnitude.
- State arrays remain bounded; no crashes should occur during normal use.
