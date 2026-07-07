import path from "path";
import fs from "fs";

/**
 * =====================================
 * CLEAN ARCHITECTURE LOCK V1
 * ANTI src/src + ANTI backend/backend
 * =====================================
 */

export class CleanArchitectureLockV1 {
  constructor() {
    this.root = this._resolveRoot();
    this.modulesPath = path.join(this.root, "modules");
  }

  /**
   * ROOT DETERMINISTIC RESOLUTION
   */
  _resolveRoot() {
    let cwd = process.cwd().replace(/\\/g, "/");

    // HARD NORMALIZATION LAYER
    cwd = cwd
      .replace(/backend\/backend/g, "backend")
      .replace(/src\/src/g, "src");

    const backendIndex = cwd.lastIndexOf("/backend");

    if (backendIndex === -1) {
      return path.resolve("backend/src");
    }

    return cwd.substring(0, backendIndex + 9) + "/src";
  }

  /**
   * HARD VALIDATION (CRASH IF BROKEN)
   */
  validate() {
    if (!fs.existsSync(this.root)) {
      throw new Error("❌ ROOT INVALID: " + this.root);
    }

    if (!fs.existsSync(this.modulesPath)) {
      console.warn("⚠️ MODULES PATH MISSING:", this.modulesPath);
    }

    return {
      root: this.root,
      modules: this.modulesPath,
      status: "LOCKED"
    };
  }

  /**
   * EXPORT SAFE CONTEXT
   */
  getContext() {
    return {
      ROOT: this.root,
      MODULES: this.modulesPath
    };
  }
}

/**
 * SINGLETON SAFE EXPORT
 */
export const cleanArchitectureLock = new CleanArchitectureLockV1();