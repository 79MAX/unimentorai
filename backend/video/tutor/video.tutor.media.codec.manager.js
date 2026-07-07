
/**
 * ==========================================
 * 🎥 VIDEO TUTOR MEDIA CODEC MANAGER
 * UniMentorAI Real-Time Media Optimization Layer
 * ==========================================
 * Manages media quality, compression and performance:
 * - adaptive bitrate control
 * - codec selection
 * - bandwidth optimization
 * - latency reduction
 */

class VideoTutorMediaCodecManager {

  constructor() {

    this.supportedCodecs = {
      video: ["H264", "VP8", "VP9", "AV1"],
      audio: ["OPUS", "AAC"]
    };

    this.qualityProfiles = {
      low: {
        resolution: "480p",
        bitrate: 300,
        fps: 15
      },

      medium: {
        resolution: "720p",
        bitrate: 800,
        fps: 24
      },

      high: {
        resolution: "1080p",
        bitrate: 2500,
        fps: 30
      }
    };
  }

  /**
   * ==========================================
   * ADAPTIVE QUALITY ENGINE (CORE)
   * ==========================================
   */
  getOptimalMediaConfig(networkStats = {}) {

    const {
      bandwidth = 1000,
      packetLoss = 0,
      latency = 50
    } = networkStats;

    // --------------------------------------
    // LOW QUALITY MODE
    // --------------------------------------
    if (bandwidth < 500 || packetLoss > 0.1) {
      return this.buildConfig("low");
    }

    // --------------------------------------
    // HIGH QUALITY MODE
    // --------------------------------------
    if (bandwidth > 2000 && latency < 80) {
      return this.buildConfig("high");
    }

    // --------------------------------------
    // DEFAULT MODE
    // --------------------------------------
    return this.buildConfig("medium");
  }

  /**
   * ==========================================
   * BUILD MEDIA CONFIG
   * ==========================================
   */
  buildConfig(profile) {

    const quality =
      this.qualityProfiles[profile];

    return {
      video: {
        codec: this.selectVideoCodec(),
        resolution: quality.resolution,
        bitrate: quality.bitrate,
        frameRate: quality.fps
      },

      audio: {
        codec: "OPUS",
        bitrate: 64,
        noiseSuppression: true,
        echoCancellation: true
      },

      transport: {
        priority: profile === "low"
          ? "latency"
          : "balanced"
      }
    };
  }

  /**
   * ==========================================
   * SMART CODEC SELECTION
   * ==========================================
   */
  selectVideoCodec() {

    // Priority order for compatibility vs performance
    const preferred = [
      "VP9",   // best compression
      "H264",  // universal support
      "AV1",   // future proof
      "VP8"    // fallback
    ];

    return preferred[0];
  }

  /**
   * ==========================================
   * REAL-TIME ADAPTATION ENGINE
   * ==========================================
   */
  adaptStream(currentConfig, liveStats) {

    let updatedConfig = { ...currentConfig };

    // --------------------------------------
    // HIGH LATENCY DETECTION
    // --------------------------------------
    if (liveStats.latency > 150) {

      updatedConfig.video.frameRate =
        Math.max(10, currentConfig.video.frameRate - 5);

      updatedConfig.video.bitrate *= 0.8;
    }

    // --------------------------------------
    // LOW BANDWIDTH DETECTION
    // --------------------------------------
    if (liveStats.bandwidth < 500) {

      updatedConfig.video.resolution = "480p";
      updatedConfig.video.bitrate = 300;
    }

    // --------------------------------------
    // GOOD NETWORK BOOST
    // --------------------------------------
    if (liveStats.bandwidth > 3000 && liveStats.packetLoss < 0.01) {

      updatedConfig.video.resolution = "1080p";
      updatedConfig.video.bitrate = 3000;
      updatedConfig.video.frameRate = 30;
    }

    return updatedConfig;
  }

  /**
   * ==========================================
   * LATENCY OPTIMIZATION MODE
   * ==========================================
   */
  getUltraLowLatencyConfig() {

    return {
      video: {
        codec: "H264",
        resolution: "480p",
        bitrate: 250,
        frameRate: 15
      },

      audio: {
        codec: "OPUS",
        bitrate: 48
      },

      transport: {
        priority: "latency",
        jitterBuffer: "minimal"
      }
    };
  }

  /**
   * ==========================================
   * DIAGNOSTICS
   * ==========================================
   */
  diagnose() {

    return {
      codecsSupported: this.supportedCodecs,
      profiles: Object.keys(this.qualityProfiles),
      status: "MEDIA_ENGINE_READY",
      timestamp: Date.now()
    };
  }
}

module.exports =
  VideoTutorMediaCodecManager;
