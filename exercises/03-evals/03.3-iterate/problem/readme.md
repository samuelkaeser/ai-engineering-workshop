# 03.3. Iterate the prompt, watch the score move

> The aha moment. Pair up. Leaderboard time.

## What you'll do

Two halves.

### Part A (10m): the data flywheel

Open `datasets/gold-set.json`. With your pair, **add exactly 1 new example** of a GitHub issue your imagination thinks would be hard for the classifier. Categories worth thinking about:

- Mixed-category issues ("the docs say X but the API does Y"). Bug or docs?
- Sarcasm ("great, another feature request that's actually a bug").
- Code-heavy with no prose.
- Non-English snippets.
- Vague one-liners.

Pick the label *you* think is correct. Disagree with your pair? Talk it out. That's the meta-lesson. One example forces you to argue about it instead of churning out three to pad the count.

Save the file, re-run `pnpm eval:dev` from 03.1. Your data is now part of the eval.

> This is Matt Pocock's [data flywheel](https://www.aihero.dev/workshops/day-5-evals-continued) made tactile. The eval is no longer someone else's eval. It's yours. Every example you add is a future regression you've insulated against.

### Part B (20m): iterate the prompt, leaderboard-style

Open `shared/classify.ts` and find `DEFAULT_SYSTEM_PROMPT`. Change it. Re-run the eval. Watch the `exactLabel` score move.

**Two tracks.** Pick the one that matches your pair's energy.

> **Easy track: tighten the definitions.**
> Append a one-sentence definition for each of the 5 categories to `DEFAULT_SYSTEM_PROMPT`. e.g. *"bug: existing behavior is wrong or crashes. feature: missing capability the user wants added. question: user is asking how to do something. docs: docs missing or wrong but code is fine. perf: code is correct but too slow or uses too much memory."* Add a tie-breaker rule for ambiguous cases ("if it could be both a bug and a feature, prefer bug"). Re-run.

> **Hard track: few-shot with *hard* examples.**
> Add 1 or 2 worked examples to the system prompt, but pick the **hardest** gold examples (the ones the baseline currently *fails*), not the easiest. Why? Including an easy example teaches memorization. Including a hard one tests whether the model can *generalize* the pattern you showed it. Look at your 03.1 results: the failing rows are your few-shot candidates. Re-run. Did it generalize? Did unrelated examples get *worse* (overfitting)?

Keep a tally. **Highest `exactLabel` accuracy at the end wins.**

## What to take away

When you nudge the prompt, the eval score nudges in response. That feedback loop, *change → measure → change*, is the whole point of this workshop. You won't tune prompts on vibes anymore. You'll tune them against numbers.
