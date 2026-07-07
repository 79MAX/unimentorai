import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ModuleRegistryV7Clean {
  constructor({ context = {} } = {}) {
    this.root = path.resolve(__dirname, "../../../");
    this.basePath = path.join(this.root, "modules");

    this.context = context;

    this.modules = new Map();
    this.services = new Map();

    this.stats = { total: 0, loaded: 0, failed: 0, repaired: 0 };
  }

  async boot() {
    console.log("🧠 V7 BOOTING...");

    if (!fs.existsSync(this.basePath)) {
      throw new Error(Modules path not found: );
    }

    const modules = fs.readdirSync(this.basePath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => ({ name: d.name, path: path.join(this.basePath, d.name) }));

    this.stats.total = modules.length;

    for (const mod of modules) {
      await this._load(mod);
    }

    console.log("🚀 V7 ACTIVE");
  }

  async _load(module) {
    try {
      const files = fs.readdirSync(module.path);
      const routesFile = files.find(f => f.includes("routes"));

      if (!routesFile) {
        this._repair(module);
        this.stats.repaired++;
        return;
      }

      const routes = await import(
        pathToFileURL(path.join(module.path, routesFile)).href
      );

      this.modules.set(module.name, {
        routes: routes?.default,
        status: "loaded"
      });

      this.stats.loaded++;

      console.log(✔ Loaded: );
    } catch (err) {
      this.stats.failed++;
      console.error(❌ Failed: , err.message);
    }
  }

  _repair(module) {
    const file = path.join(module.path, ${module.name}.routes.js);

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, \
import express from "express";
const router = express.Router();

router.get("/health",(req,res)=>{
  res.json({ module:"\", status:"repaired" });
});

export default router;
\);
    }
  }
}
