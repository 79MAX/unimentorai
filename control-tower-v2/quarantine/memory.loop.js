import { MemoryOrchestrator } from "./memory.orchestrator.js";

/* =========================
   🧠 SELF-LEARNING LOOP (PRODUCTION CORE)
   - event pipeline entry
   - safe execution wrapper
   - scalable AI memory ingestion trigger
========================= */

export class MemoryLoop {

  /**
   * 🚀 MAIN LOOP ENTRY
   * Triggers memory learning pipeline after AI interaction
   */
  static async run(data = {}) {

    if (!data || typeof data !== "object") return null;

    const {
      userId,
      message,
      aiResponse,
      level = "BEGINNER",
      sessionId = null
    } = data;

    if (!userId || !message) return null;

    try {

      /* =========================
         🧠 MEMORY PIPELINE EXECUTION
      ========================= */
      return await MemoryOrchestrator.process({
        userId,
        message,
        aiResponse,
        level,
        sessionId
      });

    } catch (err) {

      console.error("[MEMORY_LOOP_ERROR]", {
        message: err.message,
        stack: err.stack
      });

      return null;
    }
  }

}
