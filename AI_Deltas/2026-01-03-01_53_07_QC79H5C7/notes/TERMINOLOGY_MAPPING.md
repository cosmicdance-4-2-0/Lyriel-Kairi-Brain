---
DeltaID: 2026-01-03-01_53_07_QC79H5C7
Purpose: Map legacy Hearing terminology to the new Input baseline naming.
Sources:
- docs/specs/HEARING_BASELINE.md (mirrored)
Notes:
- Captures terminology drift for historical cross-reference.
- Imported artifacts keep legacy wording; this mapping clarifies current names.
---

# Hearing → Input (Audio) Terminology Mapping

- **Hearing (module name)** → **Input (Audio)** as the canonical module seam.
- **AudioCapture** → **InputSource (AudioCapture)**
- **FeatureExtractor** → **FeatureExtractor (AudioSpectral)**
- **BiasField** → **BiasMapper** (bias field maintainer)
- **Coupler** → **Coupler** (unchanged, but scoped as Input→`pB` only)
- **Hearing baseline v0.1** → **Input baseline (Audio) v0.2**

Historical references remain in `docs/specs/IMPORTED_BASELINE/hearing/*` and are explicitly non-canonical per their README. All normative specs should adopt the Input terminology going forward.

