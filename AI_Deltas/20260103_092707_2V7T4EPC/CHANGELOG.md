---
DeltaID: 20260103_092707_2V7T4EPC
Date: 2026-01-03 09:27:07
Goal: Add a renderer utility that maps PhaseCube channel values to RGBA with parity-driven alpha, packaged as a delta-only module.
---

## Summary
- Added a standalone RGB renderer module that turns plasma/liquid/solid/parity arrays into RGBA colors (R=plasma, G=liquid, B=solid, A=parity).
- Documented how to use the new renderer and how to copy it into the main repository.

## Files Created
- `src/modules/render/rgbRenderer.js`
- `RUN.md`
- `COPY_OUT_PLAN.md`
- `CHANGELOG.md`

## Files Mirrored
- None. Existing repository files were only referenced, not copied.

## Known Limitations / TODOs
- The renderer does not perform projection or culling; it only produces color buffers for downstream draw code.
- Alpha mapping is binary (0/255) following the parity bit; adjust `alphaOn`/`alphaOff` in consumer code if softer blending is desired.

## Copy-Out Plan
See `COPY_OUT_PLAN.md` for the detailed human steps to integrate this renderer into the primary source tree.
