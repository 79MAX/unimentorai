import { securityAnalyzerService } from "./security.analyzer.service.js";
import { emitSecurityAlert } from "./security.stream.js";

const ALERT_TYPES = {
  RISK_DETECTED: "RISK_DETECTED",
  CRITICAL_RISK: "CRITICAL_RISK",
  FAILED_ACTIVITY_SPIKE: "FAILED_ACTIVITY_SPIKE",
};

class SecurityAlertService {
  constructor() {
    /**
     * Anti-spam cache
     * userId -> timestamp
     */
    this.cooldownCache = new Map();

    /**
     * 10 min cooldown
     */
    this.COOLDOWN_MS = 10 * 60 * 1000;
  }

  /**
   * Analyse utilisateur puis déclenche alertes
   */
  async evaluateUser(userId) {
    const risk = await securityAnalyzerService.analyzeUser(userId);

    if (
      risk.level === "HIGH" ||
      risk.level === "CRITICAL"
    ) {
      await this.createAlert({
        type:
          risk.level === "CRITICAL"
            ? ALERT_TYPES.CRITICAL_RISK
            : ALERT_TYPES.RISK_DETECTED,

        userId,

        score: risk.score,

        level: risk.level,

        message:
          risk.level === "CRITICAL"
            ? "Critical risk detected"
            : "Suspicious activity detected",
      });
    }

    return risk;
  }

  /**
   * Création centralisée d'alerte
   */
  async createAlert(payload) {
    if (!payload?.userId) {
      return;
    }

    const key = `${payload.userId}:${payload.type}`;

    const lastSent =
      this.cooldownCache.get(key);

    const now = Date.now();

    /**
     * Anti-spam
     */
    if (
      lastSent &&
      now - lastSent < this.COOLDOWN_MS
    ) {
      return;
    }

    this.cooldownCache.set(key, now);

    /**
     * Realtime Socket
     */
    emitSecurityAlert({
      type: payload.type,
      userId: payload.userId,
      score: payload.score,
      level: payload.level,
      message: payload.message,
      timestamp: new Date(),
    });

    /**
     * Future:
     * - save DB
     * - send email
     * - send telegram
     * - send webhook
     */
    console.warn(
      "[SECURITY ALERT]",
      JSON.stringify(payload)
    );
  }

  /**
   * Détection manuelle d'activité anormale
   */
  async triggerFailedSpike(userId, count) {
    return this.createAlert({
      type: ALERT_TYPES.FAILED_ACTIVITY_SPIKE,
      userId,
      score: Math.min(count * 2, 100),
      level: count > 20 ? "HIGH" : "MEDIUM",
      message: `${count} failed events detected`,
    });
  }
}

export const securityAlertService =
  new SecurityAlertService();

export default securityAlertService;
