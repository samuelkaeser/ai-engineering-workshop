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

// This is the rubric we landed on in the dress rehearsal after one tightening.
// First attempt asked the judge to verify faithfulness to the corpus. The judge
// never sees the corpus, so it punished specificity rather than rewarding it
// (more specific answers got lower scores). The fix is to grade only what the
// judge can see: question/answer relationship, internal coherence, and whether
// claims look grounded vs. suspiciously fabricated.
const RUBRIC = `You are grading the answer an agent gave to a question about a GitHub issue tracker.
You see only the question and the answer. You do NOT see the underlying issue tracker, so do not grade faithfulness to the corpus; grade what is visible.

Score from 0 to 5 by these criteria:
- 5 = directly answers the question. Cites specifics (issue IDs like b3 / f5 / p2, titles, counts, labels) and the specifics are internally consistent. Reads as a confident, grounded response.
- 3 = addresses the question, but partial or vague (e.g. "there are some issues about timezones" with no IDs). No internal contradictions.
- 1 = dodges the question into a generic summary, OR contains internal contradictions, OR contains suspiciously specific claims unrelated to anything an issue tracker would contain (random version numbers, exact percentages, named libraries) that read as invented.
- 0 = answers a completely different question, refuses, or is empty.

Reply by calling the score_answer tool. Do NOT add prose.`;

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

evalite("Agent: answer quality", {
  data: async () => [
    { input: { question: "How many issues do we have about timezones?" }, expected: { question: "How many issues do we have about timezones?" } },
    { input: { question: "Are there any feature requests around CSV imports?" }, expected: { question: "Are there any feature requests around CSV imports?" } },
    { input: { question: "Summarize the perf issues in two sentences." }, expected: { question: "Summarize the perf issues in two sentences." } },
  ],
  task: async (input: { question: string }) => runAgent(input.question),
  scorers: [judgeAnswer],
});
