/**
 * video.tutor.network.optimizer.js
 * UniMentorAI - Network Intelligence & Adaptive Quality Engine
 */

class VideoTutorNetworkOptimizer {
  constructor({
    eventBus,
    logger
  }) {
    this.eventBus = eventBus;
    this.logger = logger;

    this.metrics = {
      rtt: 0,
      jitter: 0,
      packetLoss: 0,
      bandwidth: 0
    };

    this.qualityProfile = "HIGH";
  }

  /**
   * 📡 UPDATE NETWORK METRICS
   */
  updateMetrics(data) {
    this.metrics = {
      ...this.metrics,
      ...data
    };

    const profile = this._computeProfile();

    if (profile !== this.qualityProfile) {
      this.qualityProfile = profile;

      this._emitChange(profile);
    }

    return profile;
  }

  /**
   * 🧠 COMPUTE QUALITY PROFILE
   */
  _computeProfile() {
    const { rtt, jitter, packetLoss, bandwidth } = this.metrics;

    // 🔴 BAD NETWORK
    if (
      rtt > 300 ||
      jitter > 50 ||
      packetLoss > 0.1 ||
      bandwidth < 0.5
    ) {
      return "LOW";
    }

    // 🟡 MEDIUM NETWORK
    if (
      rtt > 150 ||
      jitter > 25 ||
      packetLoss > 0.03 ||
      bandwidth < 2
    ) {
      return "MEDIUM";
    }

    // 🟢 GOOD NETWORK
    return "HIGH";
  }

  /**
   * 🎥 GET VIDEO CONFIG
   */
  getVideoConstraints() {
    switch (this.qualityProfile) {

      case "LOW":
        return {
          width: 320,
          height: 240,
          frameRate: 10,
          bitrate: 150_000
        };

      case "MEDIUM":
        return {
          width: 640,
          height: 480,
          frameRate: 20,
          bitrate: 800_000
        };

      case "HIGH":
      default:
        return {
          width: 1280,
          height: 720,
          frameRate: 30,
          bitrate: 2_500_000
        };
    }
  }

  /**
   * 🎧 GET AUDIO CONFIG
   */
  getAudioConstraints() {
    switch (this.qualityProfile) {

      case "LOW":
        return {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 8000
        };

      case "MEDIUM":
      case "HIGH":
      default:
        return {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        };
    }
  }

  /**
   * 🔁 ADAPTIVE DOWNGRADE LOGIC
   */
  shouldDowngrade() {
    return (
      this.metrics.packetLoss > 0.08 ||
      this.metrics.rtt > 350
    );
  }

  /**
   * ⬆️ UPGRADE LOGIC
   */
  shouldUpgrade() {
    return (
      this.metrics.packetLoss < 0.02 &&
      this.metrics.rtt < 120 &&
      this.metrics.bandwidth > 3
    );
  }

  /**
   * 📡 EMIT PROFILE CHANGE
   */
  _emitChange(profile) {
    this.logger.info("Network profile changed", {
      profile
    });

    this.eventBus.emit("network.profile.changed", {
      profile,
      metrics: this.metrics
    });
  }

  /**
   * 🔄 SIMULATED NETWORK PING
   * (remplacé plus tard par WebRTC stats API)
   */
  simulateMetrics() {
    return {
      rtt: 50 + Math.random() * 300,
      jitter: Math.random() * 60,
      packetLoss: Math.random() * 0.1,
      bandwidth: Math.random() * 5
    };
  }

  /**
   * 📊 SNAPSHOT
   */
  getState() {
    return {
      profile: this.qualityProfile,
      metrics: this.metrics
    };
  }
}

module.exports =
  VideoTutorNetworkOptimizer;
