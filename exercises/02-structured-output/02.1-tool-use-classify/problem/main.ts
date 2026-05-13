// REVIEW THIS:
// An agent generated this `classifyIssue` for us. It runs, but it throws on
// every input we give it. Read the code, run it once, and pair up to answer:
//   1. What's the bug? What mistake did the agent make about Anthropic's
//      response shape?
//   2. What kind of eval (deterministic? LLM-as-judge?) would catch this in
//      CI before anyone shipped it? You'll meet that eval in Block 3.1.
import { client, SUT_MODEL } from "@shared/client.ts";
import {
  IssueClassificationSchema,
  issueClassificationInputSchema,
} from "@shared/schema.ts";
import type { IssueClassification } from "@shared/types.ts";

const TOOL_NAME = "classify_issue";

const SYSTEM_PROMPT = `You triage GitHub issues into one of: bug, feature, question, docs, perf.
Reply by calling the classify_issue tool.`;

async function classifyIssue(
  title: string,
  body: string
): Promise<IssueClassification> {
  const response = await client.messages.create({
    model: SUT_MODEL,
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    tools: [
      {
        name: TOOL_NAME,
        description: "Classify a GitHub issue and return a structured result.",
        input_schema: issueClassificationInputSchema,
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
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

  // Anthropic returns the tool input as a JSON string; parse it before validating.
  return IssueClassificationSchema.parse(JSON.parse(block.input as string));
}

const SAMPLES = [
  {
    title: "App crashes on M1 macs after upgrading to v2.3",
    body: "Steps: install v2.3, run `app start`. Stack trace below. Was working on v2.2.",
  },
  {
    title: "Could we add a dark-mode toggle in the settings page?",
    body: "Light mode is hard to read at night. Would be great to have a toggle.",
  },
  {
    title: "How do I configure a custom retry policy?",
    body: "I see a `retry` option in the docs but it's not clear how the backoff works.",
  },
];

async function main() {
  for (const s of SAMPLES) {
    const result = await classifyIssue(s.title, s.body);
    console.log(`▸ ${s.title}\n  → ${result.category}  (${result.confidence})  ${result.reasoning}\n`);
  }
}

main();
