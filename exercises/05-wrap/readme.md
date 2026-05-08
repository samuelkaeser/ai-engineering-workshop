# 05 — Where to go next

## What you just learned (the short version)

You can now:
1. Call Claude from TypeScript with forced tool-use for reliable structured output.
2. Define success criteria for an LLM feature as concrete eval metrics.
3. Write deterministic *and* LLM-as-a-Judge evals using Evalite.
4. Iterate prompts against those evals — change the prompt, watch the score, repeat.
5. (Block 4) Build an agent loop / RAG / reliability primitives, all of which you re-eval the same way.

The whole point: **stop tuning prompts on vibes**. You have a number now.

## The bigger picture: Matt's 7 phases

[Matt Pocock's *7 Phases of AI Development*](https://www.aihero.dev/my-7-phases-of-ai-development) maps the whole lifecycle: idea → research → prototype → PRD → kanban → execution → QA. **What you did today lives in execution + QA** — the eval-driven feedback loop is the QA primitive that makes the rest of the workflow worth doing.

## Two next-step tracks

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
