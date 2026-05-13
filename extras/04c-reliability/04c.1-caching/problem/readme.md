# 04c.1: Prompt caching

> Block 4c is a facilitator fallback. The default Block 4 is the agent loop (4b).

## Why this matters

Anthropic's [prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) gives you 90% off on cached input tokens. For long, stable system prompts (RAG context, large schemas, lots of few-shot examples) that's the difference between a viable product and a per-request cost crisis.

## What you'll do

`main.ts` runs the same long-prompted call twice. The second call should hit the cache. Your TODO is just to read `usage.cache_read_input_tokens` from each response and print the savings.

## Steps

1. Open `main.ts`. The first call has `cache_control: { type: "ephemeral" }` already set on the long context block.
2. Fill in the TODO to print `usage.cache_creation_input_tokens` (first call) and `usage.cache_read_input_tokens` (second call).
3. Run `pnpm exercise 4c.1`. The second run should show ~all your cached tokens being read, not re-processed.

## What to take away

Caching is a single field, but only if your system prompt is *stable*. The moment you append a unique user-specific string to the system prompt, the cache evaporates. So: structure prompts with stable prefixes, variable suffixes.
