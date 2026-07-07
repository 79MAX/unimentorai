/**
 * VIDEO TUTOR LESSON ENGINE - UniMentorAI
 * Orchestrates full adaptive learning lessons
 */

class VideoTutorLessonEngine {
  constructor({
    contextAnalyzer,
    knowledgeBase,
    skillMapper,
    performanceScorer,
    learningPathEngine,
    tutorBrain,
    analytics,
    logger
  }) {
    this.contextAnalyzer = contextAnalyzer;
    this.knowledgeBase = knowledgeBase;
    this.skillMapper = skillMapper;
    this.performanceScorer = performanceScorer;
    this.learningPathEngine = learningPathEngine;
    this.tutorBrain = tutorBrain;
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: execute full lesson flow
   */
  async runLesson({ userId, courseId, videoId, action }) {
    try {
      const context = await this.contextAnalyzer.analyze({
        userId,
        courseId,
        sessionData: { videoId, action }
      });

      const knowledge = await this.knowledgeBase.getRelevantKnowledge({
        courseId,
        skillId: context?.skills?.current || "general",
        query: action?.query || null
      });

      const skills = await this.skillMapper.mapUserSkills({
        userId,
        courseId
      });

      const performance = await this.performanceScorer.computeScore({
        userId,
        courseId
      });

      const nextPath = await this.learningPathEngine.generatePath({
        userId,
        courseId,
        currentVideoId: videoId
      });

      const decision = await this.tutorBrain.decideNextStep({
        userId,
        courseId,
        currentState: {
          context,
          knowledge,
          skills,
          performance,
          nextPath,
          action
        }
      });

      const lessonFlow = this._buildLessonFlow({
        context,
        knowledge,
        skills,
        performance,
        nextPath,
        decision
      });

      await this._trackLesson(userId, courseId, lessonFlow);

      return lessonFlow;

    } catch (error) {
      this.logger.error("LessonEngine error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Build structured lesson flow
   */
  _buildLessonFlow({
    context,
    knowledge,
    skills,
    performance,
    nextPath,
    decision
  }) {
    return {
      lessonState: {
        level: performance.level,
        score: performance.score,
        mastery: skills.mastery,
        readiness: context.readinessScore
      },

      content: {
        explanation: decision?.explanation || "No explanation available",
        example: knowledge?.knowledge?.examples?.[0] || null,
        concept: knowledge?.knowledge?.concepts?.[0] || null
      },

      action: {
        nextStep: decision?.nextStep || nextPath?.next,
        strategy: nextPath?.strategy || "linear"
      },

      metadata: {
        confidence: decision?.confidence || 0.5,
        timestamp: Date.now()
      }
    };
  }

  /**
   * 📊 Track full lesson execution
   */
  async _trackLesson(userId, courseId, lessonFlow) {
    await this.analytics.track("lesson_execution", {
      userId,
      courseId,
      score: lessonFlow.lessonState.score,
      level: lessonFlow.lessonState.level,
      strategy: lessonFlow.action.strategy,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Safe fallback lesson
   */
  _fallback() {
    return {
      lessonState: {
        level: "unknown",
        score: 50,
        mastery: 0,
        readiness: 50
      },
      content: {
        explanation: "System temporarily unavailable",
        example: null,
        concept: null
      },
      action: {
        nextStep: "retry",
        strategy: "fallback"
      },
      metadata: {
        confidence: 0.1,
        timestamp: Date.now()
      }
    };
  }
}

module.exports = VideoTutorLessonEngine;
