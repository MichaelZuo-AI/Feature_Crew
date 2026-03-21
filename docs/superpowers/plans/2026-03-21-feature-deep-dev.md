# Feature Crew Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a skill family (`feature-crew`) that orchestrates multi-phase feature development with independent evaluator agents at each phase.

**Architecture:** 5 skill files in `.claude/skills/feature-crew/`, each as a SKILL.md-style markdown file. The orchestrator skill manages state via a JSON file on disk and delegates to phase skills. Phase skills wrap existing Superpowers skills and add evaluation gates.

**Tech Stack:** Claude Code skills (markdown), JSON state files, git worktrees

**Spec:** `docs/superpowers/specs/2026-03-21-feature-crew-design.md`

---

### Task 1: Create the shared evaluator prompt template

The evaluator is the foundation — Phase 2 and Phase 3 both depend on it. Build this first.

**Files:**
- Create: `.claude/skills/feature-crew/evaluator-prompt.md`

- [ ] **Step 1: Write the evaluator prompt template**

Create `.claude/skills/feature-crew/evaluator-prompt.md` with:

```markdown
# Feature Crew — Evaluator Agent

You are an independent evaluator. Your job is to assess implementation quality against a spec. You are adversarial — your goal is to find problems, not to rubber-stamp.

## Inputs

You will receive:
1. **Spec** — the feature spec with acceptance criteria
2. **Evaluator criteria hints** — feature type, dimension weight overrides
3. **Code** — the implemented code to evaluate (file paths and contents)
4. **Round number** — which evaluation round this is (previous issues should be fixed)

## Adaptive Rubric

Detect feature type from evaluator criteria hints. If not specified, infer from the code.

**Default weights by feature type:**

| Dimension | UI-heavy | Backend | Full-stack | CLI |
|-----------|----------|---------|------------|-----|
| Spec compliance | 25% | 30% | 25% | 30% |
| Code quality | 15% | 25% | 20% | 25% |
| Test coverage | 15% | 25% | 20% | 30% |
| UI/UX fidelity | 30% | 0% | 20% | 0% |
| Error handling | 5% | 10% | 5% | 10% |
| Integration safety | 10% | 10% | 10% | 5% |

If evaluator criteria hints override weights, use those instead. If a dimension doesn't apply (e.g., UI/UX for a CLI tool), redistribute its weight proportionally across remaining dimensions.

## Evaluation Process

For each dimension:
1. Read the relevant code files thoroughly
2. Cross-reference against spec acceptance criteria
3. Score 0-100 with specific rationale
4. List concrete issues with file:line references

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

### Issues Found (blocks ≥90%)
1. [{severity}] {description} — {spec item reference}
   File: {path}:{line}

### What's Good
- {strength 1}
- {strength 2}

### Remediation
1. {fix description} — estimated {N} task(s)

### Status
PASS (≥90%) | FAIL ({score}%, issues above must be fixed)
```

## Rules

- NEVER see the implementer's reasoning or self-review — only the code and spec
- Score against the spec's acceptance criteria, not abstract quality ideals
- Be specific: every issue must have a file path and line number
- Be calibrated: don't nitpick style if spec compliance is the concern
- If this is round 2+, verify previous issues are actually fixed before scoring
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew/evaluator-prompt.md | head -5`
Expected: Shows the title and first few lines

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/evaluator-prompt.md
git commit -m "feat: add feature-crew evaluator prompt template"
```

---

### Task 2: Create the QA agent prompt template

Phase 3's QA agent needs its own prompt — distinct from the evaluator.

**Files:**
- Create: `.claude/skills/feature-crew/qa-agent-prompt.md`

- [ ] **Step 1: Write the QA agent prompt template**

Create `.claude/skills/feature-crew/qa-agent-prompt.md` with:

```markdown
# Feature Crew — QA Agent

You are a dedicated QA tester. Your job is holistic testing — not just "does the new feature work?" but "does the whole system still work with the new feature?"

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
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew/qa-agent-prompt.md | head -5`
Expected: Shows the title and first few lines

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/qa-agent-prompt.md
git commit -m "feat: add feature-crew QA agent prompt template"
```

---

### Task 3: Create the bug fixer prompt template

Phase 3's bug fixer receives bug reports and fixes them.

**Files:**
- Create: `.claude/skills/feature-crew/bug-fixer-prompt.md`

- [ ] **Step 1: Write the bug fixer prompt template**

Create `.claude/skills/feature-crew/bug-fixer-prompt.md` with:

```markdown
# Feature Crew — Bug Fixer Agent

