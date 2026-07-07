export interface GlobalThreatEvent {
  userId?: string;
  deviceId?: string;
  ip?: string;
  country?: string;
  riskScore: number;
  type: string;
  timestamp: number;
}

export interface GlobalFraudReport {
  totalEvents: number;
  criticalThreats: number;
  activeAttacks: number;
  topCountries: string[];
  globalRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}