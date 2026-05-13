import { evalite } from "evalite";
import { runAgent } from "./agent.ts";

const PARALLEL_QUESTION =
  "Find all issues that mention timezones AND all issues that mention CSV. List them.";

async function task(input: { question: string }) {
  try {
    return await runAgent(input.question);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return `__AGENT_THREW__: ${message}`;
  }
}

async function loopCompletes({ output }: { output: string }) {
  const completed = !output.startsWith("__AGENT_THREW__:");
  return { name: "loopCompletes", score: completed ? 1 : 0 };
}

evalite("Agent: loop invariant", {
  data: async () => [{ input: { question: PARALLEL_QUESTION } }],
  task,
  scorers: [loopCompletes],
});
