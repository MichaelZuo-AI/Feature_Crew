---
name: feature-crew-clarify
description: Use when starting a new feature that has a requirement description and needs requirements clarification before implementation
---

# Feature Crew — Phase 1: Clarify

Transform a feature requirement into a structured, implementation-ready spec through a question loop with the user.

## Process

### Step 1: Receive Input

The user provides:
- **Feature description** — what to build, pasted or described verbally
- **Design assets** — Figma screenshots, design specs, wireframes (optional, helps reduce ambiguity)
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
    "featureDescription": "{summary — full text in spec}"
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

### Step 4: Branch by Discussion Mode

Read `discussMode` from `state.json` (default: `"interactive"`).

- **`interactive`** → proceed to Step 4a (Clarification Loop)
- **`assumptions`** → proceed to Step 4b (Assumptions Draft)

### Step 4a: Clarification Loop with PO Agent (Interactive Mode)

Dispatch a Clarifier sub-agent using the template at:
`agents/clarifier.md`

The Clarifier analyzes the feature description + any design assets, identifies ambiguities, and generates questions ONE AT A TIME.

**For each question, before showing it to the human:**

1. Dispatch a PO Agent sub-agent using the template at:
   `agents/po-agent.md`

   Provide:
   - The question from the Clarifier
   - Feature description text
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
docs/superpowers/feature-crew/{feature-name}/spec.md
```

Then skip to Step 5.

### Step 4b: Assumptions Draft (Assumptions Mode)

Instead of asking questions one-by-one, the Clarifier drafts a complete spec based on codebase exploration:

1. Dispatch a Clarifier sub-agent using `agents/clarifier.md` with `mode: assumptions`:
   - Provide the feature description, design assets, and full codebase context from Step 3
   - The Clarifier analyzes everything and produces a **complete draft spec** — filling in all ambiguities with its best-guess answers based on existing codebase patterns, conventions, and domain context

2. Each assumption is marked inline in the spec:
   ```markdown
   - AC-3: Profile avatar uses the existing `ImageUpload` component with 2MB limit
     > **Assumption:** Inferred from existing upload patterns in `src/components/ImageUpload.tsx`. Override if different behavior needed.
   ```

3. Present the draft spec to the user with:
   > "I've drafted a complete spec based on codebase analysis. Each assumption is marked with reasoning. Please review and correct anything that's wrong — you only need to flag what needs changing."

4. The user reviews and provides corrections. For each correction:
   - Update the spec in-place
   - Remove the assumption marker from corrected items
   - Log to `poAgentLog` as:
     ```json
     {
       "questionNumber": N,
       "question": "{the assumed AC}",
       "decision": "ASSUMPTION_OVERRIDDEN",
       "originalAssumption": "{what was assumed}",
       "humanCorrection": "{what the user said instead}"
     }
     ```

5. For assumptions the user doesn't flag, mark them as accepted:
   - Remove assumption markers from the spec
   - Log to `poAgentLog` as:
     ```json
     {
       "questionNumber": N,
       "question": "{the assumed AC}",
       "decision": "ASSUMPTION_ACCEPTED",
       "assumption": "{what was assumed}",
       "reasoning": "{why it was inferred}"
     }
     ```

6. Save the finalized spec to:
   ```
   docs/superpowers/feature-crew/{feature-name}/spec.md
   ```

### Step 5: Checkpoint 1

Present the spec AND PO agent decision summary to the user:

> "Spec generated and saved to `docs/superpowers/feature-crew/{feature-name}/spec.md`."

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

On approval, update state to `IMPLEMENTING` and invoke `feature-crew-implement`.

## Backtrack Re-Entry

When invoked from a `BACKTRACK_CLARIFY` state (triggered by the evaluator flagging the same AC in 2 consecutive rounds), this skill operates in **narrow scope mode**:

### What's Different

1. **No full codebase exploration** — context is already established
2. **Narrow question scope** — only address the specific flagged ACs, not the entire feature
3. **Evaluator reasoning provided** — the Clarifier receives the evaluator's explanation of why each AC is problematic

### Backtrack Process

1. Read `state.json` to find the `backtracks` entry with `resolution: null`
2. Extract the flagged ACs and evaluator reasoning
3. Dispatch Clarifier sub-agent with:
   - The current spec
   - Only the flagged ACs (not the full feature description)
   - Evaluator reasoning for each flagged AC
   - Instruction: "These acceptance criteria were flagged as ambiguous/untestable/contradictory by the evaluator in 2 consecutive rounds. Resolve them."
4. For each clarification question, use PO Agent as normal (auto-answer or escalate)
5. Update the spec in-place with revised ACs
6. Update `backtracks` entry with resolution text
7. Log backtrack to `metrics.json`
8. Return to `IMPLEMENTING` phase (round counter is NOT reset)

### Guardrails

- Only touch the flagged ACs — do not re-open other parts of the spec
- Max 1 backtrack per feature — if this is the second backtrack, the orchestrator would have routed to BLOCKED_IMPL instead
- Do NOT present Checkpoint 1 again — the spec was already approved, this is a targeted fix

## Standalone Usage

This skill can be invoked independently via `/feature-crew-clarify` for any project. It produces a spec without requiring the full pipeline.
