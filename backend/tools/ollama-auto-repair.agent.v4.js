import fs from "fs";
import path from "path";
import ollama from "ollama";

/**
 * =========================================
 * OLLAMA AUTO REPAIR AGENT V4
 * FULL AI DEVOPS + SELF HEALING SYSTEM
 * UniMentorAI - Production Grade Engine
 * =========================================
 */

const ROOT = process.cwd();

/* =========================
   PROJECT SCANNER
========================= */
export function scanProject(dir = "backend") {
  const files = [];

  function walk(folder) {
    for (const file of fs.readdirSync(folder)) {
      const full = path.join(folder, file);

      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (file.endsWith(".js")) {
        files.push(full);
      }
    }
  }

  walk(dir);
  return files;
}

/* =========================
   READ FILE SAFE
========================= */
function readFile(file) {
  return fs.readFileSync(file, "utf-8");
}

/* =========================
   OLLAMA ANALYSIS ENGINE
========================= */
export async function analyzeWithAI(file, content) {
  const prompt = `
You are a senior Node.js DevOps engineer.

Analyze this file and return ONLY JSON:

File: ${file}

Rules:
- detect broken imports
- detect wrong exports
- detect runtime risks
- suggest fixes

Code:
${content}
`;

  const response = await ollama.chat({
    model: "llama3",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    return JSON.parse(response.message.content);
  } catch {
    return {
      raw: response.message.content,
      parseError: true,
    };
  }
}

/* =========================
   FIX APPLIER
========================= */
function applyFix(file, analysis) {
  const content = readFile(file);
  let updated = content;

  // =========================
  // AUTO FIX IMPORT MISMATCH
  // =========================
  if (analysis.fixImports) {
    for (const fix of analysis.fixImports) {
      updated = updated.replace(
        fix.from,
        fix.to
      );
    }
  }

  // =========================
  // AUTO EXPORT FIX
  // =========================
  if (analysis.fixExports) {
    for (const fix of analysis.fixExports) {
      updated = updated.replace(
        fix.from,
        fix.to
      );
    }
  }

  fs.writeFileSync(file, updated);
}

/* =========================
   BACKUP SYSTEM (ROLLBACK SAFETY)
========================= */
function backupFile(file) {
  const backupPath = file + ".backup";

  fs.writeFileSync(
    backupPath,
    fs.readFileSync(file, "utf-8")
  );
}

/* =========================
   RESTORE SYSTEM
========================= */
function restoreBackup(file) {
  const backup = file + ".backup";

  if (fs.existsSync(backup)) {
    fs.writeFileSync(
      file,
      fs.readFileSync(backup, "utf-8")
    );
  }
}

/* =========================
   SELF HEALING ENGINE
========================= */
export async function runAutoRepairV4() {
  console.log("🤖 OLLAMA V4 AI REPAIR ENGINE STARTED");

  const files = scanProject("backend");

  for (const file of files) {
    try {
      console.log(`🔍 Analyzing: ${file}`);

      const content = readFile(file);

      // BACKUP BEFORE MODIFICATION
      backupFile(file);

      // AI ANALYSIS
      const analysis = await analyzeWithAI(file, content);

      // SAFETY CHECK
      if (analysis.riskLevel === "CRITICAL") {
        console.log(`🚨 CRITICAL RISK: skipping ${file}`);
        continue;
      }

      // APPLY FIXES
      applyFix(file, analysis);

      console.log(`✅ Fixed: ${file}`);

    } catch (err) {
      console.log(`❌ ERROR in ${file} → rolling back`);

      restoreBackup(file);
    }
  }

  console.log("🚀 V4 AUTO REPAIR COMPLETE");
}
