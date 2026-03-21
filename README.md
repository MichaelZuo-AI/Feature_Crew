# Feature Deep Dev

A Claude Code skill family that orchestrates multi-phase feature development with independent evaluator agents at every phase. Built to prevent rushing to execution — each phase has deep-dive evaluation before the workflow proceeds.

## How It Works

```
Input: One-Pager + Figma Screenshots
         ↓
Phase 1: Clarify     → PO Agent auto-answers, human handles ambiguities → Structured Spec
         ↓
   Checkpoint 1      → Human approves spec
         ↓
Phase 2: Implement   → Plan → Code → Evaluator scores (≥90% to pass) → Loop if needed
         ↓
   Checkpoint 2      → Human code review
         ↓
Phase 3: QA          → Holistic testing → Bug fix loop → All clean
         ↓
   Production        → Merge / PR / Ship
```

## Quick Start

1. Open Claude Code in any project
2. Invoke `/feature-deep-dev`
3. Provide a feature name, one-pager, and optional Figma screenshots
4. The workflow guides you through each phase with human checkpoints

## Skills

| Skill | Purpose |
|-------|---------|
| `/feature-deep-dev` | Orchestrator — manages lifecycle, state, worktrees, checkpoints |
| `/feature-deep-dev-clarify` | Phase 1 — one-pager + Figma → structured spec via question loop |
| `/feature-deep-dev-implement` | Phase 2 — plan → code → evaluator scoring gate (≥90%) |
| `/feature-deep-dev-qa` | Phase 3 — holistic QA → bug fix loop |
| `/feature-deep-dev-evaluate` | Standalone evaluator with adaptive scoring rubric |

## Key Features

- **PO Agent** — auto-answers clarifier questions from context, only escalates what it can't answer (business logic, security, scope decisions)
- **Adaptive Evaluator** — scores across 6 dimensions (spec compliance, code quality, test coverage, UI fidelity, error handling, integration safety) with weights adjusted by feature type
- **Parallel Features** — each feature gets its own git worktree and state, multiple features run independently
- **Resumable** — state persisted on disk, resume any feature across sessions with `/feature-deep-dev resume <name>`

## Architecture

Layers on top of existing [Superpowers](https://github.com/anthropics/claude-code-superpowers) skills:

- `brainstorming` — conversational style for Phase 1
- `writing-plans` — plan generation for Phase 2
- `subagent-driven-development` — task execution with per-task review
- `using-git-worktrees` — isolated workspaces per feature
- `finishing-a-development-branch` — merge/PR workflow

## File Structure

```
.claude/skills/
├── feature-deep-dev/              # Orchestrator + prompt templates
│   ├── SKILL.md                   # Main orchestrator skill
│   ├── clarifier-prompt.md        # Phase 1 clarifier agent
│   ├── po-agent-prompt.md         # Phase 1 PO agent (auto-answer filter)
│   ├── evaluator-prompt.md        # Phase 2 evaluator agent
│   ├── qa-agent-prompt.md         # Phase 3 QA agent
│   └── bug-fixer-prompt.md        # Phase 3 bug fixer agent
├── feature-deep-dev-clarify/      # Phase 1 skill
│   └── SKILL.md
├── feature-deep-dev-implement/    # Phase 2 skill
│   └── SKILL.md
├── feature-deep-dev-qa/           # Phase 3 skill
│   └── SKILL.md
└── feature-deep-dev-evaluate/     # Standalone evaluator skill
    └── SKILL.md

docs/superpowers/
├── specs/                         # Design specs
│   ├── 2026-03-21-feature-deep-dev-design.md
│   └── 2026-03-21-po-agent-design.md
└── plans/                         # Implementation plans
    ├── 2026-03-21-feature-deep-dev.md
    └── 2026-03-21-po-agent.md
```

## State Management

Each feature creates its own state directory:

```
docs/superpowers/feature-deep-dev/<feature-name>/
├── state.json       # Current phase, worktree info, PO agent log
├── spec.md          # Output of Phase 1
├── plan.md          # Implementation plan
├── eval-round-N.md  # Evaluator reports
└── qa-report-N.md   # QA reports
```
