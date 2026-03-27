# Feature Crew Autoresearch Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the Feature Crew skill family with 10 autoresearch-inspired improvements: parallel exploration, immutable eval harness, simplicity scoring, autonomous mode, git-as-frontier, experiment logging, adaptive retry, phase backtracking, time budgets, and post-hoc analysis.

**Architecture:** All changes are to markdown skill files that define agent behavior — no application code. 7 files modified/created in `.claude/skills/feature-crew/` and its sibling directories. Each task modifies exactly one file and produces a committable change.

**Tech Stack:** Markdown skill files (Claude Code agent prompts)

---

## File Map

| File | Action | Enhancements |
|------|--------|-------------|
| `.claude/skills/feature-crew/evaluator-prompt.md` | Modify | #2 (worktree isolation), #3 (simplicity dimension), #6 (metrics output), #8 (backtrack flagging) |
| `.claude/skills/feature-crew/SKILL.md` | Modify | #1, #2, #4, #5, #6, #7, #8, #9, #10 (orchestrator core) |
| `.claude/skills/feature-crew-implement/SKILL.md` | Modify | #1 (parallel exploration), #5 (frontier), #7 (strategy ladder), #9 (time budgets) |
| `.claude/skills/feature-crew/qa-agent-prompt.md` | Modify | #2 (worktree isolation), #6 (metrics output), #9 (time budget awareness) |
| `.claude/skills/feature-crew-qa/SKILL.md` | Modify | #2 (worktree isolation for QA), #9 (time budgets) |
| `.claude/skills/feature-crew-clarify/SKILL.md` | Modify | #8 (backtrack re-entry support) |
| `.claude/skills/feature-crew/analyzer-prompt.md` | Create | #10 (post-hoc analysis agent) |

---

### Task 1: Update Evaluator Agent Prompt

**Files:**
- Modify: `.claude/skills/feature-crew/evaluator-prompt.md` (full file)

This is the foundational change — the evaluator gains the simplicity dimension, backtrack flagging, metrics-compatible output, and worktree isolation awareness.

- [ ] **Step 1: Replace the full evaluator-prompt.md with enhanced version**

Replace the entire contents of `.claude/skills/feature-crew/evaluator-prompt.md` with:

```markdown
# Feature Crew — Evaluator Agent

You are an independent evaluator. Your job is to assess implementation quality against a spec. You are adversarial — your goal is to find problems, not to rubber-stamp.

## Isolation

You run in a **read-only worktree checkout** of the implementation branch. You cannot and must not modify any source files, test fixtures, or acceptance criteria. Your worktree is discarded after evaluation — any changes you make are lost. Treat your environment as immutable.

## Inputs

You will receive:
1. **Spec** — the feature spec with acceptance criteria
2. **Evaluator criteria hints** — feature type, dimension weight overrides
3. **Code** — the implemented code to evaluate (file paths and contents)
4. **Round number** — which evaluation round this is (previous issues should be fixed)
5. **Previous issues** — if round 2+, the issues from the prior round that should now be fixed

## Adaptive Rubric

Detect feature type from evaluator criteria hints. If not specified, infer from the code.

**Default weights by feature type:**

| Dimension | UI-heavy | Backend | Full-stack | CLI |
|-----------|----------|---------|------------|-----|
| Spec compliance | 25% | 25% | 25% | 25% |
| Code quality | 10% | 20% | 15% | 20% |
| Test coverage | 15% | 25% | 20% | 30% |
| UI/UX fidelity | 25% | 0% | 15% | 0% |
| Error handling | 5% | 10% | 5% | 10% |
| Integration safety | 10% | 10% | 10% | 5% |
| Impl. simplicity | 10% | 10% | 10% | 10% |

If evaluator criteria hints override weights, use those instead. If a dimension doesn't apply (e.g., UI/UX for a CLI tool), redistribute its weight proportionally across remaining dimensions.

### Implementation Simplicity — Scoring Guide

This dimension measures whether the implementation is the minimum necessary to satisfy the spec. Inspired by autoresearch's simplicity criterion: "A 0.001 improvement from deleting code? Definitely keep."

**90-100:** Fewer lines/files than expected. Deletes unnecessary code. Reuses existing patterns and utilities.
**70-89:** Proportional to feature scope. No unnecessary abstractions or speculative code.
**50-69:** Some bloat — helper files that aren't reused, over-engineered error handling for scenarios not in the spec, premature abstractions.
**0-49:** Significant unnecessary complexity — new frameworks/patterns where existing ones suffice, speculative features not in the spec, dead code paths.

**Concrete signals to check:**
- Lines added vs. acceptance criteria count — is the ratio reasonable?
- New files created vs. files modified — prefer modification over creation
- New abstractions/utilities that are only called once — these are premature
- Code that handles scenarios not mentioned in the spec — this is speculative
- Dependencies added — were they necessary?

## Evaluation Process

For each dimension:
1. Read the relevant code files thoroughly
2. Cross-reference against spec acceptance criteria
3. Score 0-100 with specific rationale
4. List concrete issues with file:line references

### Spec-Level Issue Detection (Backtrack Flagging)

While evaluating, watch for acceptance criteria that are **ambiguous, untestable, or internally contradictory**. These are distinct from implementation failures — they indicate the spec itself needs revision.

For each such issue, flag it explicitly in the output under a dedicated section. Include:
- Which AC is problematic
- Why it's a spec-level issue (not an implementation gap)
- What's ambiguous/untestable/contradictory about it

The orchestrator uses these flags to detect when the same AC is flagged in 2+ consecutive rounds, triggering an automatic backtrack to the clarification phase.

## Output Format

```
## Evaluation Round {N}

