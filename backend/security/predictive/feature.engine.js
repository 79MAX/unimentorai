 /**
 * ==================================================
 * FEATURE ENGINE V2
 * UniMentorAI Behavioral Intelligence Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Convert raw user events into predictive signals
 * - Normalize behavioral data
 * - Extract early anomaly indicators
 */

class FeatureEngine {
  constructor() {
    this.window = {
      loginHistory: [],
      requestHistory: [],
    };

    this.maxWindowSize = 50;
  }

  /**
   * 🚀 MAIN FEATURE EXTRACTION PIPELINE
   */
  extract(event = {}) {
    this._updateWindow(event);

    const features = {
      loginFrequency: this._loginFrequency(event),
      geoDistance: this._geoDistance(event),
      requestBurst: this._requestBurst(event),
      behaviorAnomaly: this._behaviorAnomaly(event),

      /**
       * NEW ENGINEERED FEATURES (IMPORTANT UPGRADE)
       */
      sessionVelocity: this._sessionVelocity(),
      timeIrregularity: this._timeIrregularity(),
      actionEntropy: this._actionEntropy(),
    };

    return this._normalize(features);
  }

  /**
   * ==========================
   * WINDOW UPDATE (TIME SERIES MEMORY)
   * ==========================
   */
  _updateWindow(event) {
    if (event.type === "login") {
      this.window.loginHistory.push(Date.now());
    }

    if (event.type === "request") {
      this.window.requestHistory.push(Date.now());
    }

    if (this.window.loginHistory.length > this.maxWindowSize) {
      this.window.loginHistory.shift();
    }

    if (this.window.requestHistory.length > this.maxWindowSize) {
      this.window.requestHistory.shift();
    }
  }

  /**
   * ==========================
   * LOGIN FREQUENCY FEATURE
   * ==========================
   */
  _loginFrequency(event) {
    const now = Date.now();
    const recent = this.window.loginHistory.filter(
      (t) => now - t < 3600000 // last hour
    );

    return recent.length / 10; // scaled
  }

  /**
   * ==========================
   * GEO DISTANCE FEATURE
   * ==========================
   */
  _geoDistance(event) {
    if (!event.geoRiskScore) return 0;
    return event.geoRiskScore;
  }

  /**
   * ==========================
   * REQUEST BURST DETECTION
   * ==========================
   */
  _requestBurst() {
    const now = Date.now();
    const recent = this.window.requestHistory.filter(
      (t) => now - t < 60000 // last minute
    );

    return recent.length / 20;
  }

  /**
   * ==========================
   * BEHAVIOR ANOMALY BASE SIGNAL
   * ==========================
   */
  _behaviorAnomaly(event) {
    let score = 0;

    if (event.failedLogins > 3) score += 0.4;
    if (event.suspiciousAgent) score += 0.2;
    if (event.unusualTime) score += 0.2;
    if (event.ipChange) score += 0.2;

    return Math.min(1, score);
  }

  /**
   * ==========================
   * SESSION VELOCITY (NEW)
   * ==========================
   */
  _sessionVelocity() {
    return this.window.requestHistory.length / 100;
  }

  /**
   * ==========================
   * TIME IRREGULARITY (NEW)
   * ==========================
   */
  _timeIrregularity() {
    if (this.window.requestHistory.length < 2) return 0;

    const diffs = [];

    for (let i = 1; i < this.window.requestHistory.length; i++) {
      diffs.push(
        this.window.requestHistory[i] - this.window.requestHistory[i - 1]
      );
    }

    const avg =
      diffs.reduce((a, b) => a + b, 0) / diffs.length;

    const variance =
      diffs.reduce((a, b) => a + Math.abs(b - avg), 0) /
      diffs.length;

    return Math.min(1, variance / 10000);
  }

  /**
   * ==========================
   * ACTION ENTROPY (ADVANCED SIGNAL)
   * ==========================
   */
  _actionEntropy() {
    const actions = this.window.requestHistory.length;

    if (actions === 0) return 0;

    return Math.min(1, actions / 50);
  }

  /**
   * ==========================
   * NORMALIZATION LAYER
   * ==========================
   */
  _normalize(features) {
    const normalized = {};

    for (const key in features) {
      const value = features[key];
      normalized[key] = Math.max(0, Math.min(1, value));
    }

    return normalized;
  }
}

/**
 * Singleton instance
 */
export const featureEngine = new FeatureEngine();