You are a bug fixer. You receive a specific bug report and fix it. One bug per dispatch.

## Inputs

You will receive:
1. **Bug report** — description, reproduction steps, expected/actual, severity, file location
2. **Spec** — the feature spec for context
3. **Related files** — code context around the bug

## Process

1. **Reproduce** — Run the reproduction steps. Confirm the bug exists.
2. **Write failing test** — Write a test that captures the bug (RED).
3. **Run test** — Verify it fails with the expected behavior.
4. **Fix** — Write the minimal code fix.
5. **Run test** — Verify the fix passes (GREEN).
6. **Run full suite** — Verify no regressions.
7. **Commit** — Commit the fix with a descriptive message.

## Output Format

```
## Bug Fix Report

**Bug:** {title}
**Status:** FIXED | COULD_NOT_REPRODUCE | BLOCKED

### What was wrong
{root cause explanation}

### What was changed
- {file:line} — {description of change}

### Tests
- Added: {test file}:{test name}
- All tests passing: Yes/No

### Commit
{commit hash} — {commit message}
```

## Rules

- TDD: always write the failing test BEFORE the fix
- One bug, one fix, one commit — do not batch
- If you cannot reproduce the bug, report COULD_NOT_REPRODUCE
- If the fix requires architectural changes beyond the bug scope, report BLOCKED
- Never modify unrelated code
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew/bug-fixer-prompt.md | head -5`
Expected: Shows the title and first few lines

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/bug-fixer-prompt.md
git commit -m "feat: add feature-crew bug fixer prompt template"
```

---

### Task 4: Create the clarifier prompt template

Phase 1's clarifier agent that analyzes specs and asks questions.

**Files:**
- Create: `.claude/skills/feature-crew/clarifier-prompt.md`

- [ ] **Step 1: Write the clarifier prompt template**

Create `.claude/skills/feature-crew/clarifier-prompt.md` with:

```markdown
# Feature Crew — Clarifier Agent

You are a requirements clarifier. You analyze a feature spec (one-pager + optional Figma screenshots) and identify ambiguities, missing details, and edge cases that must be resolved before implementation.

## Inputs

You will receive:
1. **One-Pager** — feature description text
2. **Figma screenshots** — visual design reference (optional, may not be provided for non-UI features)
3. **Codebase context** — relevant existing code that the feature will interact with

## Analysis Process

### Step 1: Identify Core User Stories
Extract the main user stories / use cases from the one-pager. Number them.

### Step 2: Draft Acceptance Criteria
For each user story, draft testable acceptance criteria. Be specific — "user can see their profile" is not testable; "profile page displays name, email, and avatar from the user API response" is.

### Step 3: Identify Ambiguities
For each of these categories, list what's unclear or unspecified:
- **UI/UX gaps** — missing states (empty, loading, error), unclear interactions, responsive behavior
- **Data flow** — where does data come from? what's the API contract? caching?
- **Error handling** — what happens when things fail? retry? fallback?
- **Edge cases** — boundary values, concurrent access, permissions
- **Dependencies** — what existing code/APIs does this touch? are they stable?
- **Scope boundaries** — what's explicitly NOT included?

### Step 4: Prioritize Questions
Rank ambiguities by impact on implementation. Ask the most impactful ones first.

## Question Format

Ask ONE question at a time. For each:

```
**Question {N}:** {the question}

**Why it matters:** {impact on implementation if left ambiguous}

**Options:**
(A) {option} — {implication}
(B) {option} — {implication}
(C) {option} — {implication}
(D) Other — please specify
```

Use open-ended questions only when multiple choice doesn't fit.

## Spec Output Format

After all questions are resolved, produce:

```markdown
# Feature Spec: {Feature Name}

## Summary
{2-3 sentence description}

## User Stories
1. As a {role}, I want to {action} so that {benefit}

