# PO Agent for Feature Deep Dev — Design Spec

**Date:** 2026-03-21
**Status:** Draft
**Author:** Michael Zuo + Claude
**Parent:** `docs/superpowers/specs/2026-03-21-feature-deep-dev-design.md`

## Overview

Add a PO (Product Owner) agent to Phase 1 of the `feature-deep-dev` workflow. The PO agent acts as a **filter** between the Clarifier and the human — it auto-answers clarifier questions when it can, and only escalates to the human when it can't.

This reduces the number of questions the human needs to answer per feature while preserving full visibility at Checkpoint 1.

## Architecture

The PO agent is a sub-agent dispatched by `feature-deep-dev-clarify`. It's invisible to the Clarifier — the Clarifier asks questions the same way it always did, and gets answers back. The routing skill decides whether the PO agent or the human provides the answer.

```
Clarifier asks question → PO Agent evaluates → ANSWER? → Clarifier continues
                                               → ESCALATE? → Human answers → Clarifier continues
```

## PO Agent Prompt Template

**New file:** `.claude/skills/feature-deep-dev/po-agent-prompt.md`

### Inputs

1. **One-Pager** — feature description text
2. **Figma screenshots** — visual design reference (optional)
3. **Codebase context** — relevant existing code
4. **Additional context** — product guidelines, past specs, team conventions (optional, provided by user)
5. **The specific question** from the Clarifier

### Process

1. Read the question from the Clarifier
2. Check mandatory escalation rules — if triggered, immediately return `ESCALATE`
3. Attempt to answer from available context
4. Self-assess confidence: can the answer be clearly derived from the inputs, or is it a guess?
5. If confident → return `ANSWER`. If uncertain → return `ESCALATE`.

### Mandatory Escalation Rules

Always escalate regardless of confidence:

- **Business logic** — pricing, monetization, user tiers, billing
- **Security/auth decisions**
- **Breaking changes** to existing APIs or data contracts
- **Scope decisions** that significantly expand or reduce the feature
- **Explicitly open items** — anything the one-pager marks as TBD, to be discussed, or open
- **Legal/compliance** implications

### Output Format

```
**Decision:** ANSWER | ESCALATE
**Confidence:** High | Low
**Escalation reason:** {if ESCALATE — why: mandatory rule or low confidence}

**Answer:** {if ANSWER — the PO agent's response}
**Reasoning:** {how this was derived from the inputs}
```

## Modified Phase 1 Flow

### Changes to `feature-deep-dev-clarify` Step 4

Current:
```
Clarifier asks question → Human answers → Clarifier continues
```

New:
```
Clarifier asks question
  → Dispatch PO Agent with question + all context
  → PO Agent returns ANSWER or ESCALATE
  → If ANSWER: feed answer to Clarifier, log decision
  → If ESCALATE: show question to human (include escalation reason), log decision
  → Clarifier continues with the answer
```

### Checkpoint 1 Enhancement

At Checkpoint 1, in addition to the spec, show a PO Agent decision summary:

```markdown
## PO Agent Decisions (Auto-Answered)
- Q1: "What happens on empty state?" → "Show placeholder per Figma mockup" (High confidence)
- Q3: "Should search be real-time or on-submit?" → "On-submit, matches existing pattern" (High confidence)

## Escalated to Human
- Q2: "Should free-tier users see this feature?" → Escalated: business logic (pricing/tiers)
- Q4: "Cache TTL for API responses?" → Escalated: low confidence
```

The human reviews the full picture — auto-answered + escalated — and can override any PO agent decision before approving the spec.

## State Management

Add `poAgentLog` to `state.json`:

```json
{
  "poAgentLog": [
    {
      "questionNumber": 1,
      "question": "What happens on empty state?",
      "decision": "ANSWER",
      "confidence": "High",
      "answer": "Show placeholder per Figma mockup",
      "reasoning": "Figma screenshot shows empty state design"
    },
    {
      "questionNumber": 2,
      "question": "Should free-tier users see this feature?",
      "decision": "ESCALATE",
      "escalationReason": "Business logic: user tiers",
      "humanAnswer": "Yes, all tiers"
    }
  ]
}
```

This log serves:
1. **Checkpoint 1 review** — summary generated from this log
2. **Auditability** — trace decisions back to PO agent or human

No new phase states needed — the PO agent operates entirely within the existing `CLARIFYING` phase.

## Files to Create / Modify

| Action | File | What |
|--------|------|------|
| Create | `.claude/skills/feature-deep-dev/po-agent-prompt.md` | PO agent prompt template |
| Modify | `.claude/skills/feature-deep-dev-clarify/SKILL.md` | Update Step 4 to route questions through PO agent, add Checkpoint 1 summary |

The Clarifier prompt (`clarifier-prompt.md`) is unchanged — it doesn't know about the PO agent. The orchestrator (`feature-deep-dev/SKILL.md`) is unchanged — Phase 1 works the same from its perspective.

## Design Decisions

1. **Filter, not replacement** — PO agent filters questions, doesn't replace the Clarifier. Clarifier still drives the conversation.
2. **Approach B (in-the-loop)** — PO agent evaluates each question as it comes, preserving conversational flow and adaptive follow-ups. Chosen over batch (Approach A) or pre-processor (Approach C).
3. **Dual confidence model** — self-assessment + mandatory escalation rules. Self-assessment alone is unreliable; rules alone are too rigid.
4. **Low-confidence only at Checkpoint 1** — high-confidence auto-accepted, only low-confidence and escalated questions shown. Reduces human review burden.
5. **Additional context support** — PO agent can receive product guidelines, past specs, etc. beyond the standard one-pager + Figma + codebase.
