---
name: feature-deep-dev-clarify
description: Use when starting a new feature that has a one-pager or Figma spec and needs requirements clarification before implementation
---

# Feature Deep Dev — Phase 1: Clarify

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
docs/superpowers/feature-deep-dev/{feature-name}/state.json
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
`skills/feature-deep-dev/clarifier-prompt.md`

The Clarifier:
1. Analyzes the one-pager + Figma
2. Identifies ambiguities
3. Asks the user questions ONE AT A TIME
4. After all questions resolved, generates the spec

Save the spec to:
```
docs/superpowers/feature-deep-dev/{feature-name}/spec.md
```

### Step 5: Checkpoint 1

Present the spec to the user:

> "Spec generated and saved to `docs/superpowers/feature-deep-dev/{feature-name}/spec.md`. Please review it. When you approve, I'll proceed to implementation (Phase 2)."

Update state:
```json
{ "phase": "CHECKPOINT_1" }
```

Wait for user approval before proceeding.

### Step 6: Hand Off

On approval, update state to `IMPLEMENTING` and invoke `feature-deep-dev-implement`.

## Standalone Usage

This skill can be invoked independently via `/feature-deep-dev-clarify` for any project. It produces a spec without requiring the full pipeline.
