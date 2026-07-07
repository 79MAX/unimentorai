import path from "path";
import fs from "fs";

/**
 * =====================================
 * GLOBAL BOOT RESOLVER V1
 * =====================================
 * Fixes all path inconsistencies:
 * - backend
 * - src
 * - wrong cwd usage
 */

export class BootResolverV1 {
  constructor() {
    this.root = this._resolveRoot();
    this.src = path.join(this.root, "src");
    this.modules = path.join(this.src, "modules");
  }

  /**
   * 🔥 ROOT DETECTION (ANTI BUG DOUBLE PATH)
   */
  _resolveRoot() {
    let cwd = process.cwd().replace(/\\/g, "/");

    // remove duplicate backend
    cwd = cwd.replace(/backend\/backend/g, "backend");

    // remove src pattern
    cwd = cwd.replace(/src\/src/g, "src");

    return cwd;
  }

  /**
   * 📦 SAFE PATH BUILDER
   */
  resolve(...segments) {
    return path.join(this.root, ...segments);
  }

  /**
   * 📦 MODULE PATH (FIXED)
   */
  getModulesPath() {
    const p = path.join(this.src, "modules");

    if (!fs.existsSync(p)) {
      console.warn(`⚠️ Modules folder not found: ${p}`);
    }

    return p;
  }

  /**
   * 🧪 DEBUG STATE
   */
  debug() {
    return {
      root: this.root,
      src: this.src,
      modules: this.modules,
    };
  }
}
