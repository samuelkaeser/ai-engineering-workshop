import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and fill it in."
  );
}

export const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SUT_MODEL = "claude-haiku-4-5";
export const JUDGE_MODEL = "claude-sonnet-4-6";
