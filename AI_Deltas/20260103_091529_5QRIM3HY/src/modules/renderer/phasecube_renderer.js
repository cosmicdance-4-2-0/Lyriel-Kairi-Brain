/*
DeltaID: 20260103_091529_5QRIM3HY
Purpose: Provide a baseline-aligned renderer for PhaseCube state arrays with projection helpers.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/CODEX_Rules/30_Code_Style.md
- src/core/phasecube/index.js (mirrored)
Notes:
- Keeps rendering separate from the core to preserve baseline dynamics.
- Avoids DOM dependencies beyond an optional Canvas 2D context parameter.
*/

const clamp01 = (value) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

/**
 * DeltaID: 20260103_091529_5QRIM3HY — Precompute static lattice positions for rendering.
 */
export function buildPositions(gridSize, scale) {
  const total = gridSize ** 3;
  const positions = new Float32Array(total * 3);
  const half = (gridSize - 1) / 2;
  let ptr = 0;
  for (let x = 0; x < gridSize; x += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      for (let z = 0; z < gridSize; z += 1) {
        positions[ptr] = (x - half) * scale;
        positions[ptr + 1] = (y - half) * scale;
        positions[ptr + 2] = (z - half) * scale;
        ptr += 3;
      }
    }
  }
  return positions;
}

/**
 * DeltaID: 20260103_091529_5QRIM3HY — Project 3D positions to 2D screen coordinates.
 */
export function projectPoints({ positions, rotX, rotY, width, height }) {
  const projected = [];
  const camZ = 400;
  const fov = Math.PI / 4;
  const f = 1 / Math.tan(fov / 2);
  const aspect = width / height;
  const cX = Math.cos(rotX);
  const sX = Math.sin(rotX);
  const cY = Math.cos(rotY);
  const sY = Math.sin(rotY);
  const count = positions.length / 3;

  for (let i = 0, p = 0; i < count; i += 1, p += 3) {
    const rawX = positions[p];
    const rawY = positions[p + 1];
    const rawZ = positions[p + 2];

    const rotXVal = cY * rawX + sY * rawZ;
    const rotZVal = -sY * rawX + cY * rawZ;
    const rotYVal = cX * rawY - sX * rotZVal;
    const rotZVal2 = sX * rawY + cX * rotZVal;

    const cameraZ = camZ - rotZVal2;
    if (Math.abs(cameraZ) < 1e-6) continue;

    const ndcX = (f / aspect) * (rotXVal / cameraZ);
    const ndcY = f * (rotYVal / cameraZ);

    projected.push({
      index: i,
      z: cameraZ,
      x: (ndcX * 0.5 + 0.5) * width,
      y: (ndcY * 0.5 + 0.5) * height,
    });
  }

  projected.sort((a, b) => b.z - a.z);
  return projected;
}

/**
 * DeltaID: 20260103_091529_5QRIM3HY — Minimal renderer aligning with the baseline visualization notes.
 */
export class PhaseCubeRenderer {
  constructor(options = {}) {
    const {
      gridSize = 16,
      scale = 24,
      pointSize = 3,
      hueSpeed = 0.08,
      visibilityThreshold = 0.02,
      rotX = 0,
      rotY = Math.PI / 4,
    } = options;

    this.gridSize = gridSize;
    this.scale = scale;
    this.pointSize = pointSize;
    this.hueSpeed = hueSpeed;
    this.visibilityThreshold = visibilityThreshold;
    this.rotX = rotX;
    this.rotY = rotY;
    this.positions = buildPositions(gridSize, scale);
    this.viewport = { width: 1, height: 1, deviceScale: 1 };
  }

  /**
   * DeltaID: 20260103_091529_5QRIM3HY — Update viewport and device scale for crisp rendering.
   */
  setViewport(width, height, deviceScale = 1) {
    this.viewport = { width, height, deviceScale };
  }

  /**
   * DeltaID: 20260103_091529_5QRIM3HY — Set camera rotation in radians.
   */
  setRotation(rotX, rotY) {
    this.rotX = rotX;
    this.rotY = rotY;
  }

  /**
   * DeltaID: 20260103_091529_5QRIM3HY — Compute projected points decorated with color/alpha.
   */
  projectState(state, timeSeconds = 0) {
    const { plasma, liquid, parity } = state;
    const { width, height } = this.viewport;
    const baseHue = timeSeconds * this.hueSpeed;
    const projected = projectPoints({
      positions: this.positions,
      rotX: this.rotX,
      rotY: this.rotY,
      width,
      height,
    });

    const detailed = [];
    for (const pt of projected) {
      const l = clamp01(liquid[pt.index] ?? 0);
      if (l < this.visibilityThreshold) continue;
      const p = clamp01(plasma[pt.index] ?? 0);
      const par = parity?.[pt.index] ?? 0;
      const hue = (baseHue + par * 0.3 + p) % 1;
      const t = hue * Math.PI * 2;
      const r = Math.abs(Math.sin(t));
      const g = Math.abs(Math.sin(t + 2));
      const b = Math.abs(Math.sin(t + 4));
      const alpha = 0.3 + 0.7 * l;
      const radius = this.pointSize + 6 * l;
      detailed.push({ ...pt, r, g, b, alpha, radius });
    }
    return detailed;
  }

  /**
   * DeltaID: 20260103_091529_5QRIM3HY — Render to a 2D canvas context when provided.
   * Notes: Keeps rendering optional so core remains DOM-free.
   */
  render(state, ctx, timeSeconds = 0) {
    const points = this.projectState(state, timeSeconds);
    if (!ctx) return points;
    const { width, height, deviceScale } = this.viewport;
    ctx.save();
    ctx.scale(deviceScale, deviceScale);
    ctx.clearRect(0, 0, width, height);
    for (const pt of points) {
      ctx.beginPath();
      ctx.arc(pt.x / deviceScale, pt.y / deviceScale, pt.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(pt.r * 255)},${Math.round(pt.g * 255)},${Math.round(pt.b * 255)},${pt.alpha.toFixed(3)})`;
      ctx.fill();
    }
    ctx.restore();
    return points;
  }
}

export function createRenderer(options = {}) {
  return new PhaseCubeRenderer(options);
}
