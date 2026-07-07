import fs from "fs";
import path from "path";

export class ModuleRegistryV2 {
  constructor({ basePath }) {
    this.basePath = basePath || path.join(process.cwd(), "src/modules");
    this.modules = new Map();
    this.services = new Map();
  }

  async boot() {
    console.log("🔒 MODULE REGISTRY V2: STARTING...");

    const moduleDirs = this._scanModules(this.basePath);

    for (const mod of moduleDirs) {
      try {
        await this._loadModule(mod);
      } catch (err) {
        console.error(❌ Module failed: , err.message);
      }
    }

    console.log("🚀 MODULE REGISTRY V2: ACTIVE");
  }

  _scanModules(base) {
    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => ({
        name: d.name,
        path: path.join(base, d.name),
      }));
  }

  async _loadModule(module) {
    const files = fs.readdirSync(module.path);

    const controller = files.find(f => f.includes("controller"));
    const service = files.find(f => f.includes("service"));
    const routes = files.find(f => f.includes("routes"));

    if (!routes) {
      console.warn(⚠️ Skipped module (no routes): );
      return;
    }

    const mod = {
      name: module.name,
      controller: controller ? await import(path.join(module.path, controller)) : null,
      service: service ? await import(path.join(module.path, service)) : null,
      routes: routes ? await import(path.join(module.path, routes)) : null,
    };

    this.modules.set(module.name, mod);

    if (mod.service?.default) {
      this.services.set(module.name, mod.service.default);
    }
  }

  getService(name) {
    return this.services.get(name);
  }
}
