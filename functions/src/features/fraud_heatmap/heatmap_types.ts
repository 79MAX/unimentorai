export interface HeatmapPoint {
  country?: string;
  city?: string;
  lat: number;
  lng: number;
  riskScore: number;
  count: number;
}

export interface FraudHeatmap {
  updatedAt: number;
  points: HeatmapPoint[];
}