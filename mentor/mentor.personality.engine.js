
/**
 * ==========================================
 * 🧬 MENTOR PERSONALITY ENGINE
 * UniMentorAI Adaptive Identity & Tone System
 * ==========================================
 * Responsible for:
 * - defining AI mentor personality consistency
 * - adapting tone based on user state
 * - balancing empathy, authority, motivation
 * - maintaining pedagogical identity coherence
 * - cultural + emotional adaptation layer
 */

class MentorPersonalityEngine {

  constructor() {

    // --------------------------------------
    // BASE PERSONALITY PROFILE (CORE IDENTITY)
    // --------------------------------------
    this.basePersonality = {
      empathy: 0.6,
      strictness: 0.5,
      motivation: 0.7,
      clarity: 0.9,
      patience: 0.8,
      enthusiasm: 0.6
    };
  }

  /**
   * ==========================================
   * MAIN PERSONALITY RESOLVER
   * ==========================================
   */
  resolve(profile, context) {

    let personality = { ...this.basePersonality };

    // --------------------------------------
    // 1. EMOTIONAL ADAPTATION
    // --------------------------------------
    personality = this.adjustForEmotion(personality, profile);

    // --------------------------------------
    // 2. LEARNING STATE ADAPTATION
    // --------------------------------------
    personality = this.adjustForLearning(personality, profile);

    // --------------------------------------
    // 3. CONTEXT ADAPTATION
    // --------------------------------------
    personality = this.adjustForContext(personality, context);

    // --------------------------------------
    // 4. FINAL CLAMP
    // --------------------------------------
    return this.clamp(personality);
  }

  /**
   * ==========================================
   * EMOTIONAL ADAPTATION ENGINE
   * ==========================================
   */
  adjustForEmotion(personality, profile) {

    const p = { ...personality };

    // frustration → more empathy, less strictness
    if (profile.emotion?.frustration > 0.7) {
      p.empathy += 0.2;
      p.strictness -= 0.2;
      p.patience += 0.2;
    }

    // low confidence → more encouragement
    if (profile.emotion?.confidence < 0.4) {
      p.motivation += 0.2;
      p.empathy += 0.1;
    }

    // high motivation → more challenge
    if (profile.emotion?.motivation > 0.7) {
      p.strictness += 0.2;
      p.enthusiasm += 0.2;
    }

    return p;
  }

  /**
   * ==========================================
   * LEARNING STATE ADAPTATION
   * ==========================================
   */
  adjustForLearning(personality, profile) {

    const p = { ...personality };

    // beginner → more patience + clarity
    if (profile.identity?.globalMastery < 0.3) {
      p.patience += 0.2;
      p.clarity += 0.2;
      p.strictness -= 0.1;
    }

    // advanced learner → more challenge
    if (profile.identity?.globalMastery > 0.7) {
      p.strictness += 0.2;
      p.enthusiasm += 0.1;
    }

    return p;
  }

  /**
   * ==========================================
   * CONTEXT ADAPTATION ENGINE
   * ==========================================
   */
  adjustForContext(personality, context) {

    const p = { ...personality };

    // confusion spike → more clarity + empathy
    if (context.confusion > 0.7) {
      p.clarity += 0.2;
      p.empathy += 0.2;
      p.strictness -= 0.2;
    }

    // high engagement → more energy
    if (context.engagement > 0.8) {
      p.enthusiasm += 0.3;
    }

    return p;
  }

  /**
   * ==========================================
   * TONE GENERATOR (FINAL OUTPUT STYLE)
   * ==========================================
   */
  tone(personality) {

    if (personality.empathy > 0.8) return "SUPPORTIVE_GUIDE";
    if (personality.strictness > 0.7) return "DISCIPLINED_COACH";
    if (personality.enthusiasm > 0.7) return "MOTIVATIONAL_TUTOR";
    if (personality.clarity > 0.8) return "CLEAR_EXPLAINER";

    return "BALANCED_MENTOR";
  }

  /**
   * ==========================================
   * BEHAVIOR STYLE INSTRUCTIONS
   * ==========================================
   */
  behaviorGuide(personality) {

    return {
      explainStyle: personality.clarity > 0.7 ? "step-by-step" : "compact",
      correctionStyle: personality.strictness > 0.6 ? "direct" : "gentle",
      encouragementLevel: personality.motivation,
      patienceLevel: personality.patience,
      emotionalTone: this.tone(personality)
    };
  }

  /**
   * ==========================================
   * CLAMP ENGINE (SAFETY BOUNDS)
   * ==========================================
   */
  clamp(p) {

    Object.keys(p).forEach(k => {
      p[k] = Math.max(0, Math.min(1, p[k]));
    });

    return p;
  }

  /**
   * ==========================================
   * INSIGHT ENGINE
   * ==========================================
   */
  insights(profile, context) {

    const personality = this.resolve(profile, context);

    return {
      tone: this.tone(personality),
      empathy: personality.empathy,
      strictness: personality.strictness,
      motivation: personality.motivation,
      clarity: personality.clarity
    };
  }
}

module.exports = MentorPersonalityEngine;
