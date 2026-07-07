import { HeatmapPoint } from "./heatmap_types";

export class HeatmapAggregator {

  static aggregate(events: any[]): HeatmapPoint[] {

    const map = new Map<string, HeatmapPoint>();

    for (const e of events) {

      const key = `${e.geo?.lat?.toFixed(2)}_${e.geo?.lng?.toFixed(2)}`;

      if (!map.has(key)) {
        map.set(key, {
          lat: e.geo?.lat || 0,
          lng: e.geo?.lng || 0,
          riskScore: 0,
          count: 0,
          country: e.geo?.country,
          city: e.geo?.city,
        });
      }

      const point = map.get(key)!;
      point.count += 1;
      point.riskScore += e.score || 0;
    }

    return Array.from(map.values());
  }
}