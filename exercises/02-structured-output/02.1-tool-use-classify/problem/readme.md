# 02.1 — Forced tool-use as structured output

> *"The difference between JSON mode and forced tool-use (it matters)."*

## Why this matters

JSON mode tells the model "your response should be valid JSON." That's a soft hint. The model can drift, hallucinate keys, skip required fields, or wrap output in prose.

**Forced tool-use** (`tool_choice: { type: "tool", name: "..." }`) tells the model: "your only legal next move is to call this specific tool with arguments matching this schema." The schema is server-side enforced. It's structurally tighter than JSON mode and gives you a typed result.

We'll use it to build `classifyIssue(title, body)` — the **System Under Test** for the rest of the workshop.

## What you'll do

In `main.ts`, complete the `classifyIssue` function so it:

1. Calls `client.messages.create` with the `classify_issue` tool defined.
2. Forces the model to call that tool via `tool_choice`.
3. Pulls the `tool_use` block out of the response.
4. Validates the input with the Zod schema and returns it.

The Zod schema and the JSON Schema (for `input_schema`) are already defined in `shared/schema.ts`. The system prompt is in `shared/classify.ts` as `DEFAULT_SYSTEM_PROMPT` — we'll edit it in Block 3.

## Steps to complete

1. Open `main.ts` and find the four TODOs.
2. Run `pnpm exercise 2.1` and check the output is a valid `IssueClassification` object.
3. Try a few different issues (the constants at the bottom of the file have three pre-baked ones).

## Hints

- Anthropic's response shape: `response.content` is an array of blocks. For tool-forced calls, you want the block where `block.type === "tool_use"`. Its `input` field is the tool arguments — that's your structured output.
- TypeScript will only let you read `block.input` after you narrow `block.type === "tool_use"`.
- Validate with `IssueClassificationSchema.parse(block.input)` before returning.