## Acceptance Criteria
- AC-1: {testable criterion}
- AC-2: {testable criterion}

## Technical Decisions
- {decision}: {what was decided and why}

## Out of Scope
- {explicitly excluded item}

## Evaluator Criteria Hints
- **Feature type:** {UI-heavy | Backend | Full-stack | CLI}
- **Weight overrides:** {any dimension weight adjustments, or "use defaults"}
- **Key quality signals:** {what "good" looks like for this specific feature}
```

## Rules

- ONE question per message — never batch questions
- Prefer multiple choice — easier for the user to answer
- Don't ask about things you can determine from the codebase — read first
- Focus on decisions that affect implementation, not theoretical completeness
- The spec should be detailed enough that a developer with zero context can implement it
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew/clarifier-prompt.md | head -5`
Expected: Shows the title and first few lines

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/clarifier-prompt.md
git commit -m "feat: add feature-crew clarifier prompt template"
```

---

### Task 5: Create the Phase 1 skill — `feature-crew-clarify`

**Files:**
- Create: `.claude/skills/feature-crew-clarify/SKILL.md`

- [ ] **Step 1: Write the Phase 1 skill**

Create `.claude/skills/feature-crew-clarify/SKILL.md` with:

```markdown
---
name: feature-crew-clarify
description: Use when starting a new feature that has a one-pager or Figma spec and needs requirements clarification before implementation
---

# Feature Crew — Phase 1: Clarify

Transform a one-pager + Figma into a structured, implementation-ready spec through a question loop with the user.

## Process

### Step 1: Receive Input

The user provides:
- **One-Pager** — pasted feature description
- **Figma screenshots** — pasted images (optional for non-UI features)
- **Feature name** — short identifier (used for state directory)

### Step 2: Initialize State

Create the feature state directory and file:

```
docs/superpowers/feature-crew/{feature-name}/state.json
```

```json
{
  "featureName": "{feature-name}",
  "input": {
    "figmaLink": "{if provided}",
    "onePager": "{summary — full text in spec}"
  },
  "worktree": null,
  "phase": "CLARIFYING",
  "phaseHistory": [
    { "phase": "INIT", "timestamp": "{now}" },
    { "phase": "CLARIFYING", "timestamp": "{now}" }
  ],
  "evalRounds": 0,
  "qaRounds": 0
}
```

### Step 3: Explore Codebase

Before asking questions, explore the codebase to understand:
- Existing architecture and patterns
- APIs and data models the feature will interact with
- Test infrastructure and conventions

This prevents asking questions the codebase already answers.

### Step 4: Clarification Loop

Dispatch a Clarifier sub-agent using the template at:
`skills/feature-crew/clarifier-prompt.md`

The Clarifier:
1. Analyzes the one-pager + Figma
2. Identifies ambiguities
3. Asks the user questions ONE AT A TIME
4. After all questions resolved, generates the spec

Save the spec to:
```
docs/superpowers/feature-crew/{feature-name}/spec.md
```

### Step 5: Checkpoint 1

Present the spec to the user:

> "Spec generated and saved to `docs/superpowers/feature-crew/{feature-name}/spec.md`. Please review it. When you approve, I'll proceed to implementation (Phase 2)."

Update state:
```json
{ "phase": "CHECKPOINT_1" }
```

Wait for user approval before proceeding.

### Step 6: Hand Off

On approval, update state to `IMPLEMENTING` and invoke `feature-crew-implement`.

## Standalone Usage

This skill can be invoked independently via `/feature-crew-clarify` for any project. It produces a spec without requiring the full pipeline.
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew-clarify/SKILL.md | head -3`
Expected: Shows YAML frontmatter start

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew-clarify/SKILL.md
git commit -m "feat: add feature-crew-clarify skill (Phase 1)"
```

---

### Task 6: Create the Phase 2 skill — `feature-crew-implement`

**Files:**
- Create: `.claude/skills/feature-crew-implement/SKILL.md`

- [ ] **Step 1: Write the Phase 2 skill**

Create `.claude/skills/feature-crew-implement/SKILL.md` with:

