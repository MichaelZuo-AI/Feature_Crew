---
name: feature-deep-dev-qa
description: Use when implementation has passed code review and needs holistic QA testing with automated bug fix loops
---

# Feature Deep Dev — Phase 3: QA

Holistic quality assurance — run tests, find bugs, fix them, verify fixes. Loops until all clean.

## Inputs

- Approved implementation in worktree
- Spec at `docs/superpowers/feature-deep-dev/{feature-name}/spec.md`
- State file at `docs/superpowers/feature-deep-dev/{feature-name}/state.json`

## Process

### Step 1: Dispatch QA Agent

Dispatch a QA sub-agent using the template at:
`skills/feature-deep-dev/qa-agent-prompt.md`

Provide:
1. The spec (for acceptance criteria)
2. List of files created/modified (from git diff)
3. The project's test command (detect from package.json, Makefile, etc.)

Save QA report to:
```
docs/superpowers/feature-deep-dev/{feature-name}/qa-report-{N}.md
```

### Step 2: Check Results

Read QA agent's status:

**If ALL_CLEAR:**
- Proceed to Production Gate (Step 4)

**If BUGS_FOUND:**
- For each bug, dispatch a **Bug Fixer sub-agent** using:
  `skills/feature-deep-dev/bug-fixer-prompt.md`
- One bug per sub-agent dispatch (fresh context each time)
- Bug Fixer writes test, fixes bug, commits

### Step 3: Verification Loop

After all bugs are fixed:
- Increment `qaRounds` in state
- If `qaRounds >= 3`: update state to `BLOCKED_QA`, escalate to user
- Otherwise: return to Step 1 (re-run QA)

### Step 4: Production Gate

All tests pass, QA Agent reports ALL_CLEAR.

Invoke `superpowers:finishing-a-development-branch` to present options:
- Merge locally
- Create PR
- Keep branch as-is
- Discard

Update state to `PRODUCTION` after user chooses.

## Standalone Usage

Can be invoked independently on any branch to run QA. Useful for running QA on code that wasn't built through the full pipeline.
