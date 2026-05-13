# MattPocockVIS: AI Engineer Workshop (CS Edition)

A 3-hour TypeScript workshop on Matt Pocock-style AI engineering, built around the eval-driven iteration loop. Anchored in [aihero.dev](https://www.aihero.dev) material: *Three Types of Evals*, *Your App Is Only As Good As Its Evals*, and Days 4-5 of the AI workshop.

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn/bun)
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

## Required ≥24 hours before the workshop

The on-site Block 0 is only 9 minutes. Do these the night before. The `better-sqlite3` rebuild is the single most likely thing to derail you.

1. `pnpm install`
2. `pnpm rebuild better-sqlite3 && pnpm approve-builds`
3. `cp .env.example .env` and paste your `ANTHROPIC_API_KEY`
4. Verify: `pnpm exercise 0.1` prints a Claude response
5. Have a coding agent ready (Claude Code, Cursor, Copilot, whichever you already use). You won't hand-type exercise code on the day; you'll diagnose what AI-generated code gets wrong and decide what evals catch it.

If step 4 fails, fix it before you arrive.

## Running exercises

Interactive picker:

```sh
pnpm dev
```

Or jump straight to one:

```sh
pnpm exercise 0.1
pnpm exercise 2.1
pnpm exercise 3.1
```

## Running evals

```sh
pnpm eval:dev
```

Opens the evalite UI at [http://localhost:3006](http://localhost:3006).

## Schedule

| Block | Topic | Time |
|---|---|---|
| 0 | Setup + audience calibration + form pairs | 9m |
| 1 | Framing: evals are TDD for LLM apps | 6m |
| 2 | Structured output: forced tool-use + Zod | 15m |
| - | Stretch break | 5m |
| 3 | **Evals: the centrepiece** | 80m |
| - | Stretch break | 5m |
| 4 | Agent loop (`04b-agent`) | 45m |
| 5 | Wrap | 5m |

See [`FACILITATOR.md`](./FACILITATOR.md) for facilitator notes.

## Layout

- `exercises/`: the workshop arc (Blocks 0, 2, 3, 4b, 5).
- `extras/`: after-workshop deep-dives (`04a-rag/`, `04c-reliability/`). Linked from Block 5; not run live.
- `shared/`: reusable utilities. Imported as `@shared/*` from any exercise.

## Next steps after this workshop

- [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop): 52 exercises with Vercel AI SDK
- Matt's Claude Code Skills posts: [`/tdd`](https://www.aihero.dev/skills-tdd), [`/triage`](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill)
- [The AI Engineer Roadmap](https://www.aihero.dev/ai-engineer-roadmap)
