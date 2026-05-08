# 03.2 — LLM-as-a-Judge (scoring reasoning quality)

> *"What model should judge?"*

## Why this matters

`exactLabel` only tells you whether the *category* is right. It says nothing about whether the model's **reasoning** is any good. A correct label with hallucinated justification is a model that's right today and wrong tomorrow.

That's where [LLM-as-a-Judge](https://www.aihero.dev/three-types-of-evals) comes in: a *second* LLM call grades the first one's output against a rubric.

Two design choices to internalize while you do this:

1. **Different model for the judge.** Our SUT is `claude-haiku-4-5`. Our judge is `claude-sonnet-4-6`. A model judging itself has a known self-evaluation bias — make the judge bigger and from a different family if you can.
2. **The rubric *is* the prompt.** Tightening the rubric is exactly the same act as tightening any prompt. The judge is a system you have to evaluate too.

## What you'll do

`shared/scorers.ts` already implements `llmJudgeReasoning` — a Sonnet 4.6 call that grades the SUT's `reasoning` field on a 0–5 rubric. Read that file before continuing.

In `judge.eval.ts`:

1. Load the gold set as data (same shape as 03.1).
2. Call `classifyIssue` as the task.
3. Score with **only `llmJudgeReasoning`** (you'd add `exactLabel` too in real life — we keep them separate here so you can see the judge's score in isolation).

Then run `pnpm eval:dev` and inspect each row in the UI. **Click into a row** to see the judge's `justification` metadata — that's where rubric design becomes visible.

## Steps

1. Read `shared/scorers.ts` lines 30–80.
2. Fill in the TODOs in `judge.eval.ts`.
3. Run `pnpm eval:dev`. Note the score (it'll be lower than `exactLabel` — the rubric is harder).
4. **Edit the `JUDGE_RUBRIC` in `shared/scorers.ts`** — try tightening it (e.g. require the model to *quote* a phrase from the issue body). Re-run. Did the score change?

## Discussion

When you change the rubric, the score moves — but you haven't changed the SUT at all. That's the lesson: **judge prompts are themselves a system you have to design and evaluate.** Some teams write evals *for their judge*.