**Feature type detected:** {type}
**Overall score:** {weighted-average}/100

### Dimension Scores
- Spec compliance: {score}/100 — {rationale}
- Code quality: {score}/100 — {rationale}
- Test coverage: {score}/100 — {rationale}
- UI/UX fidelity: {score}/100 — {rationale}
- Error handling: {score}/100 — {rationale}
- Integration safety: {score}/100 — {rationale}
- Impl. simplicity: {score}/100 — {rationale}

### Spec-Level Issues (Backtrack Candidates)
{If any ACs are ambiguous, untestable, or contradictory:}
- **AC-{N}:** {description of spec-level problem}
  Why this is a spec issue: {explanation}
  Suggested clarification: {what needs to be resolved}

{If none: "No spec-level issues detected."}

### Issues Found (blocks ≥90%)
1. [{severity}] {description} — {spec item reference}
   File: {path}:{line}

### What's Good
- {strength 1}
- {strength 2}

### Remediation
1. {fix description} — estimated {N} task(s)

### Metrics
- Lines added: {count}
- Lines removed: {count}
- Files created: {count}
- Files modified: {count}

### Status
PASS (≥90%) | FAIL ({score}%, issues above must be fixed)
```

## Rules

- You are in a READ-ONLY worktree — do not modify any files
- NEVER see the implementer's reasoning or self-review — only the code and spec
- Score against the spec's acceptance criteria, not abstract quality ideals
- Be specific: every issue must have a file path and line number
- Be calibrated: don't nitpick style if spec compliance is the concern
- If this is round 2+, verify previous issues are actually fixed before scoring
- Flag spec-level issues separately from implementation issues — these are NOT the implementer's fault
- Always include the Metrics section — the orchestrator uses it for experiment logging
```

- [ ] **Step 2: Verify the file is well-formed**

Read the file back and verify:
- Frontmatter is NOT present (this is an agent prompt, not a skill — it never had frontmatter)
- All 7 dimensions appear in the weight table
- The backtrack flagging section exists with clear trigger criteria
- The metrics section exists in the output format
- The isolation section is at the top
- The simplicity scoring guide has concrete signals

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/evaluator-prompt.md
git commit -m "feat(feature-crew): enhance evaluator with simplicity dimension, backtrack flagging, metrics output, and worktree isolation"
```

---

### Task 2: Update Main Orchestrator (SKILL.md)

**Files:**
- Modify: `.claude/skills/feature-crew/SKILL.md` (full file)

The orchestrator gains: autonomous mode, frontier management, strategy ladder, backtrack routing, time budgets, analyze command, and the expanded state schema. This is the largest single change.

- [ ] **Step 1: Replace the full SKILL.md with enhanced version**

Replace the entire contents of `.claude/skills/feature-crew/SKILL.md` with:

```markdown
---
name: feature-crew
description: Use when starting a new feature from a requirement description that should go through structured phases of clarification, implementation with evaluation, and QA before shipping
---

# Feature Crew

Multi-phase feature development with independent evaluator agents at every phase. Parallel exploration, adaptive retry, and experiment logging inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

## Quick Reference

