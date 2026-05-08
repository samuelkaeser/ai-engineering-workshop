# 03.3 — Iterate the prompt, watch the score move

> The aha moment. Pair up. Leaderboard time.

## What you'll do

Two halves:

### Part A (10m) — The data flywheel: add 3 examples each

Open `datasets/gold-set.json`. Each pair, **add 3 new examples** of GitHub issues your imagination thinks would be hard for the classifier:
- Mixed-category issues ("the docs say X but the API does Y" — bug or docs?).
- Sarcasm ("great, another feature request that's actually a bug").
- Code-heavy with no prose.
- Non-English snippets.
- Vague one-liners.

Pick the label *you* think is correct. Disagree with your pair? Talk it out — that's the meta-lesson.

Save the file, re-run `pnpm eval:dev` from 03.1 — your data is now part of the eval.

> This is Matt Pocock's [data flywheel](https://www.aihero.dev/workshops/day-5-evals-continued) made tactile. The eval is no longer "the facilitator's eval" — it's yours. Every example you add is a future regression you've insulated against.

### Part B (20m) — Iterate the prompt, leaderboard-style

Open `shared/classify.ts` and find `DEFAULT_SYSTEM_PROMPT`. Change it. Re-run the eval. Watch the `exactLabel` score move.

**Two tracks:**
- **Easy:** tighten the system prompt. Add explicit category definitions. Add a tie-breaker rule ("if it could be both a bug and a feature, prefer bug"). Add output formatting rules. Re-run.
- **Hard:** add a *few-shot example* to the prompt. Pick one of the trickier examples from the gold set and include it as a worked example in the system prompt. Re-run. Did it generalize? Did it overfit (other examples got worse)?

Keep a tally. **Highest `exactLabel` accuracy at the end wins.**

## Rules

- No editing `gold-set.json` *during* the iterate round (that'd be cheating — though if you want to spend more time on Part A's flywheel, that's encouraged).
- No editing the scorers.
- Save your best prompt before the round ends — the facilitator will collect the top 2–3 for group discussion.

## What to take away

When you nudge the prompt, the eval score nudges in response. That feedback loop — *change → measure → change* — is the whole point of this workshop. You won't tune prompts on vibes anymore; you'll tune them against numbers.
