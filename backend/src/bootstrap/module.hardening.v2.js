export class ModuleHardeningV2 {
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
   * RUN FULL DIAGNOSTIC
   * =========================
   */
  run() {
    console.log("🔒 MODULE HARDENING V2: START");

    const modules = this.registry.modules;

    this.health.total = modules.size;

    for (const [name, mod] of modules) {
      this._analyze(name, mod);
    }

    this._printReport();
    this._registerHealthEndpoint();

    console.log("🚀 MODULE HARDENING V2: ACTIVE");
  }

  /**
   * =========================
   * MODULE ANALYSIS ENGINE
   * =========================
   */
  _analyze(name, mod) {
    const score = {
      controller: !!mod.controller ? 30 : 0,
      service: !!mod.service ? 40 : 0,
      routes: !!mod.routes ? 30 : 0,
    };

    const totalScore =
      score.controller + score.service + score.routes;

    const status = {
      score: totalScore,
      level: this._getLevel(totalScore),
      controller: !!mod.controller,
      service: !!mod.service,
      routes: !!mod.routes,
    };

    if (!mod.routes) {
      this.health.skipped++;
      this.health.modules[name] = status;
      console.warn(`⚠️ Module skipped (no routes): ${name}`);
      return;
    }

    if (totalScore < 70) {
      this.health.failed++;
      this.health.modules[name] = status;
      console.error(`❌ Weak module detected: ${name} (${totalScore})`);
      return;
    }

    this.health.loaded++;
    this.health.modules[name] = status;

    console.log(`✔ Module healthy: ${name} (${totalScore})`);
  }

  /**
   * =========================
   * HEALTH LEVELS
   * =========================
   */
  _getLevel(score) {
    if (score >= 90) return "EXCELLENT";
    if (score >= 70) return "STABLE";
    if (score >= 40) return "DEGRADED";
    return "CRITICAL";
  }

  /**
   * =========================
   * REPORT
   * =========================
   */
  _printReport() {
    console.log("\n📊 MODULE HEALTH REPORT V2");
    console.log("--------------------------------");
    console.log(`Total   : ${this.health.total}`);
    console.log(`Loaded  : ${this.health.loaded}`);
    console.log(`Failed  : ${this.health.failed}`);
    console.log(`Skipped : ${this.health.skipped}`);
    console.log("--------------------------------\n");
  }

  /**
   * =========================
   * HEALTH API HOOK
   * =========================
   */
  _registerHealthEndpoint() {
    try {
      const expressApp = this.registry.context?.app;

      if (!expressApp) {
        console.warn("⚠️ No Express app found for health endpoint");
        return;
      }

      expressApp.get("/health/modules", (req, res) => {
        res.json({
          status: "ok",
          timestamp: Date.now(),
          summary: this.health,
        });
      });

      console.log("🌐 Health endpoint registered: /health/modules");
    } catch (err) {
      console.warn("⚠️ Health endpoint failed:", err.message);
    }
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
