import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * =====================================
 * MODULE SYSTEM V6 ULTRA ENGINE
 * HOT RELOAD + SELF HEAL + SAFE RUNTIME
 * =====================================
 */

export class ModuleSystemV6Ultra {
  constructor({ root } = {}) {
    this.root = root || path.resolve(process.cwd(), "src/modules");

    this.modules = new Map();
    this.watchers = new Map();

    this.health = {
      loaded: 0,
      failed: 0,
      hotReloads: 0,
      fixed: 0,
    };
  }

  /**
   * =========================
   * BOOT ENGINE
   * =========================
   */
  async boot(app) {
    console.log("🧠 MODULE SYSTEM V6 ULTRA START");
    console.log("📁 ROOT:", this.root);

    if (!fs.existsSync(this.root)) {
      console.warn("⚠️ MODULE ROOT NOT FOUND:", this.root);
      return;
    }

    const dirs = fs.readdirSync(this.root, { withFileTypes: true });

    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;
      await this._loadModule(dir.name, app);
    }

    this._enableHotReload(app);

    this._report();
  }

  /**
   * =========================
   * LOAD MODULE
   * =========================
   */
  async _loadModule(name, app) {
    const modulePath = path.join(this.root, name);

    try {
      const files = fs.readdirSync(modulePath);

      const routesFile = files.find(f => f.includes("routes"));

      if (!routesFile) {
        console.warn(`⚠️ skipped (no routes): ${name}`);
        return;
      }

      const fullPath = path.join(modulePath, routesFile);
      const moduleUrl = pathToFileURL(fullPath).href;

      const mod = await import(moduleUrl + "?v=" + Date.now());

      const router = mod.default || mod.router;

      if (router) {
        app.use(`/api/${name}`, router);
        this.modules.set(name, fullPath);

        this.health.loaded++;
        console.log(`✔ module loaded: ${name}`);
      } else {
        this._fixMissingExport(fullPath, name);
      }

    } catch (err) {
      this.health.failed++;
      console.error(`❌ module failed: ${name}`, err.message);
    }
  }

  /**
   * =========================
   * AUTO FIX EXPORTS
   * =========================
   */
  _fixMissingExport(filePath, name) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");

      if (!content.includes("export default")) {
        const fixed = content + `\n\nexport default router;\n`;
        fs.writeFileSync(filePath, fixed);

        this.health.fixed++;
        console.log(`🛠 auto-fixed export: ${name}`);
      }

    } catch (e) {
      console.warn("⚠️ fix failed:", e.message);
    }
  }

  /**
   * =========================
   * HOT RELOAD ENGINE
   * =========================
   */
  _enableHotReload(app) {
    console.log("🔥 HOT RELOAD ENGINE ENABLED");

    fs.watch(this.root, { recursive: true }, async (event, filename) => {
      if (!filename) return;

      if (!filename.endsWith(".js")) return;

      const moduleName = filename.split(path.sep)[0];

      if (!moduleName) return;

      console.log(`♻️ HOT RELOAD: ${moduleName}`);

      try {
        const modulePath = this.modules.get(moduleName);

        if (!modulePath) return;

        delete import.cache?.[modulePath];

        await this._loadModule(moduleName, app);

        this.health.hotReloads++;

      } catch (err) {
        console.error("❌ hot reload error:", err.message);
      }
    });
  }

  /**
   * =========================
   * REPORT
   * =========================
   */
  _report() {
    console.log("\n📊 V6 ULTRA REPORT");
    console.log("--------------------");
    console.log("Loaded     :", this.health.loaded);
    console.log("Failed     :", this.health.failed);
    console.log("Auto-fixed  :", this.health.fixed);
    console.log("Hot reloads:", this.health.hotReloads);
    console.log("--------------------\n");
  }
}