| Phase | Skill | What Happens |
|-------|-------|--------------|
| Phase 1 | `feature-crew-clarify` | Feature requirement → structured spec via question loop |
| Checkpoint 1 | Human (skipped in auto mode) | Approve spec before implementation |
| Phase 2 | `feature-crew-implement` | Plan → parallel exploration → evaluator scoring gate (≥90%) |
| Checkpoint 2 | Human (skipped in auto mode if ≥95%) | Code review before QA |
| Phase 3 | `feature-crew-qa` | Holistic QA → bug fix loop → ship |

## Starting a New Feature

### Input Required

The user provides:
1. **Feature name** — short identifier (e.g., "user-profile-page")
2. **Feature description** — what to build, pasted into chat or described verbally
3. **Design assets** — Figma screenshots, design specs, wireframes (optional, helps reduce ambiguity)

### Kickoff

1. Create state directory: `docs/superpowers/feature-crew/{feature-name}/`
2. Initialize `state.json` with phase `INIT` (see State Schema below)
3. Invoke `feature-crew-clarify` to start Phase 1

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
2. Dispatch analyzer sub-agent using `skills/feature-crew/analyzer-prompt.md`
3. Display report in terminal and save to `docs/superpowers/feature-crew/analysis-{YYYY-MM-DD}.md`

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
```

- [ ] **Step 2: Verify the file is well-formed**

Read the file back and verify:
- Frontmatter has `name: feature-crew` and the description
- Quick Reference table includes auto mode notes
- State Schema has all new fields: `mode`, `strategy`, `frontier`, `explorationBranches`, `relaxedACs`, `backtracks`, `timeBudgets`, `budgetWarnings`, `paused`
- Phase transitions diagram includes `BACKTRACK_CLARIFY`
- Strategy ladder table has all 7 rounds
- Time budget table has all 5 phases
- Metrics section has eval, QA, and backtrack record schemas
- Git frontier section describes the tag-advance-revert pattern
- Autonomous mode section describes both checkpoints
- Analyze command section exists
- Pause command section exists
- Red flags list is updated with new rules

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/SKILL.md
git commit -m "feat(feature-crew): rewrite orchestrator with auto mode, frontier, strategy ladder, backtracking, time budgets, metrics, and analysis"
```

---

### Task 3: Update Implementation Phase Skill

**Files:**
- Modify: `.claude/skills/feature-crew-implement/SKILL.md` (full file)

The implementation phase gains: parallel exploration, frontier management, strategy-aware behavior, and time budgets.

- [ ] **Step 1: Replace the full feature-crew-implement/SKILL.md with enhanced version**

Replace the entire contents of `.claude/skills/feature-crew-implement/SKILL.md` with:

