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

## Example: Smart Search Bar

The [`examples/smart-search-bar`](examples/smart-search-bar) directory contains a complete feature built end-to-end with Feature Crew — from a one-pager to production-ready code with 142 passing tests.

### What was built

An AI-powered smart search bar with natural language query understanding, real-time suggestions, auto-generated filter chips, and instant results preview. Built with React 18, Next.js 14, TypeScript, Zustand, and Tailwind CSS.

### How it went through the pipeline

| Phase | What happened | Result |
|-------|--------------|--------|
| **Clarify** | PO Agent auto-answered 18 of 22 questions; 4 escalated to human (error handling, voice input, state persistence, rate limiting) | [spec.md](examples/smart-search-bar/docs/superpowers/feature-crew/smart-search-bar/spec.md) — 49 acceptance criteria |
| **Implement** | 4 evaluation rounds; scored 72% → 82% → 78% → **93%** (PASS) | 38 source files, 12 components, 4 hooks, 2 API routes |
| **QA** | 142/142 tests passing, ALL_CLEAR on first QA round | [qa-report-1.md](examples/smart-search-bar/docs/superpowers/feature-crew/smart-search-bar/qa-report-1.md) |

### What's in the example

```
examples/smart-search-bar/
├── feature_requirments/          # Input: one-pager + Figma design spec
│   ├── one-pager.md
│   └── figma-design-spec.html
├── docs/superpowers/feature-crew/smart-search-bar/
│   ├── state.json                # Lifecycle state + PO Agent decision log
│   ├── spec.md                   # Generated spec (49 ACs)
│   ├── plan.md                   # Implementation plan (12 tasks)
│   ├── eval-round-1.md           # First eval: 72/100 FAIL
│   ├── eval-round-4.md           # Final eval: 93/100 PASS
│   └── qa-report-1.md            # QA: ALL_CLEAR
└── src/                          # The actual implementation
    ├── components/SmartSearchBar/ # 12 React components
    ├── hooks/                     # Zustand store, debounce, media query
    ├── app/api/v2/search/         # Mock API routes with NLU parsing
    ├── lib/                       # Types, analytics, rate limiter
    └── __tests__/                 # 142 tests across 12 suites
```

### Try it yourself

```bash
cd examples/smart-search-bar
npm install
npm run dev        # → http://localhost:3000
npm test           # 142 tests
```

## License

MIT
