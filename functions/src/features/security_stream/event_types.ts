export type SecurityEventType =
  | "FRAUD_DETECTED"
  | "VERIFICATION_SUCCESS"
  | "VERIFICATION_FAILED"
  | "DEVICE_BLOCKED"
  | "AUTO_BAN"
  | "SUSPICIOUS_ACTIVITY";

export interface SecurityEvent {
  type: SecurityEventType;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId?: string;
  deviceId?: string;
  certificateId?: string;
  score?: number;
  message: string;
  timestamp: number;
  metadata?: any;
}