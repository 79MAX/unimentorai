import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export class ModuleRegistryV5AI {
  constructor({ basePath, context = {} } = {}) {
    this.basePath =
      basePath || path.join(process.cwd(), "modules");

    this.context = context;

    this.modules = new Map();
    this.services = new Map();

    this.aiHealth = {
      total: 0,
      loaded: 0,
      repaired: 0,
      failed: 0,
      skipped: 0,
      scores: {},
    };
  }

  // =========================
  // BOOT
  // =========================
  async boot() {
    console.log("🧠 MODULE REGISTRY V5 AI-HEAL: START");

    const modules = this._scan();

    this.aiHealth.total = modules.length;

    for (const mod of modules) {
      await this._processModule(mod);
    }

    this._report();

    console.log("🚀 V5 AI-HEAL ACTIVE");
  }

  // =========================
  // SCAN
  // =========================
  _scan() {
    return fs
      .readdirSync(this.basePath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => ({
        name: d.name,
        path: path.join(this.basePath, d.name),
      }));
  }

  // =========================
  // MAIN PROCESSOR
  // =========================
  async _processModule(module) {
    try {
      const files = fs.readdirSync(module.path);

      let controller = files.find((f) =>
        f.includes("controller")
      );
      let service = files.find((f) =>
        f.includes("service")
      );
      let routes = files.find((f) =>
        f.includes("routes")
      );

      // ❌ AI RULE: missing routes = auto repair
      if (!routes) {
        this._aiRepair(module);
        this.aiHealth.repaired++;
        return;
      }

      const controllerMod = await this._safeImport(
        module.path,
        controller
      );

      const serviceMod = await this._safeImport(
        module.path,
        service
      );

      const routesMod = await this._safeImport(
        module.path,
        routes
      );

      const serviceInstance =
        this._inject(serviceMod?.default);

      const score = this._scoreModule({
        controller: controllerMod,
        service: serviceInstance,
        routes: routesMod,
      });

      this.aiHealth.scores[module.name] = score;

      if (score < 50) {
        console.warn(
          `⚠️ Weak module detected: ${module.name} (${score})`
        );
      }

      this.modules.set(module.name, {
        controller: controllerMod?.default,
        service: serviceInstance,
        routes: routesMod?.default,
        score,
      });

      this.services.set(module.name, serviceInstance);

      this.aiHealth.loaded++;

      console.log(
        `✔ AI Loaded: ${module.name} [score=${score}]`
      );
    } catch (err) {
      this.aiHealth.failed++;

      console.error(
        `❌ AI Failed: ${module.name}`,
        err.message
      );
    }
  }

  // =========================
  // AI MODULE SCORE ENGINE
  // =========================
  _scoreModule({ controller, service, routes }) {
    let score = 0;

    if (controller) score += 30;
    if (service) score += 40;
    if (routes) score += 30;

    return score;
  }

  // =========================
  // AI AUTO REPAIR ENGINE
  // =========================
  _aiRepair(module) {
    const base = module.path;

    const routesFile = path.join(
      base,
      `${module.name}.routes.js`
    );

    const controllerFile = path.join(
      base,
      `${module.name}.controller.js`
    );

    const serviceFile = path.join(
      base,
      `${module.name}.service.js`
    );

    if (!fs.existsSync(routesFile)) {
      fs.writeFileSync(
        routesFile,
        `
import express from "express";

const router = express.Router();

router.get("/health", (req,res)=>{
  res.json({ module: "${module.name}", status: "auto-healed" });
});

export default router;
        `
      );
    }

    if (!fs.existsSync(controllerFile)) {
      fs.writeFileSync(
        controllerFile,
        `
export const ${module.name}Controller = {
  health(req,res){
    res.json({ ok:true, module:"${module.name}" });
  }
};
        `
      );
    }

    if (!fs.existsSync(serviceFile)) {
      fs.writeFileSync(
        serviceFile,
        `
export default class ${this._cap(module.name)}Service {}
        `
      );
    }

    console.log(`🛠 AI REPAIRED MODULE: ${module.name}`);
  }

  // =========================
  // SAFE IMPORT
  // =========================
  async _safeImport(dir, file) {
    if (!file) return null;

    const full = path.join(dir, file);

    try {
      return await import(pathToFileURL(full).href);
    } catch (err) {
      console.warn(`⚠️ Import fix needed: ${file}`);
      return null;
    }
  }

  // =========================
  // DEP INJECTION
  // =========================
  _inject(Service) {
    if (!Service) return null;
    return new Service({});
  }

  // =========================
  // REPORT
  // =========================
  _report() {
    console.log("\n🧠 V5 AI-HEAL REPORT");
    console.log("----------------------");
    console.log(`Total   : ${this.aiHealth.total}`);
    console.log(`Loaded  : ${this.aiHealth.loaded}`);
    console.log(`Repaired: ${this.aiHealth.repaired}`);
    console.log(`Failed  : ${this.aiHealth.failed}`);
    console.log("----------------------\n");
  }

  _cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // =========================
  // PUBLIC API
  // =========================
  getService(name) {
    return this.services.get(name);
  }

  debug() {
    return {
      modules: [...this.modules.keys()],
      aiHealth: this.aiHealth,
    };
  }
}
