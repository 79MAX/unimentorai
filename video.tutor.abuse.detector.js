/**
 * VIDEO TUTOR ABUSE DETECTOR - UniMentorAI
 * AI-driven behavioral anomaly & fraud detection system
 */

class VideoTutorAbuseDetector {
  constructor({ eventBus, logger }) {
    this.eventBus = eventBus;
    this.logger = logger;

    this.userProfiles = new Map();
  }

  /**
   * 🎯 Main detection entry
   */
  analyze(userId, context = {}) {
    const profile = this._getProfile(userId);

    const signals = this._extractSignals(context);

    const score = this._computeAbuseScore(profile, signals);

    const riskLevel = this._classify(score);

    // update profile
    this._updateProfile(profile, signals, riskLevel);

    // trigger system events if needed
    this._triggerEvents(userId, riskLevel, score);

    return {
      userId,
      score,
      riskLevel,
      flagged: score > 70
    };
  }

  /**
   * 🧠 Extract behavioral signals
   */
  _extractSignals(context) {
    return {
      rapidActions: context.behavior?.rapidActions || 0,
      requestBurst: context.requestsInLastSecond || 0,
      invalidInputs: context.invalidInputs || 0,
      sessionSpam: context.sessionSpam || false,
      unusualNavigation: context.navigationPattern === "erratic",
      payloadSize: context.payloadSize || 0
    };
  }

  /**
   * 📊 Compute abuse score
   */
  _computeAbuseScore(profile, signals) {
    let score = 0;

    if (signals.rapidActions > 20) score += 25;
    if (signals.requestBurst > 10) score += 30;
    if (signals.invalidInputs > 5) score += 15;
    if (signals.sessionSpam) score += 20;
    if (signals.unusualNavigation) score += 10;
    if (signals.payloadSize > 8000) score += 10;

    // historical behavior penalty
    if (profile.previousFlags > 3) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * ⚠️ Risk classification
   */
  _classify(score) {
    if (score > 80) return "critical";
    if (score > 60) return "high";
    if (score > 30) return "medium";
    return "low";
  }

  /**
   * 📦 Profile management
   */
  _getProfile(userId) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        flags: 0,
        previousFlags: 0,
        history: []
      });
    }

    return this.userProfiles.get(userId);
  }

  /**
   * 🧠 Update profile learning
   */
  _updateProfile(profile, signals, riskLevel) {
    profile.history.push({
      signals,
      riskLevel,
      timestamp: Date.now()
    });

    if (riskLevel === "high" || riskLevel === "critical") {
      profile.previousFlags += 1;
    }

    // limit memory
    if (profile.history.length > 50) {
      profile.history.shift();
    }
  }

  /**
   * 🚨 Trigger system reactions
   */
  _triggerEvents(userId, riskLevel, score) {
    if (riskLevel === "high" || riskLevel === "critical") {
      this.eventBus.emit("system.abuse_detected", {
        userId,
        riskLevel,
        score
      });

      this.logger.warn("Abuse detected", {
        userId,
        riskLevel,
        score
      });
    }

    if (riskLevel === "critical") {
      this.eventBus.emit("system.block_user", {
        userId,
        reason: "abuse_critical"
      });
    }
  }
}

module.exports = VideoTutorAbuseDetector;
