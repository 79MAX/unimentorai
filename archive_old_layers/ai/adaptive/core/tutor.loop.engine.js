import { MentorService } from "../../mentor/services/mentor.service.js";
import { MemoryService } from "../../memory/services/memory.service.js";
import { RankingService } from "../../ranking/services/ranking.service.js";
import { MemoryWriter } from "../../memory/core/memory.writer.js";

export class TutorLoopEngine {

  /* =========================
     🧠 FULL ADAPTIVE LOOP (PRODUCTION GRADE)
  ========================= */
  static async run({
    user,
    message,
    course,
    history = [],
    aiProvider
  }) {

    const traceId = this.generateTraceId();

    try {

      /* =========================
         1️⃣ LOAD MEMORY (SAFE)
      ========================= */
      const memory = await MemoryService.get(user.id);

      /* =========================
         2️⃣ AI MENTOR RESPONSE
      ========================= */
      const response = await MentorService.ask({
        user,
        message,
        course,
        history,
        aiProvider
      });

      /* =========================
         3️⃣ EXTRACT LEARNING SIGNALS
      ========================= */
      const sessionSignals = MemoryWriter.extractFromSession({
        weakAreas: response?.weakAreas || [],
        strongAreas: response?.strongAreas || [],
        progress: response?.progress || {},
        lastTopic: response?.topic || null
      });

      /* =========================
         4️⃣ UPDATE MEMORY (SAFE PATCH)
      ========================= */
      const updatedMemory = await MemoryService.patch(
        user.id,
        sessionSignals
      );

      /* =========================
         5️⃣ GENERATE RECOMMENDATIONS (SAFE)
      ========================= */
      const suggestions = course?.suggestions || [];

      const ranked = suggestions.length > 0
        ? await RankingService.getRankedCourses(suggestions, updatedMemory)
        : [];

      /* =========================
         6️⃣ TRACE LOG (OBSERVABILITY)
      ========================= */
      this.logTrace({
        traceId,
        userId: user.id,
        message,
        weakAreas: sessionSignals?.learning?.weakAreas,
        mode: response?.mode
      });

      /* =========================
         7️⃣ NORMALIZED OUTPUT
      ========================= */
      return {
        traceId,
        reply: response?.reply || response,
        memory: updatedMemory,
        recommendations: ranked,
        mode: "ADAPTIVE_TUTOR_LOOP_V1"
      };

    } catch (error) {

      /* =========================
         🚨 FALLBACK SAFE RESPONSE
      ========================= */
      console.error("[TUTOR_LOOP_ERROR]", {
        traceId,
        message: error.message
      });

      return {
        traceId,
        reply: "Je rencontre un problème temporaire, réessaie dans un instant.",
        memory: null,
        recommendations: [],
        mode: "FALLBACK_SAFE_MODE"
      };
    }
  }

  /* =========================
     🧾 TRACE ID GENERATOR
  ========================= */
  static generateTraceId() {
    return "TL-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  /* =========================
     📊 LOGGING OBSERVABILITY
  ========================= */
  static logTrace(data) {
    console.log("[TUTOR_TRACE]", JSON.stringify(data, null, 2));
  }
}
