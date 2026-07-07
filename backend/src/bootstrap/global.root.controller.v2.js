import path from "path";
import fs from "fs";

/**
 * =====================================
 * GLOBAL ROOT CONTROLLER V2
 * SINGLE SOURCE OF TRUTH FOR PATHS
 * =====================================
 */

export class GlobalRootControllerV2 {
  constructor() {
    this.cwd = this._normalize(process.cwd());
    this.root = this._detectRoot();
  }

  _normalize(p) {
    return p.replace(/\\/g, "/")
      .replace(/backend\/backend/g, "backend")
      .replace(/src\/src/g, "src");
  }

  _detectRoot() {
    const p = this.cwd;

    if (p.endsWith("/src")) {
      return p;
    }

    if (p.endsWith("/backend")) {
      return path.join(p, "src");
    }

    if (p.includes("/backend/src")) {
      return p.split("/src")[0] + "/src";
    }

    return path.resolve("backend/src");
  }

  getModulesPath() {
    const modulesPath = path.join(this.root, "modules");

    this._ensureExists(modulesPath);

    return modulesPath;
  }

  getPath(...segments) {
    return path.join(this.root, ...segments);
  }

  _ensureExists(p) {
    if (!fs.existsSync(p)) {
      console.warn(`⚠️ Missing path detected: ${p}`);
    }
  }

  debug() {
    return {
      cwd: this.cwd,
      root: this.root,
      modules: this.getModulesPath()
    };
  }
}
