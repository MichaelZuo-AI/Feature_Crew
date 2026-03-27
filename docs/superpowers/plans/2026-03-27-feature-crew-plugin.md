# Feature Crew Plugin Packaging — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package Feature Crew skills into a Claude Code plugin at `plugin/` so it can be installed in any project.

**Architecture:** Move existing skill and agent prompt files from `.claude/skills/feature-crew*/` into `plugin/skills/` and `plugin/agents/`. Update all internal path references from `skills/feature-crew/X-prompt.md` to `agents/X.md`. Delete the old directories.

**Tech Stack:** Markdown files only (Claude Code plugin format)

---

## File Map

| Action | Source | Destination |
|--------|--------|-------------|
| Create | — | `plugin/.claude-plugin/plugin.json` |
| Create | — | `plugin/README.md` |
| Move | `.claude/skills/feature-crew/SKILL.md` | `plugin/skills/feature-crew/SKILL.md` |
| Move | `.claude/skills/feature-crew-clarify/SKILL.md` | `plugin/skills/feature-crew-clarify/SKILL.md` |
| Move | `.claude/skills/feature-crew-implement/SKILL.md` | `plugin/skills/feature-crew-implement/SKILL.md` |
| Move | `.claude/skills/feature-crew-evaluate/SKILL.md` | `plugin/skills/feature-crew-evaluate/SKILL.md` |
| Move | `.claude/skills/feature-crew-qa/SKILL.md` | `plugin/skills/feature-crew-qa/SKILL.md` |
| Move+Rename | `.claude/skills/feature-crew/clarifier-prompt.md` | `plugin/agents/clarifier.md` |
| Move+Rename | `.claude/skills/feature-crew/po-agent-prompt.md` | `plugin/agents/po-agent.md` |
| Move+Rename | `.claude/skills/feature-crew/evaluator-prompt.md` | `plugin/agents/evaluator.md` |
| Move+Rename | `.claude/skills/feature-crew/qa-agent-prompt.md` | `plugin/agents/qa-agent.md` |
| Move+Rename | `.claude/skills/feature-crew/bug-fixer-prompt.md` | `plugin/agents/bug-fixer.md` |
| Move+Rename | `.claude/skills/feature-crew/analyzer-prompt.md` | `plugin/agents/analyzer.md` |
| Delete | `.claude/skills/feature-crew/` | — |
| Delete | `.claude/skills/feature-crew-clarify/` | — |
| Delete | `.claude/skills/feature-crew-implement/` | — |
| Delete | `.claude/skills/feature-crew-evaluate/` | — |
| Delete | `.claude/skills/feature-crew-qa/` | — |

---

### Task 1: Create Plugin Scaffold and Manifest

**Files:**
- Create: `plugin/.claude-plugin/plugin.json`
- Create: `plugin/README.md`

- [ ] **Step 1: Create plugin manifest**

Create `plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "feature-crew",
  "description": "Multi-phase feature development with parallel exploration, adaptive retry, and independent evaluator agents at every phase",
  "author": {
    "name": "Michael Zuo"
  }
}
```

- [ ] **Step 2: Create README**

Create `plugin/README.md`:

```markdown
# Feature Crew

Multi-phase feature development with independent evaluator agents at every phase. Parallel exploration, adaptive retry, and experiment logging inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

## Installation

```bash
claude plugins add /path/to/FeatureCrew/plugin
```

## Quick Reference

| Phase | Skill | What Happens |
|-------|-------|--------------|
| Phase 1 | `feature-crew-clarify` | Feature requirement → structured spec via question loop |
| Checkpoint 1 | Human (skipped in auto mode) | Approve spec before implementation |
| Phase 2 | `feature-crew-implement` | Plan → parallel exploration → evaluator scoring gate (≥90%) |
| Checkpoint 2 | Human (skipped in auto mode if ≥95%) | Code review before QA |
| Phase 3 | `feature-crew-qa` | Holistic QA → bug fix loop → ship |

## Usage

```
/feature-crew                    # Start a new feature
/feature-crew auto <name>        # Start in autonomous mode
/feature-crew resume <name>      # Resume a feature
/feature-crew list               # List all features
/feature-crew analyze            # Cross-feature analytics
/feature-crew-evaluate           # Standalone code evaluation
```

## Key Features

- **Parallel exploration** — 2-3 implementations compete, best wins
- **Git-as-frontier** — branch tip always represents best-known state
- **Adaptive retry** — 7-round strategy ladder (normal → architectural pivot → specialist → minimal viable → blocked)
- **Phase backtracking** — evaluator can trigger return to clarification
- **Experiment logging** — per-feature metrics.json for post-hoc analysis
- **Autonomous mode** — graduated checkpoint skipping for low-risk features
- **Time budgets** — soft caps with escalation, never hard-kills
```

