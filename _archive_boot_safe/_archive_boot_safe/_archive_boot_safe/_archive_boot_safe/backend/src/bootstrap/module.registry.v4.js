import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export class ModuleRegistryV4 {
  constructor({ basePath, context = {} } = {}) {
    this.basePath =
      basePath || path.join(process.cwd(), "modules");

    this.context = context;

    this.modules = new Map();
    this.services = new Map();

    this.health = {
      total: 0,
      loaded: 0,
      skipped: 0,
      repaired: 0,
      failed: 0,
      errors: [],
    };
  }

  /**
   * =========================
   * BOOT SYSTEM
   * =========================
   */
  async boot() {
    console.log("🔒 MODULE REGISTRY V4 AUTO-HEAL: START");

    const modules = this._scanModules();
    this.health.total = modules.length;

    for (const mod of modules) {
      await this._loadOrHeal(mod);
    }

    console.log("🚀 MODULE REGISTRY V4: ACTIVE");

    this._printHealth();
  }

  /**
   * =========================
   * SCAN MODULES
   * =========================
   */
  _scanModules() {
    return fs
      .readdirSync(this.basePath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => ({
        name: d.name,
        path: path.join(this.basePath, d.name),
      }));
  }

  /**
   * =========================
   * LOAD OR AUTO-HEAL
   * =========================
   */
  async _loadOrHeal(module) {
    try {
      let files = fs.readdirSync(module.path);

      let controller = files.find((f) =>
        f.includes("controller")
      );
      let service = files.find((f) =>
        f.includes("service")
      );
      let routes = files.find((f) =>
        f.includes("routes")
      );

      // ❌ ROUTES MISSING → AUTO-HEAL
      if (!routes) {
        console.warn(
          `⚠️ Missing routes → auto-heal: ${module.name}`
        );

        this._generateModuleSkeleton(module);

        this.health.repaired++;
        return;
      }

      const controllerMod = controller
        ? await this._importSafe(
            path.join(module.path, controller)
          )
        : null;

      const serviceMod = service
        ? await this._importSafe(
            path.join(module.path, service)
          )
        : null;

      const routesMod = await this._importSafe(
        path.join(module.path, routes)
      );

      const serviceInstance = this._inject(
        serviceMod?.default || serviceMod
      );

      this.modules.set(module.name, {
        controller:
          controllerMod?.default || controllerMod,
        service: serviceInstance,
        routes: routesMod?.default || routesMod,
      });

      if (serviceInstance) {
        this.services.set(module.name, serviceInstance);
      }

      this.health.loaded++;

      console.log(`✔ Loaded module: ${module.name}`);
    } catch (err) {
      this.health.failed++;
      this.health.errors.push({
        module: module.name,
        error: err.message,
      });

      console.error(
        `❌ Failed module: ${module.name}`,
        err.message
      );
    }
  }

  /**
   * =========================
   * AUTO MODULE GENERATOR
   * =========================
   */
  _generateModuleSkeleton(module) {
    const base = module.path;

    const controller = path.join(
      base,
      `${module.name}.controller.js`
    );
    const service = path.join(
      base,
      `${module.name}.service.js`
    );
    const routes = path.join(
      base,
      `${module.name}.routes.js`
    );

    if (!fs.existsSync(controller)) {
      fs.writeFileSync(
        controller,
        this._controllerTemplate(module.name)
      );
    }

    if (!fs.existsSync(service)) {
      fs.writeFileSync(
        service,
        this._serviceTemplate(module.name)
      );
    }

    if (!fs.existsSync(routes)) {
      fs.writeFileSync(
        routes,
        this._routesTemplate(module.name)
      );
    }
  }

  /**
   * =========================
   * TEMPLATES
   * =========================
   */
  _controllerTemplate(name) {
    return `
export const ${name}Controller = {
  async health(req, res) {
    res.json({ module: "${name}", status: "ok" });
  }
};
`;
  }

  _serviceTemplate(name) {
    return `
export default class ${this._capitalize(
      name
    )}Service {
  static dependencies = [];

  constructor() {}
}
`;
  }

  _routesTemplate(name) {
    return `
import express from "express";
import { ${name}Controller } from "./${name}.controller.js";

const router = express.Router();

router.get("/health", ${name}Controller.health);

export default router;
`;
  }

  /**
   * =========================
   * SAFE IMPORT
   * =========================
   */
  async _importSafe(filePath) {
    try {
      return await import(pathToFileURL(filePath).href);
    } catch (err) {
      throw new Error(
        `Import failed: ${filePath}`
      );
    }
  }

  /**
   * =========================
   * DEP INJECTION
   * =========================
   */
  _inject(Service) {
    if (!Service) return null;
    return new Service({});
  }

  /**
   * =========================
   * HEALTH REPORT
   * =========================
   */
  _printHealth() {
    console.log("\n📊 AUTO-HEAL REPORT V4");
    console.log("------------------------");
    console.log(`Total   : ${this.health.total}`);
    console.log(`Loaded  : ${this.health.loaded}`);
    console.log(`Repaired: ${this.health.repaired}`);
    console.log(`Failed  : ${this.health.failed}`);
    console.log("------------------------\n");
  }

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * =========================
   * PUBLIC API
   * =========================
   */
  getService(name) {
    return this.services.get(name);
  }

  debug() {
    return {
      modules: [...this.modules.keys()],
      health: this.health,
    };
  }
}
