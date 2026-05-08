import { client, SUT_MODEL } from "../../../../shared/client.ts";

// Demo only — not student-edited. Run it once to see streaming in action.
async function main() {
  const stream = client.messages.stream({
    model: SUT_MODEL,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content:
          "Explain in 4 short paragraphs why eval-driven LLM development beats vibes.",
      },
    ],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
    }
  }
  process.stdout.write("\n");

  const final = await stream.finalMessage();
  console.log(`\n[stop_reason=${final.stop_reason} input_tokens=${final.usage.input_tokens} output_tokens=${final.usage.output_tokens}]`);
}

main();
