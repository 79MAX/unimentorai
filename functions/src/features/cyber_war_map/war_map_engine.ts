import { ThreatMapper } from "./threat_mapper";

export class CyberWarMapEngine {

  static generate(events: any[]) {

    const mapData = ThreatMapper.buildMap(events);

    const criticalZones = mapData
      .filter(c => c.riskScore > 1000)
      .map(c => c.country);

    const globalRisk =
      criticalZones.length > 5 ? "CRITICAL"
      : criticalZones.length > 2 ? "HIGH"
      : "MEDIUM";

    return {
      totalEvents: events.length,
      activeThreatZones: mapData.length,
      criticalRegions: criticalZones,
      globalRiskLevel: globalRisk,
      map: mapData,
      updatedAt: Date.now(),
    };
  }
}