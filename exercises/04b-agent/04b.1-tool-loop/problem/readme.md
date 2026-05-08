# 04b.1 — The agent while-loop

> *"Tool calls inside a loop — the core primitive of every agent framework."*

## Why this matters

Frameworks like LangChain, AI SDK, Mastra, and Pydantic-AI all wrap the same primitive: a while-loop that handles `tool_use` blocks until the model decides it's done.

If you've never written it from scratch, agents feel like magic. After 15 minutes of pair-coding, they won't.

## What you'll do

You're given two tools that operate over our gold-set issue corpus:
- `search_issues(query)` — returns matching issues by simple substring match.
- `get_issue_details(id)` — returns the full body of one issue.

Your job: write the loop in `loop.ts` that lets Claude call these tools to answer a user question like *"How many bug reports do we have about timezones?"*.

## The loop in pseudocode

```
messages = [user_question]
while true:
  response = client.messages.create({ model, tools, messages })
  if response.stop_reason === "end_turn": break
  if response.stop_reason === "tool_use":
    tool_uses = blocks where type === "tool_use"
    tool_results = run each handler with block.input, return { type, tool_use_id, content }
    messages.push(assistant: response.content)
    messages.push(user: tool_results)
return final_text
```

## Steps

1. Open `loop.ts`. Read `tools.ts` first — the schemas and handlers are pre-written.
2. Fill in the TODOs in `loop.ts`.
3. Run `pnpm exercise 4b.1`. The agent should answer the seeded question by calling `search_issues` with a sensible query, possibly `get_issue_details` on a few results, and then summarising.
4. Try changing the question at the bottom of `main.ts`.

## Hints

- A response can have multiple `tool_use` blocks in one turn. Handle them all in one iteration of the loop.
- Each tool result block needs `type: "tool_result"`, `tool_use_id` (from the matching `tool_use` block), and `content` (a string).
- When you push the assistant response back into `messages`, push the *whole* `response.content` (which contains both text and tool_use blocks). Don't try to filter.
- Cap the loop at ~6 iterations so a buggy model can't burn your budget.
