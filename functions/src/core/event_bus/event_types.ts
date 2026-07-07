export type SecurityEventType =
  | "FRAUD_DETECTED"
  | "VERIFICATION_SUCCESS"
  | "AUTO_BAN"
  | "THREAT_SPIKE"
  | "DEVICE_ANOMALY";

export interface SecurityEvent {
  type: SecurityEventType;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId?: string;
  deviceId?: string;
  ip?: string;
  score?: number;
  timestamp: number;
  metadata?: any;
}