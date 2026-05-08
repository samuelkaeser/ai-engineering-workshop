import { client, SUT_MODEL } from "../../../../shared/client.ts";
import { tools, handlers } from "./tools.ts";
import type Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a triage assistant for a GitHub issue tracker.
Use the tools to look up issues, then answer the user's question concisely.`;

const MAX_ITERATIONS = 6;

async function runAgent(question: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: question },
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    // TODO 1: call client.messages.create with model SUT_MODEL, max_tokens 1024,
    //         system SYSTEM_PROMPT, tools, and messages.

    // TODO 2: if response.stop_reason === "end_turn", find the last text block
    //         in response.content and return its text.

    // TODO 3: if response.stop_reason === "tool_use", iterate over the
    //         tool_use blocks in response.content. For each:
    //           - call handlers[block.name](block.input)
    //           - build a tool_result block: { type: "tool_result", tool_use_id: block.id, content: <handler output> }
    //         Then push the assistant response (response.content) and a
    //         single user message with all the tool_result blocks back into
    //         `messages`. Continue the loop.

    throw new Error("agent loop not implemented yet");
  }

  throw new Error(`Agent didn't finish in ${MAX_ITERATIONS} iterations.`);
}

const QUESTION = "How many issues do we have about timezones, and what are they?";

const answer = await runAgent(QUESTION);
console.log("Q:", QUESTION);
console.log("A:", answer);
