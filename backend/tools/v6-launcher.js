import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

console.log("🚀 CLEAN BOOT UNI MENTOR AI V6");

/* =========================
   ROOT LOCK (CRITIQUE)
========================= */
const ROOT = path.resolve(process.cwd(), "backend");

const AGENT_NAME = "ollama-auto-repair.agent.v5.js";

/* =========================
   FIND AGENT
========================= */
function findAgent() {
  const file = path.join(ROOT, "tools", AGENT_NAME);

  if (!fs.existsSync(file)) {
    throw new Error("Agent introuvable: " + file);
  }

  return file;
}

/* =========================
   SCAN BACKEND ONLY
========================= */
function scanBackend() {
  const files = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;

    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);

      if (
        full.includes("node_modules") ||
        full.includes("archive") ||
        full.includes("dist") ||
        full.includes("functions")
      ) continue;

      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        walk(full);
      } else if (full.endsWith(".js")) {
        files.push(full);
      }
    }
  }

  walk(ROOT);
  return files;
}

/* =========================
   RUN AGENT
========================= */
async function runAgent(file) {
  const mod = await import(pathToFileURL(file).href);

  const fn =
    mod.runAutoRepairV5 ||
    mod.default;

  if (typeof fn !== "function") {
    throw new Error("Entry function introuvable");
  }

  return fn();
}

/* =========================
   BOOT SEQUENCE
========================= */
(async () => {
  try {
    console.log("📍 ROOT LOCKED:", ROOT);

    console.log("⚡ SCANNING BACKEND ONLY...");
    const files = scanBackend();

    console.log("🧠 Files detected:", files.length);

    const agentPath = findAgent();

    console.log("🚀 Agent:", agentPath);

    await runAgent(agentPath);

    console.log("🏁 CLEAN BOOT COMPLETE");

  } catch (err) {
    console.error("❌ BOOT FAILED");
    console.error(err.message);
  }
})();
