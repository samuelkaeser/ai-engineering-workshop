# MattPocockVIS — AI Engineer Workshop (CS Edition)

A 3-hour TypeScript workshop on Matt Pocock-style AI engineering — built around the eval-driven iteration loop. Anchored in [aihero.dev](https://www.aihero.dev) material: *Three Types of Evals*, *Your App Is Only As Good As Its Evals*, and Days 4–5 of the AI workshop.

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn/bun)
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

## Setup

```sh
pnpm install
cp .env.example .env
# edit .env and paste your ANTHROPIC_API_KEY
```

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
| 0 | Setup + audience calibration | 5m |
| 1 | Framing: the loop you haven't written yet | 10m |
| 2 | Structured output: forced tool-use + Zod | 15m |
| — | Stretch break | 5m |
| 3 | **Evals — the centrepiece** | 80m |
| — | Stretch break | 5m |
| 4 | Agent loop (default) | 45m |
| 5 | Wrap | 5m |

See [`FACILITATOR.md`](./FACILITATOR.md) for facilitator notes.

## Next steps after this workshop

- [Poland AI/TS Workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop) — 52 exercises with Vercel AI SDK
- Matt's Claude Code Skills posts: [`/tdd`](https://www.aihero.dev/skills-tdd), [`/triage`](https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill)
- [The AI Engineer Roadmap](https://www.aihero.dev/ai-engineer-roadmap)
