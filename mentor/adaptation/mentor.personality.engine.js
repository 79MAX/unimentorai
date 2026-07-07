/**
 * ==========================================
 * 🎭 MENTOR PERSONALITY ENGINE
 * UniMentorAI Adaptive Teaching Personality
 * ==========================================
 */

class MentorPersonalityEngine {

  constructor() {

    this.defaultProfile = {
      tone: "SUPPORTIVE",
      empathy: 0.7,
      motivation: 0.7,
      strictness: 0.4,
      explanationDepth: 0.6,
      encouragementLevel: 0.7
    };
  }

  /**
   * ==========================================
   * MAIN ENTRY
   * ==========================================
   */
  resolve(profile = {}, context = {}) {

    const personality = {
      ...this.defaultProfile
    };

    this.applyEmotionRules(
      personality,
      profile,
      context
    );

    this.applyLearningRules(
      personality,
      profile,
      context
    );

    this.applyEngagementRules(
      personality,
      profile,
      context
    );

    personality.tone =
      this.determineTone(personality);

    return personality;
  }

  /**
   * ==========================================
   * EMOTION ADAPTATION
   * ==========================================
   */
  applyEmotionRules(personality, profile, context) {

    const frustration =
      profile?.emotion?.frustration || 0;

    if (
      frustration > 0.7 ||
      context.confusion > 0.7
    ) {
      personality.empathy += 0.2;
      personality.strictness -= 0.2;
      personality.explanationDepth += 0.2;
    }

    if (frustration < 0.3) {
      personality.strictness += 0.1;
    }
  }

  /**
   * ==========================================
   * LEARNING ADAPTATION
   * ==========================================
   */
  applyLearningRules(personality, profile) {

    const mastery =
      profile?.mastery || 0;

    if (mastery < 0.3) {

      personality.explanationDepth += 0.2;
      personality.strictness -= 0.1;
      personality.encouragementLevel += 0.2;
    }

    if (mastery > 0.7) {

      personality.strictness += 0.2;
      personality.motivation += 0.1;
    }
  }

  /**
   * ==========================================
   * ENGAGEMENT ADAPTATION
   * ==========================================
   */
  applyEngagementRules(personality, profile) {

    const engagement =
      profile?.engagement || 0.5;

    if (engagement < 0.4) {

      personality.motivation += 0.2;
      personality.encouragementLevel += 0.2;
    }

    if (engagement > 0.8) {

      personality.strictness += 0.1;
    }

    this.normalize(personality);
  }

  /**
   * ==========================================
   * TONE RESOLUTION
   * ==========================================
   */
  determineTone(personality) {

    if (
      personality.empathy > 0.8 &&
      personality.strictness < 0.4
    ) {
      return "SUPPORTIVE_GUIDE";
    }

    if (
      personality.strictness > 0.7
    ) {
      return "DISCIPLINED_COACH";
    }

    if (
      personality.motivation > 0.8
    ) {
      return "MOTIVATIONAL_MENTOR";
    }

    return "BALANCED_MENTOR";
  }

  /**
   * ==========================================
   * RESPONSE CONFIG
   * ==========================================
   */
  buildResponseProfile(personality) {

    return {

      tone:
        personality.tone,

      style:
        personality.explanationDepth > 0.7
          ? "DETAILED"
          : "CONCISE",

      encouragement:
        personality.encouragementLevel,

      strictness:
        personality.strictness,

      empathy:
        personality.empathy
    };
  }

  /**
   * ==========================================
   * NORMALIZATION
   * ==========================================
   */
  normalize(personality) {

    Object.keys(personality).forEach(key => {

      if (
        typeof personality[key] === "number"
      ) {

        personality[key] =
          Math.max(
            0,
            Math.min(1, personality[key])
          );
      }
    });
  }

  /**
   * ==========================================
   * DEBUG INSIGHTS
   * ==========================================
   */
  insights(profile, context) {

    const personality =
      this.resolve(profile, context);

    return {

      tone:
        personality.tone,

      empathy:
        personality.empathy,

      motivation:
        personality.motivation,

      strictness:
        personality.strictness,

      explanationDepth:
        personality.explanationDepth
    };
  }
}

module.exports = MentorPersonalityEngine;
