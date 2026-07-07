import { RiskModel } from "./risk_model";
import { ThreatResult } from "./threat_types";

export class ThreatEngine {

  static analyze(input: any): ThreatResult {

    const score = RiskModel.compute(input);

    let level: any = "LOW";
    const flags: string[] = [];

    if (score >= 80) {
      level = "CRITICAL";
      flags.push("HIGH_RISK_ACTIVITY");
    } else if (score >= 60) {
      level = "HIGH";
      flags.push("SUSPICIOUS_BEHAVIOR");
    } else if (score >= 30) {
      level = "MEDIUM";
      flags.push("MONITOR");
    }

    return {
      score,
      level,
      flags,
    };
  }
}