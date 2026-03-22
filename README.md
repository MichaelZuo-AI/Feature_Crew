# Feature Crew

A crew of AI agents that take your feature from spec to production — clarifying requirements, writing code, evaluating quality, and fixing bugs at every step.

![Feature Crew Workflow](docs/workflow.svg?v=2)

## Quick Start

```bash
curl -fsSL https://raw.githubusercontent.com/MichaelZuo-AI/Feature_Crew/main/install.sh | bash
```

Then open Claude Code in your project and run `/feature-crew`.

**Prerequisites:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code). The install script handles the rest ([Superpowers](https://github.com/anthropics/claude-code-superpowers) plugin + skill files).

## Skills

| Skill | What it does |
|-------|-------------|
| `/feature-crew` | Orchestrator — full lifecycle with human checkpoints |
| `/feature-crew-clarify` | Phase 1 — one-pager + Figma → structured spec |
| `/feature-crew-implement` | Phase 2 — code with ≥90% evaluator scoring gate |
| `/feature-crew-qa` | Phase 3 — holistic QA → bug fix loop |
| `/feature-crew-evaluate` | Standalone adaptive evaluator |

## Key Features

- **PO Agent** — auto-answers clarifier questions from context, escalates only what it can't (business logic, security, scope)
- **Adaptive Evaluator** — scores across 6 dimensions with weights adjusted by feature type (UI-heavy, backend, full-stack, CLI)
- **Parallel Features** — each feature gets its own git worktree and state
- **Resumable** — `/feature-crew resume <name>` picks up where you left off

## Examples

| Example | Description | Stack |
|---------|-------------|-------|
| [`smart-search-bar`](examples/smart-search-bar) | AI-powered search with NLU, filter chips, and instant preview | Next.js 14, Zustand, Tailwind |
| [`dummy-ecommerce-webapp`](examples/dummy-ecommerce-webapp) | Full e-commerce app — discovery → cart → checkout → order tracking ([live demo](https://shop.michaelzuo.vip)) | Next.js 14, React Context, Tailwind |

### Try an example

```bash
cd examples/smart-search-bar    # or examples/dummy-ecommerce-webapp
npm install
npm run dev    # → http://localhost:3000
```

Each example includes the full Feature Crew artifact trail (`docs/superpowers/feature-crew/`) — specs, evaluation rounds, and QA reports — so you can see exactly how the pipeline built the code.

## License

MIT
