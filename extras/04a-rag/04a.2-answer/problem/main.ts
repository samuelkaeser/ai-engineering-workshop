import { client, SUT_MODEL } from "@shared/client.ts";
import { retrieve } from "../../04a.1-retrieve/solution/main.ts";

async function answer(question: string): Promise<string> {
  const hits = retrieve(question, 3);

  // TODO: build a system prompt that includes the retrieved KB articles.
  //       Format each as `[id] title\nbody`, separated by blank lines.
  //       Tell Claude to cite the [id]s it uses.
  const systemPrompt = "TODO: build me";

  const response = await client.messages.create({
    model: SUT_MODEL,
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: question }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("expected text response");
  return block.text;
}

const QUESTION = "Why is my CLI cold-start so slow?";
console.log("Q:", QUESTION);
console.log("A:", await answer(QUESTION));
