export interface GeoThreatPoint {
  country: string;
  city?: string;
  lat?: number;
  lng?: number;
  riskScore: number;
  eventCount: number;
  timestamp: number;
}

export interface CyberWarMapState {
  totalEvents: number;
  activeThreatZones: number;
  criticalRegions: string[];
  globalRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  updatedAt: number;
}