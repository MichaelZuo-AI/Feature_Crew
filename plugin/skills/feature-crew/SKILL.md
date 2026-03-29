---
name: feature-crew
description: Use when starting a new feature from a requirement description that should go through structured phases of clarification, implementation with evaluation, and QA before shipping
---

# Feature Crew

Multi-phase feature development with independent evaluator agents at every phase. Parallel exploration, adaptive retry, and experiment logging inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

## Quick Reference

| Phase | Skill | What Happens |
|-------|-------|--------------|
| Phase 1 | `feature-crew-clarify` | Feature requirement → structured spec (interactive or assumptions mode) |
| Checkpoint 1 | Human (skipped in auto mode) | Approve spec before implementation |
| Phase 2 | `feature-crew-implement` | Wave-structured plan → parallel exploration → evaluator scoring gate (≥90%) |
| Checkpoint 2 | Human (skipped in auto mode if ≥95%) | Code review before QA |
| Phase 3 | `feature-crew-qa` | Holistic QA → bug fix loop → ship |

## Commands

| Command | What It Does |
|---------|--------------|
| `/feature-crew {name}` | Start a new feature (interactive mode) |
| `/feature-crew {name} --assumptions` | Start with assumptions-based clarification |
| `/feature-crew auto {name}` | Start in autonomous mode |
| `/feature-crew resume {name}` | Resume a specific feature |
| `/feature-crew next` | Auto-advance the most recently active feature |
| `/feature-crew list` | List all features and their status |
| `/feature-crew analyze` | Cross-feature analytics report |
| `/feature-crew diagnose {name}` | Root-cause analysis for stuck/blocked features |
| `/feature-crew pause {name}` | Pause a feature at next checkpoint |

## Starting a New Feature

### Input Required

The user provides:
1. **Feature name** — short identifier (e.g., "user-profile-page")
2. **Feature description** — what to build, pasted into chat or described verbally
3. **Design assets** — Figma screenshots, design specs, wireframes (optional, helps reduce ambiguity)
4. **Discussion mode** (optional) — `interactive` (default) or `assumptions`

### Kickoff

1. Create state directory: `docs/superpowers/feature-crew/{feature-name}/`
2. Initialize `state.json` with phase `INIT` (see State Schema below)
3. Invoke `feature-crew-clarify` to start Phase 1

### Discussion Mode

Controls how the clarifier gathers requirements:

- **`interactive`** (default) — Clarifier asks questions one at a time via PO Agent. Best for greenfield features or features with little existing codebase context.
- **`assumptions`** — Clarifier explores the codebase first, drafts a complete spec with best-guess answers for all ambiguities, then presents the draft to the user for corrections only. Best for features in established codebases where conventions and patterns already exist.

Set via `/feature-crew {feature-name} --assumptions` or by passing `discussMode` at kickoff.

### Autonomous Mode

Invoked with `/feature-crew auto {feature-name}`:
- State records `"mode": "auto"`
- Checkpoint 1 (spec approval): **skipped** — clarifier + PO agent resolve questions, spec is auto-approved
- Checkpoint 2 (code review): **skipped IF evaluator scores ≥95%**. If 90-94%, pauses for human review
- Every skipped checkpoint logged to `docs/superpowers/feature-crew/{feature-name}/auto-decisions.md`
- Human can interrupt: `/feature-crew pause {feature-name}`
- BLOCKED states always pause and escalate, regardless of mode

## Resuming a Feature

If invoked with `resume {feature-name}`:
1. Read `docs/superpowers/feature-crew/{feature-name}/state.json`
2. Route to the current phase's skill:
   - `CLARIFYING` → `feature-crew-clarify`
   - `CHECKPOINT_1` → present spec for approval (auto mode: skip, log to auto-decisions.md)
   - `IMPLEMENTING` → `feature-crew-implement`
   - `CHECKPOINT_2` → present eval report for code review (auto mode: skip if ≥95%, log)
   - `QA` → `feature-crew-qa`
   - `BACKTRACK_CLARIFY` → `feature-crew-clarify` with narrow scope (flagged ACs only)
   - `BLOCKED_IMPL` / `BLOCKED_QA` → present issue for human guidance
   - `PRODUCTION` → already shipped, nothing to do

## Listing Features

