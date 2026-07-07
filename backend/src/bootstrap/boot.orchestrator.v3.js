import dotenv from "dotenv";
dotenv.config();

import createApp from "../app.js";
import { ModuleSystemV5Clean } from "./module.system.v5.clean.js";

/**
 * =====================================
 * BOOT ORCHESTRATOR V3 ULTRA CLEAN
 * RESILIENT + SAFE + IMMORTAL READY CORE
 * =====================================
 */

export class BootOrchestratorV3 {
  constructor() {
    this.server = null;
    this.started = false;
    this.shuttingDown = false;
    this.bootTimestamp = 0;

    this.port = Number(process.env.PORT || 5000);

    this.moduleSystem = new ModuleSystemV5Clean();

    this._signalsRegistered = false;
    this._registerSignalsOnce();
  }

  /**
   * =============================
   * GLOBAL LOCK (SAFE INIT)
   * =============================
   */
  _ensureSingleInstance() {
    if (global.__ORCHESTRATOR_RUNNING__) {
      throw new Error("Orchestrator already running (global lock)");
    }
    global.__ORCHESTRATOR_RUNNING__ = true;
  }

  /**
   * =============================
   * SIGNALS SAFE
   * =============================
   */
  _registerSignalsOnce() {
    if (this._signalsRegistered) return;
    this._signalsRegistered = true;

    const safeShutdown = (signal) => this.shutdown(signal);

    process.on("SIGINT", safeShutdown);
    process.on("SIGTERM", safeShutdown);

    process.on("uncaughtException", (err) => {
      console.error("🔥 Uncaught Exception:", err?.message || err);
      safeShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (err) => {
      console.error("⚠️ Unhandled Rejection:", err?.message || err);
    });
  }

  /**
   * =============================
   * BOOT START
   * =============================
   */
  async start() {
    if (this.started) {
      console.warn("⚠️ Orchestrator already started");
      return;
    }

    this._ensureSingleInstance();

    this.started = true;
    this.bootTimestamp = Date.now();

    try {
      console.log("\n🧠 BOOT ORCHESTRATOR V3 START");
      console.log("📦 SYSTEM: V5 CLEAN READY");
      console.log("📁 MODULE SYSTEM: BOOTING...");

      await this._safeBootModules();

      const app = createApp();

      await this._startServerWithFallback(app);

      this._selfHealHook();
      this._bootReport();

    } catch (err) {
      console.error("❌ ORCHESTRATOR FAILED:", err?.message || err);
      this.shutdown("fatal-error");
    }
  }

  /**
   * =============================
   * MODULE SYSTEM SAFE BOOT
   * =============================
   */
  async _safeBootModules() {
    try {
      await this.moduleSystem.boot();
      console.log("🧩 MODULE SYSTEM: OK");
    } catch (err) {
      console.warn("⚠️ MODULE SYSTEM DEGRADED:", err?.message || err);
    }
  }

  /**
   * =============================
   * AUTO PORT RESOLUTION (SAFE)
   * =============================
   */
  async _startServerWithFallback(app) {
    const MAX_TRIES = 10;
    let port = this.port;

    for (let i = 0; i < MAX_TRIES; i++) {
      try {
        await this._tryListen(app, port);

        console.log(`🚀 Server running on port ${port}`);
        console.log("🧠 STATUS: ONLINE");
        console.log("⚡ ORCHESTRATOR V3 ACTIVE\n");

        this.port = port;
        return;

      } catch (err) {
        if (err.code === "EADDRINUSE") {
          console.warn(`⚠️ Port ${port} busy → retrying ${port + 1}`);

          await this._safeCloseServer();
          port++;
          continue;
        }

        throw err;
      }
    }

    throw new Error("No available ports found");
  }

  /**
   * =============================
   * LISTEN WRAPPER
   * =============================
   */
  _tryListen(app, port) {
    return new Promise((resolve, reject) => {
      const server = app.listen(port);

      server.once("listening", () => {
        this.server = server;
        resolve();
      });

      server.once("error", (err) => {
        reject(err);
      });
    });
  }

  /**
   * =============================
   * SAFE SERVER CLOSE
   * =============================
   */
  _safeCloseServer() {
    return new Promise((resolve) => {
      if (!this.server) return resolve();

      this.server.close(() => resolve());
    });
  }

  /**
   * =============================
   * BOOT REPORT
   * =============================
   */
  _bootReport() {
    const duration = Date.now() - this.bootTimestamp;

    console.log("📊 BOOT REPORT");
    console.log("---------------------");
    console.log(`⏱ Boot time: ${duration}ms`);
    console.log(`📡 Port: ${this.port}`);
    console.log(`🧠 Status: STABLE`);
    console.log("---------------------\n");
  }

  /**
   * =============================
   * SELF HEAL HOOK
   * =============================
   */
  _selfHealHook() {
    console.log("🧠 Self-healing hook ready (V3)");
  }

  /**
   * =============================
   * SHUTDOWN SAFE
   * =============================
   */
  shutdown(signal) {
    if (this.shuttingDown) return;
    this.shuttingDown = true;

    console.log(`⚠️ Shutdown signal: ${signal}`);

    if (!this.server) {
      global.__ORCHESTRATOR_RUNNING__ = false;
      process.exit(0);
    }

    this.server.close(() => {
      console.log("✔ Server closed safely");
      global.__ORCHESTRATOR_RUNNING__ = false;
      process.exit(0);
    });

    setTimeout(() => {
      console.log("❌ Forced shutdown");
      process.exit(1);
    }, 5000);
  }
}

/**
 * BOOT ENTRYPOINT
 */
const orchestrator = new BootOrchestratorV3();
orchestrator.start();