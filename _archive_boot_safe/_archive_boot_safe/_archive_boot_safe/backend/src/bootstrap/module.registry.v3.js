import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export class ModuleRegistryV4 {
  constructor({ basePath, context = {}, hardening = null } = {}) {
    this.basePath = this._resolveBasePath(basePath);

    this.context = context;
    this.hardening = hardening;

    this.modules = new Map();
    this.services = new Map();

    this.health = {
      total: 0,
      loaded: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };
  }

  /**
   * =========================
   * ROOT RESOLVER (ANTI src)
   * =========================
   */
  _resolveBasePath(custom) {
    if (custom) return custom;

    let cwd = process.cwd().replace(/\\/g, "/");

    // anti duplication bugs
    cwd = cwd
      .replace(/backend\/backend/g, "backend")
      .replace(/src\/src/g, "src");

    const parts = cwd.split("/");

    const srcIndex = parts.lastIndexOf("src");

    if (srcIndex !== -1) {
      return path.join(
        parts.slice(0, srcIndex + 1).join("/"),
        "modules"
      );
    }

    return path.resolve("backend/src/modules");
  }

  /**
   * =========================
   * BOOT
   * =========================
   */
  async boot() {
    console.log("🔒 MODULE REGISTRY V4: BOOTING...");

    if (!fs.existsSync(this.basePath)) {
      console.warn("⚠️ Modules path missing:", this.basePath);
      return;
    }

    const modules = this._scanModulesSafe();
    this.health.total = modules.length;

    for (const mod of modules) {
      await this._loadModuleSafe(mod);
    }

    console.log("🚀 MODULE REGISTRY V4: ACTIVE");

    this._printHealth();
    this._runHardening();
  }

  /**
   * =========================
   * SAFE SCAN
   * =========================
   */
  _scanModulesSafe() {
    try {
      return fs
        .readdirSync(this.basePath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => ({
          name: d.name,
          path: path.join(this.basePath, d.name),
        }));
    } catch (err) {
      console.warn("⚠️ Scan failed:", err.message);
      return [];
    }
  }

  /**
   * =========================
   * SAFE MODULE LOADER
   * =========================
   */
  async _loadModuleSafe(module) {
    try {
      if (!fs.existsSync(module.path)) {
        this.health.skipped++;
        return;
      }

      const files = fs.readdirSync(module.path);

      const routesFile = files.find(f => f.includes("routes"));
      const controllerFile = files.find(f => f.includes("controller"));
      const serviceFile = files.find(f => f.includes("service"));

      if (!routesFile) {
        this.health.skipped++;
        console.warn(`⚠️ Skipped (no routes): ${module.name}`);
        return;
      }

      const routes = await this._importSafe(path.join(module.path, routesFile));
      const controller = controllerFile
        ? await this._importSafe(path.join(module.path, controllerFile))
        : null;

      const service = serviceFile
        ? await this._importSafe(path.join(module.path, serviceFile))
        : null;

      const serviceInstance = this._inject(service?.default || service);

      this.modules.set(module.name, {
        name: module.name,
        controller: controller?.default || controller,
        service: serviceInstance,
        routes: routes?.default || routes,
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

      console.error(`❌ Failed module: ${module.name}`, err.message);
    }
  }

  /**
   * =========================
   * SAFE IMPORT
   * =========================
   */
  async _importSafe(filePath) {
    try {
      return await import(pathToFileURL(filePath).href);
    } catch {
      return null;
    }
  }

  /**
   * =========================
   * DEPENDENCY INJECTION SAFE
   * =========================
   */
  _inject(ServiceClass) {
    if (!ServiceClass) return null;

    try {
      const deps = ServiceClass.dependencies || [];
      const resolved = {};

      for (const dep of deps) {
        resolved[dep] =
          this.context[dep] ||
          this.services.get(dep) ||
          null;
      }

      return new ServiceClass(resolved);
    } catch {
      return new ServiceClass({});
    }
  }

  /**
   * =========================
   * HARDENING HOOK
   * =========================
   */
  _runHardening() {
    try {
      if (!this.hardening) return;
      new this.hardening(this).run();
    } catch (err) {
      console.warn("⚠️ Hardening failed:", err.message);
    }
  }

  /**
   * =========================
   * HEALTH REPORT
   * =========================
   */
  _printHealth() {
    console.log("\n📊 MODULE REGISTRY V4 HEALTH");
    console.log("------------------------");
    console.log(`Total   : ${this.health.total}`);
    console.log(`Loaded  : ${this.health.loaded}`);
    console.log(`Skipped : ${this.health.skipped}`);
    console.log(`Failed  : ${this.health.failed}`);
    console.log("------------------------\n");
  }

  /**
   * =========================
   * API
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
