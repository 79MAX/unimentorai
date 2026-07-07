
/**
 * ==========================================
 * 👤 MENTOR USER PROFILE ENGINE (PRODUCTION)
 * UniMentorAI Cognitive Identity System
 * ==========================================
 * SINGLE SOURCE OF TRUTH FOR USER MODELING
 * ==========================================
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
      this.profiles.set(userId, this.create(userId));
    }

    return this.profiles.get(userId);
  }

  /**
   * ==========================================
   * INITIAL PROFILE STRUCTURE
   * ==========================================
   */
  create(userId) {

    return {
      userId,

      // --------------------------------------
      // CORE LEARNING IDENTITY
      // --------------------------------------
      identity: {
        level: 1,
        globalMastery: 0,
        learningVelocity: 0,
        adaptationScore: 0
      },

      // --------------------------------------
      // COGNITIVE STATE
      // --------------------------------------
      cognition: {
        focus: 0.5,
        comprehension: 0.5,
        retention: 0.5,
        cognitiveLoad: 0.2
      },

      // --------------------------------------
      // EMOTIONAL STATE
      // --------------------------------------
      emotion: {
        motivation: 0.6,
        frustration: 0.0,
        confidence: 0.5,
        satisfaction: 0.5
      },

      // --------------------------------------
      // BEHAVIOR PROFILE
      // --------------------------------------
      behavior: {
        engagement: 0.5,
        consistency: 0.0,
        persistence: 0.5,
        dropoutRisk: 0.0
      },

      // --------------------------------------
      // LEARNING STATE
      // --------------------------------------
      learning: {
        currentTopic: null,
        weakAreas: [],
        strongAreas: [],
        completedModules: [],
        inProgressModules: []
      },

      // --------------------------------------
      // ACTIVITY TRACKING
      // --------------------------------------
      activity: {
        sessions: 0,
        totalTimeSpent: 0,
        lastActive: Date.now(),
        streak: 0
      },

      // --------------------------------------
      // ADAPTIVE FLAGS
      // --------------------------------------
      flags: {
        atRisk: false,
        highPerformer: false,
        needsSimplification: false,
        needsChallenge: false
      }
    };
  }

  /**
   * ==========================================
   * UPDATE PROFILE (MAIN ENTRY)
   * ==========================================
   */
  update(userId, context, learningState) {

    const profile = this.get(userId);

    // --------------------------------------
    // UPDATE LEARNING IDENTITY
    // --------------------------------------
    profile.identity.globalMastery = learningState.mastery || 0;
    profile.identity.learningVelocity = this.computeVelocity(profile, learningState);

    profile.identity.level =
      Math.floor(profile.identity.globalMastery * 10);

    // --------------------------------------
    // UPDATE COGNITION
    // --------------------------------------
    profile.cognition.focus =
      this.smooth(profile.cognition.focus, context.engagement);

    profile.cognition.comprehension =
      1 - (context.confusion || 0);

    profile.cognition.cognitiveLoad =
      this.computeCognitiveLoad(context);

    // --------------------------------------
    // UPDATE EMOTION
    // --------------------------------------
    profile.emotion.motivation =
      this.adjustMotivation(profile, context);

    profile.emotion.frustration =
      this.adjustFrustration(profile, context);

    profile.emotion.confidence =
      this.adjustConfidence(profile, context);

    // --------------------------------------
    // UPDATE BEHAVIOR
    // --------------------------------------
    profile.behavior.engagement =
      this.smooth(profile.behavior.engagement, context.engagement);

    profile.behavior.dropoutRisk =
      this.computeDropoutRisk(profile);

    profile.behavior.consistency =
      this.computeConsistency(profile);

    // --------------------------------------
    // UPDATE ACTIVITY
    // --------------------------------------
    profile.activity.sessions += 1;
    profile.activity.lastActive = Date.now();

    // --------------------------------------
    // UPDATE FLAGS
    // --------------------------------------
    this.updateFlags(profile);

    return profile;
  }

  /**
   * ==========================================
   * MOTIVATION MODEL
   * ==========================================
   */
  adjustMotivation(profile, context) {

    let m = profile.emotion.motivation;

    if (context.engagement > 0.7) m += 0.05;
    if (context.confusion > 0.7) m -= 0.1;

    return this.clamp(m);
  }

  /**
   * ==========================================
   * FRUSTRATION MODEL
   * ==========================================
   */
  adjustFrustration(profile, context) {

    let f = profile.emotion.frustration;

    if (context.confusion > 0.7) f += 0.1;
    if (context.engagement < 0.3) f += 0.05;
    if (context.confusion < 0.3) f -= 0.05;

    return this.clamp(f);
  }

  /**
   * ==========================================
   * CONFIDENCE MODEL
   * ==========================================
   */
  adjustConfidence(profile, context) {

    let c = profile.emotion.confidence;

    if (context.confusion < 0.3) c += 0.05;
    if (context.engagement > 0.7) c += 0.03;
    if (context.confusion > 0.7) c -= 0.08;

    return this.clamp(c);
  }

  /**
   * ==========================================
   * COGNITIVE LOAD MODEL
   * ==========================================
   */
  computeCognitiveLoad(context) {

    let load = 0.2;

    if (context.confusion > 0.7) load += 0.4;
    if (context.complexity > 0.7) load += 0.3;

    return this.clamp(load);
  }

  /**
   * ==========================================
   * DROPOUT RISK ENGINE
   * ==========================================
   */
  computeDropoutRisk(profile) {

    let risk = 0;

    if (profile.emotion.frustration > 0.7) risk += 0.4;
    if (profile.behavior.engagement < 0.3) risk += 0.4;
    if (profile.identity.globalMastery < 0.2) risk += 0.2;

    return this.clamp(risk);
  }

  /**
   * ==========================================
   * CONSISTENCY ENGINE
   * ==========================================
   */
  computeConsistency(profile) {

    if (profile.activity.sessions < 2) return 0;

    return Math.min(profile.activity.sessions / 30, 1);
  }

  /**
   * ==========================================
   * VELOCITY ENGINE
   * ==========================================
   */
  computeVelocity(profile, learningState) {

    return learningState.mastery /
      Math.max(profile.activity.sessions, 1);
  }

  /**
   * ==========================================
   * FLAGS ENGINE
   * ==========================================
   */
  updateFlags(profile) {

    profile.flags.atRisk =
      profile.behavior.dropoutRisk > 0.7;

    profile.flags.highPerformer =
      profile.identity.globalMastery > 0.8 &&
      profile.emotion.motivation > 0.6;

    profile.flags.needsSimplification =
      profile.cognition.cognitiveLoad > 0.7;

    profile.flags.needsChallenge =
      profile.identity.globalMastery > 0.75 &&
      profile.behavior.engagement > 0.6;
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
  clamp(v) {
    return Math.max(0, Math.min(1, v));
  }

  /**
   * ==========================================
   * INSIGHT API
   * ==========================================
   */
  insights(userId) {

    const p = this.get(userId);

    return {
      level: p.identity.level,
      mastery: p.identity.globalMastery,
      engagement: p.behavior.engagement,
      motivation: p.emotion.motivation,
      frustration: p.emotion.frustration,
      dropoutRisk: p.behavior.dropoutRisk,
      cognitiveLoad: p.cognition.cognitiveLoad
    };
  }
}

module.exports = MentorUserProfile;
