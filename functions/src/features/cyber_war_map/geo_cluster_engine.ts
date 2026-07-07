export class GeoClusterEngine {

  static cluster(events: any[]) {

    const map = new Map<string, { score: number; count: number }>();

    for (const e of events) {

      const key = e.country || "UNKNOWN";

      const existing = map.get(key) || { score: 0, count: 0 };

      existing.score += e.riskScore || 0;
      existing.count += 1;

      map.set(key, existing);
    }

    return Array.from(map.entries()).map(([country, data]) => ({
      country,
      riskScore: data.score,
      eventCount: data.count,
    }));
  }
}