/**
 * VIDEO TUTOR ORCHESTRATOR - UniMentorAI
 * Global orchestration layer for AI Tutor ecosystem
 */

class VideoTutorOrchestrator {
  constructor({
    engine,
    analytics,
    insightsGenerator,
    monetizer,
    revenueLinker,
    ltvEngine,
    behaviorDetector,
    logger
  }) {
    this.engine = engine;
    this.analytics = analytics;
    this.insightsGenerator = insightsGenerator;
    this.monetizer = monetizer;
    this.revenueLinker = revenueLinker;
    this.ltvEngine = ltvEngine;
    this.behaviorDetector = behaviorDetector;
    this.logger = logger;
  }

  /**
   * 🎯 MAIN ORCHESTRATION ENTRY
   */
  async execute(request, req) {
    try {
      // 1. Execute core engine (AI + guard + middleware pipeline)
      const engineResult = await this.engine.handle(request, req);

      // 2. Extract context from engine output
      const context = this._extractContext(request, engineResult);

      // 3. Parallel intelligence layer (performance optimization)
      const [
        analytics,
        insights,
        monetization,
        revenue,
        ltv,
        behavior
      ] = await Promise.all([
        this._runAnalytics(context),
        this._runInsights(context),
        this._runMonetization(context),
        this._runRevenue(context),
        this._runLTV(context),
        this._runBehavior(context)
      ]);

      // 4. Decision fusion layer (AI brain synthesis)
      const decision = this._synthesize({
        analytics,
        insights,
        monetization,
        revenue,
        ltv,
        behavior
      });

      // 5. Final response assembly
      const response = this._buildResponse(engineResult, decision);

      return response;

    } catch (error) {
      this.logger.error("Orchestrator error", error);

      return {
        success: false,
        error: "orchestration_failure"
      };
    }
  }

  /**
   * 🧠 Extract unified context
   */
  _extractContext(request, engineResult) {
    return {
      ...request,
      engineResult,
      timestamp: Date.now()
    };
  }

  /**
   * 📊 Analytics pipeline
   */
  async _runAnalytics(context) {
    return this.analytics.track({
      type: "orchestrator_event",
      userId: context.userId,
      courseId: context.courseId,
      videoId: context.videoId,
      payload: context.payload
    });
  }

  /**
   * 🧠 Insights pipeline
   */
  async _runInsights(context) {
    return this.insightsGenerator.generate([context.payload]);
  }

  /**
   * 💰 Monetization pipeline
   */
  async _runMonetization(context) {
    return this.monetizer.evaluate({
      userId: context.userId,
      courseId: context.courseId,
      videoId: context.videoId,
      context
    });
  }

  /**
   * 💸 Revenue pipeline
   */
  async _runRevenue(context) {
    return this.revenueLinker.link({
      userId: context.userId,
      courseId: context.courseId,
      videoId: context.videoId,
      context
    });
  }

  /**
   * 📈 LTV pipeline
   */
  async _runLTV(context) {
    return this.ltvEngine.predict({
      userId: context.userId,
      context
    });
  }

  /**
   * 🧠 Behavior pipeline
   */
  async _runBehavior(context) {
    return this.behaviorDetector.detect({
      userId: context.userId,
      event: context.payload
    });
  }

  /**
   * 🧠 AI decision fusion layer
   */
  _synthesize(data) {
    return {
      userSegment: data.ltv?.segment || "unknown",
      revenueOpportunity: data.revenue?.action?.action || "none",
      engagementLevel: data.behavior?.classification || "balanced",
      learningRisk: data.insights?.insights?.length > 0 ? "detected" : "low",
      monetizationPriority: data.monetization?.opportunity || "none"
    };
  }

  /**
   * 🎯 Final response builder
   */
  _buildResponse(engineResult, decision) {
    return {
      success: true,
      engine: engineResult,
      intelligence: decision,
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorOrchestrator;