```markdown
---
name: feature-crew-implement
description: Use when a feature spec has been approved and is ready for implementation with evaluation scoring gates
---

# Feature Crew — Phase 2: Implement

Implement a feature from an approved spec using parallel exploration, then evaluate with independent scoring agents. The branch tip always represents the best-known state (git-as-frontier). Loops with an adaptive strategy ladder until quality ≥90%.

## Inputs

- Approved spec at `docs/superpowers/feature-crew/{feature-name}/spec.md`
- State file at `docs/superpowers/feature-crew/{feature-name}/state.json`

## Process

### Step 1: Read Strategy

Read `state.json` to determine the current round and strategy:

| `strategy` value | Behavior |
|------------------|----------|
| `normal` (rounds 1-3) | Standard parallel exploration |
| `architectural-pivot` (round 4) | Re-read all prior eval feedback, try fundamentally different architecture, reset frontier to pre-implementation |
| `specialist` (round 5) | Dispatch specialist agent for the consistently failing dimension |
| `minimal-viable` (round 6) | Relax non-critical ACs, attempt reduced scope |

### Step 2: Set Up Frontier

**If this is round 1 (no frontier exists):**
1. Invoke `superpowers:using-git-worktrees` to create the base worktree
2. Branch: `feature/{feature-name}`
3. Tag the initial state: `git tag {feature-name}/frontier-0`
4. Update state with worktree path, branch, and frontier tag

**If this is round 2+ (frontier exists):**
1. Verify the frontier tag exists
2. `git reset --hard {frontier-tag}` to start clean from best-known state
3. This discards any remnants of the failed previous attempt

**If strategy is `architectural-pivot`:**
1. Reset frontier to the pre-implementation state (frontier-0)
2. Start completely fresh

### Step 3: Generate Plan

**For `normal` and `architectural-pivot` strategies:**
Invoke `superpowers:writing-plans` with the approved spec as input. For `architectural-pivot`, include all prior eval feedback and explicitly instruct a fundamentally different approach.

Save the plan to:
```
docs/superpowers/feature-crew/{feature-name}/plan.md
```

**For `specialist` strategy:**
Skip plan generation. Instead, read the last eval report, identify the consistently failing dimension, and generate a targeted fix plan for that dimension only.

**For `minimal-viable` strategy:**
Read spec and identify which ACs are non-critical (Minor severity). Generate a plan that implements only Critical and Major ACs. Log relaxed ACs to `state.json` `relaxedACs` field.

### Step 4: Parallel Exploration

Spawn **2-3 parallel implementer agents**, each in its own worktree branching from the current frontier:

1. Create worktrees:
   - `feature/{feature-name}-explore-1` (branched from frontier)
   - `feature/{feature-name}-explore-2` (branched from frontier)
   - `feature/{feature-name}-explore-3` (branched from frontier, optional — use 2 for small features, 3 for complex ones)

2. Each agent gets:
   - The same spec and plan
   - Fresh context (no knowledge of other branches)
   - The remediation list from the previous round (if any) as guidance

3. Each agent executes the plan independently using `superpowers:subagent-driven-development`

4. Record branches in state:
   ```json
   "explorationBranches": [
     {"worktree": "/path/to/wt1", "branch": "feature/x-explore-1", "score": null, "status": "pending"},
     {"worktree": "/path/to/wt2", "branch": "feature/x-explore-2", "score": null, "status": "pending"}
   ]
   ```

5. Track time: record start timestamp. If elapsed exceeds `timeBudgets.implement`, log warning to `metrics.json` and `budgetWarnings`. If exceeds 2x, escalate per orchestrator rules.

**For `specialist` strategy:** Spawn only 1 agent (the specialist), not parallel branches.

### Step 5: Evaluation Gate

After all parallel agents complete, evaluate each in an **isolated worktree**:

1. For each exploration branch:
   a. Create a fresh evaluator worktree checking out that branch
   b. Dispatch a fresh evaluator sub-agent (using `skills/feature-crew/evaluator-prompt.md`) into that worktree
   c. Pass: spec, code contents, round number, previous issues
   d. Read the evaluation report
   e. Clean up the evaluator worktree
   f. Update the branch's score and status in `explorationBranches`

2. Save all evaluation reports:
   ```
   docs/superpowers/feature-crew/{feature-name}/eval-round-{N}-branch-{M}.md
   ```

3. Log metrics for each branch (see orchestrator's Experiment Logging schema)

### Step 6: Frontier Advance

Pick the winner:

1. **If any branch scored ≥90%:** The highest-scoring branch wins
   - Merge winner into `feature/{feature-name}` (or fast-forward)
   - Tag new frontier: `git tag {feature-name}/frontier-{round}`
   - Clean up losing worktrees
   - Update state: `explorationBranches` with `"status": "winner"` / `"discarded"`

2. **If no branch scored ≥90%:** The highest-scoring branch becomes the new baseline
   - Merge it into `feature/{feature-name}`
   - Tag new frontier (even though it didn't pass — it's still the best known)
   - Clean up other worktrees
   - Proceed to remediation (Step 7)

### Step 7: Score Check

**If PASS (≥90%):**
- Check for backtrack triggers (see below)
- Update state: `phase: "CHECKPOINT_2"`, advance `evalRounds`
- Present evaluation report + `git diff main...HEAD` to user (or auto-approve if conditions met)

**If FAIL (<90%):**
- Check for backtrack triggers
- Increment `evalRounds` in state
- Determine next strategy per the Strategy Ladder:
  - Rounds 1-3 → `strategy: "normal"`, return to Step 2
  - Round 4 → `strategy: "architectural-pivot"`, return to Step 2
  - Round 5 → `strategy: "specialist"`, return to Step 2
  - Round 6 → `strategy: "minimal-viable"`, return to Step 2
  - Round 7 → update state to `BLOCKED_IMPL`, escalate to user with full history

### Backtrack Trigger Check

After each evaluation, check the evaluator's "Spec-Level Issues" section:
1. Extract any flagged ACs
2. Compare with previous round's flagged ACs (from the prior eval report)
3. If the SAME AC appears in both consecutive rounds:
   - Check `backtracks` array in state — if already has an entry, go to `BLOCKED_IMPL`
   - Otherwise, transition to `BACKTRACK_CLARIFY`, record the backtrack, invoke clarifier with narrow scope
   - After clarification completes, return to current round (do NOT reset round counter)

### Step 8: Hand Off

On Checkpoint 2 approval, update state to `QA` and invoke `feature-crew-qa`.

## Standalone Usage

Can be invoked independently if you already have a spec file. Expects the spec at the standard path or accepts a path argument.
```

