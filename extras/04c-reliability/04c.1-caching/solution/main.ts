import { client, SUT_MODEL } from "@shared/client.ts";

const LONG_CONTEXT = `You are a triage assistant.

Issue label taxonomy:
- bug: unintended behavior in shipped code.
- feature: a new capability requested by users.
- question: a usage clarification.
- docs: a documentation gap.
- perf: a measurable speed or memory issue.

Common patterns we've seen over the last 18 months:
${"This is a long, stable, repeated context block. ".repeat(200)}
`;

async function ask(question: string) {
  const t0 = Date.now();
  const response = await client.messages.create({
    model: SUT_MODEL,
    max_tokens: 256,
    system: [
      {
        type: "text",
        text: LONG_CONTEXT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: question }],
  });
  const ms = Date.now() - t0;
  const u = response.usage;
  console.log(
    `[${ms}ms] input=${u.input_tokens} created=${u.cache_creation_input_tokens ?? 0} read=${u.cache_read_input_tokens ?? 0} output=${u.output_tokens}`
  );
  const block = response.content[0];
  console.log("  →", block.type === "text" ? block.text.slice(0, 80) : "");
}

await ask("How should I label a memory regression after a dependency upgrade?");
await ask("How should I label a docs gap that came from a missing JSDoc tag?");
