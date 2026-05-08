import { appendFileSync } from "node:fs";
import path from "node:path";
import { client, SUT_MODEL } from "@shared/client.ts";
import Anthropic from "@anthropic-ai/sdk";

const METRICS_PATH = path.resolve(process.cwd(), "metrics.jsonl");

function logCall(record: Record<string, unknown>) {
  appendFileSync(METRICS_PATH, JSON.stringify(record) + "\n", "utf8");
}

async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { maxAttempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const maxAttempts = opts.maxAttempts ?? 4;
  const baseDelayMs = opts.baseDelayMs ?? 200;

  // TODO: try fn(). If it throws an Anthropic.APIError with status 429 or 529,
  //       wait baseDelayMs * 2^attempt (with a small random jitter), and retry.
  //       Bail out after maxAttempts. Re-throw any non-retriable error
  //       immediately.

  return fn(); // <- replace this with the loop above
}

async function call(question: string) {
  const t0 = Date.now();
  const response = await withRetry(() =>
    client.messages.create({
      model: SUT_MODEL,
      max_tokens: 256,
      messages: [{ role: "user", content: question }],
    })
  );
  const ms = Date.now() - t0;
  logCall({
    ts: new Date().toISOString(),
    model: SUT_MODEL,
    latency_ms: ms,
    usage: response.usage,
  });
  const block = response.content[0];
  console.log("→", block.type === "text" ? block.text : "(no text)");
}

await call("In one sentence, what makes evals different from unit tests?");
console.log(`metrics written to ${METRICS_PATH}`);
