/*
DeltaID: 20260103_085658_RUFS91GI
Purpose: Browser glue that wires the PhaseCube core and Hearing bias modules into a canvas-based demo for static hosting.
Sources:
- web/main.js
- src/core/phasecube/index.js
- src/modules/bias/hearing.js
Notes:
- Imports are localized to this bundle to avoid cross-directory dependencies.
- Path B modulation remains the only coupling to Hearing, per baseline.
*/

import { createPhaseCubeRunner } from './core/phasecube.js';
import { createHearingBias } from './modules/hearing.js';

const config = {
  gridSize: 16,
  scale: 25,
  pointSize: 3,
  flipP: 0.02,
  parityP: 0.01,
  pathBP: 0.65,
  parityGain: 0.13,
  alpha: 0.18,
  fpsTarget: 60,
  bias: {
    binCount: 18,
    decay: 0.94,
    strength: 0.18,
    biasMin: -0.38,
    biasMax: 0.38,
  },
};

class HearingController {
  constructor(binCount) {
    this.binCount = binCount;
    this.audioCtx = null;
    this.analyserL = null;
    this.analyserR = null;
    this.leftData = null;
    this.rightData = null;
    this.binIndices = [];
    this.splitter = null;
    this.stream = null;
    this.oscillator = null;
    this.gain = null;
  }

  async useMic() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('getUserMedia is not available in this browser.');
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 2,
        echoCancellation: false,
        noiseSuppression: false,
      },
    });
    this.#teardownTone();
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }
    this.stream = stream;
    const source = this.#ensureContext().createMediaStreamSource(stream);
    this.#wireAnalyzers(source);
  }

  async useTone() {
    const ctx = this.#ensureContext();
    this.#teardownTone();
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    osc.type = 'sine';
    osc.frequency.value = 220;
    osc.connect(gain);
    this.#wireAnalyzers(gain);
    gain.connect(ctx.destination);
    osc.start();
    this.oscillator = osc;
    this.gain = gain;
  }

  sample() {
    if (!this.analyserL || !this.analyserR) return null;
    this.analyserL.getByteFrequencyData(this.leftData);
    this.analyserR.getByteFrequencyData(this.rightData);
    const left = new Array(this.binIndices.length);
    const right = new Array(this.binIndices.length);
    for (let i = 0; i < this.binIndices.length; i += 1) {
      const idx = this.binIndices[i];
      left[i] = (this.leftData[idx] ?? 0) / 255;
      right[i] = (this.rightData[idx] ?? 0) / 255;
    }
    return { left, right };
  }

  stop() {
    this.#teardownTone();
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.#disposeAnalyzers();
  }

  #wireAnalyzers(source) {
    this.#disposeAnalyzers();

    const ctx = this.#ensureContext();
    this.splitter = ctx.createChannelSplitter(2);
    source.connect(this.splitter);
    this.analyserL = ctx.createAnalyser();
    this.analyserR = ctx.createAnalyser();
    this.analyserL.fftSize = 2048;
    this.analyserR.fftSize = 2048;
    this.analyserL.smoothingTimeConstant = 0.66;
    this.analyserR.smoothingTimeConstant = 0.66;

    this.splitter.connect(this.analyserL, 0);
    this.splitter.connect(this.analyserR, 1);

    this.leftData = new Uint8Array(this.analyserL.frequencyBinCount);
    this.rightData = new Uint8Array(this.analyserR.frequencyBinCount);
    this.binIndices = this.#buildLogBins(ctx.sampleRate, this.analyserL.frequencyBinCount);
  }

  #buildLogBins(sampleRate, freqBinCount) {
    const bins = [];
    const minFreq = 20;
    const nyquist = sampleRate / 2;
    const maxFreq = Math.min(20000, nyquist - 1);
    const count = Math.max(1, this.binCount);
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0 : i / (count - 1);
      const freq = minFreq * ((maxFreq / minFreq) ** t);
      const index = Math.min(freqBinCount - 1, Math.round((freq / nyquist) * freqBinCount));
      bins.push(index);
    }
    return bins;
  }

  #ensureContext() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  #disposeAnalyzers() {
    if (this.splitter) {
      try { this.splitter.disconnect(); } catch (_) { /* noop */ }
      this.splitter = null;
    }
    if (this.analyserL) {
      try { this.analyserL.disconnect(); } catch (_) { /* noop */ }
      this.analyserL = null;
    }
    if (this.analyserR) {
      try { this.analyserR.disconnect(); } catch (_) { /* noop */ }
      this.analyserR = null;
    }
  }

  #teardownTone() {
    if (this.oscillator) {
      try { this.oscillator.stop(); } catch (_) { /* noop */ }
      try { this.oscillator.disconnect(); } catch (_) { /* noop */ }
    }
    if (this.gain) {
      try { this.gain.disconnect(); } catch (_) { /* noop */ }
    }
    this.oscillator = null;
    this.gain = null;
  }
}

