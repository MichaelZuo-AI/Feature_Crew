# Feature Crew

Multi-phase feature development with independent evaluator agents at every phase. Parallel exploration, adaptive retry, and experiment logging inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

## Installation

### Option 1: Add as Marketplace (recommended for updates)

Register the GitHub repo as a marketplace, then install the plugin:

```bash
# Add the repo as a marketplace (one-time setup)
claude plugins marketplace add https://github.com/MichaelZuo-AI/Feature_Crew --sparse plugin .claude-plugin

# Install the plugin
claude plugins install feature-crew
```

To update later:
```bash
claude plugins update feature-crew
```

### Option 2: Direct from Local Path (for development)

If you've cloned the repo, point Claude Code directly at the plugin directory:

```bash
claude --plugin-dir /path/to/Feature_Crew/plugin
```

This loads the plugin for that session only. To make it permanent, add to your project's `.claude/settings.json`:

```json
{
  "plugins": {
    "feature-crew": {
      "path": "/path/to/Feature_Crew/plugin"
    }
  }
}
```

### Verify Installation

After installing, restart Claude Code and run:

```
/feature-crew list
```

If you see a table (even if empty), the plugin is working. You should also see `feature-crew`, `feature-crew-clarify`, `feature-crew-implement`, `feature-crew-evaluate`, and `feature-crew-qa` in the available skills list.

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
