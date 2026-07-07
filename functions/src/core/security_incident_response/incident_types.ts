export type IncidentSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type IncidentType =
  | "FRAUD"
  | "BOT_ATTACK"
  | "DEVICE_SPOOF"
  | "ZERO_TRUST_FAILURE"
  | "SYSTEM_ANOMALY";

export interface SecurityIncident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  score: number;
  userId?: string;
  deviceId?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  timestamp: number;
}