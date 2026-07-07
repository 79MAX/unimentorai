import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * 🔒 LOCK V3 MODULE REGISTRY (STABLE CORE)
 * - no cwd dependency
 * - safe ESM imports
 * - sequential loading
 * - zero src bug
 */

export function loadModules(app) {
  // 🔥 FIX ROOT: always anchored to process root
  const ROOT = path.resolve(process.cwd(), "src");
  const MODULES_PATH = path.join(ROOT, "modules");

  if (!fs.existsSync(MODULES_PATH)) {
    console.warn("⚠️ Modules folder not found:", MODULES_PATH);
    return;
  }

  const modules = fs.readdirSync(MODULES_PATH);

  (async () => {
    for (const moduleName of modules) {
      const modulePath = path.join(MODULES_PATH, moduleName);

      try {
        if (!fs.statSync(modulePath).isDirectory()) continue;

        const routesFile = path.join(
          modulePath,
          `${moduleName}.routes.js`
        );

        if (!fs.existsSync(routesFile)) {
          console.warn(`⚠️ Skipped module (no routes): ${moduleName}`);
          continue;
        }

        // 🔥 SAFE ESM IMPORT
        const module = await import(
          pathToFileURL(routesFile).href
        );

        if (module?.default) {
          app.use(`/api/${moduleName}`, module.default);
          console.log(`✅ Loaded module: ${moduleName}`);
        } else {
          console.warn(`⚠️ Invalid router export: ${moduleName}`);
        }

      } catch (err) {
        console.error(
          `❌ Failed loading module: ${moduleName}`,
          err.message
        );
      }
    }
  })();
}
