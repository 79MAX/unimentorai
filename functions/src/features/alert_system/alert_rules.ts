export class AlertRules {

  static getSeverity(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {

    if (score >= 90) return "CRITICAL";
    if (score >= 75) return "HIGH";
    if (score >= 50) return "MEDIUM";

    return "LOW";
  }

  static shouldTriggerAlert(score: number): boolean {
    return score >= 50;
  }

  static isAutoBan(score: number): boolean {
    return score >= 80;
  }
}