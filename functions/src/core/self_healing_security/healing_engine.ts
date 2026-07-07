import { HealingEvent, HealingAction } from "./healing_types";

type IncidentInput = {
  incidentId: string;
  score: number;
  type: string;
  userId?: string;
  deviceId?: string;
  ip?: string;
};

export class HealingEngine {

  // 🚀 MAIN ENTRY POINT
  static async heal(incident: IncidentInput): Promise<HealingEvent> {

    // 🧠 1. ROOT CAUSE ANALYSIS
    const rootCause = this.analyzeRootCause(incident);

    // ⚙️ 2. DECIDE ACTION
    const action = this.decideAction(rootCause, incident.score);

    // 🔧 3. EXECUTE HEALING
    await this.executeAction(action, incident);

    // 📊 4. BUILD HEALING EVENT
    const healingEvent: HealingEvent = {
      id: `heal_${Date.now()}`,
      incidentId: incident.incidentId,

      rootCause,
      severity: this.mapSeverity(incident.score),

      action,
      status: "SUCCESS",

      confidenceScore: Math.min(100, incident.score + 10),

      timestamp: Date.now(),

      metadata: {
        userId: incident.userId,
        deviceId: incident.deviceId,
        ip: incident.ip,
      },
    };

    // 🧠 5. FEEDBACK LOOP (SELF LEARNING TRIGGER)
    this.learn(rootCause, action);

    return healingEvent;
  }

  // ─────────────────────────────────────────────
  // 🧠 ROOT CAUSE ANALYSIS
  // ─────────────────────────────────────────────

  private static analyzeRootCause(incident: IncidentInput): string {

    if (incident.type === "FRAUD_DETECTED") {
      return "fraud_pattern";
    }

    if (incident.score >= 90) {
      return "behavioral_anomaly";
    }

    if (incident.deviceId?.includes("emulator")) {
      return "device_compromise";
    }

    if (incident.type === "AUTH_FAILURE") {
      return "authentication_attack";
    }

    return "unknown";
  }

  // ─────────────────────────────────────────────
  // ⚙️ DECISION ENGINE
  // ─────────────────────────────────────────────

  private static decideAction(
    rootCause: string,
    score: number
  ): HealingAction {

    if (score >= 90) return "BLOCK_DEVICE";

    switch (rootCause) {

      case "fraud_pattern":
        return "RESET_SESSION";

      case "device_compromise":
        return "BLOCK_DEVICE";

      case "authentication_attack":
        return "REVOKE_TOKEN";

      case "behavioral_anomaly":
        return "RATE_LIMIT";

      default:
        return "ESCALATE_TO_SOC";
    }
  }

  // ─────────────────────────────────────────────
  // 🔧 EXECUTION LAYER
  // ─────────────────────────────────────────────

  private static async executeAction(
    action: HealingAction,
    incident: IncidentInput
  ) {

    switch (action) {

      case "RESET_SESSION":
        console.log("🔁 Session reset for user:", incident.userId);
        break;

      case "BLOCK_DEVICE":
        console.log("🚫 Device blocked:", incident.deviceId);
        break;

      case "REVOKE_TOKEN":
        console.log("🔐 Token revoked for user:", incident.userId);
        break;

      case "RATE_LIMIT":
        console.log("⛔ Rate limit applied for IP:", incident.ip);
        break;

      case "ESCALATE_TO_SOC":
        console.log("🚨 Escalated to SOC War Room");
        break;
    }
  }

  // ─────────────────────────────────────────────
  // 📊 SEVERITY MAPPING
  // ─────────────────────────────────────────────

  private static mapSeverity(score: number) {

    if (score >= 90) return "CRITICAL";
    if (score >= 70) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  }

  // ─────────────────────────────────────────────
  // 🧠 SELF-LEARNING FEEDBACK LOOP
  // ─────────────────────────────────────────────

  private static learn(rootCause: string, action: HealingAction) {

    console.log("🧠 Learning pattern:", {
      rootCause,
      action,
    });

    // ici tu brancheras ton AI training engine plus tard
  }
}