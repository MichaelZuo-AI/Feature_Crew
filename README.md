# Feature Deep Dev

Multi-phase feature development with independent evaluator agents at every phase. No rushing to execution.

![Feature Deep Dev Workflow](docs/workflow.svg?v=2)

## Quick Start

```bash
curl -fsSL https://raw.githubusercontent.com/MichaelZuo-AI/Feature_Deep_Dev/main/install.sh | bash
```

Then open Claude Code in your project and run `/feature-deep-dev`.

**Prerequisites:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code). The install script handles the rest ([Superpowers](https://github.com/anthropics/claude-code-superpowers) plugin + skill files).

## Skills

| Skill | What it does |
|-------|-------------|
| `/feature-deep-dev` | Orchestrator — full lifecycle with human checkpoints |
| `/feature-deep-dev-clarify` | Phase 1 — one-pager + Figma → structured spec |
| `/feature-deep-dev-implement` | Phase 2 — code with ≥90% evaluator scoring gate |
| `/feature-deep-dev-qa` | Phase 3 — holistic QA → bug fix loop |
| `/feature-deep-dev-evaluate` | Standalone adaptive evaluator |

## Key Features

- **PO Agent** — auto-answers clarifier questions from context, escalates only what it can't (business logic, security, scope)
- **Adaptive Evaluator** — scores across 6 dimensions with weights adjusted by feature type (UI-heavy, backend, full-stack, CLI)
- **Parallel Features** — each feature gets its own git worktree and state
- **Resumable** — `/feature-deep-dev resume <name>` picks up where you left off

## License

MIT
