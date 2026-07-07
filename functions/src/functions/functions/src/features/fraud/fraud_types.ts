export type FraudLevel =
  | "SAFE"
  | "LOW_RISK"
  | "MEDIUM_RISK"
  | "HIGH_RISK"
  | "FRAUD";

export interface FraudInput {
  userId: string;
  certificateId: string;
  qrHash: string;
  ip?: string;
  deviceId?: string;
  userAgent?: string;
  timestamp: number;
}

export interface FraudResult {
  isFraud: boolean;
  score: number;
  level: FraudLevel;
  reasons: string[];
}