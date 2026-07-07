export type SecurityActionType =
  | "BAN_USER"
  | "FLAG_DEVICE"
  | "RATE_LIMIT"
  | "ESCALATE_ALERT"
  | "LOG_ONLY";

export interface SecurityAction {
  type: SecurityActionType;
  userId?: string;
  deviceId?: string;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: number;
}