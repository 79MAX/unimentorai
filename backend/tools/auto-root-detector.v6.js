import fs from "fs";
import path from "path";

/**
 * AUTO DETECT ROOT PROJECT
 * cherche package.json ou backend stable
 */
export function detectRoot() {
  let dir = process.cwd();

  const maxDepth = 5;

  for (let i = 0; i < maxDepth; i++) {
    const hasPackage = fs.existsSync(path.join(dir, "package.json"));
    const hasBackend = fs.existsSync(path.join(dir, "backend"));

    if (hasPackage || hasBackend) {
      return dir;
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;

    dir = parent;
  }

  return process.cwd();
}
