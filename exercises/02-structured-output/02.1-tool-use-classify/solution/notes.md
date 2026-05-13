# 02.1: Facilitator notes

## The planted bug

`problem/main.ts` does forced tool-use correctly, finds the right block, and then on the final line wraps `block.input` in `JSON.parse`:

```ts
// Anthropic returns the tool input as a JSON string; parse it before validating.
return IssueClassificationSchema.parse(JSON.parse(block.input as string));
```

The comment is confidently wrong. Anthropic's SDK returns `block.input` as an **already-parsed object**, not a JSON string. OpenAI's function-calling API returns `arguments` as a JSON string; the agent conflated the two. `JSON.parse({})` stringifies the object first ("[object Object]"), then fails to parse → `SyntaxError` on every run.

Why this is the bug worth planting: cross-SDK confusion is the single most common AI mistake in 2026, and the comment makes it look defensible at first read. The fix is one delete: remove `JSON.parse(...)` and the `as string` cast.

The correct version (`solution/main.ts`, also `shared/classify.ts`):

```ts
return IssueClassificationSchema.parse(block.input);
```

## Which eval catches it

- **`schemaValid` (deterministic)**: the function throws → the eval records 0.0 → CI red. This is the demo of *why* `schemaValid` exists: in normal operation it reads 1.0 and looks pointless, but it's the canary for upstream regressions like "the agent confused two SDKs." Show it explicitly when transitioning into Block 3.1.
- **`exactLabel`**: also drops to 0 because the function throws, but for the wrong reason. Worth mentioning that schema-shape failures and category-correctness failures land in the same score column unless you separate scorers.
- **`judgeReasoning` (LLM-as-judge)**: only useful once a result exists. If the function throws, the judge never runs.

## Live-demo path into Block 3.1

If you want to show the link end-to-end:

1. Run `pnpm exercise 2.1`. Watch it throw `SyntaxError: "[object Object]" is not valid JSON`.
2. Pretend the planted version is `shared/classify.ts` for a moment (or temporarily swap the implementation). Run `pnpm eval:dev`.
3. Watch `schemaValid` go to 0 across the gold set. This is the "deterministic eval as canary" moment.
4. Delete `JSON.parse(... as string)`. Re-run. Back to 1.0.

Don't actually commit the swap. The production `shared/classify.ts` stays correct; only `exercises/02.1/problem/main.ts` ships the bug.

## Cohort rotation: alternative planted bugs

If you've delivered this before and want something fresh:

1. **Cast instead of parse**: replace `IssueClassificationSchema.parse(block.input)` with `return block.input as IssueClassification`. Combine with an inline `input_schema` that types `category` as `{ type: "string" }` (no enum) so the model occasionally invents categories like "Bug" or "performance" that downstream `exactLabel` rejects. Silent corruption rather than throw; harder to spot but lands the "schemaValid sees what TypeScript can't" lesson hard.
2. **Wrong block lookup**: use `response.content[0]` instead of `.find(b => b.type === "tool_use")`. Doesn't reliably fail on Haiku 4.5 (the model goes straight to tool_use under forced `tool_choice`), but if you rotate to a model that emits a text preamble first, this bug throws.
3. **Omit `tool_choice`**: the textbook bug. Reliable on weaker / older models; Haiku 4.5 ignores the omission ~100 % of the time and uses the tool anyway, so don't rotate to this one unless you've swapped the SUT model.

The default (`JSON.parse(block.input as string)`) is best because it surfaces every run and traces cleanly to "the agent was trained on more OpenAI than Anthropic code."
