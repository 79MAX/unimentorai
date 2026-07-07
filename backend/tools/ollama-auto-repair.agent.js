import fs from "fs";
import path from "path";

/**
 * =========================================
 * OLLAMA AUTO REPAIR AGENT V2
 * UniMentorAI - Autonomous Backend Fix System
 * =========================================
 */

const ROOT = process.cwd();

/* =========================
   FILE ANALYSIS ENGINE
========================= */
export function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  return {
    file: filePath,
    imports: extractImports(content),
    exports: extractExports(content),
    issues: detectSyntaxIssues(content),
  };
}

/* =========================
   IMPORT EXTRACTION
========================= */
function extractImports(content) {
  const regex =
    /import\s+(?:{[^}]*}|\w+)\s+from\s+["'](.+?)["']/g;

  const imports = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

/* =========================
   EXPORT EXTRACTION
========================= */
function extractExports(content) {
  const exports = [];

  const named =
    content.match(/export\s+(const|function|class)\s+(\w+)/g) || [];

  named.forEach((e) => {
    exports.push(e.split(" ").pop());
  });

  if (content.includes("export default")) {
    exports.push("default");
  }

  return exports;
}

/* =========================
   BASIC SYNTAX ISSUES DETECTOR
========================= */
function detectSyntaxIssues(content) {
  const issues = [];

  if (content.includes("undefined is not")) {
    issues.push("POTENTIAL_RUNTIME_ERROR");
  }

  if (content.includes("require(") && content.includes("import")) {
    issues.push("MIXED_MODULE_SYSTEM");
  }

  if (content.includes("..//")) {
    issues.push("POTENTIAL_BAD_PATH");
  }

  return issues;
}

/* =========================
   BROKEN IMPORT CHECK
========================= */
export function checkBrokenImports(imports, filePath) {
  return imports.filter((imp) => {
    const resolved = path.resolve(
      path.dirname(filePath),
      imp
    );

    const exists =
      fs.existsSync(resolved + ".js") ||
      fs.existsSync(resolved);

    return !exists;
  });
}

/* =========================
   AUTO FIX ENGINE
========================= */
export function generateFixPlan(analysis) {
  const fixes = [];

  // =========================
  // BROKEN IMPORTS
  // =========================
  const broken = checkBrokenImports(
    analysis.imports,
    analysis.file
  );

  broken.forEach((b) => {
    fixes.push({
      type: "CREATE_MISSING_MODULE",
      target: b,
      action: `Create stub file for ${b}`,
    });
  });

  // =========================
  // SYNTAX ISSUES
  // =========================
  analysis.issues.forEach((issue) => {
    fixes.push({
      type: "CODE_WARNING",
      issue,
      action: "Manual review required",
    });
  });

  return fixes;
}

/* =========================
   FILE AUTO STUB CREATOR
========================= */
export function createMissingModule(modulePath) {
  const fullPath = path.resolve(ROOT, modulePath + ".js");

  if (fs.existsSync(fullPath)) return;

  const dir = path.dirname(fullPath);

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    fullPath,
    `// AUTO-GENERATED STUB BY OLLAMA AGENT V2\n\nexport default function ${path.basename(
      modulePath
    )}() {\n  console.log("Stub module: ${modulePath}");\n}\n`
  );
}

/* =========================
   PROJECT SCANNER
========================= */
export function scanProject(dir = "backend") {
  const results = [];

  function walk(folder) {
    const files = fs.readdirSync(folder);

    for (const file of files) {
      const fullPath = path.join(folder, file);

      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith(".js")) {
        const analysis = analyzeFile(fullPath);

        const fixes = generateFixPlan(analysis);

        results.push({
          file: fullPath,
          fixes,
        });
      }
    }
  }

  walk(dir);

  return results;
}

/* =========================
   AUTO REPAIR EXECUTOR
========================= */
export function runAutoRepair() {
  console.log("🤖 OLLAMA AUTO REPAIR AGENT V2 STARTING...");

  const report = scanProject("backend");

  for (const fileReport of report) {
    for (const fix of fileReport.fixes) {
      if (fix.type === "CREATE_MISSING_MODULE") {
        console.log(`🛠 Creating: ${fix.target}`);
        createMissingModule(fix.target);
      }
    }
  }

  console.log("✅ AUTO REPAIR COMPLETE");

  return report;
}
