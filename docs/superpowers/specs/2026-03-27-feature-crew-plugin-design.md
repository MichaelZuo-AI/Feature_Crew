# Feature Crew Plugin — Design Spec

**Date:** 2026-03-27
**Scope:** Restructure Feature Crew skills into a Claude Code plugin at `plugin/`

---

## Goal

Package Feature Crew as a Claude Code plugin so it can be installed in any project via `claude plugins add`, replacing the current per-project `.claude/skills/` approach.

## Plugin Structure

```
plugin/
├── .claude-plugin/
│   └── plugin.json
├── LICENSE
├── README.md
├── skills/
│   ├── feature-crew/
│   │   └── SKILL.md              (orchestrator — start, resume, list, analyze, pause)
│   ├── feature-crew-clarify/
│   │   └── SKILL.md              (Phase 1: clarification)
│   ├── feature-crew-implement/
│   │   └── SKILL.md              (Phase 2: implementation with parallel exploration)
│   ├── feature-crew-evaluate/
│   │   └── SKILL.md              (standalone evaluator)
│   └── feature-crew-qa/
│       └── SKILL.md              (Phase 3: QA)
├── agents/
│   ├── clarifier.md              (was clarifier-prompt.md)
│   ├── po-agent.md               (was po-agent-prompt.md)
│   ├── evaluator.md              (was evaluator-prompt.md)
│   ├── qa-agent.md               (was qa-agent-prompt.md)
│   ├── bug-fixer.md              (was bug-fixer-prompt.md)
│   └── analyzer.md               (was analyzer-prompt.md)
```

## Manifest

`.claude-plugin/plugin.json`:
```json
{
  "name": "feature-crew",
  "description": "Multi-phase feature development with parallel exploration, adaptive retry, and independent evaluator agents at every phase",
  "author": {
    "name": "Michael Zuo"
  }
}
```

## File Migration

### Agent Prompts (move + rename)

| Current Path | Plugin Path |
|-------------|-------------|
| `.claude/skills/feature-crew/clarifier-prompt.md` | `plugin/agents/clarifier.md` |
| `.claude/skills/feature-crew/po-agent-prompt.md` | `plugin/agents/po-agent.md` |
| `.claude/skills/feature-crew/evaluator-prompt.md` | `plugin/agents/evaluator.md` |
| `.claude/skills/feature-crew/qa-agent-prompt.md` | `plugin/agents/qa-agent.md` |
| `.claude/skills/feature-crew/bug-fixer-prompt.md` | `plugin/agents/bug-fixer.md` |
| `.claude/skills/feature-crew/analyzer-prompt.md` | `plugin/agents/analyzer.md` |

### Skill Files (move)

| Current Path | Plugin Path |
|-------------|-------------|
| `.claude/skills/feature-crew/SKILL.md` | `plugin/skills/feature-crew/SKILL.md` |
| `.claude/skills/feature-crew-clarify/SKILL.md` | `plugin/skills/feature-crew-clarify/SKILL.md` |
| `.claude/skills/feature-crew-implement/SKILL.md` | `plugin/skills/feature-crew-implement/SKILL.md` |
| `.claude/skills/feature-crew-evaluate/SKILL.md` | `plugin/skills/feature-crew-evaluate/SKILL.md` |
| `.claude/skills/feature-crew-qa/SKILL.md` | `plugin/skills/feature-crew-qa/SKILL.md` |

## Path Reference Updates

All skill files that reference agent prompts must be updated. The pattern changes from:

```
skills/feature-crew/evaluator-prompt.md
```

To:

```
agents/evaluator.md
```

### Files requiring path updates

**`plugin/skills/feature-crew/SKILL.md`** (orchestrator):
- `skills/feature-crew/analyzer-prompt.md` → `agents/analyzer.md`

**`plugin/skills/feature-crew-clarify/SKILL.md`**:
- `skills/feature-crew/clarifier-prompt.md` → `agents/clarifier.md`
- `skills/feature-crew/po-agent-prompt.md` → `agents/po-agent.md`

**`plugin/skills/feature-crew-implement/SKILL.md`**:
- `skills/feature-crew/evaluator-prompt.md` → `agents/evaluator.md`

**`plugin/skills/feature-crew-evaluate/SKILL.md`**:
- `skills/feature-crew/evaluator-prompt.md` → `agents/evaluator.md`

**`plugin/skills/feature-crew-qa/SKILL.md`**:
- `skills/feature-crew/qa-agent-prompt.md` → `agents/qa-agent.md`
- `skills/feature-crew/bug-fixer-prompt.md` → `agents/bug-fixer.md`

## Cleanup

After the plugin is created and verified:
- Delete `.claude/skills/feature-crew/` (all contents moved to plugin)
- Delete `.claude/skills/feature-crew-clarify/`
- Delete `.claude/skills/feature-crew-implement/`
- Delete `.claude/skills/feature-crew-evaluate/`
- Delete `.claude/skills/feature-crew-qa/`

## README.md

Brief README with:
- What Feature Crew is (one paragraph)
- Installation command
- Quick reference table (phases)
- Link to the design spec for details

## Installation

```bash
# From local path
claude plugins add /path/to/FeatureCrew/plugin

# Or from GitHub (once published)
claude plugins add MichaelZuo-AI/Feature_Crew/plugin
```
