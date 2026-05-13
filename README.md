# MattPocockVIS: AI Engineer Workshop (CS Edition)

A 2-hour TypeScript workshop on Matt Pocock-style AI engineering, built around the eval-driven iteration loop. Anchored in [aihero.dev](https://www.aihero.dev) material: *Three Types of Evals*, *Your App Is Only As Good As Its Evals*, and Days 4-5 of the AI workshop.

## When you sit down

You walked in with nothing installed. Good — that's the assumption. Run these four commands first. ~10–15 minutes, mostly the `better-sqlite3` rebuild.

1. `pnpm install`
2. `pnpm rebuild better-sqlite3 && pnpm approve-builds`
3. `cp .env.example .env` — paste your `ANTHROPIC_API_KEY` (grab one from console.anthropic.com if you don't have it yet)
4. `pnpm exercise 0.1` — you should see a Claude response

If step 4 errors, flag a facilitator. From there, the workshop is the parts that aren't typing — you'll point a coding agent at the TODOs and spend your attention on what evals catch.

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn/bun)
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

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

## Layout

- `exercises/`: the workshop arc (Blocks 0, 2, 3, 4b, 5).
- `extras/`: after-workshop deep-dives (`04a-rag/`, `04c-reliability/`). Linked from Block 5; not run live.
- `shared/`: reusable utilities. Imported as `@shared/*` from any exercise.

## Next steps after this workshop

- [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop): 52 exercises with Vercel AI SDK
- Matt's Claude Code Skills posts: [`/tdd`](https://www.aihero.dev/skills-tdd), [`/triage`](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill)
- [The AI Engineer Roadmap](https://www.aihero.dev/ai-engineer-roadmap)
