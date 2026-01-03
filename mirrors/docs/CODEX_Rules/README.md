# Codex Rules (Repository Local)

This directory defines the non-negotiable constraints for automated code generation and refactors in this repository.

## Priority Order
1. **Specs**: `docs/specs/*.md` (baseline definitions and invariants)
2. **Codex Rules**: `docs/CODEX_Rules/*.md` (how to work here)
3. **Code**: `src/`, `web/`, `tests/` (implementation)

If a change conflicts with a baseline spec, the change is invalid unless the baseline spec is intentionally revised **with explicit change-control** (ADR + conformance update).

## Required Reading
- `docs/specs/DREAMING_BASELINE.md`
- `docs/specs/HEARING_BASELINE.md`
- `docs/CODEX_Rules/10_Baseline_Conformance.md`
- `docs/CODEX_Rules/20_Repo_Layout.md`

## Definition: Baseline
A “baseline” is a canonical, minimal behavior target intended to be stable across ports and rewrites. Baselines are not “examples”; they are conformance anchors.

## Definition: Conformance Target
A conformance target is a measurable set of behaviors/invariants. If conformance tests exist, they are the authoritative check.
