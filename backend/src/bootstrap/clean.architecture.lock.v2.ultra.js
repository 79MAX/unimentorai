import path from "path";
import fs from "fs";

/**
 * =====================================
 * CLEAN ARCHITECTURE LOCK V2 ULTRA
 * HARD RESILIENCE CORE SYSTEM
 * =====================================
 */

export class CleanArchitectureLockV2Ultra {
  constructor() {
    this.root = this._resolveRoot();
    this.modules = this._resolveModules();
  }

  /**
   * ================================
   * ROOT RESOLVER (IMMUTABLE LOGIC)
   * ================================
   */
  _resolveRoot() {
    let cwd = process.cwd().replace(/\\/g, "/");

    cwd = cwd
      .replace(/backend\/backend/g, "backend")
      .replace(/src\/src/g, "src");

    const idx = cwd.lastIndexOf("/backend");

    if (idx === -1) {
      return path.resolve("backend/src");
    }

    return cwd.substring(0, idx + 9) + "/src";
  }

  /**
   * ================================
   * MODULE PATH RESOLUTION (SAFE)
   * ================================
   */
  _resolveModules() {
    const modulesPath = path.join(this.root, "modules");

    if (!fs.existsSync(modulesPath)) {
      console.warn("⚠️ MODULES PATH MISSING:", modulesPath);
    }

    return modulesPath;
  }

  /**
   * ================================
   * VALIDATION ENGINE (GUARD RAIL)
   * ================================
   */
  validate() {
    const issues = [];

    if (!fs.existsSync(this.root)) {
      issues.push("ROOT_NOT_FOUND");
    }

    if (!fs.existsSync(this.modules)) {
      issues.push("MODULES_NOT_FOUND");
    }

    return {
      ok: issues.length === 0,
      root: this.root,
      modules: this.modules,
      issues
    };
  }

  /**
   * ================================
   * SAFE EXECUTION WRAPPER
   * ================================
   */
  safeRun(fn, label = "TASK") {
    try {
      return fn();
    } catch (err) {
      console.error(`❌ SAFE FAILURE [${label}]`, err.message);
      return null;
    }
  }

  /**
   * ================================
   * BOOT HEALTH REPORT
   * ================================
   */
  report() {
    const status = this.validate();

    console.log("\n🧠 CLEAN ARCHITECTURE LOCK V2 ULTRA");
    console.log("-----------------------------------");
    console.log("ROOT:", status.root);
    console.log("MODULES:", status.modules);
    console.log("STATUS:", status.ok ? "OK" : "DEGRADED");

    if (status.issues.length) {
      console.log("ISSUES:", status.issues.join(", "));
    }

    console.log("-----------------------------------\n");

    return status;
  }
}

/**
 * SINGLETON EXPORT (IMPORTANT)
 */
export const cleanArchitectureLockV2Ultra =
  new CleanArchitectureLockV2Ultra();