# 04c.2: Retries and metering

## What you'll do

Two things you'll always need in production:
1. **Retries with exponential backoff** for transient failures (429s, 529 overloads).
2. **Metering**: write each call's token usage and latency to a JSONL file you can grep.

## Steps

1. Open `main.ts`. Fill in the `withRetry` TODO (exponential backoff on Anthropic errors).
2. The metering function `logCall` is pre-written; the SUT call is wrapped with both.
3. Run `pnpm exercise 4c.2`. Look at `metrics.jsonl` in the repo root.
