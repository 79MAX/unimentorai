const fs = require("fs");
const path = require("path");

/* =========================
   V12 CLEAN GUARD (PRO)
   SAFE + FAST + CONTROLLED
========================= */

function assertCleanV12() {

  const root = process.cwd();

  const forbiddenPatterns = [
    "V11.1 STABLE",
    "ws-server.js",
    "realtime.server.js",
    "control-center.server.js"
  ];

  const skipDirs = new Set([
    "node_modules",
    ".git",
    "archive-v12",
    "audit-report"
  ]);

  function scanDir(dir) {

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {

        if (skipDirs.has(entry.name)) continue;

        scanDir(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".js")) continue;

      let content = "";

      try {
        content = fs.readFileSync(fullPath, "utf-8");
      } catch (e) {
        console.warn(`⚠️ Cannot read: ${fullPath}`);
        continue;
      }

      for (const pattern of forbiddenPatterns) {

        if (content.includes(pattern)) {
          throw new Error(
            `🚨 V12 VIOLATION DETECTED\n` +
            `Pattern: ${pattern}\n` +
            `File: ${fullPath}`
          );
        }
      }
    }
  }

  scanDir(root);

  console.log("🔒 V12 CLEAN GUARD OK (NO LEGACY DETECTED)");
}

module.exports = { assertCleanV12 };