console.log("🚀 FILE LOADED - V6 CLEAN ENTERPRISE ENGINE ACTIVE");

import fs from "fs";
import path from "path";
import ollama from "ollama";

/* =========================================
   ROOT (SAFE + STABLE)
========================================= */
const ROOT = path.resolve(process.cwd());

/* =========================================
   ENTERPRISE CONFIG
========================================= */
const CONFIG = {
  model: "llama3",
  timeout: 30000,
  concurrency: 4,
  maxFileSizeKB: 600,

  // 🔥 ENTERPRISE SCOPE STRICT
  scanDirs: [
    path.join(ROOT, "backend"),
    path.join(ROOT, "admin"),
    path.join(ROOT, "api"),
    path.join(ROOT, "services"),
    path.join(ROOT, "core"),
    path.join(ROOT, "ai"),
  ],

  ignoreDirs: new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    "archive",
    "archive-v2",
    "backend_backup",
  ]),
};

/* =========================================
   STATS
========================================= */
const STATS = {
  files: 0,
  processed: 0,
  fixed: 0,
  skipped: 0,
  failed: 0,
  startTime: Date.now(),
};

/* =========================================
   LOGGER CLEAN ENTERPRISE
========================================= */
const log = (type, msg) => {
  const icons = {
    info: "🧠",
    warn: "⚠️",
    error: "❌",
    success: "✅",
    skip: "⏭️",
  };

  console.log(`[V6 ENTERPRISE] ${icons[type] || "ℹ️"} ${msg}`);
};

/* =========================================
   FILE FILTER (ENTERPRISE GRADE)
========================================= */
function isValidFile(file, stat) {
  return (
    file.endsWith(".js") &&
    stat.size < CONFIG.maxFileSizeKB * 1024
  );
}

/* =========================================
   SCANNER ULTRA CLEAN
========================================= */
function scanProject() {
  const files = [];

  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const full = path.join(dir, item);

      const normalized = full.replaceAll("\\", "/");

      if ([...CONFIG.ignoreDirs].some(d => normalized.includes(d))) continue;

      try {
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
          walk(full);
        } else if (isValidFile(full, stat)) {
          files.push(full);
        }
      } catch {}
    }
  };

  for (const dir of CONFIG.scanDirs) {
    walk(dir);
  }

  return files;
}

/* =========================================
   BACKUP SAFE
========================================= */
const backup = (file) => {
  try {
    fs.copyFileSync(file, `${file}.v6.backup`);
  } catch {}
};

const restore = (file) => {
  try {
    const b = `${file}.v6.backup`;
    if (fs.existsSync(b)) fs.copyFileSync(b, file);
  } catch {}
};

/* =========================================
   OLLAMA SAFE CALL
========================================= */
async function callOllama(prompt) {
  try {
    const res = await ollama.chat({
      model: CONFIG.model,
      messages: [
        {
          role: "user",
          content: prompt.slice(0, 12000),
        },
      ],
      options: { temperature: 0.2 },
    });

    return res?.message?.content || "{}";
  } catch {
    return "{}";
  }
}

/* =========================================
   JSON PARSER ENTERPRISE SAFE
========================================= */
function safeParse(text) {
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^[^{]*/, "")
        .trim();

      return JSON.parse(cleaned);
    } catch {
      return {};
    }
  }
}

/* =========================================
   AI AGENTS (ENTERPRISE PROMPTS)
========================================= */
const analyzeAgent = async (code) =>
  safeParse(await callOllama(`
Return ONLY JSON:
{"riskLevel":"LOW|MEDIUM|HIGH|CRITICAL","issues":[],"summary":""}

Code:
${code}
`));

const fixAgent = async (analysis, code) =>
  safeParse(await callOllama(`
Return ONLY JSON:
{"updatedCode":"","changes":[]}

Analysis:
${JSON.stringify(analysis)}

Code:
${code}
`));

const validateAgent = async (code) =>
  safeParse(await callOllama(`
Return ONLY JSON:
{"safe":true,"reason":""}

Code:
${code.slice(0, 8000)}
`));

/* =========================================
   PROCESS FILE (ENTERPRISE SAFE PIPELINE)
========================================= */
async function processFile(file) {
  STATS.processed++;

  try {
    const code = fs.readFileSync(file, "utf8");

    backup(file);

    const analysis = await analyzeAgent(code);

    if (analysis?.riskLevel === "CRITICAL") {
      STATS.skipped++;
      log("skip", "CRITICAL SKIPPED");
      return;
    }

    const fixed = await fixAgent(analysis, code);

    if (!fixed?.updatedCode || typeof fixed.updatedCode !== "string") {
      STATS.failed++;
      log("warn", "NO VALID FIX");
      return;
    }

    const validation = await validateAgent(fixed.updatedCode);

    if (!validation?.safe) {
      restore(file);
      STATS.failed++;
      log("error", "ROLLBACK");
      return;
    }

    fs.writeFileSync(file, fixed.updatedCode);
    STATS.fixed++;

    log("success", "FIXED");
  } catch {
    STATS.failed++;
    restore(file);
    log("error", "CRASH");
  }
}

/* =========================================
   BATCH ENGINE (OPTIMIZED PARALLEL)
========================================= */
async function runBatches(files) {
  const chunks = [];

  for (let i = 0; i < files.length; i += CONFIG.concurrency) {
    chunks.push(files.slice(i, i + CONFIG.concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(processFile));
  }
}

/* =========================================
   MAIN ENGINE
========================================= */
export async function runAutoRepairV6() {
  log("info", `ENGINE START ROOT=${ROOT}`);

  const files = scanProject();

  STATS.files = files.length;

  log("info", `FILES FOUND: ${files.length}`);

  await runBatches(files);

  const duration = Date.now() - STATS.startTime;

  console.log("\n📊 FINAL ENTERPRISE REPORT:");
  console.log({
    ...STATS,
    duration: `${duration}ms`,
    successRate: `${((STATS.fixed / STATS.processed) * 100 || 0).toFixed(2)}%`,
  });

  log("success", "ENTERPRISE COMPLETE");
}

/* =========================================
   BOOT CLEAN ENTERPRISE
========================================= */
(async () => {
  console.log("⚡ V6 CLEAN ENTERPRISE BOOT");
  await runAutoRepairV6();
  console.log("🏁 SHUTDOWN OK");
})();
