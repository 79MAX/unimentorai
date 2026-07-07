/**
 * VIDEO TUTOR VIDEO SIGNALS ANALYZER - UniMentorAI
 * Converts raw video events into structured learning intelligence signals
 */

class VideoTutorVideoSignalsAnalyzer {
  constructor({ analytics, logger }) {
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: analyze raw video event
   */
  async analyze({ userId, courseId, videoId, event }) {
    try {
      const signal = this._interpretEvent(event);

      const enrichedSignal = this._enrichSignal({
        userId,
        courseId,
        videoId,
        signal
      });

      await this._trackSignal(enrichedSignal);

      return enrichedSignal;

    } catch (error) {
      this.logger.error("VideoSignalsAnalyzer error", error);
      return this._fallback(event);
    }
  }

  /**
   * 🧠 Interpret raw video event into learning signal
   */
  _interpretEvent(event) {
    switch (event.type) {
      case "play":
        return {
          type: "engagement_start",
          intensity: 1,
          meaning: "User started or resumed learning"
        };

      case "pause":
        return this._analyzePause(event);

      case "seek":
        return this._analyzeSeek(event);

      case "speed_change":
        return this._analyzeSpeed(event);

      case "rewatch":
        return {
          type: "confusion_indicator",
          intensity: 0.8,
          meaning: "User rewatched content (possible confusion or revision)"
        };

      case "complete":
        return {
          type: "completion_signal",
          intensity: 1,
          meaning: "User completed video"
        };

      default:
        return {
          type: "unknown",
          intensity: 0.2,
          meaning: "Unclassified event"
        };
    }
  }

  /**
   * ⏸ Pause analysis (very important signal)
   */
  _analyzePause(event) {
    const duration = event.duration || 0;

    if (duration > 60) {
      return {
        type: "high_cognitive_load",
        intensity: 0.9,
        meaning: "User paused long → possible difficulty"
      };
    }

    if (duration > 20) {
      return {
        type: "reflection_pause",
        intensity: 0.6,
        meaning: "User is thinking or processing content"
      };
    }

    return {
      type: "micro_pause",
      intensity: 0.3,
      meaning: "Normal pause behavior"
    };
  }

  /**
   * ⏩ Seek analysis (skipping behavior)
   */
  _analyzeSeek(event) {
    const diff = Math.abs(event.from - event.to);

    if (diff > 30) {
      return {
        type: "content_skip",
        intensity: 0.8,
        meaning: "User skipped large section (possible disengagement)"
      };
    }

    return {
      type: "navigation_adjustment",
      intensity: 0.4,
      meaning: "User adjusted position slightly"
    };
  }

  /**
   * ⚡ Speed change analysis
   */
  _analyzeSpeed(event) {
    const speed = event.speed || 1;

    if (speed >= 1.75) {
      return {
        type: "fast_learner",
        intensity: 0.7,
        meaning: "User consumes content very fast"
      };
    }

    if (speed <= 0.75) {
      return {
        type: "difficulty_indicator",
        intensity: 0.8,
        meaning: "User slowed down → possible difficulty"
      };
    }

    return {
      type: "normal_speed",
      intensity: 0.5,
      meaning: "Standard learning pace"
    };
  }

  /**
   * 📦 Enrich signal with context metadata
   */
  _enrichSignal({ userId, courseId, videoId, signal }) {
    return {
      userId,
      courseId,
      videoId,
      signal,
      timestamp: Date.now(),
      confidence: this._computeConfidence(signal)
    };
  }

  /**
   * 📊 Confidence scoring for signal reliability
   */
  _computeConfidence(signal) {
    if (signal.intensity > 0.7) return 0.9;
    if (signal.intensity > 0.4) return 0.7;
    return 0.5;
  }

  /**
   * 📊 Track analytics
   */
  async _trackSignal(signal) {
    await this.analytics.track("video_signal", {
      userId: signal.userId,
      courseId: signal.courseId,
      videoId: signal.videoId,
      type: signal.signal.type,
      intensity: signal.signal.intensity,
      timestamp: signal.timestamp
    });
  }

  /**
   * 🔄 Fallback safe signal
   */
  _fallback(event) {
    return {
      signal: {
        type: "unknown",
        intensity: 0.1,
        meaning: "Fallback signal"
      },
      confidence: 0.1,
      timestamp: Date.now(),
      raw: event
    };
  }
}

module.exports = VideoTutorVideoSignalsAnalyzer;
