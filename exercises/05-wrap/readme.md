# 05 — Where to go next

## What you just learned (the short version)

You can now:
1. Call Claude from TypeScript with forced tool-use for reliable structured output.
2. Define success criteria for an LLM feature as concrete eval metrics.
3. Write deterministic *and* LLM-as-a-Judge evals using Evalite.
4. Iterate prompts against those evals — change the prompt, watch the score, repeat.
5. (Block 4) Build an agent loop end-to-end and write the rubric that grades its prose answers — same eval discipline, different scorer.

The whole point: **stop tuning prompts on vibes**. You have a number now.

## The bigger picture: Matt's 7 phases

[Matt Pocock's *7 Phases of AI Development*](https://www.aihero.dev/my-7-phases-of-ai-development) maps the whole lifecycle: idea → research → prototype → PRD → kanban → execution → QA. **What you did today lives in execution + QA** — the eval-driven feedback loop is the QA primitive that makes the rest of the workflow worth doing.

## In-repo deep-dives (start here tonight)

We trimmed the live workshop to one Block 4 path. The other two paths are still in this repo, in `extras/`, and use exactly the same eval discipline you just learned:

- **`extras/04a-rag/`** — TF-IDF retrieve + augment. Build the retrieval primitive, then ask Claude to answer using only the retrieved articles. Re-eval with an LLM-as-Judge for *faithfulness*. Pairs with the agent loop you just wrote: same shape, different scorer.
- **`extras/04c-reliability/`** — Prompt caching (`cache_control`) and a retry/meter wrapper. The production primitives that turn a working agent into one you can ship. No new eval — but the metrics file is itself a kind of eval.

Both are runnable via `pnpm exercise 4a.1` etc., and the picker (`pnpm dev`) lists them under an "extras" group.

## Two external next-step tracks

Pick whichever fits you better:

### Track A — App-building breadth (Vercel AI SDK)
- [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop) — 52 exercises spanning streaming, multi-agent, memory, persistence, human-in-the-loop. Vercel AI SDK v5/v6.
- [AI SDK v6 Crash Course](https://www.aihero.dev/workshops/ai-sdk-v6-crash-course).

### Track B — Agentic coding (Claude Code Skills)
Matt's recent focus. Skills are reusable workflows you teach Claude Code to follow:
- [`/tdd`](https://www.aihero.dev/skills-tdd) — Red/Green/Refactor for agentic coding. Direct analogue of what we did with evals today.
- [`/triage`](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill) — turn messy issue backlogs into AI-actionable tasks.
- [`/grill-with-docs`](https://www.aihero.dev/grill-with-docs) — interview-driven design with shared vocabulary.
- [`/to-prd`](https://www.aihero.dev/skills-to-prd), [`/to-issues`](https://www.aihero.dev/skills-to-issues), [`/domain-model`](https://www.aihero.dev/skills-domain-model).
- The [AI Engineer Workshop 2026](https://www.aihero.dev/s/ai-2026) is the consolidated cohort version.

## Foundations refresher
If anything from today felt like it was happening too fast: [LLM Fundamentals](https://www.aihero.dev/llm-fundamentals) — tokens, context windows, system prompts, tools.

## Closing

> *"The key isn't to eliminate uncertainty — it's to understand and manage it through systematic evaluation."*

The classifier you tuned today moved from `0.73` to wherever you got it. That movement is the entire skill — repeatable, measurable, defensible.
