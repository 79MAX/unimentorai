export class FraudIntelligenceAggregator {

  static analyze(events: any[]) {

    let critical = 0;
    let total = events.length;
    let activeAttacks = 0;

    for (const e of events) {

      if (e.riskScore >= 90) critical++;
      if (e.riskScore >= 70) activeAttacks++;
    }

    const globalRisk =
      critical > 50 ? "CRITICAL" :
      critical > 20 ? "HIGH" :
      critical > 5 ? "MEDIUM" : "LOW";

    return {
      totalEvents: total,
      criticalThreats: critical,
      activeAttacks,
      globalRiskLevel: globalRisk,
    };
  }
}