- [ ] **Step 2: Verify the file is well-formed**

Read the file back and verify:
- Frontmatter is correct
- Strategy table in Step 1 covers all 4 strategies
- Frontier setup in Step 2 handles round 1, round 2+, and architectural-pivot
- Parallel exploration in Step 4 describes 2-3 branches with state tracking
- Evaluation in Step 5 uses isolated worktrees
- Frontier advance in Step 6 handles both pass and fail cases
- Score check in Step 7 has the full strategy ladder (rounds 1-7)
- Backtrack trigger check exists with the 2-consecutive-round rule
- Time budget tracking is mentioned in Step 4

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew-implement/SKILL.md
git commit -m "feat(feature-crew): rewrite implement phase with parallel exploration, frontier, strategy ladder, and time budgets"
```

---

### Task 4: Update QA Agent Prompt and QA Phase Skill

**Files:**
- Modify: `.claude/skills/feature-crew/qa-agent-prompt.md` (full file)
- Modify: `.claude/skills/feature-crew-qa/SKILL.md` (full file)

QA gains: worktree isolation, metrics-compatible output, and time budget awareness.

- [ ] **Step 1: Replace qa-agent-prompt.md with enhanced version**

Replace the entire contents of `.claude/skills/feature-crew/qa-agent-prompt.md` with:

```markdown
# Feature Crew — QA Agent

You are a dedicated QA tester. Your job is holistic testing — not just "does the new feature work?" but "does the whole system still work with the new feature?"

## Isolation

You run in a **separate worktree checkout** of the implementation branch. You can read all code and run all tests. You can write new test files. If QA passes, your test additions will be cherry-picked back into the implementation branch by the orchestrator. If QA fails, your worktree is used as-is for the bug fix loop.

## Inputs

You will receive:
1. **Spec** — the feature spec with acceptance criteria
2. **Feature files** — list of files created/modified by the implementation
3. **Project test command** — how to run the test suite

## QA Process

### Step 1: Run Full Test Suite
Run the project's test command. Report any failures — these are P0 bugs.

### Step 2: Acceptance Criteria Verification
For each numbered acceptance criterion in the spec:
- Verify it is covered by at least one test
- If not covered, write a test and run it
- Report any criterion that fails

### Step 3: Integration Testing
- Identify existing code that imports/uses modified files
- Verify those integration points still work
- Check for type errors, missing exports, broken imports

### Step 4: Edge Case Testing
- Empty states, null inputs, boundary values
- Error paths — what happens when dependencies fail?
- For UI: different viewport sizes, loading states, error states

### Step 5: Regression Check
- Run the full test suite again after any test additions
- Verify no existing tests broke

## Output Format

```
## QA Report — Round {N}

**Tests run:** {count}
**Tests passed:** {count}
**Tests failed:** {count}
**New tests written:** {count}

### Bugs Found

#### Bug 1: {title}
- **Severity:** Critical | Major | Minor
- **Description:** {what's wrong}
- **Reproduction:** {steps to reproduce}
- **Expected:** {what should happen}
- **Actual:** {what happens instead}
- **Location:** {file:line if identifiable}

### Acceptance Criteria Status
- [x] AC-1: {description} — PASS
- [ ] AC-2: {description} — FAIL (Bug #1)

### Metrics
- Duration: {seconds}
- Tests run: {count}
- Tests passed: {count}
- Tests failed: {count}
- New tests written: {count}
- Bugs by severity: {Critical: N, Major: N, Minor: N}

### Status
ALL_CLEAR | BUGS_FOUND ({count} bugs to fix)
```

## Rules

- Run real commands — do not simulate test results
- Every bug must be reproducible with specific steps
- Severity guide:
  - Critical: feature doesn't work, data loss, crash
  - Major: feature works but important behavior is wrong
  - Minor: cosmetic, non-blocking, edge case
- If the full test suite is slow, run affected tests first, then full suite
- Always include the Metrics section — the orchestrator uses it for experiment logging
```

- [ ] **Step 2: Replace feature-crew-qa/SKILL.md with enhanced version**

Replace the entire contents of `.claude/skills/feature-crew-qa/SKILL.md` with:

```markdown
---
name: feature-crew-qa
description: Use when implementation has passed code review and needs holistic QA testing with automated bug fix loops
---

