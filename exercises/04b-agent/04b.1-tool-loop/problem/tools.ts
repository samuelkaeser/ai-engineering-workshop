import goldSet from "../../../../datasets/gold-set.json" with { type: "json" };
import type { GoldExample } from "@shared/types.ts";
import type Anthropic from "@anthropic-ai/sdk";

const issues = goldSet as GoldExample[];

export const tools: Anthropic.Tool[] = [
  {
    name: "search_issues",
    description:
      "Search the issue tracker for issues whose title or body contains the query. Returns id, title, and label.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Substring to match (case-insensitive)." },
      },
      required: ["query"],
    },
  },
  {
    name: "get_issue_details",
    description: "Get the full title and body of one issue by id.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The id of the issue (e.g. 'b3')." },
      },
      required: ["id"],
    },
  },
];

type ToolHandler = (input: Record<string, unknown>) => string;

export const handlers: Record<string, ToolHandler> = {
  search_issues: (input) => {
    const query = String(input.query ?? "").toLowerCase();
    const hits = issues.filter(
      (i) =>
        i.title.toLowerCase().includes(query) ||
        i.body.toLowerCase().includes(query)
    );
    return JSON.stringify(
      hits.map((i) => ({ id: i.id, title: i.title, label: i.label })),
      null,
      2
    );
  },

  get_issue_details: (input) => {
    const id = String(input.id ?? "");
    const hit = issues.find((i) => i.id === id);
    if (!hit) return JSON.stringify({ error: `no issue with id "${id}"` });
    return JSON.stringify(hit, null, 2);
  },
};
