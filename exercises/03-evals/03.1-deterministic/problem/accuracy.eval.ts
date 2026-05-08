import { evalite } from "evalite";
import goldSet from "../../../../datasets/gold-set.json" with { type: "json" };
import { classifyIssue } from "../../../../shared/classify.ts";
import {
  exactLabel,
  schemaValid,
} from "../../../../shared/scorers.ts";
import type { GoldExample } from "../../../../shared/types.ts";

evalite("Issue classifier — accuracy", {
  // TODO 1: data should return the gold-set examples.
  //         Hint: each entry should be `{ input: GoldExample, expected: GoldExample }`.
  //         Evalite passes `input` to your task and `expected` to your scorers.
  data: async () => {
    return [];
  },

  // TODO 2: task should call classifyIssue(title, body) on the input
  //         and return the IssueClassification.
  task: async (input: GoldExample) => {
    throw new Error("task not implemented yet");
  },

  // TODO 3: pass [exactLabel, schemaValid] as scorers.
  scorers: [],
});