const canvas = document.getElementById('phasecube');
const ctx = canvas.getContext('2d', { alpha: false });
const stepEl = document.getElementById('step');
const biasEl = document.getElementById('bias');
const audioEl = document.getElementById('audio');
const seedEl = document.getElementById('seed');
const toastEl = document.getElementById('toast');

const seed = crypto.getRandomValues(new Uint32Array(1))[0];
seedEl.textContent = seed.toString();

const runner = createPhaseCubeRunner({
  gridSize: config.gridSize,
  flipP: config.flipP,
  parityP: config.parityP,
  pathBP: config.pathBP,
  parityGain: config.parityGain,
  alpha: config.alpha,
  seed,
});

const biasField = createHearingBias({
  gridSize: config.gridSize,
  binCount: config.bias.binCount,
  decay: config.bias.decay,
  strength: config.bias.strength,
  biasMin: config.bias.biasMin,
  biasMax: config.bias.biasMax,
});

const positions = buildPositions(config.gridSize, config.scale);
let viewWidth = 0;
let viewHeight = 0;
let deviceScale = window.devicePixelRatio || 1;

let rotationX = -0.35;
let rotationY = 0.45;
let isDragging = false;
let lastPointer = { x: 0, y: 0 };

let running = true;
let earsMode = 'off'; // off | mic | tone
let lastBiasAverage = 0;
let frameCounter = 0;
let hueClock = 0;
let lastStepMs = performance.now();

const hearing = new HearingController(config.bias.binCount);

function buildPositions(size, scale) {
  const total = size ** 3;
  const coords = new Float32Array(total * 3);
  const half = (size - 1) / 2;
  let p = 0;
  for (let x = 0; x < size; x += 1) {
    for (let y = 0; y < size; y += 1) {
      for (let z = 0; z < size; z += 1) {
        coords[p++] = (x - half) * scale;
        coords[p++] = (y - half) * scale;
        coords[p++] = (z - half) * scale;
      }
    }
  }
  return coords;
}

function resizeCanvas() {
  deviceScale = window.devicePixelRatio || 1;
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
  canvas.width = Math.floor(viewWidth * deviceScale);
  canvas.height = Math.floor(viewHeight * deviceScale);
  ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
}

function projectPoints(rotX, rotY) {
  const projected = [];
  const len = positions.length / 3;
  const cX = Math.cos(rotX);
  const sX = Math.sin(rotX);
  const cY = Math.cos(rotY);
  const sY = Math.sin(rotY);
  const fov = Math.PI / 4;
  const f = 1 / Math.tan(fov / 2);
  const aspect = viewWidth / viewHeight;
  const camZ = 420;

  for (let i = 0, p = 0; i < len; i += 1, p += 3) {
    const px = positions[p];
    const py = positions[p + 1];
    const pz = positions[p + 2];

    const rx = cY * px + sY * pz;
    const rz = -sY * px + cY * pz;
    const ry = cX * py - sX * rz;
    const rz2 = sX * py + cX * rz;

    const depth = rz2 - camZ;
    if (!Number.isFinite(depth) || Math.abs(depth) < 1e-3) continue;

    const ndcX = (f / aspect) * (rx / depth);
    const ndcY = f * (ry / depth);
    const x = (ndcX * 0.5 + 0.5) * viewWidth;
    const y = (ndcY * 0.5 + 0.5) * viewHeight;

    projected.push({ i, depth, x, y });
  }

  projected.sort((a, b) => b.depth - a.depth);
  return projected;
}

