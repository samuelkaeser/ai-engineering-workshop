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
const root = path.resolve(here, "..");
// Search workshop first; fall back to extras so `pnpm exercise 4a.1` still works.
const SEARCH_ROOTS = [path.join(root, "exercises"), path.join(root, "extras")];

// Parse an exercise id like "0.1", "00.1", "4b.1", "04b.1" into a comparable
// shape so the user-facing unpadded form matches the zero-padded directories.
function parseId(s: string): { major: number; letter: string; minor: number } | null {
  const m = s.match(/^(\d+)([a-z]?)\.(\d+)/);
  if (!m) return null;
  return { major: parseInt(m[1], 10), letter: m[2] || "", minor: parseInt(m[3], 10) };
}

function idMatches(query: string, dirName: string): boolean {
  const a = parseId(query);
  const b = parseId(dirName);
  if (!a || !b) return false;
  return a.major === b.major && a.letter === b.letter && a.minor === b.minor;
}

function find(id: string, dir: string): string | null {
  if (!existsSync(dir)) return null;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    if (idMatches(id, e.name)) return sub;
    const hit = find(id, sub);
    if (hit) return hit;
  }
  return null;
}

let dir: string | null = null;
for (const r of SEARCH_ROOTS) {
  dir = find(arg, r);
  if (dir) break;
}
if (!dir) {
  console.error(`No exercise starting with "${arg}-" under exercises/ or extras/`);
  process.exit(1);
}

const problemMain = path.join(dir, "problem", "main.ts");
const solutionMain = path.join(dir, "solution", "main.ts");
const target = existsSync(problemMain) ? problemMain : solutionMain;

if (!existsSync(target)) {
  // Eval exercises (Block 3, 4b.2) ship a `*.eval.ts` instead of a `main.ts`.
  // You can't usefully run those directly; Evalite owns the loop. Point students at the right command.
  const problemEval = existsSync(path.join(dir, "problem"))
    ? readdirSync(path.join(dir, "problem")).find((f) => f.endsWith(".eval.ts"))
    : undefined;
  if (problemEval) {
    const evalPath = path.relative(process.cwd(), path.join(dir, "problem", problemEval));
    console.log(`This is an eval exercise. Evalite owns the run loop, not \`pnpm exercise\`.\n`);
    console.log(`  1. Open this file in your editor:\n     ${evalPath}\n`);
    console.log(`  2. Read the readme:\n     ${path.relative(process.cwd(), path.join(dir, "problem", "readme.md"))}\n`);
    console.log(`  3. When you're ready to see the eval run:\n     pnpm eval:dev    # watch mode + UI at http://localhost:3006`);
    process.exit(0);
  }
  console.error(`Found ${dir} but no main.ts in problem/ or solution/`);
  process.exit(1);
}

console.log(`▶ Running ${path.relative(process.cwd(), target)}`);

const child = spawn("npx", ["tsx", target], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