- [ ] **Step 3: Commit**

```bash
git add plugin/.claude-plugin/plugin.json plugin/README.md
git commit -m "feat(plugin): create Feature Crew plugin scaffold and manifest"
```

---

### Task 2: Move Agent Prompts

**Files:**
- Move: `.claude/skills/feature-crew/clarifier-prompt.md` → `plugin/agents/clarifier.md`
- Move: `.claude/skills/feature-crew/po-agent-prompt.md` → `plugin/agents/po-agent.md`
- Move: `.claude/skills/feature-crew/evaluator-prompt.md` → `plugin/agents/evaluator.md`
- Move: `.claude/skills/feature-crew/qa-agent-prompt.md` → `plugin/agents/qa-agent.md`
- Move: `.claude/skills/feature-crew/bug-fixer-prompt.md` → `plugin/agents/bug-fixer.md`
- Move: `.claude/skills/feature-crew/analyzer-prompt.md` → `plugin/agents/analyzer.md`

- [ ] **Step 1: Create agents directory and move all 6 files**

```bash
mkdir -p plugin/agents
mv .claude/skills/feature-crew/clarifier-prompt.md plugin/agents/clarifier.md
mv .claude/skills/feature-crew/po-agent-prompt.md plugin/agents/po-agent.md
mv .claude/skills/feature-crew/evaluator-prompt.md plugin/agents/evaluator.md
mv .claude/skills/feature-crew/qa-agent-prompt.md plugin/agents/qa-agent.md
mv .claude/skills/feature-crew/bug-fixer-prompt.md plugin/agents/bug-fixer.md
mv .claude/skills/feature-crew/analyzer-prompt.md plugin/agents/analyzer.md
```

- [ ] **Step 2: Verify all 6 files exist in new location**

```bash
ls -la plugin/agents/
```

Expected: 6 files — `analyzer.md`, `bug-fixer.md`, `clarifier.md`, `evaluator.md`, `po-agent.md`, `qa-agent.md`

- [ ] **Step 3: Commit**

```bash
git add plugin/agents/ .claude/skills/feature-crew/
git commit -m "refactor(plugin): move agent prompts to plugin/agents/"
```

---

### Task 3: Move Skill Files

**Files:**
- Move: `.claude/skills/feature-crew/SKILL.md` → `plugin/skills/feature-crew/SKILL.md`
- Move: `.claude/skills/feature-crew-clarify/SKILL.md` → `plugin/skills/feature-crew-clarify/SKILL.md`
- Move: `.claude/skills/feature-crew-implement/SKILL.md` → `plugin/skills/feature-crew-implement/SKILL.md`
- Move: `.claude/skills/feature-crew-evaluate/SKILL.md` → `plugin/skills/feature-crew-evaluate/SKILL.md`
- Move: `.claude/skills/feature-crew-qa/SKILL.md` → `plugin/skills/feature-crew-qa/SKILL.md`

- [ ] **Step 1: Create skill directories and move all 5 files**

```bash
mkdir -p plugin/skills/feature-crew
mkdir -p plugin/skills/feature-crew-clarify
mkdir -p plugin/skills/feature-crew-implement
mkdir -p plugin/skills/feature-crew-evaluate
mkdir -p plugin/skills/feature-crew-qa
mv .claude/skills/feature-crew/SKILL.md plugin/skills/feature-crew/SKILL.md
mv .claude/skills/feature-crew-clarify/SKILL.md plugin/skills/feature-crew-clarify/SKILL.md
mv .claude/skills/feature-crew-implement/SKILL.md plugin/skills/feature-crew-implement/SKILL.md
mv .claude/skills/feature-crew-evaluate/SKILL.md plugin/skills/feature-crew-evaluate/SKILL.md
mv .claude/skills/feature-crew-qa/SKILL.md plugin/skills/feature-crew-qa/SKILL.md
```

- [ ] **Step 2: Verify all 5 SKILL.md files exist**

```bash
find plugin/skills -name "SKILL.md" | sort
```

Expected:
```
plugin/skills/feature-crew-clarify/SKILL.md
plugin/skills/feature-crew-evaluate/SKILL.md
plugin/skills/feature-crew-implement/SKILL.md
plugin/skills/feature-crew-qa/SKILL.md
plugin/skills/feature-crew/SKILL.md
```

- [ ] **Step 3: Commit**

