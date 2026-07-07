import { performance } from "node:perf_hooks";
import { AIOrchestrator } from "./ai.orchestrator.js";

export class AIBrainEngine {

  static ENGINE_NAME = "UNIMENTOR_AI_BRAIN";

  static VERSION = "1.0.0";

  /* =========================
     🧠 MAIN ENTRYPOINT
  ========================= */
  static async process(payload = {}) {

    const startedAt = performance.now();

    try {

      this.validatePayload(payload);

      const result =
        await AIOrchestrator.execute(payload);

      return {
        ...result,

        brain: {
          engine: this.ENGINE_NAME,
          version: this.VERSION,
          executionTimeMs: Math.round(
            performance.now() - startedAt
          )
        }
      };

    } catch (error) {

      console.error(
        "[AI_BRAIN_ENGINE_ERROR]",
        {
          message: error.message,
          stack: error.stack
        }
      );

      return {
        success: false,

        reply:
          "Le moteur pédagogique est temporairement indisponible.",

        error: {
          message: error.message
        },

        brain: {
          engine: this.ENGINE_NAME,
          version: this.VERSION,
          executionTimeMs: Math.round(
            performance.now() - startedAt
          )
        }
      };
    }
  }

  /* =========================
     🔐 INPUT VALIDATION
  ========================= */
  static validatePayload(payload) {

    if (!payload) {
      throw new Error(
        "Payload is required"
      );
    }

    if (!payload.user?.id) {
      throw new Error(
        "User ID is required"
      );
    }

    if (!payload.aiProvider) {
      throw new Error(
        "AI provider is required"
      );
    }
  }

  /* =========================
     ❤️ HEALTH STATUS
  ========================= */
  static async health() {

    return {
      status: "ONLINE",

      engine:
        this.ENGINE_NAME,

      version:
        this.VERSION,

      uptimeSeconds:
        Math.floor(process.uptime()),

      memoryUsage:
        process.memoryUsage(),

      nodeVersion:
        process.version,

      timestamp:
        new Date().toISOString()
    };
  }

  /* =========================
     ℹ️ ENGINE INFO
  ========================= */
  static info() {

    return {
      engine:
        this.ENGINE_NAME,

      version:
        this.VERSION,

      capabilities: [
        "adaptive_learning",
        "memory_os",
        "course_ranking",
        "mentor_ai",
        "strategy_engine",
        "certificate_trigger"
      ]
    };
  }
}