If invoked with `list`:
1. Scan `docs/superpowers/feature-crew/*/state.json`
2. Display table: feature name, current phase, mode, strategy, eval score, worktree branch

## Analyzing Features

If invoked with `analyze`:
1. Scan all `docs/superpowers/feature-crew/*/metrics.json` files
2. Dispatch analyzer sub-agent using `agents/analyzer.md`
3. Display report in terminal and save to `docs/superpowers/feature-crew/analysis-{YYYY-MM-DD}.md`

## Diagnosing a Feature

If invoked with `diagnose {feature-name}`:

A forensic analysis of stuck or blocked features. Produces a root-cause report without modifying any state.

1. Read `state.json` — current phase, strategy, round count, backtracks, budget warnings
2. Read all `eval-round-*.md` reports — extract dimension scores across rounds
3. Read all `qa-report-*.md` reports — extract recurring bugs
4. Read `metrics.json` — timeline, duration trends, score progression
5. Check git state — orphaned worktrees, missing frontier tags, uncommitted changes

### Analysis

Produce a diagnostic report:

```
## Diagnosis: {feature-name}

**Phase:** {current phase}
**Strategy:** {current strategy} (round {N} of 7)
**Time in phase:** {elapsed} / {budget}

### Score Trend
| Round | Overall | Failing Dimensions |
|-------|---------|-------------------|
| 1 | 72 | Test coverage (45), Spec compliance (68) |
| 2 | 75 | Test coverage (52), Spec compliance (70) |
| ... | ... | ... |

### Root Cause
{One of:}
- **Persistent dimension failure** — {dimension} has scored below 80 in {N} consecutive rounds. The issue is {description}.
- **Spec ambiguity** — AC-{N} has been flagged as a spec-level issue in {N} rounds. Consider backtracking to clarification.
- **Strategy exhaustion** — Feature has reached round {N} without passing. The strategy ladder has been escalated to {strategy}.
- **Time budget exceeded** — Phase {phase} has been running for {elapsed}s vs budget of {budget}s.
- **Git anomaly** — {description of orphaned worktree, missing tag, etc.}

### Recommended Action
{Specific next step based on root cause}
```

This command is informational only — it does not modify state or trigger phase transitions.

## Auto-Advancing: Next Step

If invoked with `next` (or no arguments when a feature is active):
1. Scan `docs/superpowers/feature-crew/*/state.json` for all features
2. Find the most recently active feature — the one whose last `phaseHistory` entry has the latest timestamp
3. Read its current phase and route to the next logical action:
   - `CLARIFYING` → resume clarification loop
   - `CHECKPOINT_1` → present spec for approval
   - `IMPLEMENTING` → resume implementation
   - `CHECKPOINT_2` → present eval report for code review
   - `QA` → resume QA
   - `BACKTRACK_CLARIFY` → resume narrow-scope clarification
   - `BLOCKED_IMPL` / `BLOCKED_QA` → present blocker for human guidance
   - `PRODUCTION` → report "Feature already shipped. Start a new feature or resume another."
4. Display: `"Auto-advancing **{feature-name}** → {phase description}"`

This lets the user type `/feature-crew next` without remembering the feature name or current phase.

## Pausing a Feature

If invoked with `pause {feature-name}`:
1. Read state, set `"paused": true`
2. Feature will not auto-advance past the next checkpoint
3. Resume with `/feature-crew resume {feature-name}` (clears paused flag)

## State Directory

```
docs/superpowers/feature-crew/{feature-name}/
├── state.json
├── spec.md
├── plan.md
├── metrics.json
├── auto-decisions.md          (auto mode only)
├── eval-round-{N}.md
└── qa-report-{N}.md
```

## State Schema

```json
{
  "featureName": "{feature-name}",
  "mode": "normal",
  "discussMode": "interactive",
  "input": {
    "figmaLink": "{if provided}",
    "featureDescription": "{summary}"
  },
  "worktree": null,
  "phase": "INIT",
  "phaseHistory": [
    { "phase": "INIT", "timestamp": "{now}" }
  ],
  "evalRounds": 0,
  "qaRounds": 0,
  "strategy": "normal",
  "frontier": null,
  "explorationBranches": [],
  "relaxedACs": [],
  "backtracks": [],
  "timeBudgets": {
    "clarify": 900,
    "implement": 1800,
    "eval": 600,
    "qa": 900,
    "bugfix": 600
  },
  "budgetWarnings": [],
  "paused": false
}
```

