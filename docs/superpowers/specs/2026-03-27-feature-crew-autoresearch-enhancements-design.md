# Feature Crew: Autoresearch-Inspired Enhancements

**Date:** 2026-03-27
**Inspired by:** [karpathy/autoresearch](https://github.com/karpathy/autoresearch)
**Scope:** 10 enhancements to the Feature Crew skill family
**Files affected:** All 6 existing skill files + 1 new file (`analyzer-prompt.md`)

---

## Enhancement 1: Hill-Climbing with Parallel Exploration

**What changes:** `feature-crew-implement/SKILL.md`, `evaluator-prompt.md`

When implementation begins, the orchestrator spawns 2-3 parallel implementer agents, each in its own worktree. All work from the same spec and plan but independently. Once all complete, each gets evaluated by a fresh evaluator agent (also in its own worktree for isolation — ties into #2). The highest-scoring implementation that passes >=90% wins and becomes the feature branch. Losers are discarded.

If no implementation passes, the best-scoring one is kept as the baseline for the next round (remediation targets its specific issues).

**State changes:** `state.json` gains `explorationBranches[]` tracking each parallel attempt's worktree, branch, score, and status.

---

## Enhancement 2: Immutable Eval Harness via Worktree Isolation

**What changes:** `evaluator-prompt.md`, `SKILL.md` (orchestrator)

The evaluator agent runs in a fresh, clean worktree checkout of the implementation branch. It receives read-only access — any file modifications it makes are discarded when the worktree is cleaned up.

**Evaluator flow:**
1. Check out the implementation branch into a temporary worktree
2. Read spec + code from that worktree
3. Run tests from that worktree
4. Produce report
5. Worktree is deleted after evaluation

The implementer's worktree is completely untouched by evaluation. Same pattern applies to QA agents — they also run in isolated worktrees, though their test-writing results need to be cherry-picked back into the implementation branch if QA passes.

---

## Enhancement 3: Implementation Simplicity as a Scoring Dimension

**What changes:** `evaluator-prompt.md`

Add a 7th dimension — **Implementation Simplicity** — to the adaptive rubric. Measures whether the implementation is the minimum necessary to satisfy the spec.

**Scoring criteria:**
- **90-100:** Fewer lines/files than expected. Deletes code. Reuses existing patterns.
- **70-89:** Proportional to feature scope. No unnecessary abstractions.
- **50-69:** Some bloat — helper files that aren't reused, over-engineered error handling, premature abstractions.
- **0-49:** Significant unnecessary complexity — new frameworks/patterns where existing ones suffice, speculative features, dead code.

**Concrete signals:**
- Lines added vs. acceptance criteria count (ratio)
- New files created vs. files modified (prefer modification)
- New abstractions/utilities that are only used once
- Code that handles scenarios not in the spec

**Updated weight table:**

| Dimension | UI-heavy | Backend | Full-stack | CLI |
|-----------|----------|---------|------------|-----|
| Spec compliance | 25% | 25% | 25% | 25% |
| Code quality | 10% | 20% | 15% | 20% |
| Test coverage | 15% | 25% | 20% | 30% |
| UI/UX fidelity | 25% | 0% | 15% | 0% |
| Error handling | 5% | 10% | 5% | 10% |
| Integration safety | 10% | 10% | 10% | 5% |
| Impl. simplicity | 10% | 10% | 10% | 10% |

---

## Enhancement 4: Autonomous Mode (Graduated)

**What changes:** `SKILL.md` (orchestrator)

Invoked with `/feature-crew auto {feature-name}`. Graduated autonomy:

- **Checkpoint 1 (spec approval):** Skipped. Clarifier + PO agent resolve questions, spec is auto-approved.
- **Checkpoint 2 (code review):** Skipped IF evaluator scores >=95%. If 90-94%, pauses for human review.

**Guardrails:**
- Opt-in per feature via `--auto` flag, never the default
- State file records `"mode": "auto"`
- BLOCKED states always pause and escalate regardless of mode
- Human can interrupt with `/feature-crew pause {feature-name}`
- Every skipped checkpoint logged to `auto-decisions.md` in the feature directory for post-hoc review

---

## Enhancement 5: Git Branch as Quality Frontier

**What changes:** `feature-crew-implement/SKILL.md`, `SKILL.md` (orchestrator)

Branch tip always represents the best-known implementation.

**Flow:**
1. Before each implementation attempt, current branch tip is tagged as `{feature-name}/frontier-{round}`
2. Implementation commits on top
3. Evaluator scores the new state
4. If score improves or passes: frontier advances (new tip = new best state)
5. If score drops or fails: `git reset --hard` to frontier tag (failed attempt discarded)

**Key behavior change:** Failed eval rounds no longer keep their code with remediation layered on top. Each round starts clean from the best-known state. Implementer gets remediation list as guidance but produces a fresh attempt.

**In parallel exploration:** Each parallel branch has its own frontier. After evaluation, the global frontier advances to whichever branch scored highest. Others discarded.

**Cleanup:** Frontier tags are lightweight git tags, cleaned up when feature reaches PRODUCTION.

---

## Enhancement 6: Experiment Logging (Per-Feature metrics.json)

**What changes:** `evaluator-prompt.md`, `qa-agent-prompt.md`, `SKILL.md` (orchestrator)

After every eval round and QA round, append a record to `docs/superpowers/feature-crew/{feature-name}/metrics.json`.

**Schema:**

```json
{
  "featureName": "user-profile-page",
  "featureType": "UI-heavy",
  "records": [
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
  ]
}
```

**What gets recorded:**
- Every eval round (score, all dimensions, lines changed, duration, which parallel branch, kept/discarded)
- Every QA round (tests run/passed/failed/written, bugs found by severity, duration)
- Phase transitions with timestamps
- Backtrack events with reason
- Strategy used (normal, architectural-pivot, specialist, minimal-viable)

No central rollup file. The `/feature-crew analyze` command scans all feature directories at query time.

---

## Enhancement 7: Adaptive Retry with Strategy Ladder

**What changes:** `SKILL.md` (orchestrator), `feature-crew-implement/SKILL.md`

Replaces the hard 3-strike -> BLOCKED rule with a 7-round escalation:

| Round | Strategy | Description |
|-------|----------|-------------|
| 1-3 | **Normal** | Standard implement -> eval -> remediate cycle (parallel exploration on each) |
| 4 | **Architectural pivot** | Re-read spec + all prior eval feedback holistically. Identify recurring failure pattern. Try fundamentally different architecture. Starts from clean slate (frontier resets to pre-implementation). |
| 5 | **Specialist agent** | Analyze which dimension consistently fails. Dispatch specialist sub-agent focused on that dimension (e.g., test coverage specialist, accessibility specialist). |
| 6 | **Minimal viable** | Relax non-critical ACs (Minor severity items). Attempt reduced-scope implementation nailing core ACs. Log relaxed ACs as `"relaxedACs"` in state. |
| 7 | **BLOCKED** | Escalate to human with full history: all 6 prior attempts, scores, strategies tried, what consistently fails. |

**Rules:**
- Each round uses parallel exploration and frontier pattern
- Strategy logged in `metrics.json`
- Round 4 resets frontier to pre-implementation state
- Round 6's relaxed ACs become follow-up work if feature ships

---

## Enhancement 8: Phase Backtracking (Evaluator-Triggered)

**What changes:** `evaluator-prompt.md`, `SKILL.md` (orchestrator), `feature-crew-clarify/SKILL.md`

**Trigger:** Evaluator flags the same AC as problematic (ambiguous, untestable, or contradictory) in 2 consecutive rounds.

**Flow:**
1. Evaluator round N flags "AC-3 is ambiguous"
2. Evaluator round N+1 flags AC-3 again with spec-level issue
3. Orchestrator detects repeat, pauses implementation
4. Phase transitions to `BACKTRACK_CLARIFY`
5. Clarifier invoked with narrow scope: only flagged AC(s) + evaluator's reasoning as context
6. PO agent resolves or escalates to human
7. Spec updated in-place, change logged
8. Phase returns to `IMPLEMENTING`, round counter does NOT reset
9. Implementation resumes from current frontier with updated spec

**Guardrails:**
- Max 1 backtrack per feature (prevents infinite loops)
- Second backtrack trigger on same AC -> straight to BLOCKED
- Backtrack logged in `metrics.json` with flagged ACs and resolution
- State records `"backtracks": [{"round": 4, "acs": ["AC-3"], "resolution": "..."}]`

---

## Enhancement 9: Time Budgets (Soft Cap with Escalation)

**What changes:** `SKILL.md` (orchestrator), `feature-crew-implement/SKILL.md`, `feature-crew-qa/SKILL.md`

**Default budgets:**

| Phase | Budget | 2x Escalation |
|-------|--------|----------------|
| Clarify | 15 min | 30 min |
| Implement (per parallel branch) | 30 min | 60 min |
| Eval (per evaluation) | 10 min | 20 min |
| QA (per round) | 15 min | 30 min |
| Bug fix (per bug) | 10 min | 20 min |

**Behavior:**
- At 1x budget: warning logged to `metrics.json` with phase, elapsed time, and current progress. Work continues.
- At 2x budget: escalate to human. In auto mode, pause and wait. In normal mode, surface message. User decides.
- Budgets configurable per feature via `state.json` field `"timeBudgets": {...}`.
- No hard kills — agent is never terminated mid-work.

---

## Enhancement 10: Post-Hoc Analysis (On-Demand)

**What changes:** New file `analyzer-prompt.md`, `SKILL.md` (adds `analyze` command)

Invoked via `/feature-crew analyze`. Scans all `docs/superpowers/feature-crew/*/metrics.json` files.

**Report contents:**
- **Overview:** features completed/in-progress/blocked, avg rounds to pass eval/QA
- **Dimension heatmap:** avg score per dimension, worst feature per dimension, trend arrows
- **Strategy effectiveness:** times used, success rate, avg score lift per strategy
- **Time budget analysis:** phases exceeding budget, most over-budget phase
- **Backtrack analysis:** features requiring backtracking, most backtracked AC patterns
- **Recommendations:** actionable insights based on patterns (e.g., "test coverage consistently lowest — consider TDD enforcement")

**Output:** Printed to terminal and saved to `docs/superpowers/feature-crew/analysis-{date}.md`.

---

## State File Changes Summary

`state.json` gains these new fields:

```json
{
  "mode": "normal | auto",
  "explorationBranches": [
    {"worktree": "...", "branch": "...", "score": null, "status": "pending"}
  ],
  "frontier": "feature-name/frontier-3",
  "strategy": "normal | architectural-pivot | specialist | minimal-viable",
  "relaxedACs": [],
  "backtracks": [{"round": 4, "acs": ["AC-3"], "resolution": "..."}],
  "timeBudgets": {
    "clarify": 900,
    "implement": 1800,
    "eval": 600,
    "qa": 900,
    "bugfix": 600
  },
  "budgetWarnings": []
}
```

## New Files

| File | Purpose |
|------|---------|
| `analyzer-prompt.md` | Sub-agent prompt for `/feature-crew analyze` |
| `auto-decisions.md` (per feature) | Audit trail for autonomous mode decisions |

## Files Modified

| File | Enhancements |
|------|-------------|
| `SKILL.md` | #1, #2, #4, #5, #6, #7, #8, #9, #10 |
| `feature-crew-implement/SKILL.md` | #1, #5, #7, #9 |
| `evaluator-prompt.md` | #1, #2, #3, #6, #8 |
| `qa-agent-prompt.md` | #2, #6, #9 |
| `feature-crew-clarify/SKILL.md` | #8 |
| `feature-crew-qa/SKILL.md` | #9 |
| `clarifier-prompt.md` | No changes |
| `po-agent-prompt.md` | No changes |
| `bug-fixer-prompt.md` | No changes |
