import { client, SUT_MODEL } from "@shared/client.ts";

async function main() {
  const response = await client.messages.create({
    model: SUT_MODEL,
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: "Introduce yourself in one sentence.",
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error(`Expected text block, got ${block.type}`);
  }
  console.log(block.text);
}

main();
