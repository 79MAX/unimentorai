type Incident = {
  type: string;
  score: number;
  deviceId?: string;
  userAgent?: string;
  ip?: string;
  failedAttempts?: number;
};

export type RootCause =
  | "fraud_pattern"
  | "device_compromise"
  | "authentication_attack"
  | "bot_activity"
  | "rate_abuse"
  | "behavioral_anomaly"
  | "unknown";

export interface RootCauseResult {
  cause: RootCause;
  confidence: number;
  signals: string[];
}

export class RootCauseAnalyzerV2 {

  // 🚀 MAIN ENTRY POINT
  static analyze(incident: Incident): RootCauseResult {

    const signals: string[] = [];

    // 🧠 1. SIGNAL EXTRACTION
    const device = (incident.deviceId || "").toLowerCase();
    const ua = (incident.userAgent || "").toLowerCase();

    let cause: RootCause = "unknown";
    let confidence = 50;

    // ─────────────────────────────────────
    // ⚙️ 2. RULE + PATTERN ENGINE
    // ─────────────────────────────────────

    // 🚨 FRAUD PATTERN
    if (incident.type === "FRAUD_DETECTED") {
      cause = "fraud_pattern";
      confidence = 90;
      signals.push("Fraud engine trigger");
    }

    // 📱 DEVICE COMPROMISE
    if (device.includes("emulator") || device.includes("fake")) {
      cause = "device_compromise";
      confidence = 85;
      signals.push("Emulator or fake device detected");
    }

    // 🔐 AUTH ATTACK
    if ((incident.failedAttempts || 0) > 3) {
      cause = "authentication_attack";
      confidence = 80;
      signals.push("Multiple failed authentication attempts");
    }

    // 🤖 BOT ACTIVITY
    if (ua.includes("bot") || ua.includes("crawler")) {
      cause = "bot_activity";
      confidence = 75;
      signals.push("Automated bot user-agent detected");
    }

    // ⚡ RATE ABUSE
    if (incident.score > 70 && incident.type === "RATE_LIMIT") {
      cause = "rate_abuse";
      confidence = 70;
      signals.push("Excessive request rate detected");
    }

    // 🧠 BEHAVIORAL ANOMALY (AI-LIKE SIGNAL)
    if (incident.score > 85) {
      cause = "behavioral_anomaly";
      confidence = 65;
      signals.push("High anomaly score detected");
    }

    return {
      cause,
      confidence: this.clamp(confidence),
      signals,
    };
  }

  // ─────────────────────────────────────
  // 📊 UTILITY
  // ─────────────────────────────────────

  private static clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}