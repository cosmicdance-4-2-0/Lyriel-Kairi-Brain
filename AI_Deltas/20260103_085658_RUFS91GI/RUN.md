---
DeltaID: 20260103_085658_RUFS91GI
Purpose: Explain how to serve and verify the self-contained PhaseCube + Hearing prototype bundle included in this delta.
Sources:
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/index.html
- AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube/main.js
Notes:
- The bundle is static and does not require a build step.
- Audio features depend on browser permission prompts; mic mode may be unavailable in headless browsers.
---

# Run Instructions

1. From the repository root, start a static server pointed at the bundle:
   ```bash
   cd AI_Deltas/20260103_085658_RUFS91GI/prototype/phasecube
   python -m http.server 8000
   ```

2. Open http://localhost:8000 in a modern browser.
   - Drag on the canvas to rotate the view.
   - Click **Enable Mic** to grant microphone access (if supported) or **Test Tone** to inject a sine wave.
   - Use **Clear Bias** to stop audio and let the bias field decay.

3. Save a snapshot with the **Save PNG** button to confirm rendering is working.

4. Stop the server with `Ctrl+C` when done.

No additional dependencies are needed; all modules are included alongside `index.html`.
