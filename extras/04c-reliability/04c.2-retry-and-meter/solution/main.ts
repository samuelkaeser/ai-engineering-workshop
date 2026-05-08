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

  let lastErr: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const retriable =
        err instanceof Anthropic.APIError &&
        (err.status === 429 || err.status === 529);
      if (!retriable || attempt === maxAttempts - 1) throw err;
      const wait = baseDelayMs * 2 ** attempt + Math.random() * 100;
      console.warn(`  retry ${attempt + 1}/${maxAttempts} after ${Math.round(wait)}ms (${err.status})`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
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
