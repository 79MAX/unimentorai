/**
 * ==================================================
 * REBUILD INVENTORY ENGINE V1
 * Safe Global Scanner (NO MODIFICATION MODE)
 * ==================================================
 */

import fs from "fs";
import path from "path";

const ROOT_DIRS = [
  "backend",
  "backend/src",
  "backend/modules",
  "backend/security",
  "backend/ai",
  "backend/api",
  "backend/certificates",
  "backend/routes",
];

function exists(dir) {
  try {
    return fs.existsSync(dir);
  } catch {
    return false;
  }
}

function scanDir(dir, result = []) {
  if (!exists(dir)) return result;

  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);

    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath, result);
      } else {
        result.push({
          path: fullPath,
          ext: path.extname(fullPath),
          size: stat.size,
        });
      }
    } catch (e) {
      result.push({
        path: fullPath,
        error: "UNREADABLE",
      });
    }
  }

  return result;
}

function main() {
  console.log("🚀 REBUILD INVENTORY START");

  let allFiles = [];

  for (const root of ROOT_DIRS) {
    console.log("🔍 Scanning:", root);
    allFiles = allFiles.concat(scanDir(root));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalFiles: allFiles.length,
    breakdown: {
      js: allFiles.filter(f => f.ext === ".js").length,
      json: allFiles.filter(f => f.ext === ".json").length,
      other: allFiles.filter(f => f.ext && f.ext !== ".js" && f.ext !== ".json").length,
    },
    files: allFiles,
  };

  const outPath = "backend/bootstrap/rebuild.inventory.json";

  fs.mkdirSync("backend/bootstrap", { recursive: true });

  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log("==================================");
  console.log("✅ INVENTORY COMPLETE");
  console.log("📦 FILES:", report.totalFiles);
  console.log("💾 OUTPUT:", outPath);
  console.log("==================================");
}

main();
