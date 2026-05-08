# Facilitator notes

3-hour slot, ~25 attendees, CS students with some Claude Code / AI-engineering exposure.

## Schedule (planned 2h50m + 10m slack)

| | Block | Time | Notes |
|---|---|---|---|
| 0:00 | Setup + calibration | 5m | Two show-of-hands: "called Claude API before?" / "written an eval before?" |
| 0:05 | Block 1 — framing | 10m | Vibes Trough → Data-Driven Slope. Land "evals are TDD for LLM apps." |
| 0:15 | Block 2 — structured output (02.1 only) | 15m | Forced tool-use + Zod. Fast pace; this is plumbing. |
| 0:30 | Stretch break | 5m | |
| 0:35 | **Block 3 — evals (centrepiece)** | 80m | See below. Recovered 5m from Block 2 goes here. |
| 1:55 | Stretch break | 5m | |
| 2:00 | Block 4 — agent loop | 45m | Default 4b. See "Block 4 choice" below. |
| 2:45 | Block 5 — wrap | 5m | Two next-step tracks. |
| 2:50 | Slack | 10m | Spillover, Q&A, individual help. |

## Block 3 internal timing (80m total)

- 03.1 deterministic: 22m
- 03.2 LLM-as-judge: 22m
- 03.3 (Part A flywheel): 10m — pairs add 3 examples each
- 03.3 (Part B leaderboard): 21m — change prompt, re-run, top score wins
- Debrief / read top 2–3 prompts aloud: 5m (use the recovered time here — per Berkun, *showing one student's solution is more instructive than showing yours*)

## Block 4 choice (live decision)

> **Default to 4b (agent loop) unless the room actively asks otherwise.** RAG (4a) and reliability (4c) are listed as alternatives but only switch if **60%+ vote** for one of them. This removes the mid-workshop decision load — you don't have to read the room under pressure; you have a default and a clear bar to deviate from it.

- **Default → 4b agent loop.** The tool-use loop is the core primitive of every agent framework — highest-leverage thing to internalize.
- **Curious / library-leaning** → 4a RAG (TF-IDF retrieval + augment). Switch if 60%+ vote.
- **Production-leaning** → 4c Reliability (caching + retries + meter). Switch if 60%+ vote.

If running short, demo Block 4 from the `solutions` branch instead of having students code.

## Fallback expected eval scores (Haiku 4.5 SUT, default prompt)

These are rough sanity numbers, not guarantees — use to reassure students whose runs land in the same range.

| Eval | Expected score | Notes |
|---|---|---|
| `exactLabel` baseline | 0.73–0.83 | Tricky examples (b5, f5, p5, p6) tend to miss. |
| `schemaValid` | 1.0 | Always — forced tool-use enforces schema. |
| `judgeReasoning` | 0.55–0.75 | Lower because the rubric demands specifics. |
| After easy prompt iteration | +0.05–0.10 on `exactLabel` | Adding clear category definitions usually helps. |
| After few-shot iteration | +0.05 to -0.10 | Risk of overfitting to the chosen example. |

If a student's score is dramatically worse, check: did they remove `tool_choice`? Are they using a different model?

## Evalite troubleshooting

- **`Could not locate the bindings file`** for `better-sqlite3` → run `pnpm rebuild better-sqlite3` and `pnpm approve-builds`.
- **UI doesn't open** → check `localhost:3006` (not 5173). Some dev environments need a port forward.
- **No evals discovered** → confirm filenames end in `.eval.ts` and you're running from repo root.

## Discussion prompts

**Block 1**: "Show of hands — who's shipped an LLM feature that worked great in dev and broke in prod?"
**Block 3.2**: "What's the difference between a judge prompt and any other prompt?" (Answer: nothing.)
**Block 3.3**: After leaderboard, ask the top pair to read their prompt aloud. Then ask: "What would you eval *next* given this prompt?"
**Block 4b**: "Where in this loop would you add streaming?" / "How do you eval an agent that does different work each run?"

## Backup plan if everything is on fire

1. The `solutions` branch has every TODO filled in. `git checkout solutions` and demo from there.
2. If Anthropic is down: walk through the gold set and the `evalite` UI screenshots — the framing and discussion still work even without live runs.
3. If evalite fails: the deterministic eval can be reproduced as a plain script (`for ex of goldSet: classifyIssue(...) compare`). Use this as the demo of "what evals really are under the hood."

## Next-step pointers (Block 5)

- **App-building track**: [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop) — 52 exercises, AI SDK v5/v6.
- **Agentic-coding track**: Matt's Skills posts ([`/tdd`](https://www.aihero.dev/skills-tdd), [`/triage`](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill), [`/grill-with-docs`](https://www.aihero.dev/grill-with-docs)) and the [AI 2026 Workshop](https://www.aihero.dev/s/ai-2026).
- **Foundations refresher**: [LLM Fundamentals](https://www.aihero.dev/llm-fundamentals).
