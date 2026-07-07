export class PatternLearner {

  static extractPatterns(events: any[]) {

    const patterns: string[] = [];

    // ⚡ RAPID FRAUD BURSTS
    const highRisk = events.filter(e => e.score >= 80);
    if (highRisk.length > 5) {
      patterns.push("FREQUENT_HIGH_RISK_ACTIVITY");
    }

    // 🔁 REPEATED DEVICE ABUSE
    const deviceMap = new Map<string, number>();

    for (const e of events) {
      if (e.deviceId) {
        deviceMap.set(e.deviceId, (deviceMap.get(e.deviceId) || 0) + 1);
      }
    }

    for (const [device, count] of deviceMap) {
      if (count > 10) {
        patterns.push(`DEVICE_ABUSE:${device}`);
      }
    }

    // 🌍 GLOBAL COORDINATED ATTACK
    const uniqueUsers = new Set(events.map(e => e.userId)).size;

    if (uniqueUsers > 20 && highRisk.length > 10) {
      patterns.push("COORDINATED_ATTACK_CLUSTER");
    }

    return patterns;
  }
}