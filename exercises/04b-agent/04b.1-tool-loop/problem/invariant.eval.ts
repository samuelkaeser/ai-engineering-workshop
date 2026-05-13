import { evalite } from "evalite";
import { runAgent } from "./agent.ts";

// A deterministic eval that catches the parallel-tool-call bug.
//
// The Anthropic API enforces an invariant: every `tool_use` block in an
// assistant turn must have a matching `tool_result` block in the next user
// turn. The buggy loop in `agent.ts` only handles the first tool call per
// turn, so when Claude asks for two tool calls in one reply, the API
// rejects the next request with a 400.
//
// The question below is engineered to force parallel tool calls.

const PARALLEL_QUESTION =
  "Find all issues that mention timezones AND all issues that mention CSV. List them.";

// The task wraps `runAgent` in a try/catch so a thrown error becomes a
// sentinel string instead of crashing the whole eval. This is plumbing;
// you don't have to change it.
async function task(input: { question: string }) {
  try {
    return await runAgent(input.question);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return `__AGENT_THREW__: ${message}`;
  }
}

// TODO: write a scorer named `loopCompletes`.
//
// It should return:
//   - score 1 when the agent finished without throwing
//     (i.e. `output` is a normal answer string)
//   - score 0 when the agent threw
//     (i.e. `output` starts with the sentinel "__AGENT_THREW__:")
//
// Look at `exactLabel` and `schemaValid` in shared/scorers.ts for the shape
// a scorer should return. The expected shape is:
//   { name: "loopCompletes", score: 0 | 1, metadata?: { ... } }
//
// Hint: the body is one line. Check whether `output` starts with the
// sentinel. That's it.

// TODO: write a scorer named `loopCompletes`.
//
// It should return:
//   - score 1 when the agent finished without throwing
//     (i.e. `output` is a normal answer string)
//   - score 0 when the agent threw
//     (i.e. `output` starts with the sentinel "__AGENT_THREW__:")
//
// Look at `exactLabel` and `schemaValid` in shared/scorers.ts for the shape
// a scorer should return. The expected shape is:
//   { name: "loopCompletes", score: 0 | 1, metadata?: { ... } }
//
// Hint: the body is one line. Check whether `output` starts with the
// sentinel. That's it.

// async function loopCompletes({ output }: { output: string }) {
//   // your code here
// }

evalite("Agent: loop invariant", {
  data: async () => [{ input: { question: PARALLEL_QUESTION } }],
  task,
  // TODO: add `loopCompletes` to this scorers array.
  scorers: [],
});
