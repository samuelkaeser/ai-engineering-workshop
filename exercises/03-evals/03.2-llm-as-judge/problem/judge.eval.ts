import { evalite } from "evalite";
import goldSet from "../../../../datasets/gold-set.json" with { type: "json" };
import { classifyIssue } from "../../../../shared/classify.ts";
import { llmJudgeReasoning } from "../../../../shared/scorers.ts";
import type { GoldExample } from "../../../../shared/types.ts";

evalite("Issue classifier — reasoning quality (LLM judge)", {
  // TODO 1: data — same shape as 03.1.
  data: async () => {
    return [];
  },

  // TODO 2: task — call classifyIssue.
  task: async (input: GoldExample) => {
    throw new Error("task not implemented yet");
  },

  // TODO 3: scorers — just llmJudgeReasoning here.
  scorers: [],
});
