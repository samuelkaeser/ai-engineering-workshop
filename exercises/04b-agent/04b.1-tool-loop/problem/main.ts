// This file just runs the agent. The agent code lives in `agent.ts`.
// The bug is in `agent.ts`. Open that file to read the loop.
import { runAgent } from "./agent.ts";

const QUESTION =
  "Find all issues that mention timezones AND all issues that mention CSV. List them.";

const answer = await runAgent(QUESTION);
console.log("Q:", QUESTION);
console.log("A:", answer);
