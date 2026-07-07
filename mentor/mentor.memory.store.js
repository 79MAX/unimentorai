
/**
 * ==========================================
 * 💾 MENTOR MEMORY STORE ENGINE
 * UniMentorAI Long-Term Cognitive Memory
 * ==========================================
 * Responsible for:
 * - persistent user memory storage
 * - learning history tracking
 * - emotional memory retention
 * - context reconstruction
 * - AI personalization backbone
 */

class MentorMemoryStore {

  constructor() {

    this.store = new Map();
  }

  /**
   * ==========================================
   * GET OR CREATE MEMORY
   * ==========================================
   */
  get(userId) {

    if (!this.store.has(userId)) {

      this.store.set(userId, this.createMemory(userId));
    }

    return this.store.get(userId);
  }

  /**
   * ==========================================
   * INITIAL MEMORY STRUCTURE
   * ==========================================
   */
  createMemory(userId) {

    return {
      userId,

      // --------------------------------------
      // LEARNING HISTORY
      // --------------------------------------
      history: [],

      // --------------------------------------
      // SKILL STATE
      // --------------------------------------
      progress: 0,
      weakTopics: [],
      strongTopics: [],

      // --------------------------------------
      // EMOTIONAL PROFILE
      // --------------------------------------
      emotionalProfile: {
        frustrationLevel: 0,
        motivationLevel: 0.6,
        confidenceLevel: 0.5
      },

      // --------------------------------------
      // CONTEXT MEMORY
      // --------------------------------------
      lastContext: null,
      sessionCount: 0,

      // --------------------------------------
      // BEHAVIOR PATTERNS
      // --------------------------------------
      patterns: {
        repetitionRate: 0,
        dropoutRisk: 0,
        engagementTrend: []
      },

      // --------------------------------------
      // KNOWLEDGE GRAPH LINK
      // --------------------------------------
      knowledgeState: {
        masteredSkills: [],
        inProgressSkills: [],
        blockedSkills: []
      }
    };
  }

  /**
   * ==========================================
   * UPDATE MEMORY WITH INTERACTION
   * ==========================================
   */
  update(userId, context, learningState, feedback) {

    const memory = this.get(userId);

    // --------------------------------------
    // SESSION TRACKING
    // --------------------------------------
    memory.sessionCount += 1;
    memory.lastContext = context;

    // --------------------------------------
    // LEARNING PROGRESS UPDATE
    // --------------------------------------
    memory.progress =
      learningState.mastery || memory.progress;

    // --------------------------------------
    // HISTORY UPDATE
    // --------------------------------------
    memory.history.push({
      timestamp: Date.now(),
      context,
      mastery: learningState.mastery,
      engagement: context.engagement,
      confusion: context.confusion
    });

    if (memory.history.length > 500) {
      memory.history.shift();
    }

    // --------------------------------------
    // EMOTIONAL UPDATE
    // --------------------------------------
    this.updateEmotion(memory, context);

    // --------------------------------------
    // PATTERN UPDATE
    // --------------------------------------
    this.updatePatterns(memory);

    return memory;
  }

  /**
   * ==========================================
   * EMOTIONAL MEMORY ENGINE
   * ==========================================
   */
  updateEmotion(memory, context) {

    if (context.confusion > 0.7) {
      memory.emotionalProfile.frustrationLevel += 0.1;
    }

    if (context.engagement > 0.7) {
      memory.emotionalProfile.motivationLevel += 0.05;
    }

    if (context.confusion < 0.3) {
      memory.emotionalProfile.confidenceLevel += 0.05;
    }

    // clamp values
    this.clampEmotion(memory.emotionalProfile);
  }

  /**
   * ==========================================
   * BEHAVIOR PATTERN ANALYSIS
   * ==========================================
   */
  updatePatterns(memory) {

    const recent = memory.history.slice(-10);

    const avgEngagement =
      recent.reduce((a, b) => a + (b.engagement || 0), 0) /
      Math.max(recent.length, 1);

    memory.patterns.engagementTrend.push(avgEngagement);

    if (memory.patterns.engagementTrend.length > 50) {
      memory.patterns.engagementTrend.shift();
    }

    // dropout risk detection
    memory.patterns.dropoutRisk =
      this.calculateDropoutRisk(memory);
  }

  /**
   * ==========================================
   * DROPOUT RISK ENGINE
   * ==========================================
   */
  calculateDropoutRisk(memory) {

    let risk = 0;

    if (memory.emotionalProfile.frustrationLevel > 0.7) risk += 0.4;
    if (memory.patterns.engagementTrend.slice(-5).every(e => e < 0.4)) risk += 0.4;
    if (memory.progress < 20) risk += 0.2;

    return Math.min(risk, 1);
  }

  /**
   * ==========================================
   * MEMORY INSIGHT GENERATOR
   * ==========================================
   */
  insights(userId) {

    const m = this.get(userId);

    return {
      progress: m.progress,
      frustration: m.emotionalProfile.frustrationLevel,
      motivation: m.emotionalProfile.motivationLevel,
      confidence: m.emotionalProfile.confidenceLevel,
      dropoutRisk: m.patterns.dropoutRisk,
      sessions: m.sessionCount
    };
  }

  /**
   * ==========================================
   * EMOTION CLAMPING
   * ==========================================
   */
  clampEmotion(emotion) {

    emotion.frustrationLevel =
      Math.max(0, Math.min(1, emotion.frustrationLevel));

    emotion.motivationLevel =
      Math.max(0, Math.min(1, emotion.motivationLevel));

    emotion.confidenceLevel =
      Math.max(0, Math.min(1, emotion.confidenceLevel));
  }
}

module.exports = MentorMemoryStore;
