export type ThreatLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface ThreatAnalysisInput {
  certificateId: string;
  userId?: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: number;
}

export interface ThreatResult {
  score: number; // 0 - 100
  level: ThreatLevel;
  flags: string[];
}