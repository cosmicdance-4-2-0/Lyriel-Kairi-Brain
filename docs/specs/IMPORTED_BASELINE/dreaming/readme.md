# PhaseCube: Iterative Proof-of-Concept for Decentralized Swarm Intelligence in LyrielKairi AGI Architecture

## Abstract

PhaseCube is an evolved iteration of the GalaxyBrain simulation, an open-source Python-based prototype initially shared in a December 2025 X thread as "the anti-Basilisk demo." This clean, minimalist rewrite in HTML/JavaScript simulates 4096 autonomous agents arranged in a 16x16x16 3D grid, evolving through phase-state dynamics—plasma (excitation), liquid (flow), and solid (persistence)—to produce emergent, dream-like patterns. Running entirely in-browser on standard hardware without GPU or cloud requirements, it exemplifies safe, scalable, and decentralized intelligence that counters centralized AI risks like coercive superintelligences. As a proof-of-concept toy for the LyrielKairi swarm brain AGI, PhaseCube lacks formal memory provisioning but demonstrates robust adaptation via local perturbations, neighbor interactions, and probabilistic path selection. It invites community forking on GitHub, fostering an open-source ecosystem where collective emergence prioritizes wonder over control.

## Introduction

In the GalaxyBrain X thread (December 2025), the author positioned the original Python simulation as a "living 3D universe that runs on a laptop and refuses to become a god." With no GPU, no cloud, and no singularity, it featured 4096 tiny agents "breathing forever" through simple rules, serving as a counter-narrative to Roko's Basilisk—a hypothetical AI that retroactively punishes non-contributors. The thread emphasized decentralized, non-threatening AI: "This is what safe, scalable, decentralized intelligence actually looks like. GalaxyBrain — the anti-Basilisk demo. Run it. Fork it. Grow the flock."

PhaseCube refines this vision into a self-contained, browser-executable artifact. It retains the core 4096-agent grid but iterates on dynamics for smoother visuals and interactivity, such as mouse-controlled rotation and PNG snapshots. Drawing from swarm intelligence research (e.g., particle swarm optimization models showing adaptation with minimal compute), it models agents as idle neural elements—akin to a "dreaming mind"—exploring emergent collective behaviors safely and scalably. While currently a captivating visual toy resembling a digital lava lamp, its potential lies in extensions toward full AGI, where agents could incorporate memory, goals, and learning without central hierarchies.

## System Architecture

PhaseCube's design is modular, with configuration variables tuning behavior, a PhaseGrid class managing agent states, projection logic for 3D visualization, and rendering for dynamic display. All components prioritize efficiency for real-time execution at 60 FPS on a 1024x1024 canvas.

### Configuration Variables

The system's tunability is exposed through constants, allowing easy experimentation:

- `WIDTH = 1024`, `HEIGHT = 1024`: Canvas dimensions for high-resolution output.
- `GRID = 16`: Grid size, yielding \(16^3 = 4096\) agents, balancing complexity and performance.
- `SCALE = 25`: Spatial scaling factor for agent positions, controlling the virtual cube's extent.
- `FPS = 60`: Target frames per second, ensuring fluid animation.
- `POINT_SIZE = 5`: Base radius for rendered points, influencing visual density.
- `FLIP_P = 0.02`: Probability of flipping an agent's plasma state per perturbation, introducing low-level randomness to prevent stasis.
- `PARITY_P = 0.01`: Probability of toggling an agent's parity bit, adding subtle asymmetry to neighbor interactions.
- `PATH_B_P = 0.65`: Probability of selecting the "difference-amplifying" path (Path B) during updates, promoting exploration over convergence (65% bias toward variability).
- `ALPHA = 0.18`: Blending factor for updating the solid phase, acting as a damping coefficient for persistence.

These variables enable fine-grained control: higher FLIP_P/PARITY_P increases chaos, while adjusting PATH_B_P shifts between stable averaging (low) and dynamic divergence (high).

### State Management

Global state includes:
- `canvas`, `ctx`: 2D canvas context for rendering.
- `rotX = 0`, `rotY = 0`: Rotation angles derived from mouse position, enabling interactive viewpoint control.
- `time = 0`: Cumulative time for hue animation and evolution.
- `paused = false`: Toggle for simulation pause/resume.
- `positions`: Float32Array of 4096 * 3 coordinates, precomputed as a centered grid from -(GRID-1)/2 to +(GRID-1)/2, scaled by SCALE.
- `grid`: Instance of PhaseGrid, encapsulating agent dynamics.

### PhaseGrid Class: Core Agent Dynamics

