export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AlertType =
  | "FRAUD_DETECTED"
  | "AUTO_BAN"
  | "SUSPICIOUS_ACTIVITY"
  | "DEVICE_ANOMALY"
  | "GLOBAL_ATTACK";

export interface SecurityAlert {
  type: AlertType;
  severity: AlertSeverity;
  userId?: string;
  deviceId?: string;
  message: string;
  score?: number;
  timestamp: number;
  metadata?: any;
}