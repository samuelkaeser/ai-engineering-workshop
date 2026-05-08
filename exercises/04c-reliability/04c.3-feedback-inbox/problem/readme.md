# 04c.3 — Feedback inbox

## What you'll do

The simplest possible thumbs-up/down capture. A real product UI surfaces it as a button next to each LLM response; we model it as a CLI helper that appends to `feedback.jsonl`.

The point is the *file*, not the function. Once you have a JSONL of `(prompt, response, feedback)` tuples, you have a path to:
- A future eval gold-set (your users labelled it for free).
- An error-mode catalogue (group thumbs-down by topic).
- A signal for which prompt versions to roll back.

## Steps

1. Open `main.ts`. Fill in the TODO that appends to `feedback.jsonl`.
2. Run `pnpm exercise 4c.3` a few times with different verdicts.
3. `cat feedback.jsonl` to confirm.
