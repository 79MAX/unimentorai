export class ModuleHardeningV1 {
  constructor(registry) {
    this.registry = registry;

    this.health = {
      total: 0,
      loaded: 0,
      failed: 0,
      skipped: 0,
      modules: {},
    };
  }

  /**
   * =========================
   * RUN HARDENING CHECK
   * =========================
   */
  run() {
    console.log("🔒 MODULE HARDENING V1: START");

    const modules = this.registry.modules;

    this.health.total = modules.size;

    for (const [name, mod] of modules) {
      this._checkModule(name, mod);
    }

    this._printReport();

    console.log("✅ MODULE HARDENING V1: DONE");
  }

  /**
   * =========================
   * MODULE VALIDATION
   * =========================
   */
  _checkModule(name, mod) {
    const status = {
      controller: !!mod.controller,
      service: !!mod.service,
      routes: !!mod.routes,
      healthy: false,
    };

    // MODULE MINIMUM REQUIREMENT
    if (!status.routes) {
      status.reason = "NO_ROUTES";
      this.health.skipped++;
      this.health.modules[name] = status;

      console.warn(`⚠️ Skipped module (no routes): ${name}`);
      return;
    }

    if (!status.service) {
      status.reason = "NO_SERVICE";
      this.health.failed++;
      this.health.modules[name] = status;

      console.error(`❌ Module failed (no service): ${name}`);
      return;
    }

    status.healthy = true;
    this.health.loaded++;

    this.health.modules[name] = status;

    console.log(`✔ Module healthy: ${name}`);
  }

  /**
   * =========================
   * REPORT
   * =========================
   */
  _printReport() {
    console.log("\n📊 MODULE HEALTH REPORT");
    console.log("------------------------");
    console.log(`Total   : ${this.health.total}`);
    console.log(`Loaded  : ${this.health.loaded}`);
    console.log(`Failed  : ${this.health.failed}`);
    console.log(`Skipped : ${this.health.skipped}`);
    console.log("------------------------\n");
  }

  /**
   * =========================
   * GET HEALTH
   * =========================
   */
  getHealth() {
    return this.health;
  }
}
