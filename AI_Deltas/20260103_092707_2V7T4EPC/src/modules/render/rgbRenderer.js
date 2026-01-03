/*
DeltaID: 20260103_092707_2V7T4EPC
Purpose: Provide a renderer utility that maps plasma, liquid, and solid values to RGB with parity-driven alpha.
Sources:
- src/core/phasecube/index.js
- src/modules/bias/hearing.js
Notes:
- Lives under AI_Deltas only; no upstream files modified.
- Alpha channel is derived directly from the parity bit (0 → transparent, 1 → opaque).
*/

const clamp01 = (value) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

/**
 * Convert PhaseCube channel arrays into an interleaved Uint8ClampedArray of RGBA values.
 * Mapping: plasma→R, liquid→G, solid→B, parity→A.
 *
 * @param {Object} params
 * @param {Float32Array|Array<number>} params.plasma - Bounded plasma channel values in [0, 1].
 * @param {Float32Array|Array<number>} params.liquid - Bounded liquid channel values in [0, 1].
 * @param {Float32Array|Array<number>} params.solid - Bounded solid channel values in [0, 1].
 * @param {Uint8Array|Array<number>} params.parity - Binary parity values mapped to alpha.
 * @param {Object} [options]
 * @param {number} [options.alphaOn=255] - Alpha value when parity is 1.
 * @param {number} [options.alphaOff=0] - Alpha value when parity is 0.
 * @returns {Uint8ClampedArray} Interleaved RGBA values sized to the channel length.
 */
export function mapStateToRgba({ plasma, liquid, solid, parity }, options = {}) {
  if (!plasma || !liquid || !solid || !parity) {
    throw new Error('plasma, liquid, solid, and parity arrays are required');
  }
  const count = plasma.length;
  if (liquid.length !== count || solid.length !== count || parity.length !== count) {
    throw new Error('All channel arrays must have the same length');
  }

  const alphaOn = options.alphaOn ?? 255;
  const alphaOff = options.alphaOff ?? 0;
  const colors = new Uint8ClampedArray(count * 4);

  for (let i = 0; i < count; i += 1) {
    const base = i * 4;
    colors[base] = Math.round(clamp01(plasma[i]) * 255);
    colors[base + 1] = Math.round(clamp01(liquid[i]) * 255);
    colors[base + 2] = Math.round(clamp01(solid[i]) * 255);
    colors[base + 3] = parity[i] ? alphaOn : alphaOff;
  }

  return colors;
}

/**
 * Convenience helper for callers that already hold the PhaseCube state object.
 * Accepts the runner.state shape used by the baseline PhaseCubeRunner.
 *
 * @param {Object} state - PhaseCube state with plasma, liquid, solid, and parity arrays.
 * @param {Object} [options] - Forwarded to mapStateToRgba.
 * @returns {Uint8ClampedArray} Interleaved RGBA values for the provided state.
 */
export function mapRunnerStateToRgba(state, options = {}) {
  if (!state) throw new Error('state is required');
  return mapStateToRgba({
    plasma: state.plasma,
    liquid: state.liquid,
    solid: state.solid,
    parity: state.parity,
  }, options);
}

export default mapStateToRgba;
