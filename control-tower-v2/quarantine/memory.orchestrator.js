import Memory from "./memory.model.js";
import { EmbeddingService } from "../vector/embedding.service.js";

/* =========================
   🧠 MEMORY ORCHESTRATOR (BRAIN CORE)
   - Central AI memory ingestion engine
   - Embedding + scoring + persistence
   - Ready for RAG + vector search + long-term memory
========================= */

export class MemoryOrchestrator {

  /**
   * 🚀 MAIN PROCESS PIPELINE
   */
  static async process({
    userId,
    message,
    aiResponse,
    level = "BEGINNER",
    sessionId = null
  }) {

    if (!userId || !message || typeof message !== "string") return null;

    const cleanMessage = message.trim();

    if (!cleanMessage) return null;

    try {

      /* =========================
         🧠 EMBEDDING GENERATION
      ========================= */
      const embedding =
        await EmbeddingService.embed(cleanMessage);

      /* =========================
         📊 IMPORTANCE SCORING ENGINE
      ========================= */
      const importance =
        this.computeImportance(cleanMessage);

      /* =========================
         💾 MEMORY PERSISTENCE
      ========================= */
      return await Memory.create({

        userId,
        content: cleanMessage,

        embedding: embedding || [],

        importanceScore: importance,

        metadata: {
          level,
          sessionId,
          source: "orchestrator",
          hasAIResponse: !!aiResponse
        }

      });

    } catch (err) {

      console.error("[MEMORY_ORCHESTRATOR_ERROR]", {
        message: err.message,
        stack: err.stack
      });

      return null;
    }
  }

  /**
   * 🧠 IMPORTANCE ENGINE (SMART SCORING)
   * - determines what AI should remember first
   */
  static computeImportance(text) {

    const t = text.toLowerCase();

    let score = 1;

    /* =========================
       🎯 HIGH VALUE SIGNALS
    ========================= */
    if (t.includes("goal")) score += 3;
    if (t.includes("learn")) score += 2;
    if (t.includes("build")) score += 2;
    if (t.includes("create")) score += 2;
    if (t.includes("important")) score += 3;
    if (t.includes("want to")) score += 2;
    if (t.includes("plan")) score += 2;

    /* =========================
       🧠 INTENT BOOSTING
    ========================= */
    if (t.includes("become")) score += 2;
    if (t.includes("start")) score += 1;
    if (t.includes("career")) score += 2;

    /* =========================
       🔥 CAP CONTROL (avoid overflow)
    ========================= */
    return Math.min(score, 10);
  }

}
