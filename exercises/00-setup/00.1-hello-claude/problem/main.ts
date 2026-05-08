import { client, SUT_MODEL } from "@shared/client.ts";

async function main() {
  // TODO: call client.messages.create with model = SUT_MODEL,
  // max_tokens = 256, and a single user message asking Claude to
  // introduce itself in one sentence. Then print the text out of the
  // response (hint: response.content[0] has type "text" with a .text field).
}

main();