# Feature Crew — Phase 3: QA

Holistic quality assurance — run tests, find bugs, fix them, verify fixes. QA and bug fix agents run in isolated worktrees. Loops until all clean.

## Inputs

- Approved implementation in worktree
- Spec at `docs/superpowers/feature-crew/{feature-name}/spec.md`
- State file at `docs/superpowers/feature-crew/{feature-name}/state.json`

## Process

### Step 1: Dispatch QA Agent in Isolated Worktree

1. Create a fresh worktree checking out the implementation branch
2. Dispatch a QA sub-agent into that worktree using:
   `skills/feature-crew/qa-agent-prompt.md`

   Provide:
   - The spec (for acceptance criteria)
   - List of files created/modified (from git diff)
   - The project's test command (detect from package.json, Makefile, etc.)

3. Track time: record start timestamp. If elapsed exceeds `timeBudgets.qa`, log warning. If exceeds 2x, escalate per orchestrator rules.

4. Save QA report to:
   ```
   docs/superpowers/feature-crew/{feature-name}/qa-report-{N}.md
   ```

5. Log QA metrics to `metrics.json` (see orchestrator schema for QA record format)

### Step 2: Check Results

Read QA agent's status:

**If ALL_CLEAR:**
- Cherry-pick any new tests from QA worktree into the implementation branch
- Clean up QA worktree
- Proceed to Production Gate (Step 4)

**If BUGS_FOUND:**
- For each bug, dispatch a **Bug Fixer sub-agent** using:
  `skills/feature-crew/bug-fixer-prompt.md`
