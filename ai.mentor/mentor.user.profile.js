
/**
 * ==========================================
 * 👤 MENTOR USER PROFILE ENGINE
 * UniMentorAI Learner Identity System
 * ==========================================
 * Responsible for:
 * - unified learner profile management
 * - cognitive state representation
 * - learning preferences tracking
 * - long-term behavioral modeling
 * - personalization backbone
 */

class MentorUserProfile {

  constructor() {

    this.profiles = new Map();
  }

  /**
   * ==========================================
   * GET OR CREATE PROFILE
   * ==========================================
   */
  get(userId) {

    if (!this.profiles.has(userId)) {

      this.profiles.set(userId, this.createDefaultProfile(userId));
    }

    return this.profiles.get(userId);
  }

  /**
   * ==========================================
   * DEFAULT PROFILE STRUCTURE
   * ==========================================
   */
  createDefaultProfile(userId) {

    return {
      userId,

      // --------------------------------------
      // COGNITIVE STATE
      // --------------------------------------
      cognitiveState: {
        level: 1,
        mastery: 0,
        focus: 0.5,
        retention: 0.5
      },

      // --------------------------------------
      // LEARNING PREFERENCES
      // --------------------------------------
      preferences: {
        style: "balanced", // visual / text / interactive
        pace: "medium",
        difficultyTolerance: 0.5,
        interactionLevel: 0.5
      },

      // --------------------------------------
      // BEHAVIOR PROFILE
      // --------------------------------------
      behavior: {
        engagement: 0.5,
        frustration: 0,
        motivation: 0.6,
        consistency: 0
      },

      // --------------------------------------
      // LEARNING HISTORY
      // --------------------------------------
      history: {
        sessions: 0,
        completedTopics: [],
        failedTopics: [],
        lastActive: Date.now()
      },

      // --------------------------------------
      // ADAPTIVE FLAGS
      // --------------------------------------
      flags: {
        isAtRisk: false,
        isHighPerformer: false,
        needsSupport: false
      }
    };
  }

  /**
   * ==========================================
   * UPDATE PROFILE WITH LEARNING DATA
   * ==========================================
   */
  update(userId, learningState, context, progress) {

    const profile = this.get(userId);

    // --------------------------------------
    // UPDATE COGNITIVE STATE
    // --------------------------------------
    profile.cognitiveState.mastery =
      learningState.mastery;

    profile.cognitiveState.level =
      progress?.summary?.sessions > 10
        ? Math.floor(learningState.mastery * 10)
        : profile.cognitiveState.level;

    // --------------------------------------
    // UPDATE BEHAVIOR SIGNALS
    // --------------------------------------
    profile.behavior.engagement =
      this.smooth(profile.behavior.engagement, context.engagement);

    profile.behavior.frustration =
      this.adjustFrustration(profile, context);

    profile.behavior.motivation =
      this.adjustMotivation(profile, context);

    // --------------------------------------
    // UPDATE HISTORY
    // --------------------------------------
    profile.history.sessions += 1;
    profile.history.lastActive = Date.now();

    // --------------------------------------
    // UPDATE FLAGS
    // --------------------------------------
    this.updateFlags(profile);

    return profile;
  }

  /**
   * ==========================================
   * FRUSTRATION MODEL
   * ==========================================
   */
  adjustFrustration(profile, context) {

    let f = profile.behavior.frustration;

    if (context.confusion > 0.7) f += 0.1;
    if (context.engagement < 0.3) f += 0.05;
    if (context.confusion < 0.3) f -= 0.05;

    return this.clamp(f);
  }

  /**
   * ==========================================
   * MOTIVATION MODEL
   * ==========================================
   */
  adjustMotivation(profile, context) {

    let m = profile.behavior.motivation;

    if (context.engagement > 0.7) m += 0.05;
    if (context.confusion > 0.7) m -= 0.1;

    return this.clamp(m);
  }

  /**
   * ==========================================
   * FLAG SYSTEM (RISK DETECTION)
   * ==========================================
   */
  updateFlags(profile) {

    profile.flags.isAtRisk =
      profile.behavior.frustration > 0.7 ||
      profile.behavior.engagement < 0.3;

    profile.flags.isHighPerformer =
      profile.cognitiveState.mastery > 0.8 &&
      profile.behavior.engagement > 0.6;

    profile.flags.needsSupport =
      profile.behavior.frustration > 0.6 &&
      profile.behavior.motivation < 0.5;
  }

  /**
   * ==========================================
   * SMOOTHING FUNCTION
   * ==========================================
   */
  smooth(oldVal, newVal) {

    return oldVal * 0.7 + newVal * 0.3;
  }

  /**
   * ==========================================
   * CLAMP UTILITY
   * ==========================================
   */
  clamp(value) {

    return Math.max(0, Math.min(1, value));
  }

  /**
   * ==========================================
   * PROFILE INSIGHT GENERATOR
   * ==========================================
   */
  getInsights(userId) {

    const p = this.get(userId);

    return {
      level: p.cognitiveState.level,
      mastery: p.cognitiveState.mastery,
      engagement: p.behavior.engagement,
      motivation: p.behavior.motivation,
      frustration: p.behavior.frustration,
      risk: p.flags.isAtRisk,
      performance: p.flags.isHighPerformer
    };
  }
}

module.exports = MentorUserProfile;
