import { evalite } from "evalite";
import goldSet from "../../../../datasets/gold-set.json" with { type: "json" };
import { classifyIssue } from "../../../../shared/classify.ts";
import {
  exactLabel,
  schemaValid,
} from "../../../../shared/scorers.ts";
import type { GoldExample } from "../../../../shared/types.ts";

evalite("Issue classifier — accuracy", {
  data: async () =>
    (goldSet as GoldExample[]).map((ex) => ({ input: ex, expected: ex })),

  task: async (input: GoldExample) => classifyIssue(input.title, input.body),

  scorers: [exactLabel, schemaValid],
});
