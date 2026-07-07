@'
import fs from "fs";
import path from "path";

/**
 * =========================================
 * AUTO LAUNCH ENGINE V6 CLEAN
 * CTO-GRADE SAFE BOOT SYSTEM
 * =========================================
 */

/* =========================
   FIND PROJECT ROOT
========================= */
function findRoot(start = process.cwd()) {
  let dir = start;

  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    if (fs.existsSync(path.join(dir, "backend"))) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) break;

    dir = parent;
  }

  return start;
}

/* =========================
   FIND BACKEND
========================= */
function findBackend(root) {
  const candidates = [
    "backend",
    "backend",
    "src/backend",
    "server",
    "api"
  ];

  for (const c of candidates) {
    const full = path.join(root, c);
    if (fs.existsSync(full)) return full;
  }

  return root;
}

/* =========================
   FIND AGENT (LATEST)
========================= */
function findLatestAgent(backend) {
  const toolsDir = path.join(backend, "tools");

  if (!fs.existsSync(toolsDir)) {
    throw new Error("TOOLS DIR NOT FOUND: " + toolsDir);
  }

  const agents = fs.readdirSync(toolsDir)
    .filter(f => f.includes("ollama-auto-repair.agent") && f.endsWith(".js"))
    .sort((a, b) => {
      const av = Number(a.match(/v(\d+)/)?.[1] || 0);
      const bv = Number(b.match(/v(\d+)/)?.[1] || 0);
      return bv - av;
    });

  return path.join(toolsDir, agents[0]);
}

/* =========================
   RUN AGENT SAFE
========================= */
async function runAgent(filePath) {
  console.log("🚀 SELECTED AGENT:", filePath);

  const mod = await import(pathToFileURL(filePath));

  const fn =
    mod.runAutoRepairV5 ||
    mod.runAutoRepairV6 ||
    mod.default;

  if (typeof fn !== "function") {
    throw new Error("NO ENTRY FUNCTION FOUND");
  }

  return fn();
}

/* =========================
   BOOT ENGINE
========================= */
(async () => {
  try {
    console.log("⚡ BOOT SEQUENCE START");

    const root = findRoot();
    const backend = findBackend(root);
    const agent = findLatestAgent(backend);

    console.log("📍 ROOT:", root);
    console.log("📂 BACKEND:", backend);
    console.log("🧠 AGENT:", agent);

    await runAgent(agent);

    console.log("🏁 AUTO ENGINE COMPLETE");
  } catch (err) {
    console.error("❌ ENGINE ERROR:", err.message);
  }
})();
'@ | Set-Content -Encoding UTF8 tools\auto-launch-engine.v6.clean.js
