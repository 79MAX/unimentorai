export class AdaptiveWeights {

  static calculateAdjustment(patterns: string[]) {

    let adjustment = 0;

    if (patterns.includes("FREQUENT_HIGH_RISK_ACTIVITY")) {
      adjustment += 10;
    }

    if (patterns.includes("COORDINATED_ATTACK_CLUSTER")) {
      adjustment += 20;
    }

    if (patterns.some(p => p.startsWith("DEVICE_ABUSE"))) {
      adjustment += 15;
    }

    return Math.min(adjustment, 30);
  }
}