/*
DeltaID: 20260103_092743_S8CVRCAX
Purpose: Map PhaseCube state channels to RGBA color values for rendering.
Sources:
- docs/specs/DREAMING_BASELINE.md
Notes:
- Exists as a drop-in renderer module without touching baseline core files.
- Intentionally keeps mapping 1:1 (plasma→R, liquid→G, solid→B, parity→A) with explicit clamps.
*/

/**
 * Convert phase state channels into a packed RGBA array suitable for canvas rendering.
 * Plasma, liquid, and solid map directly to R, G, and B (0–255). Parity maps to alpha.
 * @param {{ plasma: ArrayLike<number>, liquid: ArrayLike<number>, solid: ArrayLike<number>, parity: ArrayLike<number> }} state
 * @returns {Uint8ClampedArray} Packed RGBA values (length = N * 4).
 */
export function mapPhasesToRgba(state) {
  const { plasma, liquid, solid, parity } = state;
  if (!plasma || !liquid || !solid || !parity) {
    throw new Error('state must include plasma, liquid, solid, and parity arrays');
  }

  const count = Math.min(plasma.length, liquid.length, solid.length, parity.length);
  const out = new Uint8ClampedArray(count * 4);

  for (let i = 0; i < count; i += 1) {
    const offset = i * 4;
    out[offset] = toByte(plasma[i]);
    out[offset + 1] = toByte(liquid[i]);
    out[offset + 2] = toByte(solid[i]);
    out[offset + 3] = toByte(parity[i]);
  }

  return out;
}

/**
 * Return a single RGBA sample for the provided cell index.
 * Values are clamped to [0,1] before scaling to [0,255].
 * @param {{ plasma: ArrayLike<number>, liquid: ArrayLike<number>, solid: ArrayLike<number>, parity: ArrayLike<number> }} state
 * @param {number} index
 * @returns {{ r: number, g: number, b: number, a: number }}
 */
export function colorAt(state, index) {
  const { plasma, liquid, solid, parity } = state;
  if (
    !plasma ||
    !liquid ||
    !solid ||
    !parity ||
    index < 0 ||
    index >= plasma.length ||
    index >= liquid.length ||
    index >= solid.length ||
    index >= parity.length
  ) {
    throw new Error('index out of bounds or state missing channels');
  }

  return {
    r: toByte(plasma[index]),
    g: toByte(liquid[index]),
    b: toByte(solid[index]),
    a: toByte(parity[index]),
  };
}

function toByte(value) {
  if (!Number.isFinite(value)) return 0;
  const v = value < 0 ? 0 : value > 1 ? 1 : value;
  return Math.round(v * 255);
}
