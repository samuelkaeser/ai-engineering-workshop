import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: pnpm exercise <number>   e.g. pnpm exercise 0.1");
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const exercisesDir = path.resolve(here, "..", "exercises");

function find(id: string, dir: string): string | null {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    if (e.name.startsWith(`${id}-`)) return sub;
    const hit = find(id, sub);
    if (hit) return hit;
  }
  return null;
}

const dir = find(arg, exercisesDir);
if (!dir) {
  console.error(`No exercise starting with "${arg}-" under ${exercisesDir}`);
  process.exit(1);
}

const problemMain = path.join(dir, "problem", "main.ts");
const solutionMain = path.join(dir, "solution", "main.ts");
const target = existsSync(problemMain) ? problemMain : solutionMain;

if (!existsSync(target)) {
  console.error(`Found ${dir} but no main.ts in problem/ or solution/`);
  process.exit(1);
}

console.log(`▶ Running ${path.relative(process.cwd(), target)}`);

const child = spawn("npx", ["tsx", target], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
