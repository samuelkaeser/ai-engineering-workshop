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

# Block 0 — Setup (5m)

Two questions, hands up:

1. Who's called Claude's API from code before?
2. Who's written an eval before?

---

# Block 1 — The loop you haven't written yet (10m)

You've built AI toys. They worked on three examples.
Then real users broke them.

This is the **Vibes-Only Trough**.

---

# Block 1 — Vibes Trough → Data-Driven Slope

The way out is the same as TDD's way out:

> **Change → measure → change.**

For LLM apps that loop is called **evals**.

Evals are **TDD for LLM apps.**

---

# Block 2 — Forced tool-use (15m)

> JSON mode says *"please be JSON"*.
> Forced tool-use says *"the only legal next move is this schema"*.

```ts
tool_choice: { type: "tool", name: "classify_issue" }
```

You build `classifyIssue(title, body)` — the System Under Test for the rest of the day.

---

# Break — 5m

---

# Block 3 — Evals (80m)

The centrepiece. Pair up.

We use **[Evalite](https://www.evalite.dev)** — Matt's own TypeScript-native eval harness.

Three types of evals (Matt's taxonomy):

1. **Deterministic** — pass/fail. (`exactLabel`, `schemaValid`)
2. **LLM-as-a-Judge** — second model grades the first.
3. **Human Feedback** — thumbs up/down.

---

# Block 3.1 — Deterministic (22m)

`exactLabel` + `schemaValid` over 30 hand-labelled GitHub issues.

Run `pnpm eval:dev` → UI at `localhost:3006`.

You'll land somewhere around **0.73–0.83**.

That's your baseline. Remember it.

---

# Block 3.2 — LLM-as-a-Judge (22m)

What model should judge?

Not the one being judged.

- **SUT**: `claude-haiku-4-5`
- **Judge**: `claude-sonnet-4-6`

Different family. Avoids self-evaluation bias.

The rubric *is* the prompt. Judge prompts are themselves a system you have to design.

---

# Block 3.3a — Data flywheel (10m)

Add **3 examples each** to the gold set.
Tricky ones. Mixed-category. Sarcasm. Code-heavy.

Now the eval is yours, not the facilitator's.

---

# Block 3.3b — Iterate, leaderboard-style (21m)

Edit `DEFAULT_SYSTEM_PROMPT`. Re-run. Watch the score.

- **Easy**: tighten the prompt. Add definitions, tie-breakers.
- **Hard**: add a few-shot example from the gold set.

Highest `exactLabel` wins.

Top 2–3 prompts → group discussion.

---

# Break — 5m

---

# Block 4 — Tool calls inside a loop (45m)

> *The core primitive of every agent framework.*

```ts
while (true) {
  const r = await client.messages.create({ model, tools, messages });
  if (r.stop_reason === "end_turn") return text(r);
  // run each tool_use, feed tool_results back, loop.
}
```

This is what every agent library wraps.

---

# Block 4 — Then re-eval

The agent answers free-form prose. `exactLabel` doesn't apply.

**LLM-as-a-Judge**, with a "is this faithful to the corpus?" rubric.

Same eval discipline, different scorer.

---

# Block 5 — Where this sits

Matt Pocock's **7 Phases of AI Development**:

> idea → research → prototype → PRD → kanban → **execution** → **QA**

What you did today lives in execution + QA.
The eval-driven feedback loop is what makes the rest worth doing.

---

# Block 5 — Two tracks from here

**App-building** (this track, going deeper):
- [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop) — 52 exercises

**Agentic coding** (Matt's current focus):
- [`/tdd` skill](https://www.aihero.dev/skills-tdd)
- [`/triage` skill](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill)
- [AI Engineer 2026](https://www.aihero.dev/s/ai-2026)

---

# Closing

> *"The key isn't to eliminate uncertainty — it's to understand and manage it through systematic evaluation."*

Stop tuning prompts on vibes. You have a number now.

Thanks. 🦦
