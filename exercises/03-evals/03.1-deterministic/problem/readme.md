# 03.1 — Deterministic eval (the first scorer)

> *"The loop you've almost certainly never written: change prompt → watch a number move."*

## Why this matters

Matt Pocock breaks evals into [three types](https://www.aihero.dev/three-types-of-evals): **Deterministic**, **LLM-as-a-Judge**, and **Human Feedback**. We start with the first because it's the cheapest, fastest, and least subjective.

A deterministic eval returns pass/fail (or 0/1). It's "extracting determinism from a probabilistic system" — your way of pinning down at least one thing the model must do correctly.

For our classifier, two deterministic checks make sense:
1. **`exactLabel`** — does the predicted category match the human-labelled gold label?
2. **`schemaValid`** — does the response parse as a valid `IssueClassification`?

We're using **[Evalite](https://www.evalite.dev)** as the harness — Matt's own TypeScript-native eval tool.

## What you'll do

In `accuracy.eval.ts`, complete the `evalite()` call so it:

1. Loads the 30 examples from `datasets/gold-set.json` as the `data`.
2. Calls `classifyIssue` from `shared/classify.ts` as the `task`.
3. Scores with `exactLabel` and `schemaValid`.

Then run `pnpm eval:dev` and open [http://localhost:3006](http://localhost:3006).

## Steps

1. Open `accuracy.eval.ts`. Find the TODOs.
2. Run `pnpm eval:dev`. The UI will open. You should see ~24-26 of 30 passing on `exactLabel`. (If you see 0, check your TODOs.)
3. **Read the per-example results in the UI.** Which ones is the classifier getting wrong? Why might that be?
4. We'll iterate on the prompt in 03.3 to move that number up.

## Hints

- The Evalite shape is `evalite("name", { data, task, scorers })`.
- `data` can be a function returning an array. Each entry's shape is up to you — we use the `GoldExample` directly so scorers can use the `label` field.
- `task` receives one entry and should return whatever shape your scorers consume. Returning the full `IssueClassification` is what our scorers expect.
