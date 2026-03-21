# Feature Deep Dev — Design Spec

**Date:** 2026-03-21
**Status:** Draft
**Author:** Michael Zuo + Claude

## Overview

`feature-deep-dev` is a Claude Code skill family that orchestrates a multi-phase feature development workflow. Its core principle: **every phase has an independent sub-agent that does deep-dive evaluation before the workflow can proceed**. No rushing to execution.

The system layers on top of existing Superpowers skills (brainstorming, writing-plans, subagent-driven-development, using-git-worktrees, finishing-a-development-branch), wrapping each phase with evaluation gates and adding a dedicated QA/bug-fix phase that doesn't exist today.

## Skill Family

| Skill | Role |
|-------|------|
| `feature-deep-dev` | Orchestrator — lifecycle, state management, worktrees, human checkpoints |
| `feature-deep-dev-clarify` | Phase 1 — question loop with user → structured spec |
| `feature-deep-dev-implement` | Phase 2 — plan → code → evaluator scoring gate (≥90%) |
| `feature-deep-dev-qa` | Phase 3 — holistic QA → bug fix loop |
| `feature-deep-dev-evaluate` | Shared evaluator agent — adaptive rubric, scoring, reports |

## Input

User provides:
- **Figma link** — design reference (optional for non-UI features)
- **One-Pager** — feature description, pasted into chat

## State Management

Each feature creates a state directory:
```
docs/superpowers/feature-deep-dev/<feature-name>/
├── state.json          # lifecycle state, current phase, worktree path
├── spec.md             # output of Phase 1
├── plan.md             # generated implementation plan
├── eval-round-1.md     # Phase 2 evaluation reports
├── eval-round-2.md
├── qa-report-1.md      # Phase 3 QA reports
└── qa-report-2.md
```

### state.json

```json
{
  "featureName": "user-profile-page",
  "input": {
    "figmaLink": "https://figma.com/...",
    "onePager": "..."
  },
  "worktree": {
    "path": ".worktrees/user-profile-page",
    "branch": "feature/user-profile-page"
  },
  "phase": "IMPLEMENTING",
  "phaseHistory": [
    { "phase": "INIT", "timestamp": "2026-03-21T10:00:00Z" },
    { "phase": "CLARIFYING", "timestamp": "2026-03-21T10:01:00Z" },
    { "phase": "CHECKPOINT_1", "timestamp": "2026-03-21T10:15:00Z", "approved": true },
    { "phase": "IMPLEMENTING", "timestamp": "2026-03-21T10:16:00Z" }
  ],
  "evalRounds": 0,
  "qaRounds": 0
}
```

### State Transitions

```
INIT → CLARIFYING → CHECKPOINT_1 → IMPLEMENTING → CHECKPOINT_2 → QA → PRODUCTION
                                         ↓                        ↓
                                    BLOCKED_IMPL              BLOCKED_QA
                                  (escalate to human        (escalate to human
                                   after 3 eval rounds)      after 3 QA rounds)
```

The state file is session-independent — if Claude Code is closed mid-feature, re-invoking `/feature-deep-dev` reads the state file and resumes from the current phase.

### Cleanup

After a feature ships (reaches `PRODUCTION`), the state directory is preserved for reference. The user can delete it manually. Future versions may auto-archive to a `completed/` subdirectory.

---

## Phase 1: Clarify (`feature-deep-dev-clarify`)

**Input:** Figma link + One-Pager text
**Output:** Structured spec (`spec.md`)

### Process

1. **Parse & Analyze** — A Clarifier sub-agent reads the one-pager and analyzes the Figma link (the user pastes screenshots from Figma into the chat since Claude Code cannot render Figma directly). It identifies:
   - Core user stories / acceptance criteria
   - Technical ambiguities (e.g., "what happens on error?", "what's the empty state?")
   - Edge cases not covered in the spec
   - Dependencies on existing code or APIs

2. **Question Loop** — The Clarifier asks the user questions **one at a time**:
   - What's ambiguous
   - Why it matters
   - Suggested options (multiple choice when possible)

