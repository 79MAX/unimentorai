
/**
 * ==========================================
 * ⚙️ MENTOR BEHAVIOR OPTIMIZER ENGINE
 * UniMentorAI Self-Adaptive Behavior System
 * ==========================================
 * Responsible for:
 * - optimizing mentor behavioral parameters over time
 * - adapting response style based on performance feedback
 * - balancing engagement, clarity, and retention
 * - minimizing dropout risk via behavioral tuning
 * - continuous self-improvement loop input
 */

class MentorBehaviorOptimizer {

  constructor() {

    this.globalBehaviorState = new Map();
  }

  /**
   * ==========================================
   * MAIN OPTIMIZATION LOOP
   * ==========================================
   */
  optimize(userId, profile, performance, context) {

    const state = this.getState(userId);

    // --------------------------------------
    // 1. ENGAGEMENT SIGNAL ANALYSIS
    // --------------------------------------
    const engagementSignal =
      this.computeEngagement(performance, context);

    // --------------------------------------
    // 2. LEARNING EFFECTIVENESS ANALYSIS
    // --------------------------------------
    const effectiveness =
      this.computeEffectiveness(performance);

    // --------------------------------------
    // 3. DROPOUT RISK SIGNAL
    // --------------------------------------
    const risk =
      this.computeRisk(profile, context);

    // --------------------------------------
    // 4. BEHAVIOR ADJUSTMENT VECTOR
    // --------------------------------------
    const adjustment =
      this.computeAdjustmentVector(state, engagementSignal, effectiveness, risk);

    // --------------------------------------
    // 5. APPLY OPTIMIZATION
    // --------------------------------------
    const updated =
      this.apply(state, adjustment);

    // --------------------------------------
    // 6. SAVE STATE
    // --------------------------------------
    this.globalBehaviorState.set(userId, updated);

    return updated;
  }

  /**
   * ==========================================
   * STATE INITIALIZATION
   * ==========================================
   */
  getState(userId) {

    if (!this.globalBehaviorState.has(userId)) {
      this.globalBehaviorState.set(userId, this.createState());
    }

    return this.globalBehaviorState.get(userId);
  }

  /**
   * ==========================================
   * INITIAL BEHAVIOR STATE
   * ==========================================
   */
  createState() {

    return {
      clarityWeight: 0.7,
      strictnessWeight: 0.5,
      empathyWeight: 0.6,
      pacingSpeed: 0.5,
      detailLevel: 0.6,
      interactivityLevel: 0.6
    };
  }

  /**
   * ==========================================
   * ENGAGEMENT ENGINE
   * ==========================================
   */
  computeEngagement(performance, context) {

    return (
      (performance.engagement || 0) * 0.6 +
      (context.engagement || 0) * 0.4
    );
  }

  /**
   * ==========================================
   * EFFECTIVENESS ENGINE
   * ==========================================
   */
  computeEffectiveness(performance) {

    return performance.masteryGain || 0;
  }

  /**
   * ==========================================
   * RISK ENGINE (DROPOUT DETECTION)
   * ==========================================
   */
  computeRisk(profile, context) {

    let risk = 0;

    if (profile.behavior?.dropoutRisk > 0.7) {
      risk += 0.5;
    }

    if (context.confusion > 0.7) {
      risk += 0.3;
    }

    if (context.engagement < 0.3) {
      risk += 0.4;
    }

    return this.clamp(risk);
  }

  /**
   * ==========================================
   * ADJUSTMENT VECTOR ENGINE
   * ==========================================
   */
  computeAdjustmentVector(state, engagement, effectiveness, risk) {

    return {
      clarityWeight:
        risk > 0.6 ? +0.2 : effectiveness > 0.7 ? -0.1 : 0,

      strictnessWeight:
        effectiveness > 0.7 ? +0.2 : risk > 0.6 ? -0.3 : 0,

      empathyWeight:
        risk > 0.5 ? +0.3 : engagement < 0.4 ? +0.2 : -0.1,

      pacingSpeed:
        engagement > 0.8 ? +0.2 : risk > 0.6 ? -0.3 : 0,

      detailLevel:
        effectiveness > 0.6 ? +0.1 : risk > 0.6 ? -0.2 : 0,

      interactivityLevel:
        engagement > 0.7 ? +0.2 : -0.1
    };
  }

  /**
   * ==========================================
   * APPLY OPTIMIZATION
   * ==========================================
   */
  apply(state, adjustment) {

    const updated = { ...state };

    Object.keys(adjustment).forEach(key => {

      updated[key] =
        this.clamp(updated[key] + adjustment[key]);
    });

    return updated;
  }

  /**
   * ==========================================
   * FINAL BEHAVIOR PROFILE EXPORT
   * ==========================================
   */
  export(userId) {

    return this.globalBehaviorState.get(userId) || this.createState();
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
   * INSIGHT ENGINE
   * ==========================================
   */
  insights(userId) {

    const state = this.export(userId);

    return {
      clarity: state.clarityWeight,
      empathy: state.empathyWeight,
      strictness: state.strictnessWeight,
      pacing: state.pacingSpeed,
      interactivity: state.interactivityLevel
    };
  }
}

module.exports = MentorBehaviorOptimizer;
