import { AlertDispatcher } from "./alert_dispatcher";
import { AlertRules } from "./alert_rules";
import { SecurityAlert } from "./alert_types";

export class AlertEngine {

  static async process(event: any) {

    const score = event.score || 0;

    // 🚨 CHECK IF ALERT IS NEEDED
    if (!AlertRules.shouldTriggerAlert(score)) {
      return;
    }

    const alert: SecurityAlert = {
      type: this.mapType(event),
      severity: AlertRules.getSeverity(score),
      userId: event.userId,
      deviceId: event.deviceId,
      message: this.generateMessage(event),
      score,
      timestamp: Date.now(),
      metadata: event,
    };

    await AlertDispatcher.dispatch(alert);
  }

  private static mapType(event: any) {

    if (event.type === "FRAUD_DETECTED") return "FRAUD_DETECTED";
    if (event.type === "AUTO_BAN") return "AUTO_BAN";

    if (event.score >= 90) return "GLOBAL_ATTACK";

    return "SUSPICIOUS_ACTIVITY";
  }

  private static generateMessage(event: any): string {

    if (event.type === "FRAUD_DETECTED") {
      return "Fraud detected by AI system";
    }

    if (event.type === "AUTO_BAN") {
      return "Automatic ban triggered";
    }

    if (event.score >= 90) {
      return "Critical global attack pattern detected";
    }

    return "Suspicious activity detected";
  }
}