```markdown
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
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew-implement/SKILL.md | head -3`
Expected: Shows YAML frontmatter start

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew-implement/SKILL.md
git commit -m "feat: add feature-crew-implement skill (Phase 2)"
```

---

### Task 7: Create the Phase 3 skill — `feature-crew-qa`

**Files:**
- Create: `.claude/skills/feature-crew-qa/SKILL.md`

- [ ] **Step 1: Write the Phase 3 skill**

Create `.claude/skills/feature-crew-qa/SKILL.md` with:

```markdown
---
name: feature-crew-qa
description: Use when implementation has passed code review and needs holistic QA testing with automated bug fix loops
---

# Feature Crew — Phase 3: QA

Holistic quality assurance — run tests, find bugs, fix them, verify fixes. Loops until all clean.

## Inputs

- Approved implementation in worktree
- Spec at `docs/superpowers/feature-crew/{feature-name}/spec.md`
- State file at `docs/superpowers/feature-crew/{feature-name}/state.json`

## Process

### Step 1: Dispatch QA Agent

Dispatch a QA sub-agent using the template at:
`skills/feature-crew/qa-agent-prompt.md`

Provide:
1. The spec (for acceptance criteria)
2. List of files created/modified (from git diff)
3. The project's test command (detect from package.json, Makefile, etc.)

Save QA report to:
```
docs/superpowers/feature-crew/{feature-name}/qa-report-{N}.md
```

### Step 2: Check Results

Read QA agent's status:

**If ALL_CLEAR:**
- Proceed to Production Gate (Step 4)

**If BUGS_FOUND:**
- For each bug, dispatch a **Bug Fixer sub-agent** using:
  `skills/feature-crew/bug-fixer-prompt.md`
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
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew-qa/SKILL.md | head -3`
Expected: Shows YAML frontmatter start

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew-qa/SKILL.md
git commit -m "feat: add feature-crew-qa skill (Phase 3)"
```

---

### Task 8: Create the orchestrator skill — `feature-crew`

**Files:**
- Create: `.claude/skills/feature-crew/SKILL.md`

- [ ] **Step 1: Write the orchestrator skill**

Create `.claude/skills/feature-crew/SKILL.md` with:

