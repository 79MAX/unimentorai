/**
 * VIDEO TUTOR AUDIO PROCESSOR - UniMentorAI
 * Converts audio behavior into learning intelligence signals
 */

class VideoTutorAudioProcessor {
  constructor({ analytics, logger }) {
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: process audio event
   */
  async process({ userId, courseId, videoId, audioEvent }) {
    try {
      const signal = this._analyzeAudioEvent(audioEvent);

      const enriched = this._enrichSignal({
        userId,
        courseId,
        videoId,
        signal
      });

      await this._trackAudioSignal(enriched);

      return enriched;

    } catch (error) {
      this.logger.error("AudioProcessor error", error);
      return this._fallback(audioEvent);
    }
  }

  /**
   * 🧠 Core audio intelligence analysis
   */
  _analyzeAudioEvent(event) {
    switch (event.type) {
      case "audio_play":
        return {
          type: "audio_engagement_start",
          intensity: 1,
          meaning: "Audio narration started"
        };

      case "audio_pause":
        return this._analyzeAudioPause(event);

      case "speech_rate":
        return this._analyzeSpeechRate(event);

      case "emphasis_detected":
        return {
          type: "key_concept_emphasis",
          intensity: 0.8,
          meaning: "Important concept highlighted in audio"
        };

      case "silence_gap":
        return this._analyzeSilence(event);

      default:
        return {
          type: "unknown_audio_event",
          intensity: 0.2,
          meaning: "Unclassified audio signal"
        };
    }
  }

  /**
   * ⏸ Audio pause analysis
   */
  _analyzeAudioPause(event) {
    const duration = event.duration || 0;

    if (duration > 5) {
      return {
        type: "audio_comprehension_pause",
        intensity: 0.8,
        meaning: "User likely processing explanation"
      };
    }

    return {
      type: "micro_audio_pause",
      intensity: 0.3,
      meaning: "Natural audio pause"
    };
  }

  /**
   * 🎙 Speech rate analysis (tutor or system voice)
   */
  _analyzeSpeechRate(event) {
    const rate = event.wordsPerMinute || 0;

    if (rate > 180) {
      return {
        type: "fast_audio_delivery",
        intensity: 0.8,
        meaning: "Content delivered too quickly for learner"
      };
    }

    if (rate < 110) {
      return {
        type: "slow_audio_delivery",
        intensity: 0.4,
        meaning: "Slow paced explanation (good for beginners)"
      };
    }

    return {
      type: "optimal_audio_delivery",
      intensity: 0.5,
      meaning: "Balanced speech rate"
    };
  }

  /**
   * 🔇 Silence gap analysis
   */
  _analyzeSilence(event) {
    const duration = event.duration || 0;

    if (duration > 3) {
      return {
        type: "cognitive_processing_window",
        intensity: 0.7,
        meaning: "User likely thinking/processing content"
      };
    }

    return {
      type: "micro_silence",
      intensity: 0.2,
      meaning: "Normal pause between audio segments"
    };
  }

  /**
   * 📦 Enrich signal with metadata
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
   * 📊 Confidence scoring
   */
  _computeConfidence(signal) {
    if (signal.intensity >= 0.8) return 0.9;
    if (signal.intensity >= 0.5) return 0.7;
    return 0.5;
  }

  /**
   * 📊 Analytics tracking
   */
  async _trackAudioSignal(signal) {
    await this.analytics.track("audio_signal", {
      userId: signal.userId,
      courseId: signal.courseId,
      videoId: signal.videoId,
      type: signal.signal.type,
      intensity: signal.signal.intensity,
      timestamp: signal.timestamp
    });
  }

  /**
   * 🔄 Fallback safe mode
   */
  _fallback(event) {
    return {
      signal: {
        type: "audio_unknown",
        intensity: 0.1,
        meaning: "Fallback audio signal"
      },
      confidence: 0.1,
      timestamp: Date.now(),
      raw: event
    };
  }
}

module.exports = VideoTutorAudioProcessor;
