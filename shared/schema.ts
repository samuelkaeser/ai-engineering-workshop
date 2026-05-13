import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ISSUE_CATEGORIES } from "./types.ts";

export const IssueClassificationSchema = z.object({
  category: z.enum(ISSUE_CATEGORIES),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().min(1),
});

const fullJsonSchema = zodToJsonSchema(IssueClassificationSchema, {
  $refStrategy: "none",
}) as Record<string, unknown>;

// Anthropic's tool input_schema wants a top-level object schema;
// strip the JSON Schema metadata zod-to-json-schema adds.
const { $schema: _s, definitions: _d, ...rest } = fullJsonSchema;

export const issueClassificationInputSchema = rest as {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
};