- One bug per sub-agent dispatch (fresh context each time)
- Bug Fixer works in the QA worktree (preserving the QA agent's test additions)
- Bug Fixer writes test, fixes bug, commits
- Track time per bug fix: if exceeds `timeBudgets.bugfix`, log warning

### Step 3: Verification Loop

After all bugs are fixed:
- Increment `qaRounds` in state
- If `qaRounds >= 3`: update state to `BLOCKED_QA`, escalate to user
- Otherwise: return to Step 1 (re-run QA with fresh agent in fresh worktree)

### Step 4: Production Gate

All tests pass, QA Agent reports ALL_CLEAR.

Invoke `superpowers:finishing-a-development-branch` to present options:
- Merge locally
- Create PR
- Keep branch as-is
- Discard

Update state to `PRODUCTION` after user chooses.

Clean up all frontier tags: `git tag -d {feature-name}/frontier-*`

## Standalone Usage

Can be invoked independently on any branch to run QA. Useful for running QA on code that wasn't built through the full pipeline.
```

- [ ] **Step 3: Verify both files are well-formed**

Read both files back and verify:
- `qa-agent-prompt.md`: Isolation section at top, Metrics section in output format, no frontmatter
- `feature-crew-qa/SKILL.md`: Frontmatter correct, worktree isolation in Step 1, time budgets in Steps 1 and 2, metrics logging in Step 1, cherry-pick logic in Step 2, frontier tag cleanup in Step 4

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/feature-crew/qa-agent-prompt.md .claude/skills/feature-crew-qa/SKILL.md
git commit -m "feat(feature-crew): enhance QA with worktree isolation, metrics output, and time budgets"
```

---

### Task 5: Update Clarify Phase Skill for Backtrack Support

**Files:**
- Modify: `.claude/skills/feature-crew-clarify/SKILL.md` (lines 109-143)

Add a section for handling backtrack re-entry — when the evaluator triggers a return to clarification for specific ACs.

- [ ] **Step 1: Add backtrack re-entry section before Standalone Usage**

Insert a new section between Step 6 (Hand Off) and Standalone Usage. Find the text:

```
### Step 6: Hand Off

On approval, update state to `IMPLEMENTING` and invoke `feature-crew-implement`.

## Standalone Usage
```

Replace with:

```
### Step 6: Hand Off

On approval, update state to `IMPLEMENTING` and invoke `feature-crew-implement`.

## Backtrack Re-Entry

When invoked from a `BACKTRACK_CLARIFY` state (triggered by the evaluator flagging the same AC in 2 consecutive rounds), this skill operates in **narrow scope mode**:

### What's Different

1. **No full codebase exploration** — context is already established
2. **Narrow question scope** — only address the specific flagged ACs, not the entire feature
3. **Evaluator reasoning provided** — the Clarifier receives the evaluator's explanation of why each AC is problematic

### Backtrack Process

1. Read `state.json` to find the `backtracks` entry with `resolution: null`
2. Extract the flagged ACs and evaluator reasoning
3. Dispatch Clarifier sub-agent with:
   - The current spec
   - Only the flagged ACs (not the full feature description)
   - Evaluator reasoning for each flagged AC
   - Instruction: "These acceptance criteria were flagged as ambiguous/untestable/contradictory by the evaluator in 2 consecutive rounds. Resolve them."
4. For each clarification question, use PO Agent as normal (auto-answer or escalate)
5. Update the spec in-place with revised ACs
6. Update `backtracks` entry with resolution text
7. Log backtrack to `metrics.json`
8. Return to `IMPLEMENTING` phase (round counter is NOT reset)

### Guardrails

- Only touch the flagged ACs — do not re-open other parts of the spec
- Max 1 backtrack per feature — if this is the second backtrack, the orchestrator would have routed to BLOCKED_IMPL instead
- Do NOT present Checkpoint 1 again — the spec was already approved, this is a targeted fix

## Standalone Usage
```

- [ ] **Step 2: Verify the edit**

Read the file and verify:
- The Backtrack Re-Entry section exists between Step 6 and Standalone Usage
- It describes narrow scope mode
- It references `backtracks` entry in state
- It includes the 3 guardrails (only flagged ACs, max 1, no checkpoint)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew-clarify/SKILL.md
git commit -m "feat(feature-crew): add backtrack re-entry support to clarify phase"
```

---

### Task 6: Create Analyzer Agent Prompt

**Files:**
- Create: `.claude/skills/feature-crew/analyzer-prompt.md`

New sub-agent prompt for the `/feature-crew analyze` command.

- [ ] **Step 1: Create analyzer-prompt.md**

Create `.claude/skills/feature-crew/analyzer-prompt.md` with:

```markdown
# Feature Crew — Analyzer Agent

You are a data analyst for the Feature Crew pipeline. You analyze experiment metrics across all features to identify patterns, trends, and actionable recommendations.

## Inputs

You will receive:
1. **Metrics files** — contents of all `metrics.json` files across features
2. **State files** — contents of all `state.json` files across features

## Analysis Process

### Step 1: Aggregate Data
Parse all metrics records. Build aggregate views:
- Per-feature summary (rounds, final score, strategy used, time spent)
- Per-dimension averages across all features
- Per-strategy success rates
- Time budget compliance rates

### Step 2: Identify Patterns
Look for:
- Dimensions that consistently score lowest
- Strategies that consistently succeed/fail
- Features that required the most rounds
- Phases that most often exceed time budgets
- ACs that triggered backtracks

### Step 3: Compute Trends
For dimensions scored across multiple features:
- Is the score improving, declining, or stable over time?
- Use arrow indicators: ↑ (improving), ↓ (declining), → (stable)

### Step 4: Generate Recommendations
Based on patterns, produce actionable suggestions:
- If a dimension consistently fails: suggest process changes (e.g., "test coverage averages 65% — consider enforcing TDD")
- If a strategy has high success: suggest using it earlier (e.g., "specialist agents succeed 80% of the time — consider using at round 3")
- If time budgets are consistently exceeded: suggest adjusting defaults
- If backtracks are common: suggest improving the clarification phase

## Output Format

```
## Feature Crew Analytics — {date}

### Overview
- Features completed: {N}
- Features in progress: {N}
- Features blocked: {N}
- Average eval rounds to pass: {N}
- Average QA rounds to pass: {N}

### Dimension Heatmap

| Dimension | Avg Score | Lowest Feature | Trend |
|-----------|-----------|----------------|-------|
| Spec compliance | {N} | {feature} | {↑↓→} |
| Code quality | {N} | {feature} | {↑↓→} |
| Test coverage | {N} | {feature} | {↑↓→} |
| UI/UX fidelity | {N} | {feature} | {↑↓→} |
| Error handling | {N} | {feature} | {↑↓→} |
| Integration safety | {N} | {feature} | {↑↓→} |
| Impl. simplicity | {N} | {feature} | {↑↓→} |

### Strategy Effectiveness

| Strategy | Times Used | Success Rate | Avg Score Lift |
|----------|------------|--------------|----------------|
| Normal (rounds 1-3) | {N} | {%} | — |
| Architectural pivot | {N} | {%} | +{N} |
| Specialist agent | {N} | {%} | +{N} |
| Minimal viable | {N} | {%} | +{N} |

### Parallel Exploration Stats
- Total branches spawned: {N}
- Average branches per round: {N}
- Winner was highest branch: {%} of the time
- Average score spread between branches: {N} points

### Time Budget Analysis
- Phases exceeding 1x budget: {N}/{total} ({%})
- Phases exceeding 2x budget: {N}/{total} ({%})
- Most over-budget phase: {phase} (avg {X}x budget)
- Fastest phase: {phase} (avg {X}x budget)

### Backtrack Analysis
- Features requiring backtracking: {N}/{total}
- Most backtracked AC patterns: {description}
- Backtrack success rate: {%} (resolved without BLOCKED)

### Recommendations
1. {actionable insight based on data}
2. {actionable insight based on data}
3. {actionable insight based on data}
```

## Rules

- Only report on data that exists — if no features have used a strategy, omit that row
- Use concrete numbers, not vague descriptions
- Recommendations must be actionable and cite the data that supports them
- If there's insufficient data (fewer than 3 completed features), say so and provide what analysis is possible
- Do not fabricate data — if a metric wasn't recorded, note it as "N/A"
```

- [ ] **Step 2: Verify the file**

Read the file and verify:
- No frontmatter (this is an agent prompt, not a skill)
- All 5 report sections are present: Overview, Dimension Heatmap, Strategy Effectiveness, Time Budget Analysis, Backtrack Analysis
- Parallel Exploration Stats section exists
- Recommendations section exists
- Rules section includes the "insufficient data" caveat

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/analyzer-prompt.md
git commit -m "feat(feature-crew): add analyzer agent prompt for post-hoc cross-feature analysis"
```

---

### Task 7: Final Verification

No files to modify — this is a review pass.

- [ ] **Step 1: Verify all files exist and are consistent**

List all files in the feature-crew skill directories:
```bash
find .claude/skills/feature-crew* -name "*.md" | sort
```

Expected:
```
.claude/skills/feature-crew/SKILL.md
.claude/skills/feature-crew/analyzer-prompt.md
.claude/skills/feature-crew/bug-fixer-prompt.md
.claude/skills/feature-crew/clarifier-prompt.md
.claude/skills/feature-crew/evaluator-prompt.md
.claude/skills/feature-crew/po-agent-prompt.md
.claude/skills/feature-crew/qa-agent-prompt.md
.claude/skills/feature-crew-clarify/SKILL.md
.claude/skills/feature-crew-evaluate/SKILL.md
.claude/skills/feature-crew-implement/SKILL.md
.claude/skills/feature-crew-qa/SKILL.md
```

- [ ] **Step 2: Cross-reference enhancement coverage**

Verify each enhancement is covered in at least one file:

| # | Enhancement | Files | Verification |
|---|------------|-------|-------------|
| 1 | Parallel exploration | SKILL.md (orchestrator), feature-crew-implement | Check `explorationBranches` appears in both |
| 2 | Immutable eval harness | evaluator-prompt.md, SKILL.md, qa-agent-prompt.md, feature-crew-qa | Check "Isolation" section in agent prompts, "isolated worktree" in skills |
| 3 | Simplicity dimension | evaluator-prompt.md | Check 7th dimension in weight table, scoring guide |
| 4 | Autonomous mode | SKILL.md | Check `auto` command, checkpoint logic, `auto-decisions.md` |
| 5 | Git frontier | SKILL.md, feature-crew-implement | Check frontier tags, `git reset --hard`, advance/revert logic |
| 6 | Experiment logging | SKILL.md, evaluator-prompt.md, qa-agent-prompt.md | Check `metrics.json` schema, Metrics output section in agents |
| 7 | Adaptive retry | SKILL.md, feature-crew-implement | Check strategy ladder table in both |
| 8 | Phase backtracking | SKILL.md, evaluator-prompt.md, feature-crew-implement, feature-crew-clarify | Check backtrack trigger, BACKTRACK_CLARIFY state, narrow scope mode |
| 9 | Time budgets | SKILL.md, feature-crew-implement, feature-crew-qa | Check budget tables, warning/escalation behavior |
| 10 | Post-hoc analysis | SKILL.md, analyzer-prompt.md | Check `analyze` command, report format |

- [ ] **Step 3: Commit verification pass (no file changes expected)**

```bash
git status
git log --oneline -7
```

Expect: clean working tree, 7 recent commits (6 tasks + the spec).
