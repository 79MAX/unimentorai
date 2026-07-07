export class ImmortalGuardianV6PP {
  constructor({ moduleSystem, orchestrator }) {
    this.moduleSystem = moduleSystem;
    this.orchestrator = orchestrator;

    this.crashCount = 0;
    this.maxCrashes = 3;

    this.lastHealth = null;
    this.isRecovering = false;
  }

  /**
   * =========================
   * START WATCHDOG SYSTEM
   * =========================
   */
  start() {
    console.log("🛡 IMMORTAL GUARDIAN V6++ ACTIVE");

    this._bindProcessWatchers();
    this._startHealthMonitor();
  }

  /**
   * =========================
   * GLOBAL CRASH WATCHERS
   * =========================
   */
  _bindProcessWatchers() {
    process.on("uncaughtException", (err) => {
      console.error("💀 CRASH:", err?.message || err);
      this._recover("uncaughtException");
    });

    process.on("unhandledRejection", (err) => {
      console.error("⚠️ PROMISE CRASH:", err?.message || err);
      this._recover("unhandledRejection");
    });
  }

  /**
   * =========================
   * MODULE HEALTH LOOP
   * =========================
   */
  _startHealthMonitor() {
    setInterval(() => {
      try {
        const status = this.moduleSystem?.debug?.() || {};

        this.lastHealth = {
          modules: status.modules?.length || 0,
          failed: status.health?.failed || 0,
          time: Date.now(),
        };

        // auto repair trigger
        if (this.lastHealth.failed > 0 && !this.isRecovering) {
          console.warn("🧠 AUTO-RECOVERY TRIGGERED");
          this._moduleHeal();
        }

      } catch (e) {
        console.warn("⚠️ Health monitor error:", e.message);
      }
    }, 8000);
  }

  /**
   * =========================
   * MODULE SELF-HEAL
   * =========================
   */
  _moduleHeal() {
    this.isRecovering = true;

    try {
      console.log("🔧 Healing modules...");

      // soft reload only (no full crash)
      if (this.moduleSystem?.boot) {
        this.moduleSystem.boot();
      }

      console.log("✔ Module recovery done");

    } catch (err) {
      console.error("❌ Heal failed:", err.message);
    } finally {
      setTimeout(() => {
        this.isRecovering = false;
      }, 5000);
    }
  }

  /**
   * =========================
   * CRASH RECOVERY ENGINE
   * =========================
   */
  _recover(type) {
    this.crashCount++;

    console.log(`🧯 IMMORTAL RECOVERY (${type})`);

    if (this.crashCount >= this.maxCrashes) {
      console.log("❌ MAX CRASH LIMIT → SAFE EXIT");
      process.exit(1);
    }

    // soft stabilization instead of restart loop
    setTimeout(() => {
      console.log("🔁 SYSTEM STABILIZATION STEP");
    }, 1500);
  }
}