```bash
git add plugin/skills/ .claude/skills/feature-crew/ .claude/skills/feature-crew-clarify/ .claude/skills/feature-crew-implement/ .claude/skills/feature-crew-evaluate/ .claude/skills/feature-crew-qa/
git commit -m "refactor(plugin): move skill files to plugin/skills/"
```

---

### Task 4: Update Agent Path References in Skills

**Files:**
- Modify: `plugin/skills/feature-crew/SKILL.md`
- Modify: `plugin/skills/feature-crew-clarify/SKILL.md`
- Modify: `plugin/skills/feature-crew-implement/SKILL.md`
- Modify: `plugin/skills/feature-crew-evaluate/SKILL.md`
- Modify: `plugin/skills/feature-crew-qa/SKILL.md`

All references to `skills/feature-crew/X-prompt.md` must become `agents/X.md`.

- [ ] **Step 1: Update orchestrator (feature-crew/SKILL.md)**

Find and replace in `plugin/skills/feature-crew/SKILL.md`:
- `skills/feature-crew/analyzer-prompt.md` → `agents/analyzer.md`

- [ ] **Step 2: Update clarify phase (feature-crew-clarify/SKILL.md)**

Find and replace in `plugin/skills/feature-crew-clarify/SKILL.md`:
- `skills/feature-crew/clarifier-prompt.md` → `agents/clarifier.md`
- `skills/feature-crew/po-agent-prompt.md` → `agents/po-agent.md`

- [ ] **Step 3: Update implement phase (feature-crew-implement/SKILL.md)**

Find and replace in `plugin/skills/feature-crew-implement/SKILL.md`:
- `skills/feature-crew/evaluator-prompt.md` → `agents/evaluator.md`

- [ ] **Step 4: Update standalone evaluator (feature-crew-evaluate/SKILL.md)**

Find and replace in `plugin/skills/feature-crew-evaluate/SKILL.md`:
- `skills/feature-crew/evaluator-prompt.md` → `agents/evaluator.md`

- [ ] **Step 5: Update QA phase (feature-crew-qa/SKILL.md)**

Find and replace in `plugin/skills/feature-crew-qa/SKILL.md`:
- `skills/feature-crew/qa-agent-prompt.md` → `agents/qa-agent.md`
- `skills/feature-crew/bug-fixer-prompt.md` → `agents/bug-fixer.md`

- [ ] **Step 6: Verify no old paths remain**

```bash
grep -r "skills/feature-crew/" plugin/skills/ | grep -v "feature-crew-"
```

Expected: no output (no remaining references to the old agent prompt paths)

- [ ] **Step 7: Commit**

```bash
git add plugin/skills/
git commit -m "refactor(plugin): update agent path references in all skill files"
```

---

### Task 5: Delete Old Skill Directories and Verify

**Files:**
- Delete: `.claude/skills/feature-crew/` (should be empty after moves)
- Delete: `.claude/skills/feature-crew-clarify/` (should be empty)
- Delete: `.claude/skills/feature-crew-implement/` (should be empty)
- Delete: `.claude/skills/feature-crew-evaluate/` (should be empty)
- Delete: `.claude/skills/feature-crew-qa/` (should be empty)

- [ ] **Step 1: Verify old directories are empty**

```bash
find .claude/skills/feature-crew* -type f 2>/dev/null
```

Expected: no output (all files have been moved)

- [ ] **Step 2: Remove empty directories**

```bash
rm -rf .claude/skills/feature-crew .claude/skills/feature-crew-clarify .claude/skills/feature-crew-implement .claude/skills/feature-crew-evaluate .claude/skills/feature-crew-qa
```

- [ ] **Step 3: Verify final plugin structure**

```bash
find plugin -type f | sort
```

Expected:
```
plugin/.claude-plugin/plugin.json
plugin/README.md
plugin/agents/analyzer.md
plugin/agents/bug-fixer.md
plugin/agents/clarifier.md
plugin/agents/evaluator.md
plugin/agents/po-agent.md
plugin/agents/qa-agent.md
plugin/skills/feature-crew-clarify/SKILL.md
plugin/skills/feature-crew-evaluate/SKILL.md
plugin/skills/feature-crew-implement/SKILL.md
plugin/skills/feature-crew-qa/SKILL.md
plugin/skills/feature-crew/SKILL.md
```

Total: 13 files (1 manifest + 1 README + 6 agents + 5 skills)

- [ ] **Step 4: Verify no old skill directories remain**

```bash
ls .claude/skills/feature-crew* 2>&1
```

Expected: error/not found

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(plugin): remove old skill directories, plugin packaging complete"
```
