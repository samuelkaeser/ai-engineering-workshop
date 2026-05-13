import { defineConfig, configDefaults } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Evalite runs on top of vitest, which doesn't read tsconfig `paths`.
// Mirror the `@shared/*` alias here so .eval.ts files can import shared utilities.
export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(here, "shared"),
    },
  },
  test: {
    // Skip the inline `solution/` evals. They exist as a facilitator reference,
    // not as runnable evals. Without this, students see a green dashboard before
    // they've touched a TODO (the solution evals run, inflate the aggregate, and
    // tank the "watch a number move" moment).
    exclude: [...configDefaults.exclude, "**/solution/**"],
  },
});
