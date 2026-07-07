/**
 * 🧠 AI OPERATING SYSTEM — UNIMENTORAI (PRODUCTION KERNEL)
 * Level: OpenAI / Stripe / Meta Infrastructure Style
 * Core: Event-driven AI runtime + orchestration engine
 */

import { AiOrchestratorEngine } from "./orchestrator/ai_orchestrator.engine.js";
import { RealtimeGateway } from "./realtime/realtime.gateway.js";

export class AIOS {

  /* =========================
     🧠 SYSTEM STATE (KERNEL MEMORY)
  ========================= */
  static state = {
    started: false,
    intervalId: null,
    lastTick: null,
    tickCount: 0,
    mode: "AUTO", // AUTO | SAFE | PERFORMANCE
    health: 100,
    errorCount: 0
  };

  /* =========================
     🚀 BOOT KERNEL
  ========================= */
  static init(server, options = {}) {

    if (this.state.started) {
      console.warn("⚠️ AIOS already initialized");
      return;
    }

    console.log("🧠 AI OPERATING SYSTEM BOOTING...");

    try {

      // ⚡ REALTIME LAYER
      if (server) {
        RealtimeGateway.init(server);
      }

      // 🧠 START ORCHESTRATION LOOP
      this.startLoop(options);

      this.state.started = true;

      console.log("⚡ AI OS FULLY OPERATIONAL");

    } catch (err) {

      this.state.errorCount++;
      console.error("❌ AIOS BOOT FAILURE:", err);

      this.state.mode = "SAFE";
    }
  }

  /* =========================
     🔁 MAIN LOOP ENGINE
  ========================= */
  static startLoop({ interval = 5000 } = {}) {

    if (this.state.intervalId) return;

    this.state.intervalId = setInterval(async () => {

      try {

        this.state.tickCount++;
        this.state.lastTick = Date.now();

        // 🧠 SAFE ORCHESTRATION CALL
        await AiOrchestratorEngine.run({});

        // 📊 HEALTH UPDATE
        this.updateHealth();

      } catch (err) {

        this.state.errorCount++;
        console.error("⚠️ AIOS LOOP ERROR:", err);

        // 🧯 AUTO RECOVERY MODE
        if (this.state.errorCount > 5) {
          this.state.mode = "SAFE";
        }
      }

    }, interval);
  }

  /* =========================
     📊 SYSTEM HEALTH ENGINE
  ========================= */
  static updateHealth() {

    const base = 100;

    const penalty = this.state.errorCount * 5;

    this.state.health = Math.max(0, base - penalty);

    if (this.state.health < 30) {
      this.state.mode = "SAFE";
    }
  }

  /* =========================
     🧠 MANUAL EXECUTION API
  ========================= */
  static async run(payload = {}) {

    try {

      return await AiOrchestratorEngine.run(payload);

    } catch (err) {

      this.state.errorCount++;

      console.error("❌ AIOS MANUAL RUN ERROR:", err);

      return {
        error: true,
        message: err.message
      };
    }
  }

  /* =========================
     ⛔ SHUTDOWN ENGINE (IMPORTANT FOR PROD)
  ========================= */
  static shutdown() {

    console.log("⛔ AIOS SHUTTING DOWN...");

    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }

    this.state.started = false;

    console.log("🧠 AI OS OFFLINE");
  }

  /* =========================
     📡 STATUS MONITORING (ADMIN PANEL READY)
  ========================= */
  static status() {

    return {
      started: this.state.started,
      mode: this.state.mode,
      health: this.state.health,
      ticks: this.state.tickCount,
      lastTick: this.state.lastTick,
      errors: this.state.errorCount
    };
  }
}