3. **Spec Generation** — Produces a structured spec saved to `spec.md`:
   - Feature summary
   - Acceptance criteria (numbered, testable)
   - Technical decisions made during clarification
   - Out of scope (explicitly listed)
   - **Evaluator criteria hints** — what "good" looks like for this feature, feature type classification (UI-heavy / backend / full-stack / CLI), any dimension weight overrides

4. **Checkpoint 1** — Presents the spec to the user for approval. User can edit, request changes, or approve to proceed.

### Underlying Skills

- Reuses conversational style from `brainstorming` skill
- Spec is saved and committed to git

### Future Evolution (v2)

Add an AI PM agent that answers clarifying questions first based on the provided spec, only escalating unresolvable ambiguities to the human. The Clarifier → PM Agent loop runs autonomously; only genuinely ambiguous items reach Checkpoint 1.

---

## Phase 2: Implement (`feature-deep-dev-implement`)

**Input:** Approved spec from Phase 1
**Output:** Implemented code + evaluation report

### Process

1. **Plan Generation** — Invokes `writing-plans` skill to break the spec into bite-sized tasks with exact file paths, code, and verification steps.

2. **Implementation** — Invokes `subagent-driven-development` to execute the plan. Each task gets:
   - Fresh Implementer sub-agent (writes code)
   - Two-stage review (spec compliance + code quality) — existing behavior

3. **Evaluation Gate** — After all tasks complete, dispatches the **Evaluator agent** (`feature-deep-dev-evaluate`):
   - Reads original spec + evaluator criteria hints
   - Adapts rubric based on feature type
   - Produces scored evaluation report (`eval-round-N.md`)

4. **Score Gate** — If overall score < 90%:
   - Evaluator feedback → fresh Implementer sub-agent
   - Implementer fixes issues
   - Evaluator re-evaluates (new round)
   - **Max 3 rounds** — if still < 90% after 3 rounds, escalate to human

5. **Checkpoint 2** — Presents evaluation report + code diff to user for human code review.

### Key Principle

The Evaluator agent is **completely independent** from the Implementer — fresh context, no shared state. It is an adversarial reviewer, not a rubber stamp.

---

## Phase 3: QA (`feature-deep-dev-qa`)

**Input:** Implemented code that passed Checkpoint 2
**Output:** Bug-free code ready for production

### Process

1. **QA Agent** — A dedicated sub-agent that does holistic testing:
   - Runs the **full test suite** (not just new feature tests)
   - Tests integration points — does the new feature break existing functionality?
   - Checks edge cases from the spec's acceptance criteria
   - For UI features: tests viewport sizes, interaction flows, loading/error states
   - Produces a **bug report** — structured list of issues:
     - Description, reproduction steps, severity (critical / major / minor)
     - Expected vs actual behavior
     - File path + line number if identifiable

2. **Bug Fixer Agent** — Receives the bug report:
   - Fresh sub-agent per fix (no context pollution)
   - Writes/updates tests to cover the bug
   - Commits each fix individually

3. **Verification Loop** — QA Agent re-runs after fixes:
   - Verifies reported bugs are fixed
   - Checks for regressions introduced by fixes
   - If new bugs found → back to Bug Fixer
   - **Max 3 rounds** — then escalate to human

4. **Production Gate** — All tests pass, QA Agent signs off. Invokes `finishing-a-development-branch` to merge/PR/ship.

### Key Distinction from Phase 2

Phase 2's evaluator checks **"did you build it right?"** against the spec. Phase 3's QA agent checks **"does it actually work?"** through real execution and integration testing.

---

## Shared Evaluator (`feature-deep-dev-evaluate`)

**Purpose:** Reusable evaluation engine used by Phase 2's scoring gate.

### Adaptive Scoring Rubric

The evaluator reads the spec's evaluator criteria hints and feature type, then selects weights:

