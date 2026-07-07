import { AIOrchestrator } from "../brain/ai.orchestrator.js";

export class TutorPipeline {

  static PIPELINE_NAME = "TUTOR_PIPELINE_V1";

  /* =========================
     🚀 MAIN PIPELINE HANDLER
  ========================= */
  static async handle(payload = {}) {

    const startTime = Date.now();

    const traceId =
      payload.traceId ||
      this.generateTraceId();

    try {

      /* =========================
         🔐 VALIDATION LAYER
      ========================= */
      const normalizedPayload =
        this.normalize(payload, traceId);

      /* =========================
         🧠 CORE ORCHESTRATION
      ========================= */
      const result =
        await AIOrchestrator.execute(
          normalizedPayload
        );

      /* =========================
         📊 PIPELINE ENRICHMENT
      ========================= */
      return {
        ...result,

        pipeline: {
          name: this.PIPELINE_NAME,
          traceId,
          executionTimeMs:
            Date.now() - startTime
        }
      };

    } catch (error) {

      console.error(
        "[TUTOR_PIPELINE_ERROR]",
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
          "Erreur dans le pipeline d'apprentissage.",

        pipeline: {
          name: this.PIPELINE_NAME,
          executionTimeMs:
            Date.now() - startTime
        },

        error: {
          message: error.message
        }
      };
    }
  }

  /* =========================
     🧠 PAYLOAD NORMALIZATION
  ========================= */
  static normalize(payload, traceId) {

    return {
      ...payload,

      traceId,

      user: {
        id: payload?.user?.id,
        level: payload?.user?.level || "BEGINNER",
        goals: payload?.user?.goals || []
      },

      course: payload?.course || null,

      history: Array.isArray(payload?.history)
        ? payload.history.slice(-20)
        : [],

      metadata: {
        receivedAt: new Date().toISOString(),
        pipeline: this.PIPELINE_NAME
      }
    };
  }

  /* =========================
     🧾 TRACE GENERATOR
  ========================= */
  static generateTraceId() {

    return [
      "PIPE",
      Date.now().toString(36),
      Math.random().toString(36).slice(2, 8)
    ].join("-");
  }
}
