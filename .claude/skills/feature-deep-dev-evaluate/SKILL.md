---
name: feature-deep-dev-evaluate
description: Use when you need to independently evaluate implemented code against a spec with adaptive scoring across multiple quality dimensions
---

# Feature Deep Dev — Evaluate

Independent, adversarial evaluation of implemented code against a spec. Produces a scored report with an adaptive rubric based on feature type.

## When to Use

- After implementation is complete and you want a quality gate
- To score code against a spec without running the full pipeline
- Called automatically by `feature-deep-dev-implement` (Phase 2)

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
   `skills/feature-deep-dev/evaluator-prompt.md`

   Pass the sub-agent:
   - Full spec text (do NOT make it read a file)
   - All code file contents (do NOT make it read files)
   - Round number and any previous issues

3. Save the evaluation report

4. Return the score and status (PASS/FAIL)

## Standalone Usage

```
/feature-deep-dev-evaluate --spec path/to/spec.md --diff main...HEAD
```

Can be used on any codebase, not just features built through the pipeline.
