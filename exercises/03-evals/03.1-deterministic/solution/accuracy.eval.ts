import { evalite } from "evalite";
import { classifyTask, goldSetData } from "@shared/eval-harness.ts";
import {
  exactLabel,
  schemaValid,
} from "@shared/scorers.ts";

evalite("Issue classifier — accuracy", {
  data: goldSetData,
  task: classifyTask,
  scorers: [exactLabel, schemaValid],
});
