import { MemoryOrchestrator } from "./memory.orchestrator.js";

/* =========================
   🧠 UNIMENTOR AI MEMORY SELF-LEARNING LOOP
   WORLD CLASS CONTINUOUS MEMORY FEEDBACK SYSTEM
========================= */

export class MemoryLoop {

  /* =========================
     🚀 MAIN EXECUTION LOOP
  ========================= */
  static async run({
    userId,
    message,
    aiResponse,
    sessionId = null,
    level = "BEGINNER"
  }) {

    if (!userId || !message || !aiResponse) {
      return null;
    }

    try {

      /* =========================
         🧠 MEMORY PIPELINE EXECUTION
      ========================= */
      const profile =
        await MemoryOrchestrator.process({
          userId,
          message,
          aiResponse,
          level,
          sessionId
        });

      return {
        success: true,
        profileUpdated: !!profile
      };

    } catch (err) {

      /* =========================
         🔐 FAIL SAFE (NEVER BREAK CHAT)
      ========================= */
      console.error("❌ MEMORY_LOOP_ERROR:", err.message);

      return {
        success: false,
        error: "Memory loop failed silently"
      };
    }
  }

  /* =========================
     ⚡ FIRE-AND-FORGET MODE (STREAM CHAT OPTIMIZED)
  ========================= */
  static async runAsync(payload) {

    setImmediate(() => {
      this.run(payload).catch(() => {});
    });

    return true;
  }

}
