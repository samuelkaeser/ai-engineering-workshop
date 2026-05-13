# 02.1: Diagnose an AI-generated classifier

> *"The difference between JSON mode and forced tool-use (it matters)."*

## What we're building today

For the rest of the workshop, the System Under Test is one function:

```ts
classifyIssue(title, body) → { category, confidence, reasoning }
```

It takes a GitHub issue and returns one of five categories (`bug | feature | question | docs | perf`) plus a confidence score and one-sentence reasoning. That's the whole product surface.

The ground truth lives in `datasets/gold-set.json`: 30 real-shaped issues hand-labelled with their correct category. **You'll evaluate the classifier against that set in Block 3**, iterate the prompt in 3.3, and watch a number move.

Right now, in this exercise, you're not writing the classifier. You're reviewing one a coding agent already wrote.

## Why this matters

JSON mode tells the model "your response should be valid JSON." That's a soft hint. The model can drift, hallucinate keys, skip required fields, or wrap output in prose.

**Forced tool-use** (`tool_choice: { type: "tool", name: "..." }`) tells the model: "your only legal next move is to call this specific tool with arguments matching this schema." Server-side enforced; typed result.

`main.ts` ships with an agent-generated implementation that *uses* forced tool-use correctly. The schema is right. The `tool_choice` is right. It even finds the right block in the response. And yet it throws on every single input. Your job is to find the one line that's wrong, and to predict the eval that would have caught it.

## What you'll do (review, don't rewrite)

1. **Run it.**

   ```sh
   pnpm exercise 2.1
   ```

   You'll get a stack trace on the first sample.

2. **Read the agent's code and the stack trace together.** The bug is on the line that turns the tool's `input` into a validated object. Hint: read the comment on that line. Does it actually describe what Anthropic's SDK does, or does it describe what a *different* SDK does?

3. **Pair: name the bug in two sentences.** Which SDK was the agent thinking of? What's the one-character fix?

4. **Predict.** What kind of eval (deterministic? LLM-as-a-judge?) would catch this class of failure in CI before it ever reached prod? Hold that prediction; you'll check yourself in Block 3.1.

## The point

This is the System Under Test for the rest of the workshop. From here on, `shared/classify.ts` holds a *correct* version of this function. The buggy variant you just stared at is exactly what Block 3 is built to detect.
