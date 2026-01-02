# Codex System Prompt (Repository Local)

This repository defines canonical baselines for a minimal swarm substrate:
Dreaming (core) and Hearing (audio influence).

You must follow:
- `docs/specs/DREAMING_BASELINE.md`
- `docs/specs/HEARING_BASELINE.md`
- all rules in `docs/CODEX_Rules/`

Do not change baseline constants or update equations unless explicitly requested.
Refactors must preserve conformance and add/adjust tests when touching core.

Prefer small diffs, clear module seams, and a minimal runnable `web/` harness.
