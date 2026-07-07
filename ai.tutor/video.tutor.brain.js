/**
 * VIDEO TUTOR BRAIN - UniMentorAI
 * Responsible for:
 * - learning path decision
 * - user adaptation
 * - content sequencing
 */

class VideoTutorBrain {
  constructor({ aiModel, analytics, memory, logger }) {
    this.aiModel = aiModel;
    this.analytics = analytics;
    this.memory = memory;
    this.logger = logger;
  }

  /**
   * 🎯 Main decision engine
   */
  async decideNextStep({ userId, courseId, currentState }) {
    try {
      const context = await this._buildContext(userId, courseId, currentState);

      const decision = await this.aiModel.predict({
        input: context,
        mode: "tutor-next-step"
      });

      await this._trackDecision(userId, decision);

      return this._formatResponse(decision);
    } catch (error) {
      this.logger.error("VideoTutorBrain failure", error);
      return this._fallbackResponse();
    }
  }

  /**
   * 🧠 Build full learning context
   */
  async _buildContext(userId, courseId, state) {
    const [profile, history, performance] = await Promise.all([
      this.memory.getUserProfile(userId),
      this.analytics.getLearningHistory(userId, courseId),
      this.analytics.getPerformanceMetrics(userId, courseId)
    ]);

    return {
      user: profile,
      state,
      history,
      performance,
      timestamp: Date.now()
    };
  }

  /**
   * 📊 Track AI decision for optimization
   */
  async _trackDecision(userId, decision) {
    await this.analytics.track("tutor_decision", {
      userId,
      decisionType: decision.type,
      confidence: decision.confidence,
      timestamp: Date.now()
    });
  }

  /**
   * 🧾 Normalize output
   */
  _formatResponse(decision) {
    return {
      nextAction: decision.type || "continue",
      contentId: decision.contentId || null,
      difficulty: decision.difficulty || "medium",
      explanation: decision.reason || "AI generated path",
      confidence: decision.confidence || 0.5
    };
  }

  /**
   * 🔄 Safe fallback (critical for production)
   */
  _fallbackResponse() {
    return {
      nextAction: "continue",
      contentId: null,
      difficulty: "medium",
      explanation: "Fallback mode activated",
      confidence: 0.2
    };
  }
}

module.exports = VideoTutorBrain;
