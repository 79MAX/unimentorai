import fs from "fs";
import path from "path";
import { resolveModulesPath } from "./module.root.resolver.js";

/**
 * =====================================
 * MODULE NORMALIZER V2 AI (PRODUCTION CLEAN)
 * =====================================
 * - zero cwd dependency
 * - deterministic path system
 * - safe self-healing module generator
 */

export class ModuleNormalizerV2AI {
  constructor({ modulesPath } = {}) {
    // 🧠 SINGLE SOURCE OF TRUTH
    this.modulesPath = modulesPath || resolveModulesPath();

    this.fixed = [];
    this.broken = [];
  }

  /**
   * =====================================
   * MAIN ENTRY
   * =====================================
   */
  async run() {
    console.log("🧠 MODULE NORMALIZER V2 AI START");
    console.log("📁 MODULES PATH:", this.modulesPath);

    if (!fs.existsSync(this.modulesPath)) {
      console.warn("⚠️ Modules path missing:", this.modulesPath);
      return;
    }

    const modules = fs.readdirSync(this.modulesPath, { withFileTypes: true });

    if (!modules.length) {
      console.warn("⚠️ No modules found in:", this.modulesPath);
      return;
    }

    for (const mod of modules) {
      if (!mod.isDirectory()) continue;
      await this._normalizeModule(mod.name);
    }

    this._report();
  }

  /**
   * =====================================
   * MODULE NORMALIZATION CORE
   * =====================================
   */
  async _normalizeModule(name) {
    const modulePath = path.join(this.modulesPath, name);

    if (!fs.existsSync(modulePath)) return;

    const files = fs.readdirSync(modulePath);

    const hasRoutes = files.some(f => f.includes("routes"));
    const hasController = files.some(f => f.includes("controller"));
    const hasService = files.some(f => f.includes("service"));

    // =========================
    // ROUTES
    // =========================
    if (!hasRoutes) {
      const file = path.join(modulePath, `${name}.routes.js`);

      fs.writeFileSync(file, `
import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ module: "${name}", status: "auto-fixed" });
});

export default router;
      `.trim());

      this._log(`routes created: ${name}`);
    }

    // =========================
    // CONTROLLER
    // =========================
    if (!hasController) {
      const singular = name.replace(/s$/, "");
      const file = path.join(modulePath, `${singular}.controller.js`);

      fs.writeFileSync(file, `
export const ${singular}Controller = {
  health(req, res) {
    res.json({ module: "${name}", status: "auto-fixed" });
  }
};
      `.trim());

      this._log(`controller created: ${name}`);
    }

    // =========================
    // SERVICE
    // =========================
    if (!hasService) {
      const singular = name.replace(/s$/, "");
      const ClassName = singular.charAt(0).toUpperCase() + singular.slice(1);

      const file = path.join(modulePath, `${singular}.service.js`);

      fs.writeFileSync(file, `
export default class ${ClassName}Service {
  constructor(deps = {}) {
    this.deps = deps;
  }
}
      `.trim());

      this._log(`service created: ${name}`);
    }

    this.fixed.push(name);
  }

  /**
   * =====================================
   * LOGGER
   * =====================================
   */
  _log(msg) {
    console.log("🛠", msg);
  }

  /**
   * =====================================
   * REPORT
   * =====================================
   */
  _report() {
    console.log("\n📊 NORMALIZER V2 REPORT");
    console.log("----------------------");
    console.log("Fixed modules:", this.fixed.length);

    if (this.fixed.length) {
      console.log("Modules:", this.fixed.join(", "));
    }

    console.log("----------------------\n");
  }
}
