import path from "path";
import fs from "fs";

/**
 * =====================================
 * GLOBAL MODULE ROOT RESOLVER (FINAL CLEAN V3)
 * =====================================
 * - no duplication
 * - no cwd chaos
 * - deterministic backend/modules path
 */

export function resolveModulesPath() {
  let cwd = process.cwd().replace(/\\/g, "/");

  // 🧠 CLEAN DUPLICATES
  cwd = cwd
    .replace(/backend\/backend/g, "backend")
    .replace(/src\/src/g, "src");

  // 🔍 FIND BACKEND ROOT
  const backendIndex = cwd.lastIndexOf("/backend");

  if (backendIndex === -1) {
    return path.resolve("backend/src/modules");
  }

  const backendRoot = cwd.substring(0, backendIndex + 9); // "/backend"

  const modulesPath = path.join(backendRoot, "src", "modules");

  // 🛡 FINAL SAFETY CLEAN
  return modulesPath.replace(/src\/src/g, "src");
}

/**
 * =====================================
 * DEBUG TOOL
 * =====================================
 */
export function debugRootResolution() {
  const resolved = resolveModulesPath();

  console.log("📁 ROOT DEBUG:");
  console.log("→ modules path:", resolved);
  console.log("→ exists:", fs.existsSync(resolved));

  return resolved;
}
