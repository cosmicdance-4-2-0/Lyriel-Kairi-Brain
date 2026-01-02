# Web Harness

This directory contains minimal runnable demos for the Dreaming and Hearing baselines. The baseline HTML files are verbatim copies of the historical imports for easy comparison.

## How to run locally

1. From the repository root, start a simple static server (Python example):
   - `python -m http.server 8000`
2. Open the demo index: <http://localhost:8000/web/index.html>
3. Launch the specific baseline demos:
   - Dreaming: <http://localhost:8000/web/demos/dreaming_baseline.html>
   - Hearing: <http://localhost:8000/web/demos/hearing_baseline.html>

## Expected output checklist

### Dreaming baseline
- Animated lattice of points rotating with mouse movement.
- Colors cycling over time; brighter points correspond to higher plasma activity.
- Simulation keeps moving without collapsing or freezing when unpaused.
- Keyboard shortcuts: **S** saves a PNG, **P** toggles pause (per baseline UI).

### Hearing baseline
- Similar rotating lattice with hearing controls visible.
- Audio modes available (live mic, synth tone, file) with UI buttons.
- Bias influence should subtly modulate behavior without driving collapse; silence decays bias toward zero.
- Analyzer overlay toggles if baseline UI exposes it; snapshot and pause hotkeys match baseline behavior.

The demos are lightweight ES modules with no build step; any static file server works.
