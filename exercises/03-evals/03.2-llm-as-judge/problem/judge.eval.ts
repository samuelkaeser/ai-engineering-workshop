import { evalite } from "evalite";
import { classifyTask, goldSetData } from "@shared/eval-harness.ts";
import { llmJudgeReasoning } from "@shared/scorers.ts";

evalite("Issue classifier: reasoning quality (LLM judge)", {
  data: goldSetData,
  task: classifyTask,

  // TODO: swap in `llmJudgeReasoning` from shared/scorers.ts.
  //       Read the rubric in that file first. The rubric *is* the prompt.
  scorers: [],
});
