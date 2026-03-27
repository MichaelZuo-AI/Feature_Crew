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
