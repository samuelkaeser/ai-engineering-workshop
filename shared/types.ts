export const ISSUE_CATEGORIES = [
  "bug",
  "feature",
  "question",
  "docs",
  "perf",
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export interface GoldExample {
  id: string;
  title: string;
  body: string;
  label: IssueCategory;
}

export interface IssueClassification {
  category: IssueCategory;
  confidence: number;
  reasoning: string;
}
