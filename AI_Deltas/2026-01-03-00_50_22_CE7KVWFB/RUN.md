---
DeltaID: 2026-01-03-00_50_22_CE7KVWFB
Purpose: Provide minimal run/review instructions for this delta package without modifying the repository root.
Sources:
- docs/specs/DREAMING_BASELINE.md
- docs/specs/HEARING_BASELINE.md
Notes:
- No runnable artifacts are included; this note focuses on review and manual copy-out.
---

# RUN / REVIEW INSTRUCTIONS

Because this delta does not introduce runnable code, the “run” procedure is a short review checklist:

1. **Inspect the guidance files**  
   - Read `obvious_next_steps.md` to understand proposed actions for filling the empty implementation scaffolding.
   - Read `COPY_OUT_PLAN.md` to see the exact manual copy destinations.

2. **Plan integration**  
   - Decide whether to adopt the suggested target paths or adjust them to the evolving repo layout (while keeping specs intact).

3. **Manual copy-out (if desired)**  
   - Follow the steps in `COPY_OUT_PLAN.md` to copy files into `docs/` under the recommended names.
   - Keep core specs and baselines unchanged unless a separate change-control process is initiated.

4. **Post-copy verification**  
   - Run `git status` to confirm only the intended doc additions appear.
   - If new runnable code is later added using this guidance, ensure conformance tests are added alongside it per `docs/CODEX_Rules/40_Conformance_Tests.md`.