**Field reference:**
- `mode`: `"normal"` or `"auto"` — controls checkpoint behavior
- `discussMode`: `"interactive"` or `"assumptions"` — controls clarification approach (see Discussion Mode)
- `strategy`: current retry strategy — `"normal"`, `"architectural-pivot"`, `"specialist"`, `"minimal-viable"`
- `frontier`: git tag name of the current best implementation state (e.g., `"feature-name/frontier-3"`)
- `explorationBranches`: array of `{"worktree": "...", "branch": "...", "score": null, "status": "pending|evaluated|winner|discarded"}`
- `relaxedACs`: ACs relaxed during minimal-viable strategy (e.g., `["AC-5", "AC-8"]`)
- `backtracks`: array of `{"round": N, "acs": ["AC-3"], "resolution": "..."}` — max 1 entry
- `timeBudgets`: per-phase budget in seconds — user can override at kickoff
- `budgetWarnings`: array of `{"phase": "...", "elapsed": N, "budget": N, "timestamp": "..."}` — logged at 1x

## Phase Transitions

```
INIT → CLARIFYING → CHECKPOINT_1 → IMPLEMENTING → CHECKPOINT_2 → QA → PRODUCTION
                         ↑               ↓    ↑                   ↓
                         |          BACKTRACK_CLARIFY          BLOCKED_QA
                         |               ↓
                         |          BLOCKED_IMPL
                         |
                    (auto mode: skip)
```

### Checkpoint 1 Logic
- **Normal mode:** pause, present spec + PO decisions, wait for human approval
- **Auto mode:** skip, log decision to `auto-decisions.md`:
  ```
  ## Checkpoint 1 — Auto-Approved
  **Timestamp:** {now}
  **Reason:** Auto mode enabled. Spec generated by clarifier + PO agent.
  **PO Agent decisions:** {count} auto-answered, {count} escalated to human
  ```

### Checkpoint 2 Logic
- **Normal mode:** pause, present eval report, wait for human code review
- **Auto mode, score ≥95%:** skip, log decision to `auto-decisions.md`:
  ```
  ## Checkpoint 2 — Auto-Approved
  **Timestamp:** {now}
  **Reason:** Auto mode + eval score {score}% ≥ 95% threshold.
  **Winning branch:** {branch name}
  **Score:** {score}/100
  ```
- **Auto mode, score 90-94%:** pause for human review (not confident enough to auto-approve)

### Backtrack Logic
- After each eval round, check for **spec-level issues** in evaluator output
- If the same AC is flagged as a spec-level issue in 2 consecutive rounds:
  1. Transition to `BACKTRACK_CLARIFY`
  2. Record in `backtracks`: `{"round": N, "acs": ["AC-3", ...], "resolution": null}`
  3. Invoke `feature-crew-clarify` with narrow scope: only the flagged ACs + evaluator reasoning
  4. After clarification, update spec, set resolution, return to `IMPLEMENTING`
  5. Round counter does NOT reset
- **Max 1 backtrack per feature** — second trigger on same AC → BLOCKED_IMPL
- Backtrack events logged to `metrics.json`

### Strategy Ladder (Adaptive Retry)
Replaces the old 3-strike rule. The `strategy` field in state tracks the current approach:

| Round | Strategy | What Happens |
|-------|----------|-------------|
| 1-3 | `normal` | Standard parallel exploration → eval → keep best or remediate |
| 4 | `architectural-pivot` | Re-read spec + ALL prior eval feedback. Identify recurring failure pattern. Reset frontier to pre-implementation state. Try fundamentally different architecture. |
| 5 | `specialist` | Analyze which dimension consistently fails across rounds. Dispatch specialist sub-agent for ONLY that dimension (e.g., test-coverage specialist, accessibility specialist). |
| 6 | `minimal-viable` | Relax non-critical ACs (Minor items from spec). Log relaxed ACs in state. Attempt reduced-scope implementation nailing core ACs. |
| 7 | N/A | `BLOCKED_IMPL` — escalate to human with full 6-round history |

