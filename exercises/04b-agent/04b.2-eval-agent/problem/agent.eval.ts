import { evalite } from "evalite";
import { client, JUDGE_MODEL, SUT_MODEL } from "@shared/client.ts";
import { tools, handlers } from "../../04b.1-tool-loop/problem/tools.ts";
import type Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a triage assistant for a GitHub issue tracker.
Use the tools to look up issues, then answer the user's question concisely.`;

async function runAgent(question: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: question },
  ];
  for (let i = 0; i < 6; i++) {
    const response = await client.messages.create({
      model: SUT_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });
    if (response.stop_reason === "end_turn") {
      const last = [...response.content].reverse().find((b) => b.type === "text");
      if (last?.type === "text") return last.text;
      return "";
    }
    if (response.stop_reason !== "tool_use") {
      throw new Error(`unexpected stop_reason: ${response.stop_reason}`);
    }
    const toolUses = response.content.filter((b) => b.type === "tool_use");
    const toolResults: Anthropic.ToolResultBlockParam[] = toolUses.map((block) => {
      if (block.type !== "tool_use") throw new Error("unreachable");
      const handler = handlers[block.name];
      return {
        type: "tool_result",
        tool_use_id: block.id,
        content: handler ? handler(block.input as Record<string, unknown>) : "no handler",
      };
    });
    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: toolResults });
  }
  return "(agent did not finish)";
}

// TODO: write the rubric the judge will use to score the agent's answer.
//
// You're scoring two things together on 0–5:
//   (a) faithfulness to the corpus (the issues the agent looked at)
//   (b) whether the answer actually addresses the question
//
// Re-read JUDGE_RUBRIC in shared/scorers.ts (the one from 03.2). The shape
// is the same — describe what each score level means, and tell the judge to
// reply by calling the score_answer tool. The plumbing below already wires
// `RUBRIC` into the system prompt; you just have to design it.
const RUBRIC = ``;

async function judgeAnswer({
  output,
  expected,
}: {
  output: string;
  expected?: { question: string };
}) {
  const response = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 256,
    system: RUBRIC,
    tools: [
      {
        name: "score_answer",
        description: "Score the agent's answer on the rubric.",
        input_schema: {
          type: "object",
          properties: {
            score: { type: "integer", minimum: 0, maximum: 5 },
            justification: { type: "string" },
          },
          required: ["score", "justification"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "score_answer" },
    messages: [
      {
        role: "user",
        content: `Question: ${expected?.question ?? "(unknown)"}\n\nAnswer: ${output}`,
      },
    ],
  });
  const block = response.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    return { name: "judgeAnswer", score: 0 };
  }
  const input = block.input as { score: number; justification: string };
  return {
    name: "judgeAnswer",
    score: input.score / 5,
    metadata: { justification: input.justification, raw: input.score },
  };
}

evalite("Agent — answer quality", {
  data: async () => [
    { input: { question: "How many issues do we have about timezones?" }, expected: { question: "How many issues do we have about timezones?" } },
    { input: { question: "Are there any feature requests around CSV imports?" }, expected: { question: "Are there any feature requests around CSV imports?" } },
    { input: { question: "Summarize the perf issues in two sentences." }, expected: { question: "Summarize the perf issues in two sentences." } },
  ],
  task: async (input: { question: string }) => runAgent(input.question),
  scorers: [judgeAnswer],
});
