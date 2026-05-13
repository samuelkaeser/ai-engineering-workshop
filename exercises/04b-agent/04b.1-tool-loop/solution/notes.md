# 04b.1: Facilitator notes

## File layout

- `problem/agent.ts` — contains the buggy `runAgent`. The bug lives here.
- `problem/main.ts` — two-line harness that imports `runAgent` and calls it. Students don't edit this.
- `problem/invariant.eval.ts` — has a TODO scorer (`loopCompletes`). The task wraps the agent in try/catch; the scorer just inspects whether the agent threw.
- `solution/agent.ts`, `solution/main.ts`, `solution/invariant.eval.ts` — facilitator reference.

## The planted bug (default)

The loop **handles only the first `tool_use` block** per turn:

```ts
const block = response.content.find((b) => b.type === "tool_use");
// ... single tool_result
messages.push({ role: "user", content: [toolResult] });
```

When the model emits two tool calls in one turn (very common: "find X AND Y" prompts it to do them in parallel), the second `tool_use` is dropped on the floor. There is no matching `tool_result` for it.

What students will see (verified empirically with Haiku 4.5 + the seeded "timezones AND CSV" question, 3/3 runs):

- The first iteration prints one `↳ search_issues({"query":"timezones"})` (or `"csv"`) trace.
- The second iteration **400s** with: *"`tool_use` ids were found without `tool_result` blocks immediately after"*. Anthropic refuses to continue because the assistant turn we pushed contains a `tool_use` block (the CSV / second search) for which we never sent a matching `tool_result`.
- The error message names the bug explicitly. Diagnosis is fast (10-30s); the time goes to "what eval would have caught this in CI?". That's the bridge into 04b.2.

A weaker / older model might instead recover by silently dropping the missed search and continuing, producing a partial-but-plausible answer. If you ever see that, point it out as the silent version of the same defect: same root cause, scarier failure mode.

The correct version is in `solution/agent.ts`:

```ts
const toolUses = response.content.filter((b) => b.type === "tool_use");
const toolResults = toolUses.map((block) => /* ... */);
messages.push({ role: "user", content: toolResults });
```

## Which eval catches it

Two distinct flavors, both legitimate. Block 4 covers both:

1. **Deterministic invariant (04b.1, this exercise).** The agent throws a 400 from Anthropic when the tool_use/tool_result counts don't match. Wrap `runAgent` in a try/catch, score 1 if it returned, 0 if it threw. Cheap. 100% catch rate for this bug. Mirrors the `schemaValid` shape from 03.1.
2. **LLM-as-a-judge (04b.2).** Grades the agent's final answer against the question. Catches *quality* regressions a deterministic invariant doesn't (partial answers, hallucinated content, lazy summaries). Bridges to "what scorer do you reach for when you don't know the bug yet?"

The exercise sequence is intentional: write the cheap invariant first (closes the predict-then-write loop), then write the judge (generalises to bugs you haven't seen yet). In real engineering you ship both.

## Cohort rotation: alternative bugs

If you've run the workshop before and want to keep things fresh:

1. **Return the FIRST text block instead of the LAST.** Change `[...response.content].reverse().find(...)` to `response.content.find(...)`. The agent often emits a preamble ("Let me check the issues...") followed by the real answer. Returning the first text gives students the preamble. Visible, harmless, easy to diagnose.
2. **Cap iterations at 2 instead of 6.** Two-turn questions silently hit the iteration cap and throw. Diagnoses well; trains "what does the cap protect you from?" instinct.
3. **Forget `messages.push({ role: "assistant", content: response.content })`.** API 400s on the next iteration because there's no preceding assistant turn to attach the `tool_result` to. Loud failure; quick to spot in the stack trace.

Pick one per cohort. The default (parallel-tool-call drop) is the most pedagogically rich because it ties directly into 04b.2's judge rubric.

## If the bug doesn't surface in the room

Haiku occasionally issues the two searches sequentially across two turns instead of in parallel. If that happens, rephrase the seeded question to push parallelism harder, e.g. `"In one go, list every issue about timezones AND every issue about CSV."` Or escalate to a three-topic version (`timezones, CSV, dark mode`).
