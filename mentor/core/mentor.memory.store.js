
/**
 * ==========================================
 * 💾 MENTOR MEMORY STORE
 * UniMentorAI Persistent Learning Memory System
 * ==========================================
 * Role:
 * - store user learning history
 * - maintain profile evolution over time
 * - persist engagement, mastery, confusion trends
 * - provide memory context for all AI modules
 */

class MentorMemoryStore {

  constructor() {

    // In-memory MVP store (can be replaced by DB later)
    this.store = new Map();
  }

  /**
   * ==========================================
   * GET USER MEMORY
   * ==========================================
   */
  get(userId) {

    if (!this.store.has(userId)) {
      this.store.set(userId, this.createDefaultMemory());
    }

    return this.store.get(userId);
  }

  /**
   * ==========================================
   * UPDATE USER MEMORY
   * ==========================================
   */
  update(userId, update) {

    const memory = this.get(userId);

    // --------------------------------------
    // 1. UPDATE PROFILE EVOLUTION
    // --------------------------------------
    if (update.lastContext) {
      this.updateProfile(memory, update.lastContext);
    }

    // --------------------------------------
    // 2. SAVE HISTORY
    // --------------------------------------
    if (update.lastInput) {
      memory.history.push({
        input: update.lastInput,
        response: update.lastResponse,
        timestamp: Date.now()
      });
    }

    // --------------------------------------
    // 3. LIMIT HISTORY SIZE (MVP SAFETY)
    // --------------------------------------
    if (memory.history.length > 200) {
      memory.history.shift();
    }

    // --------------------------------------
    // 4. STORE BACK
    // --------------------------------------
    this.store.set(userId, memory);

    return memory;
  }

  /**
   * ==========================================
   * PROFILE EVOLUTION ENGINE
   * ==========================================
   */
  updateProfile(memory, context) {

    const profile = memory.profile;

    // --------------------------------------
    // ENGAGEMENT EVOLUTION
    // --------------------------------------
    profile.engagement =
      this.smooth(profile.engagement, context.engagement || 0.5);

    // --------------------------------------
    // CONFUSION EVOLUTION
    // --------------------------------------
    profile.confusion =
      this.smooth(profile.confusion, context.confusion || 0);

    // --------------------------------------
    // SKILL EVOLUTION
    // --------------------------------------
    if (context.success) {
      profile.mastery += 0.02;
    } else {
      profile.mastery -= 0.01;
    }

    profile.mastery = this.clamp(profile.mastery);

    // --------------------------------------
    // EMOTIONAL STATE EVOLUTION
    // --------------------------------------
    if (context.intent === "EXPLANATION" && context.confusion > 0.6) {
      profile.emotion.frustration += 0.1;
    } else {
      profile.emotion.frustration -= 0.05;
    }

    profile.emotion.frustration =
      this.clamp(profile.emotion.frustration);
  }

  /**
   * ==========================================
   * DEFAULT MEMORY STRUCTURE
   * ==========================================
   */
  createDefaultMemory() {

    return {
      history: [],

      profile: {
        engagement: 0.5,
        confusion: 0.2,
        mastery: 0.3,

        emotion: {
          frustration: 0.2,
          motivation: 0.6
        }
      }
    };
  }

  /**
   * ==========================================
   * HISTORY INSIGHTS ENGINE
   * ==========================================
   */
  getInsights(userId) {

    const memory = this.get(userId);

    return {
      totalSessions: memory.history.length,
      avgEngagement: memory.profile.engagement,
      masteryLevel: memory.profile.mastery,
      frustrationLevel: memory.profile.emotion.frustration
    };
  }

  /**
   * ==========================================
   * UTILITY FUNCTIONS
   * ==========================================
   */
  smooth(prev, current) {

    const alpha = 0.3;
    return (alpha * current) + ((1 - alpha) * prev);
  }

  clamp(value) {

    return Math.max(0, Math.min(1, value));
  }
}

module.exports = MentorMemoryStore;
