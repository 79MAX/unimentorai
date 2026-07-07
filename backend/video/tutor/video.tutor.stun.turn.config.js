
/**
 * ==========================================
 * 🌐 VIDEO TUTOR STUN/TURN CONFIG
 * UniMentorAI WebRTC Connectivity Layer
 * ==========================================
 * Ensures stable real-time video sessions:
 * - NAT traversal (STUN)
 * - relay fallback (TURN)
 * - adaptive network routing
 * - connection resilience
 */

class VideoTutorSTUNTurnConfig {

  constructor() {

    // Default STUN servers (free public fallback)
    this.stunServers = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" }
    ];

    // TURN servers (production recommended)
    this.turnServers = [
      {
        urls: "turn:turn.unimentorai.com:3478",
        username: process.env.TURN_USER || "default",
        credential: process.env.TURN_PASS || "default"
      }
    ];
  }

  /**
   * ==========================================
   * GET FULL ICE CONFIG (WEBRTC READY)
   * ==========================================
   */
  getIceConfiguration(options = {}) {

    return {
      iceServers: [
        ...this.stunServers,
        ...this.turnServers
      ],

      iceTransportPolicy:
        options.forceRelay ? "relay" : "all",

      bundlePolicy: "max-bundle",

      rtcpMuxPolicy: "require",

      iceCandidatePoolSize: 10
    };
  }

  /**
   * ==========================================
   * ADAPTIVE NETWORK CONFIG
   * ==========================================
   * Adjusts configuration based on network quality
   */
  getAdaptiveConfig(networkQuality = "medium") {

    const base = this.getIceConfiguration();

    switch (networkQuality) {

      case "low":
        return {
          ...base,
          iceTransportPolicy: "relay",
          iceCandidatePoolSize: 5
        };

      case "high":
        return {
          ...base,
          iceCandidatePoolSize: 15
        };

      default:
        return base;
    }
  }

  /**
   * ==========================================
   * CONNECTION RECOVERY STRATEGY
   * ==========================================
   */
  getRecoveryStrategy() {

    return {
      reconnectAttempts: 5,
      reconnectInterval: 2000,

      fallbackOrder: [
        "P2P_STUN",
        "TURN_RELAY",
        "FULL_RECONNECT"
      ],

      onFailureAction: "SWITCH_TO_TURN"
    };
  }

  /**
   * ==========================================
   * QUALITY OPTIMIZATION SETTINGS
   * ==========================================
   */
  getQualityConfig() {

    return {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },

      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
  }

  /**
   * ==========================================
   * DEBUG NETWORK STATUS
   * ==========================================
   */
  diagnoseConnection() {

    return {
      stunServers: this.stunServers.length,
      turnServers: this.turnServers.length,
      status: "CONFIG_READY",
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorSTUNTurnConfig;
