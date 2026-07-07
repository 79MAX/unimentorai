export type AlertSeverity =
  | "INFO"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type AlertType =
  | "FRAUD_ALERT"
  | "AUTO_BAN"
  | "THREAT_SPIKE"
  | "SYSTEM_WARNING"
  | "ZERO_TRUST_FAILURE";

export interface SecurityAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: number;
  payload?: any;
}