import { runAgent } from "./agent.ts";

const QUESTION =
  "Find all issues that mention timezones AND all issues that mention CSV. List them.";

const answer = await runAgent(QUESTION);
console.log("Q:", QUESTION);
console.log("A:", answer);
