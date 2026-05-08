import { client, SUT_MODEL } from "./client.ts";
import {
  IssueClassificationSchema,
  issueClassificationInputSchema,
} from "./schema.ts";
import type { IssueClassification } from "./types.ts";

export const CLASSIFY_TOOL_NAME = "classify_issue";

export const DEFAULT_SYSTEM_PROMPT = `You triage GitHub issues into one of: bug, feature, question, docs, perf.
Reply by calling the classify_issue tool.`;

export async function classifyIssue(
  title: string,
  body: string,
  systemPrompt: string = DEFAULT_SYSTEM_PROMPT
): Promise<IssueClassification> {
  const response = await client.messages.create({
    model: SUT_MODEL,
    max_tokens: 512,
    system: systemPrompt,
    tools: [
      {
        name: CLASSIFY_TOOL_NAME,
        description: "Classify a GitHub issue and return a structured result.",
        input_schema: issueClassificationInputSchema,
      },
    ],
    tool_choice: { type: "tool", name: CLASSIFY_TOOL_NAME },
    messages: [
      {
        role: "user",
        content: `Title: ${title}\n\nBody:\n${body}`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error(
      `Expected a tool_use block; got ${response.content.map((b) => b.type).join(", ")}`
    );
  }

  return IssueClassificationSchema.parse(block.input);
}
