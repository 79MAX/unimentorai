import { FraudIntelligenceAggregator } from "./fraud_intelligence_aggregator";
import { GlobalThreatCorrelator } from "./global_threat_correlator";

export class GlobalFraudCommandCenter {

  static async process(events: any[]) {

    // 🧠 1. ANALYZE GLOBAL FRAUD INTELLIGENCE
    const intelligence = FraudIntelligenceAggregator.analyze(events);

    // 🌍 2. CORRELATE GLOBAL ATTACK PATTERNS
    const topCountries = GlobalThreatCorrelator.correlate(events);

    // 📊 3. BUILD GLOBAL REPORT
    const report = {
      ...intelligence,
      topCountries,
      timestamp: Date.now(),
    };

    // 🚨 4. GLOBAL ALERT LOGIC
    if (intelligence.globalRiskLevel === "CRITICAL") {
      console.log("🚨 GLOBAL FRAUD ALERT: SYSTEM UNDER ATTACK");
    }

    return report;
  }
}