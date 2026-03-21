---
name: feature-crew-implement
description: Use when a feature spec has been approved and is ready for implementation with evaluation scoring gates
---

# Feature Crew — Phase 2: Implement

Implement a feature from an approved spec, then evaluate it with an independent scoring agent. Loops until quality ≥90%.

## Inputs

- Approved spec at `docs/superpowers/feature-crew/{feature-name}/spec.md`
- State file at `docs/superpowers/feature-crew/{feature-name}/state.json`

## Process

### Step 1: Set Up Worktree

If no worktree exists in state, invoke `superpowers:using-git-worktrees` to create one:
- Branch: `feature/{feature-name}`
- Directory: project's worktree location

Update state with worktree path and branch.

### Step 2: Generate Plan

Invoke `superpowers:writing-plans` with the approved spec as input. Save the plan to:
```
docs/superpowers/feature-crew/{feature-name}/plan.md
```

### Step 3: Execute Plan

Invoke `superpowers:subagent-driven-development` to execute the plan task by task. Each task gets:
- Fresh implementer sub-agent
- Two-stage review (spec compliance + code quality)

### Step 4: Evaluation Gate

After all tasks complete, dispatch the **Evaluator agent** using the template at:
`skills/feature-crew/evaluator-prompt.md`

Provide the evaluator with:
1. The spec (`spec.md`)
2. All files created/modified during implementation
3. The current round number

Save the evaluation report to:
```
docs/superpowers/feature-crew/{feature-name}/eval-round-{N}.md
```

### Step 5: Score Check

Read the evaluator's status:

**If PASS (≥90%):**
- Update state: `phase: "CHECKPOINT_2"`
- Present evaluation report + `git diff main...HEAD` to user
- Ask for human code review approval

**If FAIL (<90%):**
- Increment `evalRounds` in state
- If `evalRounds >= 3`: update state to `BLOCKED_IMPL`, escalate to user
- Otherwise: dispatch fresh implementer sub-agent with evaluator's remediation list
- After fixes, return to Step 4 (re-evaluate)

### Step 6: Hand Off

On Checkpoint 2 approval, update state to `QA` and invoke `feature-crew-qa`.

## Standalone Usage

Can be invoked independently if you already have a spec file. Expects the spec at the standard path or accepts a path argument.
