/*
DeltaID: 20260103_091518_P7ETNCA4
Purpose: Provide a reusable, DOM-light renderer for PhaseCube state arrays that mirrors the baseline projection and coloring rules.
Sources:
- mirrors/docs/specs/DREAMING_BASELINE.md
- mirrors/src/core/phasecube/index.js
- mirrors/web/main.js
Notes:
- Keeps projection math and drawing detached from event handling so web or test harnesses can compose it.
- Does not mutate simulation state; consumers manage animation cadence, input, and bias plumbing.
*/

const DEFAULT_BACKGROUND = '#050505';
const DEFAULT_VISIBILITY = 0.02;
const HUE_RATE = 0.1;
const DEPTH_CLIP = { near: -4000, far: 3000 };

/**
 * Build a static list of lattice positions centered on the origin.
 */
export function buildPositions(gridSize, scale = 1) {
  const total = gridSize ** 3;
  const coords = new Float32Array(total * 3);
  const half = (gridSize - 1) / 2;
  let ptr = 0;
  for (let x = 0; x < gridSize; x += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      for (let z = 0; z < gridSize; z += 1) {
        coords[ptr++] = (x - half) * scale;
        coords[ptr++] = (y - half) * scale;
        coords[ptr++] = (z - half) * scale;
      }
    }
  }
  return coords;
}

/**
 * PhaseCubeRenderer handles projection and canvas drawing for PhaseCube state arrays.
 * It intentionally avoids DOM queries and event wiring so callers can embed it in different harnesses.
 */
export class PhaseCubeRenderer {
  constructor(options = {}) {
    const {
      gridSize = 16,
      scale = 25,
      pointSize = 3,
      background = DEFAULT_BACKGROUND,
      visibilityThreshold = DEFAULT_VISIBILITY,
    } = options;

    this.gridSize = gridSize;
    this.scale = scale;
    this.pointSize = pointSize;
    this.background = background;
    this.visibilityThreshold = visibilityThreshold;

    this.positions = buildPositions(gridSize, scale);
    this.viewWidth = 1;
    this.viewHeight = 1;
    this.rotationX = -0.35;
    this.rotationY = 0.45;
    this.hueClock = 0;
  }

  /**
   * Update viewport sizing. Device pixel ratio is handled by callers on the canvas context.
   */
  resize(viewWidth, viewHeight) {
    this.viewWidth = Math.max(1, viewWidth);
    this.viewHeight = Math.max(1, viewHeight);
  }

  /**
   * Apply rotation in radians around X and Y axes.
   */
  setRotation(rotX, rotY) {
    this.rotationX = rotX;
    this.rotationY = rotY;
  }

  /**
   * Advance internal hue clock to keep coloration time-based but deterministic per caller.
   */
  advanceHue(deltaSeconds) {
    if (!Number.isFinite(deltaSeconds)) return;
    this.hueClock += deltaSeconds;
  }

  /**
   * Project lattice points into view space, sorted back-to-front.
   */
  projectPoints() {
    const projected = [];
    const len = this.positions.length / 3;
    const cX = Math.cos(this.rotationX);
    const sX = Math.sin(this.rotationX);
    const cY = Math.cos(this.rotationY);
    const sY = Math.sin(this.rotationY);
    const fov = Math.PI / 4;
    const f = 1 / Math.tan(fov / 2);
    const aspect = this.viewWidth / this.viewHeight;
    const camZ = 420;

    for (let i = 0, p = 0; i < len; i += 1, p += 3) {
      const px = this.positions[p];
      const py = this.positions[p + 1];
      const pz = this.positions[p + 2];

      const rx = cY * px + sY * pz;
      const rz = -sY * px + cY * pz;
      const ry = cX * py - sX * rz;
      const rz2 = sX * py + cX * rz;

      const depth = rz2 - camZ;
      if (!Number.isFinite(depth) || Math.abs(depth) < 1e-3) continue;

      const ndcX = (f / aspect) * (rx / depth);
      const ndcY = f * (ry / depth);
      const x = (ndcX * 0.5 + 0.5) * this.viewWidth;
      const y = (ndcY * 0.5 + 0.5) * this.viewHeight;

      projected.push({ i, depth, x, y });
    }

    projected.sort((a, b) => b.depth - a.depth);
    return projected;
  }

  /**
   * Render the provided PhaseCube state to a 2D canvas context.
   */
  render(ctx, state, options = {}) {
    const {
      background = this.background,
      visibilityThreshold = this.visibilityThreshold,
      depthClip = DEPTH_CLIP,
    } = options;

    if (!ctx || !state) return;
    const { plasma, parity } = state;
    if (!plasma || !parity) return;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

    const points = this.projectPoints();
    const hueBase = this.hueClock * HUE_RATE;

    for (const pt of points) {
      const energy = plasma[pt.i];
      if (!Number.isFinite(energy) || energy < visibilityThreshold) continue;
      if (pt.depth > depthClip.far || pt.depth < depthClip.near) continue;

      const hue = (hueBase + parity[pt.i] + energy) % 1;
      const t = hue * Math.PI * 2;
      const r = Math.abs(Math.sin(t));
      const g = Math.abs(Math.sin(t + 2));
      const b = Math.abs(Math.sin(t + 4));
      const alpha = 0.35 + 0.65 * energy;
      const radius = this.pointSize + 6 * energy;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, ${alpha.toFixed(3)})`;
      ctx.fill();
    }
  }
}