function render(state) {
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  const plasma = state.plasma;
  const parity = state.parity;
  const points = projectPoints(rotationX, rotationY);

  for (const pt of points) {
    const energy = plasma[pt.i];
    if (energy < 0.02) continue;
    if (pt.depth > 3000 || pt.depth < -4000) continue;

    const hue = (hueClock * 0.1 + parity[pt.i] + energy) % 1;
    const t = hue * Math.PI * 2;
    const r = Math.abs(Math.sin(t));
    const g = Math.abs(Math.sin(t + 2));
    const b = Math.abs(Math.sin(t + 4));
    const alpha = 0.35 + 0.65 * energy;
    const radius = config.pointSize + 6 * energy;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, ${alpha.toFixed(3)})`;
    ctx.fill();
  }
}

function meanAbs(field) {
  let total = 0;
  for (let i = 0; i < field.length; i += 1) {
    total += Math.abs(field[i]);
  }
  return total / field.length;
}

function updateHud() {
  stepEl.textContent = runner.state.step.toString();
  if (earsMode === 'off') {
    biasEl.textContent = 'off';
  } else {
    biasEl.textContent = `${lastBiasAverage.toFixed(3)}`;
  }
  audioEl.textContent = earsMode === 'off' ? 'off' : earsMode;
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.style.display = 'block';
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    toastEl.style.display = 'none';
  }, 2400);
}

function advanceSimulation() {
  const hasAudio = earsMode !== 'off';
  if (hasAudio) {
    const features = hearing.sample();
    if (features) {
      biasField.ingest(features);
    } else {
      biasField.tick();
    }
  } else {
    biasField.tick();
  }

  const bias = earsMode === 'off' ? undefined : biasField.getField();
  runner.tick({ biasField: bias });
  frameCounter += 1;

  if (frameCounter % 10 === 0 && earsMode !== 'off') {
    lastBiasAverage = meanAbs(biasField.getField());
  }
}

function frame(now) {
  const stepInterval = 1000 / config.fpsTarget;
  const deltaMs = now - lastStepMs;
  if (running && deltaMs >= stepInterval) {
    const steps = Math.min(4, Math.floor(deltaMs / stepInterval));
    for (let i = 0; i < steps; i += 1) {
      advanceSimulation();
      lastStepMs += stepInterval;
      hueClock += stepInterval / 1000;
    }
  }

  render(runner.state);
  updateHud();
  requestAnimationFrame(frame);
}

function saveSnapshot() {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.download = `phasecube_${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  lastPointer = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', () => {
  isDragging = false;
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastPointer.x;
  const dy = e.clientY - lastPointer.y;
  lastPointer = { x: e.clientX, y: e.clientY };
  rotationY += dx * 0.005;
  rotationX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, rotationX + dy * 0.005));
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.getElementById('toggle-run').addEventListener('click', () => {
  running = !running;
  document.getElementById('toggle-run').textContent = running ? 'Pause' : 'Resume';
});

document.getElementById('snapshot').addEventListener('click', saveSnapshot);

document.getElementById('enable-mic').addEventListener('click', async () => {
  try {
    await hearing.useMic();
    earsMode = 'mic';
    toast('Microphone enabled. Biasing Path B probability.');
  } catch (err) {
    toast(err?.message ?? 'Microphone unavailable.');
  }
});

document.getElementById('enable-tone').addEventListener('click', async () => {
  try {
    await hearing.useTone();
    earsMode = 'tone';
    toast('Test tone running. Biasing Path B probability.');
  } catch (err) {
    toast(err?.message ?? 'Unable to start test tone.');
  }
});

document.getElementById('clear-bias').addEventListener('click', () => {
  hearing.stop();
  earsMode = 'off';
  biasField.getField().fill(0);
  lastBiasAverage = 0;
  toast('Bias field cleared and audio stopped.');
});

requestAnimationFrame(frame);
