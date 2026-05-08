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

In `accuracy.eval.ts`, the `data` and `task` are pre-wired (see `shared/eval-harness.ts`). Your single job is to wire up the **scorers**: pass `exactLabel` and `schemaValid` (already imported) into the `scorers` array.

Then run `pnpm eval:dev` and open [http://localhost:3006](http://localhost:3006).

## Steps

1. Open `accuracy.eval.ts`. Fill in the one TODO.
2. Run `pnpm eval:dev`. The UI will open. You should see ~24-26 of 30 passing on `exactLabel`. (If you see 0, check your TODO.)
3. **Read the per-example results in the UI.** Which ones is the classifier getting wrong? Why might that be?
4. We'll iterate on the prompt in 03.3 to move that number up.

## Hints

- The Evalite shape is `evalite("name", { data, task, scorers })`. We've extracted `data` and `task` into `shared/eval-harness.ts` so 03.1 and 03.2 only differ in their scorers.
- `exactLabel` returns 1 if `output.category === expected.label`, else 0.
- `schemaValid` returns 1 if the output parses as `IssueClassificationSchema`. With forced tool-use this is always 1 — that's the point: it's the canary that fires only when something upstream has broken.

## If your score looks wrong, check:

- **Score is 0 across the board** — did you forget to put the scorers in the array?
- **Score is much lower than 0.73** — are you on `claude-haiku-4-5`? (Check `shared/client.ts`.) Did you remove `tool_choice` from `classify.ts`?
- **`schemaValid` is below 1.0** — the SUT response isn't matching `IssueClassificationSchema`; click into a failing row in the UI to see the parse error.
- **Eval times out** — `ANTHROPIC_API_KEY` not set, or rate limited. Run `pnpm exercise 0.1` to confirm the API works.
