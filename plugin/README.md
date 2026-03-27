# Feature Crew

Multi-phase feature development with independent evaluator agents at every phase. Parallel exploration, adaptive retry, and experiment logging inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

## Installation

```bash
claude plugins add /path/to/FeatureCrew/plugin
```

## Quick Reference

| Phase | Skill | What Happens |
|-------|-------|--------------|
| Phase 1 | `feature-crew-clarify` | Feature requirement → structured spec via question loop |
| Checkpoint 1 | Human (skipped in auto mode) | Approve spec before implementation |
| Phase 2 | `feature-crew-implement` | Plan → parallel exploration → evaluator scoring gate (≥90%) |
| Checkpoint 2 | Human (skipped in auto mode if ≥95%) | Code review before QA |
| Phase 3 | `feature-crew-qa` | Holistic QA → bug fix loop → ship |

## Usage

```
/feature-crew                    # Start a new feature
/feature-crew auto <name>        # Start in autonomous mode
/feature-crew resume <name>      # Resume a feature
/feature-crew list               # List all features
/feature-crew analyze            # Cross-feature analytics
/feature-crew-evaluate           # Standalone code evaluation
```

## Key Features

- **Parallel exploration** — 2-3 implementations compete, best wins
- **Git-as-frontier** — branch tip always represents best-known state
- **Adaptive retry** — 7-round strategy ladder (normal → architectural pivot → specialist → minimal viable → blocked)
- **Phase backtracking** — evaluator can trigger return to clarification
- **Experiment logging** — per-feature metrics.json for post-hoc analysis
- **Autonomous mode** — graduated checkpoint skipping for low-risk features
- **Time budgets** — soft caps with escalation, never hard-kills
