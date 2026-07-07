import { GeoClusterEngine } from "./geo_cluster_engine";

export class ThreatMapper {

  static buildMap(events: any[]) {

    const clusters = GeoClusterEngine.cluster(events);

    return clusters
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 20);
  }
}