# 04b.2 — Eval the agent

## Why this matters

You wired up an agent. Now apply the same eval discipline to *its* output. Block 3 evals taught you to score a classifier; this teaches you to score a free-form agent answer.

We can't use `exactLabel` here — the agent returns prose, not a category. We use **LLM-as-a-Judge** instead, with a rubric specific to "is this answer faithful to the corpus and does it actually answer the question?".

## What you'll do

The eval is mostly written. Read it, then run `pnpm eval:dev` and watch the agent get scored on three seeded questions.

Optional stretch: add a fourth question. Pick one that *should* require multiple tool calls. Watch how the agent behaves.
