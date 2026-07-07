import fs from "fs";
import path from "path";

/**
 * =====================================
 * MODULE SYSTEM V5 CLEAN FINAL (LOCKED)
 * ZERO src/src BUG - SINGLE SOURCE ROOT
 * =====================================
 */

export class ModuleSystemV5Clean {
  constructor({ root } = {}) {
    this.root = this._resolveRoot(root);

    this.modulesPath = this._resolveModulesPath();

    this.modules = new Map();

    this.health = {
      total: 0,
      loaded: 0,
      failed: 0,
      skipped: 0,
    };
  }

  /**
   * =====================================
   * ROOT RESOLVER (ANTI src/src HARD LOCK)
   * =====================================
   */
  _resolveRoot(customRoot) {
    let cwd = (customRoot || process.cwd()).replace(/\\/g, "/");

    // 🔥 HARD NORMALIZATION
    cwd = cwd
      .replace(/backend\/backend/g, "backend")
      .replace(/src\/src/g, "src");

    // 🎯 FORCE BACKEND ROOT DETECTION
    const idx = cwd.lastIndexOf("/backend");

    if (idx !== -1) {
      return cwd.substring(0, idx + 9); // "/backend"
    }

    return path.resolve("backend");
  }

  /**
   * =====================================
   * MODULES PATH (STRICT SINGLE RULE)
   * =====================================
   */
  _resolveModulesPath() {
    const p = path.join(this.root, "src/modules");

    return path
      .resolve(p)
      .replace(/src\/src/g, "src");
  }

  /**
   * =====================================
   * BOOT SYSTEM
   * =====================================
   */
  async boot() {
    console.log("🧠 MODULE SYSTEM V5 CLEAN START");
    console.log("📁 ROOT:", this.root);
    console.log("📁 MODULES PATH:", this.modulesPath);

    if (!fs.existsSync(this.modulesPath)) {
      console.warn("⚠️ MODULES PATH NOT FOUND:", this.modulesPath);
      return;
    }

    const dirs = fs.readdirSync(this.modulesPath, {
      withFileTypes: true,
    });

    const modules = dirs.filter((d) => d.isDirectory());

    this.health.total = modules.length;

    for (const mod of modules) {
      await this._load(mod.name);
    }

    console.log("🚀 MODULE SYSTEM V5 ACTIVE");
    this._report();
  }

  /**
   * =====================================
   * SAFE MODULE LOADER
   * =====================================
   */
  async _load(name) {
    const modulePath = path.join(this.modulesPath, name);

    try {
      const files = fs.readdirSync(modulePath);

      const hasRoutes = files.some((f) =>
        f.includes("routes")
      );

      if (!hasRoutes) {
        this.health.skipped++;
        console.warn(`⚠️ skipped (no routes): ${name}`);
        return;
      }

      this.modules.set(name, {
        name,
        path: modulePath,
      });

      this.health.loaded++;
      console.log(`✔ module loaded: ${name}`);
    } catch (err) {
      this.health.failed++;
      console.error(`❌ module failed: ${name}`, err.message);
    }
  }

  /**
   * =====================================
   * REPORT
   * =====================================
   */
  _report() {
    console.log("\n📊 MODULE SYSTEM V5 REPORT");
    console.log("------------------------");
    console.log("Total  :", this.health.total);
    console.log("Loaded :", this.health.loaded);
    console.log("Skipped:", this.health.skipped);
    console.log("Failed :", this.health.failed);
    console.log("------------------------\n");
  }
}