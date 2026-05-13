# 03.1. Deterministic eval (the first scorer)

> *"The loop you've almost certainly never written: change prompt, watch a number move."*

## Why this matters

Matt Pocock breaks evals into [three types](https://www.aihero.dev/three-types-of-evals): **Deterministic**, **LLM-as-a-Judge**, and **Human Feedback**. We start with the first because it's the cheapest, fastest, and least subjective.

A deterministic eval returns pass/fail (or 0/1). It's "extracting determinism from a probabilistic system": your way of pinning down at least one thing the model must do correctly.

For our classifier, two deterministic checks make sense:
1. **`exactLabel`**. Does the predicted category match the human-labelled gold label?
2. **`schemaValid`**. Does the response parse as a valid `IssueClassification`?

We're using **[Evalite](https://www.evalite.dev)** as the harness. It's Matt's own TypeScript-native eval tool.

## The 5 categories (so the failure rows make sense)

| Category | Meaning |
|---|---|
| `bug` | Behavior is wrong or crashes |
| `feature` | A missing capability the user wants added |
| `question` | User is asking how to do something, not reporting a defect |
| `docs` | Docs missing or wrong; code is fine |
| `perf` | Code is *correct* but too slow or uses too much memory |

The hard pairs are **`bug` vs `perf`** (both feel "broken" to users) and **`question` vs `feature`** (sometimes a "how do I do X?" really means "X doesn't exist yet").

## What you'll do

In `accuracy.eval.ts`, the `data` and `task` are pre-wired (see `shared/eval-harness.ts`). Your single job is to wire up the **scorers**: pass `exactLabel` and `schemaValid` (already imported) into the `scorers` array.

Then run `pnpm eval:dev` and open [http://localhost:3006](http://localhost:3006).

## Steps

1. Open `accuracy.eval.ts`. Fill in the one TODO.
2. Run `pnpm eval:dev`. The UI will open. You should see roughly **22 to 26 of 35 passing on `exactLabel`** (~65 to 75%). `schemaValid` should be 1.00. If `exactLabel` is 0, check your TODO.
3. **Read the per-example results in the UI.** Which ones is the classifier getting wrong? **The `h*` rows are deliberately ambiguous**, so those are the most interesting failures to look at. Why is the model getting them wrong?
4. We'll iterate on the prompt in 03.3 to move that number up.

> **Heads up: you'll see an extra `Agent: answer quality` row in the dashboard.** Ignore it for now. That's the Block 4 eval; its scores look noisy because its rubric isn't written yet. We'll wire it up in 04b.2.

## Hints

- The Evalite shape is `evalite("name", { data, task, scorers })`. We've extracted `data` and `task` into `shared/eval-harness.ts` so 03.1 and 03.2 only differ in their scorers.
- `exactLabel` returns 1 if `output.category === expected.label`, else 0.
- `schemaValid` returns 1 if the output parses as `IssueClassificationSchema`. With forced tool-use this is always 1. That's the point: it's the canary that fires only when something upstream has broken.

## If your score looks wrong, check:

- **Score is 0 across the board.** Did you forget to put the scorers in the array?
- **Score is much lower than 0.65.** Are you on `claude-haiku-4-5`? (Check `shared/client.ts`.) Did you remove `tool_choice` from `classify.ts`?
- **`schemaValid` is below 1.0.** The SUT response isn't matching `IssueClassificationSchema`; click into a failing row in the UI to see the parse error.
- **Eval times out.** `ANTHROPIC_API_KEY` not set, or rate limited. Run `pnpm exercise 0.1` to confirm the API works.
