---
DeltaID: 2026-01-03-01_53_07_QC79H5C7
Purpose: Reframe the Hearing baseline as the canonical Input baseline where audio is one concrete modality.
Sources:
- docs/specs/HEARING_BASELINE.md (mirrored)
- docs/specs/DREAMING_BASELINE.md (read for coupling constraints)
Notes:
- Establishes Input as the module seam; audio is a specific InputSource implementation.
- Maintains influence-not-control semantics; Input biases Dreaming but does not overwrite core state.
---

# INPUT_BASELINE v0.2 (Audio as Input)

## 1. Scope and Intent
- Defines the canonical **Input baseline** for PhaseCube: a minimal **input→features→bias→coupling** pipeline that **influences** (never controls) Dreaming dynamics.
- “Input” is the module seam; **audio** is the reference modality under this baseline.
- Imported historical artifacts may still say “Hearing”; those references are historical only.

## 2. Goals
The Input baseline is designed to:
- Provide a small, stable interface from external stimuli (audio) into Dreaming without rewriting core equations.
- Deliver bounded, interpretable influence via a bias field that modulates Path B probabilities.
- Stay optional: Dreaming runs with Input disabled and remains conformant.

## 3. Terminology
- **InputSource (Audio)**: Captures audio frames from mic/oscillator/file and produces channel-aligned waveform chunks.
- **FeatureExtractor (Audio)**: Converts audio frames to normalized spectral magnitudes.
- **BiasMapper**: Transforms features into a grid-aligned bias field with decay, injection, and clamp.
- **Coupler**: Applies bias to permitted coupling points only (baseline: `pB[i]`).
- **Influence, not control**: Input may bias probabilities or inject bounded energy; it MUST NOT overwrite plasma/liquid/solid arrays.

## 4. Non-Goals
Input baseline does **not** provide:
- Semantic understanding, transcription, or symbolic decoding of audio.
- Long-term memory of audio events.
- Output generation, decision making, or goal pursuit.
- Multi-modal fusion beyond the reference audio modality.
- Direct mutation of Dreaming core state.

## 5. System Model

### 5.1 Components (Baseline Interface)
1. **InputSource (AudioCapture)**
   - Provides audio frames from microphone or injected source.

2. **FeatureExtractor (AudioSpectral)**
   - Produces log-spaced magnitude vectors per channel.
   - Baseline parameters: `BIN_COUNT`, `FFT_SIZE`, log-frequency sampling from ~20 Hz to Nyquist (≤ ~20 kHz), normalized to `[0,1]`.

3. **BiasMapper**
   - Maintains a grid-sized bias field that:
     - decays each frame (`bias[i] *= decay`),
     - injects energy from feature bins via a spatial kernel,
     - clamps to `[biasMin, biasMax]`.

4. **Coupler**
   - Applies `pB[i] = clamp(pB[i] + bias[i], pB_min, pB_max)`.
   - No other core variables are modified in baseline mode.

### 5.2 Canonical Audio Feature Shape
- Vector per channel: `left[b]`, `right[b]` in `[0,1]`, length = `BIN_COUNT`.
- Stereo difference preserves lateral cues; mono maps identically to both channels.

### 5.3 Bias Mapping (Audio → Bias Field)
- **Frequency (bin index)** → **Depth (Z)**
  - `zCenter = floor( (b / (BIN_COUNT-1)) * (GRID-1) )`
- **Stereo imbalance** → **Lateral displacement (X)**
  - `pan = (right[b] - left[b]) * (GRID * 0.16)`
  - `xCenter = clamp( floor( (GRID-1)/2 + pan + energy * (GRID-1) * 0.3 ), 0, GRID-1 )`
- **Amplitude (energy)** → **Injection strength**
  - `energy = 0.5 * (left[b] + right[b])`
- **Y center** defaults to mid-plane: `yCenter = floor( (GRID-1)/2 )`
- **Kernel**: radial (gaussian-like) with `kernelRadius ≈ max(1, floor(GRID/6))` and `kernel = exp(-dist2 * 2.4)`.
- **Bias update (per frame):**
  1. `bias[i] *= decay` (suggested `decay ≈ 0.94`).
  2. For each bin `b`, inject `energy * strength * kernel(distance)` (suggested `strength ≈ 0.18`).
  3. Clamp: `bias[i] = clamp(bias[i], biasMin, biasMax)` (suggested `biasMin = -0.38`, `biasMax = +0.38`).

### 5.4 Determinism Surface Area
Expose tunables that affect semantics: `BIN_COUNT`, `FFT_SIZE`, `decay`, `strength`, `kernelRadius`, `biasMin`, `biasMax`, `pB_min`, `pB_max`. Defaults must preserve baseline behavior.

## 6. Conformance Requirements
An implementation conforms to **INPUT_BASELINE v0.2** if:
- Pipeline: captures audio or injected frames; computes left/right feature vectors; produces bias field with decay, injection, clamp.
- Coupling: bias influences Dreaming only via `pB[i]` modulation; other state arrays remain untouched.
- Boundedness: bias and `pB[i]` remain within declared clamps.
- Determinism option: fixed seed and fixed parameters yield repeatable evolution.

## 7. Extension Seams (Deltas Only)
Allowed as deltas (non-baseline): alternate freq→Z mappings, pan→Y/rotation, multi-locus injections, alternate feature extraction (envelopes, mel, onset), additional couplings (bias→plasma/liquid/solid, renderer aesthetics). Such changes require explicit flagging and spec updates.

## 8. Validation Hooks
- **Input Off:** bias decays toward ~0.
- **Silence:** bias remains near 0 (with small noise tolerance).
- **Tone:** bias concentrates in a Z band with lateral displacement by pan.
- **No collapse:** sustained audio alone must not lock the substrate into a fixed point.

## 9. Versioning and Naming
- **v0.2:** Renames “Hearing baseline v0.1” to **Input baseline (Audio) v0.2**, preserving semantics while clarifying module seam and terminology.
- Historical references to “Hearing” are retained only in imported artifacts and are explicitly non-normative.

