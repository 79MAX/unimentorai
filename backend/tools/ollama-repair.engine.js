import fs from "fs";
import path from "path";

/**
 * =========================================
 * OLLAMA BACKEND REPAIR ENGINE V1
 * UniMentorAI - Self Healing System
 * =========================================
 */

const SRC_ROOT = process.cwd();

/* =========================
   SCAN MODULE IMPORTS
========================= */
export function scanImports(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  const importRegex =
    /import\s+(?:{[^}]+}|\w+)\s+from\s+["'](.+?)["']/g;

  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

/* =========================
   CHECK FILE EXISTS
========================= */
export function checkModuleExists(importPath, baseFile) {
  try {
    const resolved = path.resolve(
      path.dirname(baseFile),
      importPath
    );

    return fs.existsSync(resolved + ".js") ||
           fs.existsSync(resolved);
  } catch {
    return false;
  }
}

/* =========================
   DETECT BROKEN IMPORTS
========================= */
export function detectBrokenImports(filePath) {
  const imports = scanImports(filePath);

  const broken = [];

  imports.forEach((imp) => {
    const exists = checkModuleExists(imp, filePath);

    if (!exists) {
      broken.push({
        file: filePath,
        import: imp,
        issue: "MODULE_NOT_FOUND",
      });
    }
  });

  return broken;
}

/* =========================
   EXPORT MISMATCH CHECK
========================= */
export function detectExportMismatch(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  const exports = [];

  if (content.includes("export default")) {
    exports.push("default");
  }

  const namedExports =
    content.match(/export\s+(const|function|class)\s+(\w+)/g) || [];

  namedExports.forEach((exp) => {
    const name = exp.split(" ").pop();
    exports.push(name);
  });

  return exports;
}

/* =========================
   REPAIR SUGGESTION ENGINE
========================= */
export function suggestFix(issue) {
  if (issue.issue === "MODULE_NOT_FOUND") {
    return {
      action: "CREATE_STUB",
      message: `Create missing module: ${issue.import}.js`,
    };
  }

  return {
    action: "MANUAL_REVIEW",
    message: "Cannot auto-fix safely",
  };
}

/* =========================
   FULL PROJECT SCAN
========================= */
export function scanProject(dir = "backend") {
  const results = [];

  function walk(folder) {
    const files = fs.readdirSync(folder);

    files.forEach((file) => {
      const fullPath = path.join(folder, file);

      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith(".js")) {
        const broken = detectBrokenImports(fullPath);
        results.push(...broken);
      }
    });
  }

  walk(dir);

  return results;
}

/* =========================
   RUN REPAIR ENGINE
========================= */
export function runRepair() {
  const issues = scanProject("backend");

  const report = issues.map((issue) => ({
    ...issue,
    fix: suggestFix(issue),
  }));

  console.log("🧠 OLLAMA REPAIR REPORT:");
  console.table(report);

  return report;
}
