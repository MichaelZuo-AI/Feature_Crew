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
