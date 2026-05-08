import { client, SUT_MODEL } from "../../../../shared/client.ts";
import { retrieve } from "../../04a.1-retrieve/solution/main.ts";

async function answer(question: string): Promise<string> {
  const hits = retrieve(question, 3);

  const context = hits
    .map((h) => `[${h.doc.id}] ${h.doc.title}\n${h.doc.body}`)
    .join("\n\n");

  const systemPrompt = `You are a helpful triage assistant. Use ONLY the
knowledge-base articles below to answer. Cite each article you use as [id].
If the articles don't cover the question, say so.

KB:
${context}`;

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
