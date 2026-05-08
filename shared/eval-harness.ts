import goldSet from "../datasets/gold-set.json" with { type: "json" };
import { classifyIssue } from "./classify.ts";
import type { GoldExample } from "./types.ts";

export const goldSetData = async () =>
  (goldSet as GoldExample[]).map((ex) => ({ input: ex, expected: ex }));

export const classifyTask = async (input: GoldExample) =>
  classifyIssue(input.title, input.body);
