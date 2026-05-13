# 00.1: Hello Claude

> **Find a partner now.** One laptop, swap typist after each exercise. You'll argue about the gold-set labels in 03.3, and that's the whole point.

A 60-second smoke test: confirm your environment is wired up.

## What you'll do

Run the file. Nothing to type.

## Steps

1. Make sure `ANTHROPIC_API_KEY` is set in `.env` (copy `.env.example` if you haven't).
2. Run:

   ```sh
   pnpm exercise 0.1
   ```

3. You should see Claude introduce itself in your terminal. If you don't, fix your `.env` before Block 2 starts.

## Heads-up: this is an agent-era workshop

You'll use a coding agent (Claude Code, Cursor, Copilot, whichever you brought) for the typing today. The interesting parts of the day are **diagnosing what an AI-generated implementation gets wrong**, deciding which evals would catch it, and curating the data those evals run on. Hand-typing 3-line API calls is not why you're here.
