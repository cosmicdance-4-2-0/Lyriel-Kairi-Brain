/*
DeltaID: 20260103_092700_FQ3KYTYN
Purpose: Map PhaseCube state channels to RGBA buffers for rendering.
Sources:
- mirrors/docs/specs/DREAMING_BASELINE.md
Notes:
- Plasma→R, Liquid→G, Solid→B, Parity→A to keep visualization coupled to core state.
- Keeps allocation optional; caller may pass an existing Uint8ClampedArray buffer.
*/

const clamp01 = (value) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const toByte = (value) => Math.round(clamp01(value) * 255);

const toAlphaByte = (parityValue, alphaOn = 255, alphaOff = 0) => {
  const parityBit = parityValue ? 1 : 0;
  return parityBit ? alphaOn : alphaOff;
};

/**
 * PROVENANCE: DeltaID=20260103_092700_FQ3KYTYN | Intent=Renderer glue for state→RGBA mapping
 * @param {Object} state - PhaseCube state containing plasma, liquid, solid, parity arrays.
 * @param {Float32Array|Uint8ClampedArray} [state.plasma]
 * @param {Float32Array|Uint8ClampedArray} [state.liquid]
 * @param {Float32Array|Uint8ClampedArray} [state.solid]
 * @param {Int8Array|Uint8Array|Array} [state.parity]
 * @param {Uint8ClampedArray} [target] - Optional preallocated RGBA buffer of length count*4.
 * @param {Object} [options]
 * @param {number} [options.alphaOn=255] - Alpha byte when parity is 1.
 * @param {number} [options.alphaOff=0] - Alpha byte when parity is 0.
 * @returns {Uint8ClampedArray} RGBA buffer ready for ImageData or WebGL textures.
 */
export function writeRgbaFromState(state, target, options = {}) {
  const { plasma, liquid, solid, parity } = state ?? {};
  if (!plasma || !liquid || !solid || !parity) {
    throw new Error('State object must include plasma, liquid, solid, and parity arrays.');
  }

  const count = Math.min(plasma.length, liquid.length, solid.length, parity.length);
  const rgba = target ?? new Uint8ClampedArray(count * 4);
  const { alphaOn = 255, alphaOff = 0 } = options;

  for (let i = 0, p = 0; i < count; i += 1, p += 4) {
    rgba[p] = toByte(plasma[i]);
    rgba[p + 1] = toByte(liquid[i]);
    rgba[p + 2] = toByte(solid[i]);
    rgba[p + 3] = toAlphaByte(parity[i], alphaOn, alphaOff);
  }

  return rgba;
}

/**
 * PROVENANCE: DeltaID=20260103_092700_FQ3KYTYN | Intent=Generate a normalized float buffer for GPU pipelines
 * @param {Object} state - Same requirements as writeRgbaFromState.
 * @param {Float32Array} [target] - Optional preallocated Float32Array of length count*4.
 * @returns {Float32Array} Normalized RGBA floats in [0,1].
 */
export function writeNormalizedRgba(state, target) {
  const { plasma, liquid, solid, parity } = state ?? {};
  if (!plasma || !liquid || !solid || !parity) {
    throw new Error('State object must include plasma, liquid, solid, and parity arrays.');
  }

  const count = Math.min(plasma.length, liquid.length, solid.length, parity.length);
  const rgba = target ?? new Float32Array(count * 4);

  for (let i = 0, p = 0; i < count; i += 1, p += 4) {
    rgba[p] = clamp01(plasma[i]);
    rgba[p + 1] = clamp01(liquid[i]);
    rgba[p + 2] = clamp01(solid[i]);
    rgba[p + 3] = parity[i] ? 1 : 0;
  }

  return rgba;
}
