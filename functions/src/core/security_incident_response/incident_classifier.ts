export class IncidentClassifier {

  static classify(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {

    if (score >= 90) return "CRITICAL";
    if (score >= 70) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  }

  static detectType(event: any): string {

    if (event.type === "FRAUD_DETECTED") return "FRAUD";
    if (event.botDetected) return "BOT_ATTACK";
    if (event.deviceRisk > 80) return "DEVICE_SPOOF";

    return "SYSTEM_ANOMALY";
  }
}