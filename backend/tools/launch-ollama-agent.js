import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = path.resolve("C:/Users/DJOTOHOU/UNIMENTORAI/unimentorai/backend");
const TOOLS_DIR = path.join(ROOT, "tools");

function findAgents() {
  if (!fs.existsSync(TOOLS_DIR)) {
    throw new Error("TOOLS_DIR not found: " + TOOLS_DIR);
  }

  return fs.readdirSync(TOOLS_DIR)
    .filter(f => f.includes("ollama-auto-repair.agent") && f.endsWith(".js"))
    .map(f => ({
      name: f,
      fullPath: path.join(TOOLS_DIR, f)
    }));
}

function pickLatest(agents) {
  return agents.sort((a, b) => {
    const av = Number(a.name.match(/v(\d+)/)?.[1] || 0);
    const bv = Number(b.name.match(/v(\d+)/)?.[1] || 0);
    return bv - av;
  })[0];
}

async function run(file) {
  console.log("🚀 Selected:", file.name);

  const mod = await import(pathToFileURL(file.fullPath).href);

  const fn =
    mod.runAutoRepairV5 ||
    mod.default;

  if (typeof fn !== "function") {
    throw new Error("No entry function found");
  }

  return fn();
}

(async () => {
  console.log("⚡ CLEAN BOOT UNI MENTOR AI");
  console.log("📍 ROOT =", ROOT);
  console.log("📂 TOOLS =", TOOLS_DIR);

  const agents = findAgents();

  if (!agents.length) {
    console.log("❌ NO AGENTS FOUND");
    return;
  }

  const selected = pickLatest(agents);

  console.log("🧠 Agents found:", agents.length);
  console.log("✅ Selected:", selected.name);

  await run(selected);

  console.log("🏁 DONE");
})();
