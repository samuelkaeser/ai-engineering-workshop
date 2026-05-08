import { evalite } from "evalite";
import { classifyTask, goldSetData } from "../../../../shared/eval-harness.ts";
import { llmJudgeReasoning } from "../../../../shared/scorers.ts";

evalite("Issue classifier — reasoning quality (LLM judge)", {
  data: goldSetData,
  task: classifyTask,
  scorers: [llmJudgeReasoning],
});
