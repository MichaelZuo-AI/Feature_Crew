---
name: feature-deep-dev
description: Use when starting a new feature from a one-pager or Figma spec that should go through structured phases of clarification, implementation with evaluation, and QA before shipping
---

# Feature Deep Dev

Multi-phase feature development with independent evaluator agents at every phase. No rushing to execution.

## Quick Reference

| Phase | Skill | What Happens |
|-------|-------|--------------|
| Phase 1 | `feature-deep-dev-clarify` | One-pager + Figma → structured spec via question loop |
| Checkpoint 1 | Human | Approve spec before implementation |
| Phase 2 | `feature-deep-dev-implement` | Plan → code → evaluator scoring gate (≥90%) |
| Checkpoint 2 | Human | Code review before QA |
| Phase 3 | `feature-deep-dev-qa` | Holistic QA → bug fix loop → ship |

## Starting a New Feature

### Input Required

The user provides:
1. **Feature name** — short identifier (e.g., "user-profile-page")
2. **One-Pager** — feature description, pasted into chat
3. **Figma screenshots** — pasted images (optional for non-UI features)

### Kickoff

1. Create state directory: `docs/superpowers/feature-deep-dev/{feature-name}/`
2. Initialize `state.json` with phase `INIT`
3. Invoke `feature-deep-dev-clarify` to start Phase 1

## Resuming a Feature

If invoked with `resume {feature-name}`:
1. Read `docs/superpowers/feature-deep-dev/{feature-name}/state.json`
2. Route to the current phase's skill:
   - `CLARIFYING` → `feature-deep-dev-clarify`
   - `CHECKPOINT_1` → present spec for approval
   - `IMPLEMENTING` → `feature-deep-dev-implement`
   - `CHECKPOINT_2` → present eval report for code review
   - `QA` → `feature-deep-dev-qa`
   - `BLOCKED_IMPL` / `BLOCKED_QA` → present issue for human guidance
   - `PRODUCTION` → already shipped, nothing to do

## Listing Features

If invoked with `list`:
1. Scan `docs/superpowers/feature-deep-dev/*/state.json`
2. Display table: feature name, current phase, worktree branch

## State Directory

```
docs/superpowers/feature-deep-dev/{feature-name}/
├── state.json
├── spec.md
├── plan.md
├── eval-round-{N}.md
└── qa-report-{N}.md
```

## Phase Transitions

```
INIT → CLARIFYING → CHECKPOINT_1 → IMPLEMENTING → CHECKPOINT_2 → QA → PRODUCTION
                                         ↓                        ↓
                                    BLOCKED_IMPL              BLOCKED_QA
```

- Each checkpoint pauses for human approval
- BLOCKED states escalate after 3 failed rounds
- State file enables resume across sessions

## Parallel Features

Each feature gets its own:
- Git worktree (via `superpowers:using-git-worktrees`)
- State directory
- Independent agent pipelines

Start multiple: invoke `/feature-deep-dev` for each feature. They run independently. Resume any with `/feature-deep-dev resume {name}`.

## Red Flags — Never Do These

- Skip a checkpoint — always wait for human approval
- Reuse an evaluator/QA agent across rounds — always fresh context
- Let the implementer see evaluator reasoning — they only get the remediation list
- Proceed past BLOCKED — only the human can unblock
- Share state between parallel features
