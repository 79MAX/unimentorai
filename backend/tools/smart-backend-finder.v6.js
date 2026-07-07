@'
import fs from "fs";
import path from "path";

/**
 * =========================================
 * SMART BACKEND FINDER V6
 * CTO-GRADE AUTO DISCOVERY SYSTEM
 * =========================================
 */

/**
 * 🔍 LISTE DES BACKENDS POSSIBLES
 */
const CANDIDATES = [
  "backend",
  "backend",
  "src/backend",
  "server",
  "api",
];

/**
 * 📂 CHECK SI DOSSIER EXISTE
 */
function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

/**
 * 🧠 DETECT BACKEND INTELLIGENT
 */
export function findBackend(rootDir = process.cwd()) {
  for (const candidate of CANDIDATES) {
    const fullPath = path.join(rootDir, candidate);

    if (exists(fullPath)) {
      return fullPath;
    }
  }

  // fallback sécurisé
  return rootDir;
}

/**
 * 🔥 DETECT ROOT + BACKEND AUTO COMBO
 */
export function detectProjectStructure() {
  let dir = process.cwd();
  const maxDepth = 10;

  for (let i = 0; i < maxDepth; i++) {
    const hasPackage = exists(path.join(dir, "package.json"));
    const hasBackend = exists(path.join(dir, "backend"));

    if (hasPackage || hasBackend) {
      const backend = findBackend(dir);

      return {
        root: dir,
        backend
      };
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;

    dir = parent;
  }

  return {
    root: process.cwd(),
    backend: process.cwd()
  };
}

/**
 * 📊 DEBUG PRINT
 */
export function printStructure() {
  const result = detectProjectStructure();

  console.log("📍 ROOT:", result.root);
  console.log("📂 BACKEND:", result.backend);

  return result;
}
'@ | Set-Content -Encoding UTF8 tools\smart-backend-finder.v6.js
