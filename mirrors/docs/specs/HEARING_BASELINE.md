# HEARING_BASELINE — PhaseCube Audio Influence Layer (v0.1)

**Status:** Baseline Definition  
**Audience:** Developers and researchers implementing or extending a minimal, continuously-active, influenceable swarm substrate with an audio input channel.  
**Scope:** Defines the canonical **Hearing** baseline for PhaseCube: a minimal audio→features→bias→coupling pipeline that **influences** (does not control) Dreaming dynamics.

---

## 1. Purpose

This document formalizes the **Hearing baseline**: the smallest stable “ears” module that can be attached to the **Dreaming baseline** without changing its core behavior model.

The Hearing baseline is designed to:

- Add **audio-sensing** as *influence*, not command.
- Preserve the Dreaming substrate’s **bounded, non-collapsing** nature.
- Provide a **conformance target** so ports and rewrites can be compared.
- Define clean **extension seams** for future work (alternate mappings, smoothing, output channels).

---

## 2. Baseline Definition

### 2.1 What “Hearing” Means Here

“Hearing” is a strictly limited interface:

1. Capture audio (mic or injected source)
2. Convert audio into a compact feature vector
3. Convert features into a **decaying bias field** over the grid
4. Use that bias field to modulate **one** substrate coupling path:
   - **Branch probability modulation** (p(B) bias)

That’s it.

### 2.2 Minimal Coupling Rule (Canonical)

The Hearing baseline **MUST** only influence Dreaming by adjusting the local probability of selecting Path B:

Let:

- `pB_base` = baseline `BASE_PATH_B_P`
- `bias[i]` = bias field value at cell `i` (bounded)
- `pB[i]` = local branch probability at cell `i`

Then:

- `pB[i] = clamp(pB_base + bias[i], pB_min, pB_max)`

**Baseline constraints:**
- `pB_min` and `pB_max` are chosen to prevent collapse or freezing; defaults:
  - `pB_min = 0.05`
  - `pB_max = 0.95`
- `bias[i]` MUST be bounded (see §4.4).

**Non-baseline note:** Any additional coupling (bias→plasma changes, bias→jitter scaling, bias→solid direct writes, etc.) is **not baseline** and belongs in a delta.

---

## 3. Non-Goals

The Hearing baseline does **not** attempt to provide:

- Semantic understanding of audio
- Classification, transcription, or symbolic decoding
- Long-term memory of audio events
- Output generation, decision making, or goal pursuit
- Multi-modal fusion (vision/text/etc.)
- “Nice” UX polish (UI is a prototype concern)

---

## 4. System Model

### 4.1 Components

The Hearing baseline consists of four conceptual components:

1. **AudioCapture**
   - Provides audio frames from a microphone or injected source.

2. **FeatureExtractor**
   - Converts audio into a compact vector of `BIN_COUNT` magnitudes.
   - Uses an FFT analyser with log-frequency sampling.

3. **BiasField**
   - Maintains a grid-sized float field that:
     - decays over time,
     - receives new energy injections from features,
     - clamps to safe bounds.

4. **Coupler**
   - Applies `bias[i]` only to `pB[i]` (Path B probability).

### 4.2 Feature Vector (Canonical)

**Feature shape:**  
A 1D vector of length `BIN_COUNT` per channel:
- `left[b]` in `[0,1]`
- `right[b]` in `[0,1]`

**Canonical sampling:**
- Use log-spaced frequencies from ~20 Hz to Nyquist (clamped to ~20 kHz max).
- Sample the analyser bins at those frequencies.
- Normalize to `[0,1]`.

This maintains stability across sample rates and devices.

### 4.3 Bias Field Semantics (Canonical Mapping)

Each frequency bin injects energy into a spatial kernel in the PhaseCube grid:

- **Frequency (bin index)** → **Depth (Z)**
  - Lower bins map deeper, higher bins map toward surface.

- **Stereo imbalance** → **Lateral displacement (X)**
  - Right stronger than left shifts toward +X; left stronger shifts toward −X.

- **Amplitude (energy)** → **Injection strength**
  - Overall energy controls how much bias is injected.

