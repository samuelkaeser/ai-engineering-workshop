# 04b.2 — Eval the agent (write the rubric)

## Why this matters

You wired up an agent. Now apply the same eval discipline to *its* output. Block 3 evals taught you to score a classifier; this teaches you to score a free-form agent answer.

We can't use `exactLabel` here — the agent returns prose, not a category. We use **LLM-as-a-Judge** instead, with a rubric specific to "is this answer faithful to the corpus *and* does it actually answer the question?"

## What you'll do

The eval scaffolding (data, task, judge plumbing) is pre-written. Your one job is to **write the rubric** in `agent.eval.ts` — the empty `RUBRIC` string at the top of the judge function.

A good rubric for this task scores two things together:
- **Faithfulness** — does the answer match what the issue tracker actually contains, or does it hallucinate issues / numbers / labels?
- **Addressing the question** — does it answer what was asked, or does it dodge into a generic summary?

The shape is the same as `JUDGE_RUBRIC` in `shared/scorers.ts` (from 03.2). Re-read that one first — describe what each score level (0, 1, 3, 5) means, and tell the judge to reply by calling the `score_answer` tool.

## Steps

1. Read `JUDGE_RUBRIC` in `shared/scorers.ts`. Notice: it's prose with score anchors and a "reply by calling X" line.
2. Open `agent.eval.ts`, find the empty `RUBRIC = \`\``, write yours.
3. Run `pnpm eval:dev`. Click into a row to see the judge's `justification` metadata — that's where rubric design becomes visible.
4. **Tighten one thing.** First-draft rubrics are usually too soft. Try requiring the judge to *quote* a phrase from the answer when justifying a 5. Re-run. Did the score drop? That's the rubric working.

## If your scores all come back as 0

The empty rubric makes the judge ignore your scoring instructions and produce no `tool_use` block, which we map to score 0. Once you fill in `RUBRIC`, real numbers should start showing up.

## Optional stretch

Add a fourth question to the `data` array. Pick one that *should* require multiple tool calls. Watch how the agent behaves — and whether your rubric still discriminates good answers from bad ones at the new question.
