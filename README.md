# Feature Crew

A crew of AI agents that take your feature from spec to production — clarifying requirements, writing code, evaluating quality, and fixing bugs at every step.

![Feature Crew Workflow](docs/workflow.svg?v=4)

## Install

```bash
# Step 1: Add the repo as a plugin marketplace (one-time)
claude plugins marketplace add https://github.com/MichaelZuo-AI/Feature_Crew

# Step 2: Install the plugin
claude plugins install feature-crew
```

Then open Claude Code in your project and run `/feature-crew`.

**Prerequisites:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and the [Superpowers](https://github.com/anthropics/claude-code-superpowers) plugin.

### Updating

```bash
claude plugins update feature-crew
```

## Skills

| Skill | What it does |
|-------|-------------|
| `/feature-crew` | Orchestrator — full lifecycle with human checkpoints |
| `/feature-crew auto <name>` | Autonomous mode — graduated checkpoint skipping |
| `/feature-crew-clarify` | Phase 1 — feature requirement → structured spec |
| `/feature-crew-implement` | Phase 2 — parallel exploration with ≥90% evaluator gate |
| `/feature-crew-qa` | Phase 3 — holistic QA → bug fix loop |
| `/feature-crew-evaluate` | Standalone adaptive evaluator |
| `/feature-crew resume <name>` | Resume a feature at any phase |
| `/feature-crew list` | List all features with status |
| `/feature-crew analyze` | Cross-feature analytics and recommendations |

## Key Features

- **Parallel exploration** — 2-3 implementations compete, best wins
- **Git-as-frontier** — branch tip always represents best-known state, failures revert
- **Adaptive retry** — 7-round strategy ladder (normal → architectural pivot → specialist → minimal viable → blocked)
- **Adaptive evaluator** — scores across 7 dimensions with weights adjusted by feature type (UI-heavy, backend, full-stack, CLI)
- **Phase backtracking** — evaluator can trigger return to clarification when spec is ambiguous
- **Experiment logging** — per-feature metrics.json for post-hoc analysis
- **Autonomous mode** — graduated checkpoint skipping for low-risk features
- **Time budgets** — soft caps with escalation, never hard-kills
- **PO Agent** — auto-answers clarifier questions from context, escalates what it can't
- **Resumable** — `/feature-crew resume <name>` picks up where you left off

## Examples

| Example | Description | Stack |
|---------|-------------|-------|
| [`smart-search-bar`](examples/smart-search-bar) | AI-powered search with NLU, filter chips, and instant preview | Next.js 14, Zustand, Tailwind |
| [`dummy-ecommerce-webapp`](examples/dummy-ecommerce-webapp) | Full e-commerce app — discovery, categories, cart, checkout, reviews, membership ([live demo](https://shop.michaelzuo.vip)) | Next.js 14, React Context, Tailwind |

### Try an example

```bash
cd examples/smart-search-bar    # or examples/dummy-ecommerce-webapp
npm install
npm run dev    # → http://localhost:3000
```

Each example includes the full Feature Crew artifact trail (`docs/superpowers/feature-crew/`) — specs, evaluation rounds, and QA reports — so you can see exactly how the pipeline built the code.

## Changelog

### v1.0.0 (2026-03-28)

**Plugin packaging** — Feature Crew is now a Claude Code plugin. Install with `claude plugins marketplace add` + `claude plugins install` instead of copying skill files.

**10 enhancements inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch):**

| # | Enhancement | What it does |
|---|-------------|-------------|
| 1 | Parallel exploration | 2-3 implementer agents compete in separate worktrees, best score wins |
| 2 | Immutable eval harness | Evaluator runs in isolated read-only worktree — can't modify code or tests |
| 3 | Implementation simplicity | New 7th scoring dimension penalizing unnecessary complexity |
| 4 | Autonomous mode | `/feature-crew auto` skips checkpoints for low-risk features (≥95% to skip code review) |
| 5 | Git-as-frontier | Branch tip = best-known state. Failed attempts revert, not accumulate |
| 6 | Experiment logging | Per-feature `metrics.json` records every eval round, score, strategy, and duration |
| 7 | Adaptive retry | 7-round strategy ladder replaces 3-strike rule (normal → architectural pivot → specialist → minimal viable → blocked) |
| 8 | Phase backtracking | Evaluator can trigger return to clarification when same AC is flagged 2 rounds in a row |
| 9 | Time budgets | Soft caps per phase with warning at 1x and escalation at 2x — never hard-kills |
| 10 | Post-hoc analysis | `/feature-crew analyze` scans all features for patterns, trends, and recommendations |

### v0.1.0 (2026-03-22)

Initial release — 3-phase pipeline (clarify → implement → QA) with PO agent, adaptive evaluator (6 dimensions), and parallel feature support via git worktrees.

## License

MIT
