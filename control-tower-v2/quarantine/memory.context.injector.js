import { MemoryRankService } from "../rank/memory.rank.service.js";
import { MemoryProfileService } from "../profile/memory.profile.service.js";

/* =========================
   🧠 RAG CONTEXT INJECTOR (PRODUCTION CORE)
   - intelligent context builder
   - memory ranking + profiling
   - optimized for LLM token efficiency
========================= */

export class MemoryContextInjector {

  /**
   * 🚀 BUILD FULL RAG CONTEXT FOR LLM
   */
  static async build({ userId, query = "", memories = [] }) {

    if (!userId) return this.emptyContext();

    try {

      /* =========================
         🧠 1. RANK & FILTER MEMORY
      ========================= */
      const rankedMemories =
        this.getRanked(memories, query);

      /* =========================
         🧠 2. BUILD USER PROFILE
      ========================= */
      const profile =
        await MemoryProfileService.build(userId);

      /* =========================
         🧠 3. FORMAT MEMORY BLOCK
      ========================= */
      const memoryBlock =
        this.format(rankedMemories);

      /* =========================
         🧠 4. BUILD FINAL CONTEXT
      ========================= */
      return this.formatContext(profile, memoryBlock);

    } catch (err) {

      console.error("[RAG_CONTEXT_ERROR]", err.message);

      return this.emptyContext();
    }
  }

  /* =========================
     🧠 MEMORY RANKING WRAPPER
  ========================= */
  static getRanked(memories, query) {

    if (!Array.isArray(memories)) return [];

    return MemoryRankService
      .rank(memories, query)
      .slice(0, 15);
  }

  /* =========================
     🧠 MEMORY FORMATTER (LLM OPTIMIZED)
  ========================= */
  static format(memories = []) {

    if (!memories.length) {
      return "No relevant memory found.";
    }

    return memories
      .map((m, i) => {

        const score =
          m.score?.toFixed?.(2) || "1.00";

        return `[${i + 1}] ${m.content} (score: ${score})`;
      })
      .join("\n");
  }

  /* =========================
     🧠 FINAL CONTEXT BUILDER
  ========================= */
  static formatContext(profile, memoryBlock) {

    return `
🧠 RAG AI CONTEXT ENGINE

📌 USER PROFILE:
${JSON.stringify(profile, null, 2)}

📚 MEMORY CONTEXT:
${memoryBlock}

⚡ SYSTEM RULES:
- Use memory for personalization
- Prioritize high-score memories
- Maintain user consistency
- Avoid hallucinating missing facts
    `.trim();
  }

  /* =========================
     🚫 EMPTY SAFE CONTEXT
  ========================= */
  static emptyContext() {

    return `
🧠 RAG AI CONTEXT ENGINE

📚 MEMORY CONTEXT:
No memory available

⚡ SYSTEM RULES:
- No user data available
- Respond generally
- Start learning from interactions
    `.trim();
  }

}
