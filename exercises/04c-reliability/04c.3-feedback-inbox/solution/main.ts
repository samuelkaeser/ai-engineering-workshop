import { appendFileSync } from "node:fs";
import path from "node:path";

const FEEDBACK_PATH = path.resolve(process.cwd(), "feedback.jsonl");

type Verdict = "up" | "down";

function recordFeedback(args: {
  exampleId: string;
  prompt: string;
  response: string;
  verdict: Verdict;
  note?: string;
}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...args });
  appendFileSync(FEEDBACK_PATH, line + "\n", "utf8");
}

recordFeedback({
  exampleId: "b3",
  prompt: "Date picker shows the wrong day in Australia/Sydney",
  response: "category=bug, confidence=0.9, reasoning=...",
  verdict: "up",
  note: "good catch on the timezone",
});

console.log(`feedback recorded to ${FEEDBACK_PATH}`);