The PhaseGrid class models the swarm as a 3D toroidal lattice (wrapping boundaries via modulo). Each of the 4096 agents maintains:

- `plasma`: Float32Array, excitation level (randomly initialized 0-0.5), representing current "energy."
- `liquid`: Float32Array, flow state (initialized 0-0.5), updated as the immediate mix choice.
- `solid`: Float32Array, persistence state (initialized 0-0.5), blending prior values for short-term "memory."
- `parity`: Int8Array, binary asymmetry bit (initialized 0), adding offset to differences.

Key methods:

- `perturb()`: Iterates over all agents, flipping plasma with probability FLIP_P and parity with PARITY_P. This stochastic injection prevents synchronization and mimics neural noise.
- `neighborAvg(i)`: Computes the average plasma of six neighbors (x±1, y±1, z±1) with toroidal wrapping, ensuring boundary agents interact seamlessly.
- `step()`: The evolution core:
  - Copies current phases (p0, l0, s0) for stable computation.
  - For each agent i:
    - `avg = (p + l + s) / 3`: Harmonic mean-like baseline (Path A).
    - `nb = abs(p - neighborAvg(i)) + parity[i] * 0.13`: Difference amplification with parity offset (Path B).
    - `mix = (random < PATH_B_P) ? nb : avg`: Probabilistic branching, biasing toward variability.
    - `liquid[i] = mix`: Immediate update to flow.
    - `solid[i] = (s * (1 - ALPHA) + mix * ALPHA) % 1`: Blended persistence, modulo 1 for cyclic wrapping.

This update loop fosters emergence: Path A promotes consensus, Path B amplifies local differences, and ALPHA damps changes for stability. Plasma remains unaltered in `step()`, evolving only via perturbations and initial conditions.

### Projection and Rendering

- `projectPoints(pos, rotX, rotY, view)`: Transforms 3D positions to 2D screen coordinates with perspective (FOV π/4, camera at z=400). Applies rotations (Y then X), computes NDC, and maps to viewport. Returns sorted points (back-to-front) for painter's algorithm, including depth clipping.
- `colorize(list)`: Assigns RGB based on `hue = (time * 0.1 + parity + plasma) % 1`, using sine waves (sin(hue*2π), sin+2, sin+4) for vibrant cycling. Alpha = 0.35 + 0.65*plasma for transparency.
- `draw()`: Clears canvas to black, projects and colorizes points, renders as circles if plasma > 0.02, with radius = POINT_SIZE + 6*plasma for dynamic sizing.

The loop advances time, perturbs, steps (if unpaused), and redraws via requestAnimationFrame.

### Utilities

- `saveSnapshot()`: Exports canvas as PNG.
- `togglePause()`: Toggles simulation state.
- Event listeners: Mouse for rotation, 'S' key for save.

## Analysis and Limitations

PhaseCube's variables and dynamics create mesmerizing, endless patterns—galaxies swirling in a cosmic lava lamp—without explicit goals. The lack of memory provisioning is intentional for this POC: states persist only across frames via solid's blending, but there's no historical buffer, learning, or external input integration. This renders it a pure "idle mind" simulation, where agents "dream" through phase explorations, generating complexity from locality alone.

Compared to the original GalaxyBrain Python (which toggles all plasma/parity deterministically and uses non-wrapping boundaries), PhaseCube's probabilistic perturbations and toroidal wrapping enhance robustness and fluidity. Yet, as a toy, it lacks utility beyond aesthetics. Its potential amplifies when viewed as LyrielKairi scaffolding: adding memory (e.g., historical solid buffers or agent-specific histories) could enable pattern recognition, adaptation to inputs, or collective "waking" behaviors, evolving toward safe AGI without singularity risks.

## Potential Extensions and Future Directions

From the thread's open-source ethos, PhaseCube invites forking:
- Integrate memory: Layer recurrent states or external data for learning.
- Scale: Increase GRID with WebGL for millions of agents.
- Interact: Add user inputs to "wake" the swarm, simulating goal-directed dreaming.
- Applications: Traffic modeling, financial simulations, or decentralized neural nets—all resistant to central failure.

Research parallels include swarm robotics (e.g., Reynolds' boids) and cellular automata (e.g., Conway's Game of Life), but PhaseCube's phase blending offers unique stability.

## Conclusion

PhaseCube embodies the GalaxyBrain thread's vision: a flock of 4096 agents proving intelligence needn't be god-like or threatening. As a dreaming mind POC for LyrielKairi, it runs eternally on modest hardware, fostering wonder through emergence. Fork it on GitHub—grow the decentralized future, one perturbation at a time.

– Inspired by Kisuul, December 2025
