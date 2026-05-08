---
marp: true
theme: default
paginate: true
---

# Matt Pocock-style AI Engineering

## A 3-hour workshop for CS students

*"Your app is only as good as its evals."*
— Matt Pocock, [aihero.dev](https://www.aihero.dev)

---

# Block 0 — Setup (9m)

Two questions, hands up:

1. Who's called Claude's API from code before?
2. Who's written an eval before?

Then: **find a partner.** One laptop, swap typist each exercise.

---

# Block 1 — Vibes Trough → Data-Driven Slope (6m)

You've built AI toys. They worked on three examples.
Then real users broke them.

The way out is the same as TDD's:

> **Change → measure → change.**

For LLM apps that loop is called **evals**.

> *Evals are TDD for LLM apps.*

---

# Block 3 — Three types of evals (Matt's taxonomy)

1. **Deterministic** — pass/fail. (`exactLabel`, `schemaValid`)
2. **LLM-as-a-Judge** — second model grades the first.
3. **Human Feedback** — thumbs up/down (we won't get to this today).

Mechanics live in each `readme.md`. The slides are framing.

---

# Block 4 — The agent loop

The core primitive of every agent framework:

```
[user msg] → [API call] → stop_reason?
                          ├ end_turn → return text
                          └ tool_use → execute tools
                                       → append tool_results
                                       → loop
```

Same eval discipline. The agent answers prose, so `exactLabel` doesn't apply — use **LLM-as-a-Judge** with a "faithful to the corpus?" rubric.

---

# What we are NOT covering today

Out of scope, on purpose:

- Streaming
- Memory / persistence
- Multi-agent orchestration
- Fine-tuning
- Embeddings-based RAG (we use TF-IDF in `extras/`)
- Prompt injection / red-teaming

Block 5 points you at where each of these lives.

---

# Block 5 — Where this sits

Matt's **7 Phases of AI Development**:

> idea → research → prototype → PRD → kanban → **execution** → **QA**

What you did today lives in execution + QA. The eval-driven loop is what makes the rest worth doing.

**After-workshop deep-dives in this repo:**
- `extras/04a-rag/` — TF-IDF retrieve + augment.
- `extras/04c-reliability/` — caching + retry/meter.

**Two external tracks:**
- App-building → [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop) (52 exercises).
- Agentic coding → Matt's Skills ([`/tdd`](https://www.aihero.dev/skills-tdd), [`/triage`](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill)) and [AI Engineer 2026](https://www.aihero.dev/s/ai-2026).

---

# Closing

> *"The key isn't to eliminate uncertainty — it's to understand and manage it through systematic evaluation."*

Stop tuning prompts on vibes. You have a number now.

Thanks. 🦦
