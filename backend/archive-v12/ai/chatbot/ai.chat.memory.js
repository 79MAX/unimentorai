
const MAX_HISTORY = 20;

/**
 * ========================
 * 🧠 AI CHAT MEMORY ENGINE
 * UniMentorAI SaaS Context Layer
 * ========================
 * Stores conversation context per user/session
 */

class AIChatMemory {

  constructor() {
    // In-memory store (MVP)
    // 👉 upgrade possible: Redis / MongoDB
    this.memoryStore = new Map();
  }

  /**
   * ========================
   * 📥 GET USER MEMORY
   * ========================
   */
  getMemory(userId) {

    if (!this.memoryStore.has(userId)) {
      this.memoryStore.set(userId, []);
    }

    return this.memoryStore.get(userId);
  }

  /**
   * ========================
   * 📤 ADD MESSAGE TO MEMORY
   * ========================
   */
  addMessage(userId, role, message) {

    const history = this.getMemory(userId);

    history.push({
      role, // "user" | "assistant"
      message,
      timestamp: new Date()
    });

    // 🧹 Keep memory size under control
    if (history.length > MAX_HISTORY) {
      history.splice(0, history.length - MAX_HISTORY);
    }

    this.memoryStore.set(userId, history);
  }

  /**
   * ========================
   * 🧠 GET CONTEXT STRING (FOR AI)
   * ========================
   */
  getContext(userId) {

    const history = this.getMemory(userId);

    return history
      .map(h => `${h.role.toUpperCase()}: ${h.message}`)
      .join("\n");
  }

  /**
   * ========================
   * 🧹 CLEAR MEMORY
   * ========================
   */
  clearMemory(userId) {

    this.memoryStore.delete(userId);
  }

  /**
   * ========================
   * 📊 MEMORY STATS
   * ========================
   */
  getStats(userId) {

    const history = this.getMemory(userId);

    return {
      messageCount: history.length,
      lastInteraction: history.length
        ? history[history.length - 1].timestamp
        : null
    };
  }

  /**
   * ========================
   * ⚡ BUILD AI CONTEXT PAYLOAD
   * ========================
   */
  buildAIContext(userId, currentQuery) {

    const context = this.getContext(userId);

    return `
You are an AI business assistant.

Conversation history:
${context}

User question:
${currentQuery}

Answer clearly and concisely.
`;
  }
}

module.exports = new AIChatMemory();
