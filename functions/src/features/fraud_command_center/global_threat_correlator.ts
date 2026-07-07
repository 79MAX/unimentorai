export class GlobalThreatCorrelator {

  static correlate(events: any[]) {

    const map = new Map<string, number>();

    for (const event of events) {

      const key = event.country || "UNKNOWN";

      map.set(key, (map.get(key) || 0) + event.riskScore);
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country]) => country);
  }
}