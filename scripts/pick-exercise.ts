import { select } from "@clack/prompts";
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const exercisesDir = path.resolve(here, "..", "exercises");

type Exercise = { id: string; label: string; dir: string };

function collect(): Exercise[] {
  const out: Exercise[] = [];
  for (const block of readdirSync(exercisesDir, { withFileTypes: true })) {
    if (!block.isDirectory()) continue;
    const blockDir = path.join(exercisesDir, block.name);
    for (const ex of readdirSync(blockDir, { withFileTypes: true })) {
      if (!ex.isDirectory()) continue;
      const m = ex.name.match(/^([\d.a-z]+)-(.+)$/);
      if (!m) continue;
      const id = m[1];
      const label = `${id}  ${m[2].replace(/-/g, " ")}`;
      out.push({ id, label, dir: path.join(blockDir, ex.name) });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

const exercises = collect();
if (exercises.length === 0) {
  console.error("No exercises found.");
  process.exit(1);
}

const choice = await select({
  message: "Pick an exercise",
  options: exercises.map((e) => ({ value: e.id, label: e.label })),
});

if (typeof choice !== "string") process.exit(0);

const ex = exercises.find((e) => e.id === choice)!;
const problemMain = path.join(ex.dir, "problem", "main.ts");
const solutionMain = path.join(ex.dir, "solution", "main.ts");
const target = existsSync(problemMain) ? problemMain : solutionMain;

if (!existsSync(target)) {
  console.error(`No main.ts in ${ex.dir}`);
  process.exit(1);
}

const child = spawn("npx", ["tsx", target], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
