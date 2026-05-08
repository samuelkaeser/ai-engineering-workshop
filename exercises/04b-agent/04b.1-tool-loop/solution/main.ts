import { client, SUT_MODEL } from "@shared/client.ts";
import { tools, handlers } from "../problem/tools.ts";
import type Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a triage assistant for a GitHub issue tracker.
Use the tools to look up issues, then answer the user's question concisely.`;

const MAX_ITERATIONS = 6;

async function runAgent(question: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: question },
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: SUT_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const last = [...response.content].reverse().find((b) => b.type === "text");
      if (!last || last.type !== "text") throw new Error("no text in final response");
      return last.text;
    }

    if (response.stop_reason === "tool_use") {
      const toolUses = response.content.filter((b) => b.type === "tool_use");

      const toolResults: Anthropic.ToolResultBlockParam[] = toolUses.map((block) => {
        if (block.type !== "tool_use") throw new Error("unreachable");
        const handler = handlers[block.name];
        const content = handler
          ? handler(block.input as Record<string, unknown>)
          : `error: no handler for tool "${block.name}"`;
        console.log(`  ↳ ${block.name}(${JSON.stringify(block.input)})`);
        return { type: "tool_result", tool_use_id: block.id, content };
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    throw new Error(`Unexpected stop_reason: ${response.stop_reason}`);
  }

  throw new Error(`Agent didn't finish in ${MAX_ITERATIONS} iterations.`);
}

const QUESTION = "How many issues do we have about timezones, and what are they?";

const answer = await runAgent(QUESTION);
console.log("Q:", QUESTION);
console.log("A:", answer);