The orchestrator updates `strategy` in state before each round. The implementer reads the strategy to know its approach.

### Time Budget Enforcement
Track elapsed time for each phase. Two thresholds:

| Phase | 1x Budget (warning) | 2x Budget (escalation) |
|-------|---------------------|------------------------|
| Clarify | 15 min | 30 min |
| Implement (per branch) | 30 min | 60 min |
| Eval (per evaluation) | 10 min | 20 min |
| QA (per round) | 15 min | 30 min |
| Bug fix (per bug) | 10 min | 20 min |

**At 1x:** Log warning to `metrics.json` and `budgetWarnings` in state. Continue working.
**At 2x:** Escalate. Normal mode: surface message, let user decide. Auto mode: pause and wait.
**Never hard-kill** — agent is never terminated mid-work.

Budgets are configurable: user can pass `--budget implement=3600` at kickoff to override defaults.

### Experiment Logging
After every eval round and QA round, the orchestrator appends a record to `docs/superpowers/feature-crew/{feature-name}/metrics.json`.

**Eval record:**
```json
{
  "phase": "eval",
  "round": 1,
  "timestamp": "2026-03-27T14:30:00Z",
  "score": 82,
  "status": "FAIL",
  "dimensions": {
    "specCompliance": 85,
    "codeQuality": 90,
    "testCoverage": 70,
    "uiUxFidelity": 80,
    "errorHandling": 95,
    "integrationSafety": 88,
    "implSimplicity": 75
  },
  "linesAdded": 342,
  "linesRemoved": 12,
  "filesCreated": 4,
  "filesModified": 7,
  "durationSeconds": 480,
  "approach": "parallel-branch-1",
  "strategy": "normal",
  "frontier": "user-profile-page/frontier-1",
  "commitHash": "abc1234",
  "outcome": "discarded"
}
```

**QA record:**
```json
{
  "phase": "qa",
  "round": 1,
  "timestamp": "2026-03-27T15:00:00Z",
  "testsRun": 150,
  "testsPassed": 148,
  "testsFailed": 2,
  "testsWritten": 5,
  "bugsFound": [
    {"title": "...", "severity": "Major"},
    {"title": "...", "severity": "Minor"}
  ],
  "durationSeconds": 360,
  "status": "BUGS_FOUND"
}
```

**Backtrack record:**
```json
{
  "phase": "backtrack",
  "round": 4,
  "timestamp": "2026-03-27T16:00:00Z",
  "flaggedACs": ["AC-3"],
  "resolution": "AC-3 clarified: changed from X to Y",
  "durationSeconds": 120
}
```

The metrics file wraps all records:
```json
{
  "featureName": "user-profile-page",
  "featureType": "UI-heavy",
  "records": [...]
}
```

## Git Frontier Management

The branch tip always represents the best-known implementation (inspired by autoresearch).

**Before each implementation round:**
1. Tag the current branch tip as `{feature-name}/frontier-{round}`
2. Implementation commits on top of that tag

**After evaluation:**
- Score improves or passes → frontier advances (new tip = best state)
- Score drops or fails → `git reset --hard` to frontier tag (failed attempt discarded)

**In parallel exploration:**
- Each parallel branch has its own frontier
- After all branches are evaluated, the global frontier advances to the highest-scoring branch
- Other branches are discarded (worktrees cleaned up)

**Cleanup:** Frontier tags are deleted when the feature reaches PRODUCTION.

## Parallel Features

Each feature gets its own:
- Git worktree (via `superpowers:using-git-worktrees`)
- State directory
- Independent agent pipelines
- Independent metrics.json

Start multiple: invoke `/feature-crew` for each feature. They run independently. Resume any with `/feature-crew resume {name}`.

## Red Flags — Never Do These

- Skip a checkpoint in normal mode — always wait for human approval
- Reuse an evaluator/QA agent across rounds — always fresh context, fresh worktree
- Let the implementer see evaluator reasoning — they only get the remediation list
- Proceed past BLOCKED — only the human can unblock
- Share state between parallel features
- Hard-kill an agent mid-work — always use soft escalation
- Allow more than 1 backtrack per feature — second trigger goes to BLOCKED
- Run evaluator in the implementer's worktree — always use a separate, clean worktree
