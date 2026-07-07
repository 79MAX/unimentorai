import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export class ModuleSystemV5AI {
  constructor({ basePath, context = {} } = {}) {
    this.basePath = this._resolveBasePath(basePath);
    this.context = context;

    this.modules = new Map();
    this.services = new Map();

    // 🧠 anti reprocessing / anti loop
    this.processed = new Set();

    this.health = {
      total: 0,
      loaded: 0,
      healed: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };
  }

  /**
   * =========================
   * ROOT RESOLVER SAFE
   * =========================
   */
  _resolveBasePath(custom) {
    if (custom) return custom;

    let cwd = process.cwd().replace(/\\/g, "/");

    cwd = cwd
      .replace(/backend\/backend/g, "backend")
      .replace(/src\/src/g, "src");

    const parts = cwd.split("/");
    const idx = parts.lastIndexOf("src");

    if (idx !== -1) {
      return path.join(parts.slice(0, idx + 1).join("/"), "modules");
    }

    return path.resolve("backend/src/modules");
  }

  /**
   * =========================
   * BOOT
   * =========================
   */
  async boot() {
    console.log("🧠 MODULE SYSTEM V5 AI START");

    if (!fs.existsSync(this.basePath)) {
      console.warn("⚠️ Modules folder missing:", this.basePath);
      return;
    }

    const modules = this._scanSafe();
    this.health.total = modules.length;

    for (const mod of modules) {
      if (this.processed.has(mod.name)) continue;

      await this._process(mod);

      this.processed.add(mod.name);
    }

    this._report();
  }

  /**
   * =========================
   * SAFE SCAN
   * =========================
   */
  _scanSafe() {
    try {
      return fs
        .readdirSync(this.basePath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => ({
          name: d.name,
          path: path.join(this.basePath, d.name),
        }));
    } catch {
      return [];
    }
  }

  /**
   * =========================
   * PROCESS MODULE
   * =========================
   */
  async _process(module) {
    try {
      const files = fs.readdirSync(module.path);

      let routes = files.find(f => f.includes("routes"));
      let controller = files.find(f => f.includes("controller"));
      let service = files.find(f => f.includes("service"));

      // =========================
      // HEAL ROUTES
      // =========================
      if (!routes) {
        routes = await this._createRoutes(module);
        this.health.healed++;
      }

      // =========================
      // HEAL CONTROLLER
      // =========================
      if (!controller) {
        controller = await this._createController(module);
        this.health.healed++;
      }

      // =========================
      // HEAL SERVICE
      // =========================
      if (!service) {
        service = await this._createService(module);
        this.health.healed++;
      }

      const routesMod = await this._safeImport(path.join(module.path, routes));
      const controllerMod = await this._safeImport(path.join(module.path, controller));
      const serviceMod = await this._safeImport(path.join(module.path, service));

      const instance = this._inject(serviceMod?.default || serviceMod);

      this.modules.set(module.name, {
        routes: routesMod?.default,
        controller: controllerMod?.default,
        service: instance,
      });

      this.services.set(module.name, instance);

      this.health.loaded++;

      console.log(`✔ Module OK: ${module.name}`);
    } catch (err) {
      this.health.failed++;
      this.health.errors.push({
        module: module.name,
        error: err.message,
      });

      console.error(`❌ Module error: ${module.name}`, err.message);
    }
  }

  /**
   * =========================
   * CREATE ROUTES (SAFE)
   * =========================
   */
  async _createRoutes(module) {
    const file = path.join(module.path, `${module.name}.routes.js`);

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, `
import express from "express";
const router = express.Router();

router.get("/health", (req,res)=>{
  res.json({ module:"${module.name}", status:"auto-healed" });
});

export default router;
      `.trim());
    }

    return `${module.name}.routes.js`;
  }

  /**
   * =========================
   * CREATE CONTROLLER
   * =========================
   */
  async _createController(module) {
    const name = module.name.replace(/s$/, "");
    const file = path.join(module.path, `${name}.controller.js`);

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, `
export const ${name}Controller = {
  health(req,res){
    res.json({ module:"${module.name}", status:"auto-healed" });
  }
};
      `.trim());
    }

    return `${name}.controller.js`;
  }

  /**
   * =========================
   * CREATE SERVICE
   * =========================
   */
  async _createService(module) {
    const name = module.name.replace(/s$/, "");
    const ClassName = name.charAt(0).toUpperCase() + name.slice(1);

    const file = path.join(module.path, `${name}.service.js`);

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, `
export default class ${ClassName}Service {
  constructor(deps = {}) {
    this.deps = deps;
  }
}
      `.trim());
    }

    return `${name}.service.js`;
  }

  /**
   * =========================
   * SAFE IMPORT
   * =========================
   */
  async _safeImport(filePath) {
    try {
      return await import(pathToFileURL(filePath).href);
    } catch {
      return null;
    }
  }

  /**
   * =========================
   * DEP INJECTION SAFE
   * =========================
   */
  _inject(ServiceClass) {
    if (!ServiceClass) return null;

    try {
      const deps = ServiceClass.dependencies || [];
      const resolved = {};

      for (const d of deps) {
        resolved[d] =
          this.context[d] ||
          this.services.get(d) ||
          null;
      }

      return new ServiceClass(resolved);
    } catch {
      return new ServiceClass({});
    }
  }

  /**
   * =========================
   * REPORT
   * =========================
   */
  _report() {
    console.log("\n📊 MODULE SYSTEM V5 REPORT");
    console.log("------------------------");
    console.log(`Total   : ${this.health.total}`);
    console.log(`Loaded  : ${this.health.loaded}`);
    console.log(`Healed  : ${this.health.healed}`);
    console.log(`Skipped : ${this.health.skipped}`);
    console.log(`Failed  : ${this.health.failed}`);
    console.log("------------------------\n");
  }

  get(name) {
    return this.modules.get(name);
  }
}
