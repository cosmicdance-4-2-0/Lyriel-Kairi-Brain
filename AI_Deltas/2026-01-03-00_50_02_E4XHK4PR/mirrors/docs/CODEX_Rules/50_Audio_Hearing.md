# Hearing Layer Rules (Audio → Bias → Influence)

## Scope
This repo defines “Hearing” as an audio-driven influence layer that biases Dreaming dynamics without controlling them.

## Audio Inputs
Supported sources may include:
- microphone
- oscillator/synth
- audio file playback

Implementation detail is flexible, but semantics are not.

## Canonical Mapping (High-Level)
- Convert audio to frequency magnitudes (log-spaced bins are acceptable).
- Stereo difference may bias lateral placement (pan).
- Bin index may map to depth (Z).
- Magnitude may map to energy/influence strength.

## Bias Field Constraints
- Bias diffuses / spreads spatially (kernel ok).
- Bias decays over time.
- Bias is clamped to a bounded range.
- Bias never directly overwrites core state arrays; it only biases probabilities / perturbation terms.

## Tuning Policy
If jitter reduction or smoothing is introduced:
- smoothing parameters must be exposed and defaulted to baseline behavior
- do not add smoothing that changes the “feel” unless baseline spec is updated
