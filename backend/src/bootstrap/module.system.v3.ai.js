import fs from "fs";
import path from "path";

/**
 * MODULE SYSTEM V3 AI
 */

export class ModuleSystemV3AI {
  constructor({ modulesPath } = {}) {
    const cwd = process.cwd().replace(/\\/g, "/");

    this.modulesPath =
      modulesPath ||
      (cwd.includes("/src")
        ? path.join(cwd, "modules")
        : path.join(cwd, "src/modules"));

    this.graph = new Map();
    this.errors = [];
    this.fixed = [];
  }

  async run() {
    console.log("🧠 MODULE SYSTEM V3 AI START");

    if (!fs.existsSync(this.modulesPath)) {
      console.warn("⚠️ Modules path missing:", this.modulesPath);
      return;
    }

    const modules = fs.readdirSync(this.modulesPath, {
      withFileTypes: true,
    });

    for (const mod of modules) {
      if (!mod.isDirectory()) continue;
      await this._processModule(mod.name);
    }

    this._detectCycles();
    this._report();

    console.log("🚀 MODULE SYSTEM V3 AI ACTIVE");
  }

  _processModule(name) {
    const modulePath = path.join(this.modulesPath, name);

    const files = fs.readdirSync(modulePath);
    const jsFiles = files.filter(f => f.endsWith(".js"));

    const deps = [];

    for (const file of jsFiles) {
      const full = path.join(modulePath, file);
      const content = fs.readFileSync(full, "utf-8");

      const imports = [...content.matchAll(/from\s+["']([^"']+)["']/g)]
        .map(m => m[1]);

      deps.push(...imports);
    }

    this.graph.set(name, deps);
  }

  _detectCycles() {
    for (const [mod, deps] of this.graph.entries()) {
      if (deps.includes(mod)) {
        console.warn("⚠️ SELF DEP CYCLE:", mod);
      }
    }
  }

  _report() {
    console.log("\n📊 MODULE SYSTEM V3 REPORT");
    console.log("Modules:", this.graph.size);
    console.log("Errors:", this.errors.length);
  }
}
