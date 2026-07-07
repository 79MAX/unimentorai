/**
 * ==========================================
 * 🔁 MENTOR FEEDBACK LOOP
 * UniMentorAI Self-Improvement Engine (MVP)
 * ==========================================
 * Responsibilities:
 * - collect learning feedback signals
 * - detect success/failure patterns
 * - update behavioral signals
 * - improve future learning decisions
 * ==========================================
 */

class MentorFeedbackLoop {

  constructor() {

    this.learningSignals = new Map();
  }

  /**
   * ==========================================
   * MAIN ENTRY
   * ==========================================
   */
  process(userId, response, context) {

    const feedback = this.extractFeedback(
      response,
      context
    );

    this.updateSignals(
      userId,
      feedback
    );

    this.updateBehaviorPatterns(
      userId,
      feedback
    );

    return {
      userId,
      feedback,
      updated: true
    };
  }

  /**
   * ==========================================
   * FEEDBACK EXTRACTION
   * ==========================================
   */
  extractFeedback(response, context) {

    const success =
      context.confusion < 0.3;

    const engagement =
      context.engagement || 0.5;

    const difficultyMismatch =
      this.detectDifficultyMismatch(context);

    return {

      success,

      engagement,

      difficultyMismatch,

      clarityScore:
        this.computeClarityScore(context),

      timestamp:
        Date.now()
    };
  }

  /**
   * ==========================================
   * SIGNAL STORAGE
   * ==========================================
   */
  updateSignals(userId, feedback) {

    if (!this.learningSignals.has(userId)) {
      this.learningSignals.set(userId, []);
    }

    const signals =
      this.learningSignals.get(userId);

    signals.push(feedback);

    // keep memory lightweight
    if (signals.length > 100) {
      signals.shift();
    }

    this.learningSignals.set(userId, signals);
  }

  /**
   * ==========================================
   * PATTERN ANALYSIS
   * ==========================================
   */
  updateBehaviorPatterns(userId, feedback) {

    const signals =
      this.learningSignals.get(userId) || [];

    const avgSuccess =
      this.average(
        signals.map(s => s.success ? 1 : 0)
      );

    const avgEngagement =
      this.average(
        signals.map(s => s.engagement)
      );

    const avgClarity =
      this.average(
        signals.map(s => s.clarityScore)
      );

    return {

      avgSuccess,

      avgEngagement,

      avgClarity,

      needsAdjustment:
        avgSuccess < 0.5 ||
        avgEngagement < 0.4
    };
  }

  /**
   * ==========================================
   * DIFFICULTY MISMATCH DETECTION
   * ==========================================
   */
  detectDifficultyMismatch(context) {

    if (
      context.confusion > 0.7 &&
      context.engagement < 0.4
    ) {
      return "TOO_HARD";
    }

    if (
      context.confusion < 0.2 &&
      context.engagement > 0.8
    ) {
      return "TOO_EASY";
    }

    return "BALANCED";
  }

  /**
   * ==========================================
   * CLARITY SCORE
   * ==========================================
   */
  computeClarityScore(context) {

    let score = 1;

    if (context.confusion > 0.7) {
      score -= 0.5;
    }

    if (context.confusion > 0.4) {
      score -= 0.2;
    }

    return this.clamp(score);
  }

  /**
   * ==========================================
   * UTILITIES
   * ==========================================
   */
  average(arr) {

    if (!arr.length) return 0;

    return (
      arr.reduce((a, b) => a + b, 0) /
      arr.length
    );
  }

  clamp(value) {

    return Math.max(
      0,
      Math.min(1, value)
    );
  }

  /**
   * ==========================================
   * INSIGHTS API
   * ==========================================
   */
  getInsights(userId) {

    const signals =
      this.learningSignals.get(userId) || [];

    return {
      totalInteractions:
        signals.length,

      successRate:
        this.average(
          signals.map(s =>
            s.success ? 1 : 0
          )
        ),

      avgEngagement:
        this.average(
          signals.map(s =>
            s.engagement
          )
        ),

      avgClarity:
        this.average(
          signals.map(s =>
            s.clarityScore
          )
        )
    };
  }
}

module.exports =
  MentorFeedbackLoop;
