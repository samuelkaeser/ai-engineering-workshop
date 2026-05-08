import { select } from "@clack/prompts";
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const exercisesDir = path.join(root, "exercises");
const extrasDir = path.join(root, "extras");

type Exercise = { id: string; label: string; dir: string; group: "workshop" | "extras" };

function collectFrom(baseDir: string, group: Exercise["group"]): Exercise[] {
  if (!existsSync(baseDir)) return [];
  const out: Exercise[] = [];
  for (const block of readdirSync(baseDir, { withFileTypes: true })) {
    if (!block.isDirectory()) continue;
    const blockDir = path.join(baseDir, block.name);
    for (const ex of readdirSync(blockDir, { withFileTypes: true })) {
      if (!ex.isDirectory()) continue;
      const m = ex.name.match(/^([\d.a-z]+)-(.+)$/);
      if (!m) continue;
      const id = m[1];
      const prefix = group === "extras" ? "↳ extras  " : "";
      const label = `${prefix}${id}  ${m[2].replace(/-/g, " ")}`;
      out.push({ id, label, dir: path.join(blockDir, ex.name), group });
    }
  }
  return out;
}

const workshop = collectFrom(exercisesDir, "workshop").sort((a, b) =>
  a.id.localeCompare(b.id, undefined, { numeric: true })
);
const extras = collectFrom(extrasDir, "extras").sort((a, b) =>
  a.id.localeCompare(b.id, undefined, { numeric: true })
);
const exercises = [...workshop, ...extras];

if (exercises.length === 0) {
  console.error("No exercises found.");
  process.exit(1);
}

const options: { value: string; label: string }[] = [];
for (const e of workshop) options.push({ value: e.id, label: e.label });
if (extras.length) {
  // Visual separator: a non-selectable header isn't supported by @clack/prompts
  // here, so we prefix extras labels in `collectFrom` instead.
  for (const e of extras) options.push({ value: `extras:${e.id}`, label: e.label });
}

const choice = await select({ message: "Pick an exercise", options });

if (typeof choice !== "string") process.exit(0);

const isExtras = choice.startsWith("extras:");
const wantedId = isExtras ? choice.slice("extras:".length) : choice;
const ex =
  (isExtras ? extras : workshop).find((e) => e.id === wantedId) ??
  exercises.find((e) => e.id === wantedId);
if (!ex) process.exit(1);

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
