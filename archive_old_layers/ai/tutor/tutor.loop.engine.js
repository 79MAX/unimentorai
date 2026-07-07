import { performance } from "node:perf_hooks";
import { TutorPipeline } from "./tutor.pipeline.js";

export class AITutorLoopEngine {

  static ENGINE_NAME = "AI_TUTOR_LOOP_ENGINE";

  /* =========================
     🚀 MAIN LOOP ENTRYPOINT
  ========================= */
  static async run(payload = {}) {

    const startTime =
      performance.now();

    const traceId =
      this.generateTraceId();

    try {

      /* =========================
         🔐 VALIDATION LAYER
      ========================= */
      this.validate(payload);

      /* =========================
         🧠 PIPELINE EXECUTION
      ========================= */
      const result =
        await TutorPipeline.handle({
          ...payload,
          traceId
        });

      /* =========================
         📊 ENRICH RESPONSE
      ========================= */
      return {
        ...result,

        tutorLoop: {
          engine: this.ENGINE_NAME,
          traceId,
          executionTimeMs: Math.round(
            performance.now() - startTime
          )
        }
      };

    } catch (error) {

      console.error(
        "[TUTOR_LOOP_ENGINE_ERROR]",
        {
          traceId,
          message: error.message,
          stack: error.stack
        }
      );

      return {
        success: false,

        traceId,

        reply:
          "Une erreur est survenue pendant le processus d'apprentissage.",

        tutorLoop: {
          engine: this.ENGINE_NAME,
          executionTimeMs: Math.round(
            performance.now() - startTime
          )
        },

        error: {
          message: error.message
        }
      };
    }
  }

  /* =========================
     🔐 INPUT VALIDATION
  ========================= */
  static validate(payload) {

    if (!payload) {
      throw new Error("Payload is required");
    }

    if (!payload.user?.id) {
      throw new Error("User ID is required");
    }

    if (!payload.message) {
      throw new Error("Message is required");
    }
  }

  /* =========================
     🧾 TRACE GENERATOR
  ========================= */
  static generateTraceId() {

    return [
      "TUTOR",
      Date.now().toString(36),
      Math.random().toString(36).slice(2, 8)
    ].join("-");
  }
}
