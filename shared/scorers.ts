import { client, JUDGE_MODEL } from "./client.ts";
import { IssueClassificationSchema } from "./schema.ts";
import type { GoldExample, IssueClassification } from "./types.ts";

// Evalite scorer signature: ({ input, output, expected }) -> Score
// We accept Promise-returning scorers so the LLM judge can be async.

type ScoreArgs = {
  output: IssueClassification;
  expected?: GoldExample;
};

export const exactLabel = ({ output, expected }: ScoreArgs) => ({
  name: "exactLabel",
  score: expected && output.category === expected.label ? 1 : 0,
});

export const schemaValid = ({ output }: ScoreArgs) => {
  const result = IssueClassificationSchema.safeParse(output);
  return {
    name: "schemaValid",
    score: result.success ? 1 : 0,
    metadata: result.success ? undefined : { error: result.error.message },
  };
};

const JUDGE_RUBRIC = `You are grading the *reasoning* a junior engineer wrote when triaging a GitHub issue.
Score from 0 to 5 by these criteria:
- 5 = specific, references concrete details from the issue body, names the signal that decided the category.
- 3 = generic but defensible ("the user is asking how to do something").
- 1 = vague or template-y ("this looks like a bug").
- 0 = hallucinated content not in the issue.

Reply by calling the score_reasoning tool. Do NOT add prose.`;

export const llmJudgeReasoning = async ({ output, expected }: ScoreArgs) => {
  if (!expected) {
    return { name: "judgeReasoning", score: 0, metadata: { error: "no expected" } };
  }
  const response = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 256,
    system: JUDGE_RUBRIC,
    tools: [
      {
        name: "score_reasoning",
        description: "Score the reasoning between 0 and 5.",
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
    tool_choice: { type: "tool", name: "score_reasoning" },
    messages: [
      {
        role: "user",
        content: `Issue title: ${expected.title}
Issue body: ${expected.body}

Predicted category: ${output.category}
Predicted reasoning: ${output.reasoning}`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    return { name: "judgeReasoning", score: 0, metadata: { error: "no tool_use block" } };
  }

  const input = block.input as { score: number; justification: string };
  return {
    name: "judgeReasoning",
    score: input.score / 5,
    metadata: { justification: input.justification, raw: input.score },
  };
};
