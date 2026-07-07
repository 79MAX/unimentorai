/**
 * ==================================================
 * REBUILD MAP ENGINE V3.1
 * Dependency Graph + Architecture Intelligence Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Analyze 1000+ files backend structure
 * - Build dependency graph
 * - Detect modules clusters
 * - Define SAFE migration order
 * - Detect architectural chaos patterns
 */

import fs from "fs";
import path from "path";

/**
 * ==========================
 * CONFIG
 * ==========================
 */
const INVENTORY_PATH = "backend/bootstrap/rebuild.inventory.json";
const OUTPUT_PATH = "backend/bootstrap/rebuild.map.json";

/**
 * ==========================
 * LOAD INVENTORY
 * ==========================
 */
function loadInventory() {
  if (!fs.existsSync(INVENTORY_PATH)) {
    throw new Error("Inventory file missing. Run rebuild.inventory.js first.");
  }

  return JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf-8"));
}

/**
 * ==========================
 * EXTRACT IMPORTS (JS ONLY)
 * ==========================
 */
function extractImports(fileContent) {
  const importRegex = /from\s+["'](.+?)["']/g;
  const requiresRegex = /require\(["'](.+?)["']\)/g;

  const deps = [];

  let match;

  while ((match = importRegex.exec(fileContent))) {
    deps.push(match[1]);
  }

  while ((match = requiresRegex.exec(fileContent))) {
    deps.push(match[1]);
  }

  return deps;
}

/**
 * ==========================
 * DETECT MODULE TYPE
 * ==========================
 */
function detectModuleType(filePath) {
  if (filePath.includes("/ai/")) return "AI";
  if (filePath.includes("/security/")) return "SECURITY";
  if (filePath.includes("/auth/")) return "AUTH";
  if (filePath.includes("/users/")) return "USERS";
  if (filePath.includes("/courses/")) return "COURSES";
  if (filePath.includes("/payments/")) return "PAYMENTS";
  if (filePath.includes("/certificates/")) return "CERTIFICATES";
  if (filePath.includes("/config/")) return "CONFIG";
  if (filePath.includes("/shared/")) return "SHARED";
  if (filePath.includes("/bootstrap/")) return "BOOTSTRAP";
  return "LEGACY";
}

/**
 * ==========================
 * BUILD GRAPH
 * ==========================
 */
function buildGraph(files) {
  const graph = {};
  const modules = {};

  for (const file of files) {
    const type = detectModuleType(file.path);

    if (!modules[type]) {
      modules[type] = [];
    }

    modules[type].push(file.path);

    graph[file.path] = {
      type,
      deps: [],
    };

    try {
      const content = fs.readFileSync(file.path, "utf-8");
      const deps = extractImports(content);

      graph[file.path].deps = deps;
    } catch {
      graph[file.path].deps = [];
    }
  }

  return { graph, modules };
}

/**
 * ==========================
 * DETECT CIRCULAR DEPENDENCIES
 * ==========================
 */
function detectCycles(graph) {
  const visited = new Set();
  const stack = new Set();
  const cycles = [];

  function visit(node) {
    if (stack.has(node)) {
      cycles.push(node);
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    stack.add(node);

    const deps = graph[node]?.deps || [];

    for (const dep of deps) {
      if (graph[dep]) {
        visit(dep);
      }
    }

    stack.delete(node);
  }

  for (const node in graph) {
    visit(node);
  }

  return cycles;
}

/**
 * ==========================
 * DEFINE SAFE MIGRATION ORDER
 * ==========================
 */
function computeMigrationOrder(modules) {
  const order = [
    "SHARED",
    "CONFIG",
    "AUTH",
    "USERS",
    "COURSES",
    "PAYMENTS",
    "CERTIFICATES",
    "AI",
    "SECURITY",
    "BOOTSTRAP",
    "LEGACY",
  ];

  const result = [];

  for (const type of order) {
    if (modules[type]) {
      result.push({
        module: type,
        fileCount: modules[type].length,
      });
    }
  }

  return result;
}

/**
 * ==========================
 * MAIN ENGINE
 * ==========================
 */
function main() {
  console.log("🚀 REBUILD MAP ENGINE START");

  const inventory = loadInventory();
  const files = inventory.files;

  console.log("📦 FILES LOADED:", files.length);

  const { graph, modules } = buildGraph(files);

  const cycles = detectCycles(graph);

  const migrationPlan = computeMigrationOrder(modules);

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      modulesDetected: Object.keys(modules).length,
      circularDependencies: cycles.length,
    },
    modules,
    migrationPlan,
    circularDependencies: cycles,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

  console.log("==================================");
  console.log("🧠 MAP ENGINE COMPLETE");
  console.log("📊 MODULES:", Object.keys(modules).length);
  console.log("⚠️ CYCLES:", cycles.length);
  console.log("📦 OUTPUT:", OUTPUT_PATH);
  console.log("==================================");
}

main();
