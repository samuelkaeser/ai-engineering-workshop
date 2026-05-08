# Claude / agent notes for this repo

This is a 3-hour Matt Pocock-style AI engineering workshop (TypeScript, Anthropic SDK, Evalite). Read `README.md` for the human-facing intro and `FACILITATOR.md` for the live-delivery schedule.

## Layout

```
exercises/         # student-facing exercises, grouped by block
  00-setup/        # 00.1-hello-claude
  02-structured-output/  # 02.1-tool-use-classify
  03-evals/        # 03.1, 03.2, 03.3 — the centrepiece
  04a-rag/         # facilitator-fallback: RAG (TF-IDF retrieve + augment)
  04b-agent/       # facilitator-default: agent tool-use loop + eval
  04c-reliability/ # facilitator-fallback: caching + retry/meter
  05-wrap/         # closing readme
shared/            # reusable utilities imported across exercises
  client.ts        # Anthropic client + SUT_MODEL / JUDGE_MODEL constants
  classify.ts      # the System Under Test — classifyIssue(title, body)
  schema.ts        # Zod IssueClassification schema + JSON-schema for tool_use
  scorers.ts       # exactLabel, schemaValid, llmJudgeReasoning
  types.ts         # GoldExample, IssueClassification, IssueCategory
  eval-harness.ts  # shared `data` + `task` for 03.1/03.2 evals
datasets/
  gold-set.json    # 30 hand-labelled GitHub issues (Block 3 SUT data)
  rag-corpus.json  # 10 KB articles (Block 4a only)
scripts/
  pick-exercise.ts # `pnpm dev` — interactive picker; scans exercises/ via fs
  run-exercise.ts  # `pnpm exercise <id>` — id is e.g. 0.1, 2.1, 4b.1
slides/deck.md     # Marp slides
```

## Conventions

- **Exercise dirs** are named `<id>-<slug>/` and contain `problem/` and `solution/` siblings. The picker prefers `problem/main.ts`; `*.eval.ts` files go alongside `main.ts` in 03.x and 04b.2.
- **Each exercise should have one TODO** with a binary pass criterion (Berkun rule). Anything bigger gets split.
- **Solutions are kept on the `solutions` branch and inline** under `solution/`. The inline ones are the source of truth for the picker; the branch is for live demo if everything's on fire.
- **No tests.** `vitest` was removed because nothing used it. If you want runtime verification, write a `*.eval.ts` instead — the eval harness is the test framework here.
- **Models** are pinned via `shared/client.ts` (`SUT_MODEL = claude-haiku-4-5`, `JUDGE_MODEL = claude-sonnet-4-6`). Don't hardcode model strings elsewhere.

## Common tasks

- Add an exercise → create `exercises/<block>/<id>-<slug>/{problem,solution}/main.ts`. The picker discovers it automatically; no registration needed.
- Add an eval → drop `<name>.eval.ts` next to `main.ts`; `pnpm eval:dev` discovers all `*.eval.ts` files.
- Tweak the SUT prompt → edit `DEFAULT_SYSTEM_PROMPT` in `shared/classify.ts` (this is exactly what students do in 03.3 Part B).
- Tighten the LLM judge → edit `JUDGE_RUBRIC` in `shared/scorers.ts`.

## Don't

- Don't add tests with `vitest` — the dependency was deliberately removed.
- Don't expand Block 2 or Block 4 — the time budget is fixed at 170 min and Block 3 is the centrepiece.
- Don't replace TF-IDF with embeddings in 04a — the workshop intentionally avoids a second API provider.
