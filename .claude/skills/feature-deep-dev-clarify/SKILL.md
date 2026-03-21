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

### Step 4: Clarification Loop with PO Agent

Dispatch a Clarifier sub-agent using the template at:
`skills/feature-deep-dev/clarifier-prompt.md`

The Clarifier analyzes the one-pager + Figma, identifies ambiguities, and generates questions ONE AT A TIME.

**For each question, before showing it to the human:**

1. Dispatch a PO Agent sub-agent using the template at:
   `skills/feature-deep-dev/po-agent-prompt.md`

   Provide:
   - The question from the Clarifier
   - One-pager text
   - Figma screenshots (if provided)
   - Codebase context (from Step 3 exploration)
   - Additional context (if user provided product guidelines, past specs, etc.)

2. Read PO Agent's response:

   **If ANSWER:**
   - Feed the answer back to the Clarifier as if the human answered
   - Log to `poAgentLog` in state.json:
     ```json
     {
       "questionNumber": N,
       "question": "{the question}",
       "decision": "ANSWER",
       "confidence": "High",
       "answer": "{PO agent's answer}",
       "reasoning": "{PO agent's reasoning}"
     }
     ```

   **If ESCALATE:**
   - Show the question to the human, including the escalation reason
   - After human answers, feed the answer to the Clarifier
   - Log to `poAgentLog` in state.json:
     ```json
     {
       "questionNumber": N,
       "question": "{the question}",
       "decision": "ESCALATE",
       "escalationReason": "{why}",
       "humanAnswer": "{human's answer}"
     }
     ```

3. Clarifier continues with the next question until all resolved.

Save the spec to:
```
docs/superpowers/feature-deep-dev/{feature-name}/spec.md
```

### Step 5: Checkpoint 1

Present the spec AND PO agent decision summary to the user:

> "Spec generated and saved to `docs/superpowers/feature-deep-dev/{feature-name}/spec.md`."

Then show the PO Agent decision log:

```markdown
## PO Agent Decisions (Auto-Answered)
{For each ANSWER entry in poAgentLog:}
- Q{N}: "{question}" → "{answer}" ({confidence} confidence)

## Escalated to Human
{For each ESCALATE entry in poAgentLog:}
- Q{N}: "{question}" → Escalated: {escalationReason}
```

> "Please review the spec and the PO agent's auto-answered decisions above. You can override any decision. When you approve, I'll proceed to implementation (Phase 2)."

Update state:
```json
{ "phase": "CHECKPOINT_1" }
```

Wait for user approval before proceeding.

### Step 6: Hand Off

On approval, update state to `IMPLEMENTING` and invoke `feature-deep-dev-implement`.

## Standalone Usage

This skill can be invoked independently via `/feature-deep-dev-clarify` for any project. It produces a spec without requiring the full pipeline.