| Dimension | UI-heavy | Backend | Full-stack | CLI |
|-----------|----------|---------|------------|-----|
| Spec compliance | 25% | 30% | 25% | 30% |
| Code quality | 15% | 25% | 20% | 25% |
| Test coverage | 15% | 25% | 20% | 30% |
| UI/UX fidelity | 30% | 0% | 20% | 0% |
| Error handling | 5% | 10% | 5% | 10% |
| Integration safety | 10% | 10% | 10% | 5% |

### Output Format

```markdown
## Evaluation Round N

**Feature type detected:** UI-heavy
**Overall score:** 82/100

### Dimension Scores
- Spec compliance: 90/100 — [rationale]
- Code quality: 85/100 — [rationale]
- Test coverage: 70/100 — [rationale]
- UI/UX fidelity: 80/100 — [rationale]
- Error handling: 75/100 — [rationale]
- Integration safety: 90/100 — [rationale]

### Issues Found (blocks ≥90%)
1. [Critical] Missing empty state for user list — spec item #3
2. [Major] No error boundary on API failure

### What's Good
- Clean component decomposition
- Tests cover happy path well

### Remediation
1. Add empty state component — estimated 1 task
2. Add error boundary — estimated 1 task
```

### Key Behaviors

- Feature type can be **overridden** via evaluator criteria hints in the spec
- If a dimension doesn't apply, its weight redistributes proportionally
- The evaluator never sees the implementer's reasoning — only the code and spec
- Scoring is relative to the spec's acceptance criteria, not abstract quality

---

## Parallel Feature Support

### How It Works

1. **Each invocation** of `/feature-deep-dev` creates:
   - Its own git worktree (via `using-git-worktrees`)
   - Its own state directory
   - Independent agent pipelines — no shared state between features

2. **Invocation:**
   ```
   /feature-deep-dev "User Profile Page"
   /feature-deep-dev "Search API"
   ```

3. **Checkpoints are per-feature** — Feature A can be in Phase 3 while Feature B is in Phase 1. Each pauses independently at its checkpoints. To resume a specific feature: `/feature-deep-dev resume <feature-name>`.

4. **Merge coordination** — `finishing-a-development-branch` handles each feature independently. Merge conflicts between feature branches are flagged for human resolution.

### Current Constraint

Claude Code runs one conversation at a time, so "parallel" means the orchestrator interleaves — it advances whichever feature is ready and pauses others at checkpoints.

### Future Evolution (v2): Multi-Session Parallelism

A **plugin** can solve the single-session constraint:
- Watch state files and dispatch separate Claude Code sessions per feature automatically
- Coordinate checkpoints — aggregate notifications across sessions (e.g., dashboard or Slack)
- Handle merge coordination — detect when multiple features finish and manage integration order

The current design supports this by keeping all state on disk (`state.json`) rather than in-session memory. The plugin is the "launcher" layer on top.

---

## Dependencies on Existing Superpowers Skills

| Existing Skill | Used By | How |
|---------------|---------|-----|
| `brainstorming` | Phase 1 | Conversational style for clarification |
| `writing-plans` | Phase 2 | Generates implementation plan from spec |
| `subagent-driven-development` | Phase 2 | Executes plan with per-task agents + review |
| `using-git-worktrees` | Orchestrator | Creates isolated worktree per feature |
| `finishing-a-development-branch` | Phase 3 exit | Merge/PR/ship workflow |

These skills are **called, not replaced**. If they improve upstream, `feature-deep-dev` benefits automatically.

---

## What's New (Not in Existing Superpowers)

1. **Phase 1 Clarifier agent** — structured question loop producing a formal spec with evaluator hints
2. **Adaptive scoring evaluator** — quantitative evaluation with feature-type-aware rubric
3. **≥90% scoring gate** — implementation loops until quality threshold is met
4. **Phase 3 QA/Bug Fix loop** — holistic testing phase separate from per-task reviews
5. **State management** — on-disk state file enabling resume and multi-session coordination
6. **Parallel feature pipelines** — multiple features running independently via worktrees