**Baseline defaults (suggested):**
- `zCenter = floor( (b / (BIN_COUNT-1)) * (GRID-1) )`
- `energy = 0.5 * (left[b] + right[b])`
- `pan = (right[b] - left[b]) * (GRID * 0.16)`
- `xCenter = clamp( floor( (GRID-1)/2 + pan + energy * (GRID-1) * 0.3 ), 0, GRID-1 )`
- `yCenter = floor( (GRID-1)/2 )`

**Note:** These constants are baseline defaults, not sacred numbers. The semantics are the baseline: **freq→Z**, **pan→X**, **amp→strength**.

### 4.4 Bias Field Update Rule (Canonical)

Bias is a decaying field with bounded injections:

Per frame:

1. **Decay**
   - `bias[i] *= decay`

2. **Inject**
   - For each bin `b`, inject `energy * strength * kernel(distance)` into nearby cells.
   - Kernel is radial and local (e.g., gaussian-like).

3. **Clamp**
   - `bias[i] = clamp(bias[i], biasMin, biasMax)`

**Baseline suggested parameters:**
- `decay ≈ 0.94`
- `strength ≈ 0.18`
- `kernelRadius ≈ max(1, floor(GRID/6))`
- `biasMin = -0.38`
- `biasMax = +0.38`

**Kernel guidance:**
- Gaussian-ish kernel is recommended for smoothness:
  - `kernel = exp(-dist2 * 2.4)` where `dist2` is normalized by `radius^2`.

---

## 5. Conformance Requirements

An implementation conforms to **HEARING_BASELINE v0.1** if it satisfies:

### 5.1 Pipeline
- Captures audio (mic or injected source).
- Computes `left[]` and `right[]` feature vectors of length `BIN_COUNT`.
- Produces a grid-sized bias field with:
  - decay,
  - injection,
  - clamp.

### 5.2 Coupling
- The bias field influences Dreaming **only** via `pB[i]` modulation.
- No other state variables are directly modified by hearing input in baseline mode.

### 5.3 Boundedness
- Bias values are clamped to safe limits.
- `pB[i]` is clamped to safe limits.

### 5.4 Deterministic Surface Area
- All tunables that affect semantics are exposed in config (not buried constants), at minimum:
  - `BIN_COUNT`, `FFT_SIZE`
  - `decay`, `strength`, `kernelRadius`
  - `biasMin`, `biasMax`
  - `pB_min`, `pB_max`

---

## 6. Extension Seams

The Hearing baseline is intentionally built to accept deltas without rewriting the baseline:

### 6.1 Alternate Mappings (Allowed as Deltas)
- Remapping freq→Z nonlinearly
- Mapping pan→Y or pan→rotation bias
- Spatial injection into multiple loci
- Multi-resolution bias fields

### 6.2 Alternate Feature Extraction (Allowed as Deltas)
- Time-domain envelopes
- Onset detection
- Mel scaling
- Temporal smoothing windows

### 6.3 Additional Couplings (Not Baseline)
Any of the following are **explicit deltas**:

- bias→plasma (direct additions / flips)
- bias→liquid jitter scaling
- bias→solid writes
- bias controlling renderer aesthetics

---

## 7. Minimal Testing / Sanity Checks

Baseline implementations SHOULD provide quick validation hooks:

- **Ears Off:** bias field should decay toward ~0 over time.
- **Ears On, silence:** bias should remain near 0 (with small noise if the mic is noisy).
- **Ears On, tone:** bias should concentrate in a stable Z band with lateral displacement according to pan.
- **No collapse:** substrate should not lock into a fixed point solely from sustained audio input.

---

## 8. Minimal API Contract (Recommended)

To keep the module reusable, the Hearing baseline is well represented as:

- `extractFeatures(audioCtx, analyserL, analyserR) -> { left, right }`
- `biasField.ingest(left, right)`
- `biasField.get() -> bias[]`
- `couple(pB_base, bias[i]) -> pB[i]`

The Dreaming substrate consumes only `bias[]` and stays otherwise untouched.

---

## 9. Versioning

- **v0.1**: Establishes the canonical Hearing pipeline and the single coupling rule (probability modulation).
- Future baseline bumps occur only when **semantics** change, not when constants are tuned.

---
