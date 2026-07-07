/**
 * video.tutor.learning.model.js
 * UniMentorAI Learning Digital Twin
 */

class VideoTutorLearningModel {
  constructor({
    eventBus,
    telemetry,
    logger
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    this.models = new Map();
  }

  initialize(userId) {
    const model = {
      userId,

      mastery: {},

      skillGraph: {},

      engagement: {
        score: 50,
        trend: "stable",
        lastActiveAt: Date.now()
      },

      performance: {
        accuracy: 0,
        completionRate: 0,
        retentionRate: 0,
        averageScore: 0
      },

      risk: {
        dropoutProbability: 0,
        burnoutRisk: 0
      },

      certification: {
        readinessScore: 0,
        predictedPassProbability: 0,
        missingCompetencies: []
      },

      career: {
        employabilityScore: 0,
        entrepreneurshipScore: 0,
        leadershipScore: 0
      },

      analytics: {
        totalLearningMinutes: 0,
        completedLessons: 0,
        completedCourses: 0,
        averageSessionDuration: 0
      },

      aiInsights: {
        strongestSkill: null,
        weakestSkill: null,
        recommendedNextSkill: null,
        learningMomentum: 0
      },

      learningProfile: {
        pace: "adaptive",
        preferredLanguage: "fr",
        difficultyPreference: "dynamic",
        sessionDurationPreference: 30
      },

      metadata: {
        version: "1.0.0",
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };

    this.models.set(userId, model);

    return model;
  }

  getModel(userId) {
    return (
      this.models.get(userId) ||
      this.initialize(userId)
    );
  }

  updateMastery(userId, skillId, masteryScore) {
    const model = this.getModel(userId);

    model.mastery[skillId] = masteryScore;

    model.metadata.updatedAt = Date.now();

    this._refreshInsights(model);

    this._emitUpdate(userId);

    return model;
  }

  updateSkillGraph(userId, skillId, payload) {
    const model = this.getModel(userId);

    model.skillGraph[skillId] = {
      mastery: payload.mastery || 0,
      confidence: payload.confidence || 0,
      prerequisites: payload.prerequisites || [],
      lastAssessment: Date.now()
    };

    model.metadata.updatedAt = Date.now();

    this._emitUpdate(userId);

    return model;
  }

  updatePerformance(userId, performance) {
    const model = this.getModel(userId);

    model.performance = {
      ...model.performance,
      ...performance
    };

    this._recalculateRisk(model);
    this._recalculateCertification(model);

    model.metadata.updatedAt = Date.now();

    this._emitUpdate(userId);

    return model;
  }

  updateEngagement(userId, score) {
    const model = this.getModel(userId);

    model.engagement.trend =
      score > model.engagement.score
        ? "up"
        : "down";

    model.engagement.score = score;
    model.engagement.lastActiveAt = Date.now();

    this._recalculateRisk(model);

    model.metadata.updatedAt = Date.now();

    this._emitUpdate(userId);

    return model;
  }

  calculateKnowledgeIndex(userId) {
    const model = this.getModel(userId);

    const values = Object.values(model.mastery);

    if (!values.length) {
      return 0;
    }

    return (
      values.reduce((a, b) => a + b, 0) /
      values.length
    );
  }

  predictDropoutRisk(userId) {
    return this.getModel(userId)
      .risk.dropoutProbability;
  }

  calculateCertificationReadiness(userId) {
    return this.getModel(userId)
      .certification.readinessScore;
  }

  exportSnapshot(userId) {
    return structuredClone(
      this.getModel(userId)
    );
  }

  _recalculateRisk(model) {
    let score = 0;

    if (
      model.performance.completionRate < 0.5
    ) score += 30;

    if (
      model.performance.retentionRate < 0.5
    ) score += 30;

    if (
      model.engagement.score < 40
    ) score += 40;

    model.risk.dropoutProbability =
      Math.min(score / 100, 1);

    model.risk.burnoutRisk =
      model.analytics.averageSessionDuration >
      180
        ? 0.7
        : 0.2;
  }

  _recalculateCertification(model) {
    const readiness =
      (
        model.performance.accuracy +
        model.performance.retentionRate +
        model.performance.completionRate
      ) / 3;

    model.certification.readinessScore =
      Math.round(readiness * 100);

    model.certification.predictedPassProbability =
      readiness;
  }

  _refreshInsights(model) {
    const entries =
      Object.entries(model.mastery);

    if (!entries.length) return;

    entries.sort((a, b) => b[1] - a[1]);

    model.aiInsights.strongestSkill =
      entries[0][0];

    model.aiInsights.weakestSkill =
      entries[
        entries.length - 1
      ][0];
  }

  _emitUpdate(userId) {
    this.eventBus.emit(
      "learning.model.updated",
      { userId }
    );

    this.telemetry.collect({
      type: "learning.model.updated",
      userId
    });
  }
}

module.exports =
  VideoTutorLearningModel;
