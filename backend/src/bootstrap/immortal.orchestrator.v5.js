import dotenv from "dotenv";
dotenv.config();

import createApp from "../app.js";
import { ModuleSystemV5Clean } from "./module.system.v5.clean.js";

/**
 * =====================================
 * IMMORTAL BACKEND V5 CORE
 * NEVER CRASH DESIGN
 * =====================================
 */

class ImmortalOrchestratorV5 {
  constructor() {
    this.server = null;
    this.started = false;
    this.shuttingDown = false;

    this.port = Number(process.env.PORT || 5000);

    // CORE SYSTEM
    this.moduleSystem = new ModuleSystemV5Clean();

    // IMMORTAL STATE
    this.health = {
      booted: false,
      modulesLoaded: false,
      lastError: null,
      restartCount: 0,
    };

    this._registerGlobalGuards();
  }

  /**
   * =====================================
   * GLOBAL CRASH SHIELD
   * =====================================
   */
  _registerGlobalGuards() {
    process.on("uncaughtException", (err) => {
      console.error("🔥 UNCUGHT:", err?.message);
      this._recover("uncaughtException");
    });

    process.on("unhandledRejection", (err) => {
      console.error("🔥 REJECTION:", err);
      this._recover("unhandledRejection");
    });

    process.on("SIGINT", () => this.shutdown("SIGINT"));
    process.on("SIGTERM", () => this.shutdown("SIGTERM"));
  }

  /**
   * =====================================
   * IMMORTAL START
   * =====================================
   */
  async start() {
    if (this.started) return;

    this.started = true;

    try {
      console.log("\n🧠 IMMORTAL BACKEND V5 START");
      console.log("🛡️ MODE: IMMORTAL ACTIVE");

      await this._bootModulesSafe();

      const app = createApp();

      this.server = app.listen(this.port, () => {
        this.health.booted = true;

        console.log(`🚀 Server running on port ${this.port}`);
        console.log("🧠 STATUS: IMMORTAL ONLINE");
      });

      this._startHealthLoop();

    } catch (err) {
      this.health.lastError = err;
      this._recover("boot-failure");
    }
  }

  /**
   * =====================================
   * SAFE MODULE BOOT (ISOLATED)
   * =====================================
   */
  async _bootModulesSafe() {
    try {
      await this.moduleSystem.boot();
      this.health.modulesLoaded = true;

      console.log("🧩 Modules: OK");
    } catch (err) {
      this.health.modulesLoaded = false;
      this.health.lastError = err;

      console.warn("⚠️ Modules degraded mode activated");
    }
  }

  /**
   * =====================================
   * IMMORTAL RECOVERY ENGINE
   * =====================================
   */
  _recover(source) {
    console.log(`♻️ RECOVERY TRIGGERED: ${source}`);

    this.health.restartCount++;
    this.health.lastError = source;

    // NEVER crash process directly
    if (this.restartCount > 5) {
      console.error("💀 Too many failures - safe shutdown");
      this.shutdown("fail-safe");
      return;
    }

    setTimeout(() => {
      console.log("🔁 Attempting self-heal restart cycle...");
      this._restartCore();
    }, 1000);
  }

  /**
   * =====================================
   * CORE RESTART (HOT FIX STYLE)
   * =====================================
   */
  async _restartCore() {
    try {
      if (this.server) {
        this.server.close();
      }

      this.server = null;
      this.started = false;

      await this.start();
    } catch (err) {
      console.error("❌ Restart failed:", err?.message);
    }
  }

  /**
   * =====================================
   * HEALTH MONITOR LOOP
   * =====================================
   */
  _startHealthLoop() {
    setInterval(() => {
      console.log("💓 HEALTH CHECK:", {
        booted: this.health.booted,
        modules: this.health.modulesLoaded,
        restarts: this.health.restartCount,
      });
    }, 30000);
  }

  /**
   * =====================================
   * SAFE SHUTDOWN
   * =====================================
   */
  shutdown(signal) {
    if (this.shuttingDown) return;
    this.shuttingDown = true;

    console.log(`⚠️ Shutdown: ${signal}`);

    if (!this.server) {
      process.exit(0);
    }

    this.server.close(() => {
      console.log("✔ Immortal backend stopped safely");
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 5000);
  }
}

/**
 * BOOT
 */
const app = new ImmortalOrchestratorV5();
app.start();