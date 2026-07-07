/**
 * VIDEO TUTOR LEARNING PATH ENGINE - UniMentorAI
 * Dynamically generates adaptive learning paths per user
 */

class VideoTutorLearningPathEngine {
  constructor({ analytics, progressTracker, contextAnalyzer, logger }) {
    this.analytics = analytics;
    this.progressTracker = progressTracker;
    this.contextAnalyzer = contextAnalyzer;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: generate next learning path
   */
  async generatePath({ userId, courseId, currentVideoId }) {
    try {
      const [context, progress] = await Promise.all([
        this.contextAnalyzer.analyze({
          userId,
          courseId,
          sessionData: { currentVideoId }
        }),
        this.progressTracker.updateProgress({
          userId,
          courseId,
          videoId: currentVideoId,
          event: { type: "path_request" }
        })
      ]);

      const path = this._buildPath({
        context,
        progress,
        currentVideoId
      });

      const optimizedPath = this._optimizePath(path, context);

      await this._trackPath(userId, courseId, optimizedPath);

      return optimizedPath;

    } catch (error) {
      this.logger.error("LearningPathEngine error", error);
      return this._fallbackPath(currentVideoId);
    }
  }

  /**
   * 🧭 Build base learning path (rule + AI hybrid)
   */
  _buildPath({ context, progress, currentVideoId }) {
    const completion = progress.metrics?.completionRate || 0;
    const engagement = progress.metrics?.engagementScore || 50;

    const path = {
      current: currentVideoId,
      next: null,
      strategy: "normal",
      difficulty: "medium",
      reasoning: []
    };

    // 🎯 STRATEGY DECISION
    if (completion > 80 && engagement > 70) {
      path.strategy = "accelerated";
      path.difficulty = "hard";
      path.reasoning.push("High performance detected → accelerate learning");
    }

    if (completion < 40) {
      path.strategy = "remedial";
      path.difficulty = "easy";
      path.reasoning.push("Low completion → reinforce fundamentals");
    }

    if (engagement < 40) {
      path.strategy = "simplified";
      path.difficulty = "easy";
      path.reasoning.push("Low engagement → reduce cognitive load");
    }

    return path;
  }

  /**
   * ⚡ AI + heuristic optimization layer
   */
  _optimizePath(path, context) {
    const optimized = { ...path };

    // Learning style adaptation
    if (context.insights?.learningStyle === "visual") {
      optimized.formatPreference = "video-heavy";
    }

    if (context.insights?.learningStyle === "reading") {
      optimized.formatPreference = "text-supported";
    }

    // Motivation boost logic
    if (context.insights?.motivationLevel === "low") {
      optimized.microRewardInjection = true;
      optimized.strategy = "gamified";
      optimized.reasoning.push("Low motivation → gamification enabled");
    }

    return optimized;
  }

  /**
   * 📊 Track learning path decisions
   */
  async _trackPath(userId, courseId, path) {
    await this.analytics.track("learning_path_generated", {
      userId,
      courseId,
      strategy: path.strategy,
      difficulty: path.difficulty,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Fallback path (safe linear progression)
   */
  _fallbackPath(currentVideoId) {
    return {
      current: currentVideoId,
      next: null,
      strategy: "linear_fallback",
      difficulty: "medium",
      reasoning: ["Fallback mode activated"]
    };
  }
}

module.exports = VideoTutorLearningPathEngine;