```markdown
---
name: feature-crew
description: Use when starting a new feature from a one-pager or Figma spec that should go through structured phases of clarification, implementation with evaluation, and QA before shipping
---

# Feature Crew

Multi-phase feature development with independent evaluator agents at every phase. No rushing to execution.

## Quick Reference

| Phase | Skill | What Happens |
|-------|-------|--------------|
| Phase 1 | `feature-crew-clarify` | One-pager + Figma → structured spec via question loop |
| Checkpoint 1 | Human | Approve spec before implementation |
| Phase 2 | `feature-crew-implement` | Plan → code → evaluator scoring gate (≥90%) |
| Checkpoint 2 | Human | Code review before QA |
| Phase 3 | `feature-crew-qa` | Holistic QA → bug fix loop → ship |

## Starting a New Feature

### Input Required

The user provides:
1. **Feature name** — short identifier (e.g., "user-profile-page")
2. **One-Pager** — feature description, pasted into chat
3. **Figma screenshots** — pasted images (optional for non-UI features)

### Kickoff

1. Create state directory: `docs/superpowers/feature-crew/{feature-name}/`
2. Initialize `state.json` with phase `INIT`
3. Invoke `feature-crew-clarify` to start Phase 1

## Resuming a Feature

If invoked with `resume {feature-name}`:
1. Read `docs/superpowers/feature-crew/{feature-name}/state.json`
2. Route to the current phase's skill:
   - `CLARIFYING` → `feature-crew-clarify`
   - `CHECKPOINT_1` → present spec for approval
   - `IMPLEMENTING` → `feature-crew-implement`
   - `CHECKPOINT_2` → present eval report for code review
   - `QA` → `feature-crew-qa`
   - `BLOCKED_IMPL` / `BLOCKED_QA` → present issue for human guidance
   - `PRODUCTION` → already shipped, nothing to do

## Listing Features

If invoked with `list`:
1. Scan `docs/superpowers/feature-crew/*/state.json`
2. Display table: feature name, current phase, worktree branch

## State Directory

```
docs/superpowers/feature-crew/{feature-name}/
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

Start multiple: invoke `/feature-crew` for each feature. They run independently. Resume any with `/feature-crew resume {name}`.

## Red Flags — Never Do These

- Skip a checkpoint — always wait for human approval
- Reuse an evaluator/QA agent across rounds — always fresh context
- Let the implementer see evaluator reasoning — they only get the remediation list
- Proceed past BLOCKED — only the human can unblock
- Share state between parallel features
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew/SKILL.md | head -3`
Expected: Shows YAML frontmatter start

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew/SKILL.md
git commit -m "feat: add feature-crew orchestrator skill"
```

---

### Task 9: Create the evaluator skill — `feature-crew-evaluate`

This is the skill wrapper that makes the evaluator invocable independently.

**Files:**
- Create: `.claude/skills/feature-crew-evaluate/SKILL.md`

- [ ] **Step 1: Write the evaluator skill**

Create `.claude/skills/feature-crew-evaluate/SKILL.md` with:

```markdown
---
name: feature-crew-evaluate
description: Use when you need to independently evaluate implemented code against a spec with adaptive scoring across multiple quality dimensions
---

# Feature Crew — Evaluate

Independent, adversarial evaluation of implemented code against a spec. Produces a scored report with an adaptive rubric based on feature type.

## When to Use

- After implementation is complete and you want a quality gate
- To score code against a spec without running the full pipeline
- Called automatically by `feature-crew-implement` (Phase 2)

## Inputs

Provide:
1. **Spec path** — path to the feature spec (with acceptance criteria and evaluator hints)
2. **Code to evaluate** — either a git diff or list of file paths
3. **Round number** — 1 for first evaluation, increments on re-evaluation

## Process

1. Read the spec and extract:
   - Acceptance criteria
   - Feature type (UI-heavy / Backend / Full-stack / CLI)
   - Any weight overrides from evaluator criteria hints

2. Dispatch a fresh evaluator sub-agent using:
   `skills/feature-crew/evaluator-prompt.md`

   Pass the sub-agent:
   - Full spec text (do NOT make it read a file)
   - All code file contents (do NOT make it read files)
   - Round number and any previous issues

3. Save the evaluation report

4. Return the score and status (PASS/FAIL)

## Standalone Usage

```
/feature-crew-evaluate --spec path/to/spec.md --diff main...HEAD
```

Can be used on any codebase, not just features built through the pipeline.
```

- [ ] **Step 2: Verify file was created**

Run: `cat .claude/skills/feature-crew-evaluate/SKILL.md | head -3`
Expected: Shows YAML frontmatter start

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/feature-crew-evaluate/SKILL.md
git commit -m "feat: add feature-crew-evaluate skill"
```

---

### Task 10: Final integration — verify all skills are discoverable and push

**Files:**
- Verify: All `.claude/skills/*/SKILL.md` files exist and have valid frontmatter

- [ ] **Step 1: List all created skills**

Run: `find .claude/skills -name "SKILL.md" -o -name "*.md" | sort`

Expected output:
```
.claude/skills/feature-crew/SKILL.md
.claude/skills/feature-crew/bug-fixer-prompt.md
.claude/skills/feature-crew/clarifier-prompt.md
.claude/skills/feature-crew/evaluator-prompt.md
.claude/skills/feature-crew/qa-agent-prompt.md
.claude/skills/feature-crew-clarify/SKILL.md
.claude/skills/feature-crew-evaluate/SKILL.md
.claude/skills/feature-crew-implement/SKILL.md
.claude/skills/feature-crew-qa/SKILL.md
```

- [ ] **Step 2: Verify all SKILL.md files have valid frontmatter**

Run: `for f in .claude/skills/*/SKILL.md; do echo "=== $f ==="; head -4 "$f"; echo; done`

Expected: Each file starts with `---`, has `name:` and `description:` fields, ends with `---`

- [ ] **Step 3: Verify skill names match directory names**

Check that the `name:` in frontmatter matches the directory name for each SKILL.md.

- [ ] **Step 4: Push to remote**

```bash
git push origin main
```

- [ ] **Step 5: Test skill discovery**

Start a new Claude Code conversation in the Deepdive project and verify that `/feature-crew` appears in the skill list. Test invocation with a simple feature to verify the orchestrator loads correctly.
