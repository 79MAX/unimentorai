import fs from "fs";
import path from "path";

export class SelfHealingV2Engine {
  constructor({ modulesPath } = {}) {
    this.modulesPath =
      modulesPath || path.join(process.cwd(), "src/modules");

    this.repaired = 0;
    this.fixed = [];
  }

  async run() {
    console.log("🧠 SELF-HEALING V2 START");

    if (!fs.existsSync(this.modulesPath)) {
      console.warn("⚠️ Modules folder missing:", this.modulesPath);
      return;
    }

    const modules = fs.readdirSync(this.modulesPath, { withFileTypes: true });

    for (const mod of modules) {
      if (!mod.isDirectory()) continue;
      await this._healModule(mod.name);
    }

    this._report();
  }

  async _healModule(name) {
    const modulePath = path.join(this.modulesPath, name);

    const singular = name.replace(/s$/, "");

    const controller = path.join(modulePath, `${singular}.controller.js`);
    const service = path.join(modulePath, `${singular}.service.js`);
    const routes = path.join(modulePath, `${name}.routes.js`);

    if (!fs.existsSync(controller)) {
      fs.writeFileSync(controller, `
export const ${singular}Controller = {
  health(req,res){
    res.json({ module: "${name}", status: "auto-healed" });
  }
};
      `);
      this._log("controller created: " + name);
    }

    if (!fs.existsSync(service)) {
      fs.writeFileSync(service, `
export default class ${singular.charAt(0).toUpperCase() + singular.slice(1)}Service {
  constructor(deps = {}) {
    this.deps = deps;
  }
}
      `);
      this._log("service created: " + name);
    }

    if (!fs.existsSync(routes)) {
      fs.writeFileSync(routes, `
import express from "express";
import { ${singular}Controller } from "./${singular}.controller.js";

const router = express.Router();

router.get("/health", ${singular}Controller.health);

export default router;
      `);
      this._log("routes created: " + name);
    }

    this.repaired++;
  }

  _log(msg) {
    this.fixed.push(msg);
    console.log("🛠", msg);
  }

  _report() {
    console.log("\n📊 SELF-HEALING V2 REPORT");
    console.log("-------------------------");
    console.log("Repaired modules:", this.repaired);
    console.log("Fix count:", this.fixed.length);
    console.log("-------------------------\n");
  }
}
