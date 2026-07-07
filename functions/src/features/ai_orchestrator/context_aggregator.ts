export class ContextAggregator {

  static buildContext(event: any) {

    return {
      riskScore: event.score || 0,
      isFraud: event.score >= 80,
      isBot: event.metadata?.isBot || false,
      deviceRisk: event.metadata?.deviceRisk || 0,
      ipReputation: event.metadata?.ipRisk || 0,
      historicalViolations: event.metadata?.history || 0,
    };
  }
}