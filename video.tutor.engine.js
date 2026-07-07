/**
 * VIDEO TUTOR ENGINE - UniMentorAI
 * Core orchestration engine for AI Tutor system
 */

class VideoTutorEngine {
  constructor({
    guard,
    middleware,
    behaviorDetector,
    attentionTracker,
    lessonEngine,
    chatEngine,
    voiceBridge,
    responseEngine,
    analytics,
    insightsGenerator,
    monetizer,
    revenueLinker,
    ltvEngine,
    logger
  }) {
    this.guard = guard;
    this.middleware = middleware;
    this.behaviorDetector = behaviorDetector;
    this.attentionTracker = attentionTracker;

    this.lessonEngine = lessonEngine;
    this.chatEngine = chatEngine;
    this.voiceBridge = voiceBridge;
    this.responseEngine = responseEngine;

    this.analytics = analytics;
    this.insightsGenerator = insightsGenerator;

    this.monetizer = monetizer;
    this.revenueLinker = revenueLinker;
    this.ltvEngine = ltvEngine;

    this.logger = logger;
  }

  /**
   * 🎯 MAIN ENTRY POINT
   */
  async handle(request, req) {
    try {
      // 1. Middleware preprocessing
      const context = await this.middleware.process(req);

      // 2. Guard protection layer
      const guardResult = await this.guard.protect(context);

      if (!guardResult.allowed) {
        return this._blockedResponse(guardResult);
      }

      context.guard = guardResult;

      // 3. Behavior detection
      const behavior = this.behaviorDetector.detect({
        userId: context.userId,
        event: context.payload
      });

      context.behavior = behavior;

      // 4. Attention tracking
      const attention = this.attentionTracker.track({
        userId: context.userId,
        signals: context.payload
      });

      context.attention = attention;

      // 5. Determine mode (lesson/chat/voice)
      const mode = this._resolveMode(context);

      // 6. Route to correct AI engine
      const aiResponse = await this._route(mode, context);

      // 7. Analytics tracking
      await this.analytics.track({
        type: "tutor_interaction",
        userId: context.userId,
        courseId: context.courseId,
        videoId: context.videoId,
        payload: context.payload
      });

      // 8. Insights generation
      const insights = this.insightsGenerator.generate([context.payload]);

      // 9. Monetization engine
      const monetization = this.monetizer.evaluate({
        userId: context.userId,
        courseId: context.courseId,
        videoId: context.videoId,
        context
      });

      // 10. Revenue linking
      const revenue = this.revenueLinker.link({
        userId: context.userId,
        courseId: context.courseId,
        videoId: context.videoId,
        context
      });

      // 11. LTV prediction
      const ltv = this.ltvEngine.predict({
        userId: context.userId,
        context
      });

      // 12. Final response assembly
      const finalResponse = this.responseEngine.build({
        aiResponse,
        insights,
        monetization,
        revenue,
        ltv,
        behavior
      });

      return finalResponse;

    } catch (error) {
      this.logger.error("VideoTutorEngine error", error);

      return {
        success: false,
        error: "engine_failure"
      };
    }
  }

  /**
   * 🧠 Resolve interaction mode
   */
  _resolveMode(context) {
    const p = context.payload || {};

    if (p.voiceEvent) return "voice";
    if (p.chatMessage) return "chat";
    if (p.lessonRequest) return "lesson";

    return "lesson";
  }

  /**
   * ⚙️ Route to correct AI engine
   */
  async _route(mode, context) {
    switch (mode) {

      case "voice":
        return await this.voiceBridge.handleVoice(context);

      case "chat":
        return await this.chatEngine.handleMessage(context);

      case "lesson":
      default:
        return await this.lessonEngine.runLesson(context);
    }
  }

  /**
   * 🚫 Blocked response handler
   */
  _blockedResponse(guardResult) {
    return {
      success: false,
      blocked: true,
      reason: guardResult.reason,
      risk: guardResult.risk
    };
  }
}

module.exports = VideoTutorEngine;
