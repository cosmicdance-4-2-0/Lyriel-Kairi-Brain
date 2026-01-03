/*
DeltaID: 20260103_092707_AW0M53MV
Purpose: Define a renderer that maps PhaseCube state channels to RGBA output (plasma→R, liquid→G, solid→B, parity→A).
Sources:
- src/core/phasecube/index.js (read-only reference)
Notes:
- Lives in the delta mirror so the baseline repo remains untouched until copy-out.
- Avoids DOM/WebGL; focuses solely on color packing for consumers.
*/

const clamp01 = (value) => {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

/**
 * DeltaID=20260103_092707_AW0M53MV: Translate PhaseCube scalar channels into packed RGBA bytes.
 * Plasma → Red, Liquid → Green, Solid → Blue, Parity → Alpha.
 */
export class PhaseCubeRenderer {
  constructor(options = {}) {
    const { gridSize, enforceSize = true } = options;
    this.gridSize = gridSize;
    this.expectedCount = typeof gridSize === 'number' ? gridSize ** 3 : null;
    this.enforceSize = enforceSize;
  }

  #validateLengths(plasma, liquid, solid, parity) {
    const lengths = [plasma?.length ?? 0, liquid?.length ?? 0, solid?.length ?? 0, parity?.length ?? 0];
    const first = lengths[0];
    const sameLength = lengths.every((len) => len === first && len > 0);
    if (!sameLength) {
      throw new Error('All channels must be provided and share the same length.');
    }
    if (this.enforceSize && this.expectedCount !== null && first !== this.expectedCount) {
      throw new Error(`Channel length ${first} does not match expected grid size count ${this.expectedCount}.`);
    }
    return first;
  }

  /**
   * DeltaID=20260103_092707_AW0M53MV: Produce a Uint8ClampedArray in RGBA order per cell.
   */
  renderToRgba({ plasma, liquid, solid, parity }) {
    const count = this.#validateLengths(plasma, liquid, solid, parity);
    const out = new Uint8ClampedArray(count * 4);

    for (let i = 0; i < count; i += 1) {
      const base = i * 4;
      out[base] = Math.round(clamp01(plasma[i]) * 255);
      out[base + 1] = Math.round(clamp01(liquid[i]) * 255);
      out[base + 2] = Math.round(clamp01(solid[i]) * 255);
      out[base + 3] = Math.round(clamp01(parity[i]) * 255);
    }

    return out;
  }
}

export function createPhaseCubeRenderer(options = {}) {
  return new PhaseCubeRenderer(options);
}
