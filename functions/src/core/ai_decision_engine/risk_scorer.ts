export class RiskScorer {

  static computeRisk(event: any): number {

    let score = 0;

    if (event.fraudScore > 80) score += 50;
    if (event.deviceRisk > 70) score += 20;
    if (event.ipRisk > 60) score += 15;
    if (event.behaviorAnomaly) score += 25;

    return Math.min(100, score);
  }
}