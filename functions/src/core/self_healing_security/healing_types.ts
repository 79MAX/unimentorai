// functions/src/core/self_healing_security/healing_types.ts

export type HealingAction =
  | "RESET_SESSION"
  | "BLOCK_DEVICE"
  | "REVOKE_TOKEN"
  | "RATE_LIMIT"
  | "PATCH_SECURITY_RULES"
  | "ESCALATE_TO_SOC"
  | "ROLLBACK_STATE";

export type HealingStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "VERIFIED";

export interface HealingEvent {
  id: string;
  incidentId: string;

  rootCause:
    | "behavioral_anomaly"
    | "device_compromise"
    | "authentication_attack"
    | "fraud_pattern"
    | "unknown";

  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  action: HealingAction;
  status: HealingStatus;

  confidenceScore: number;

  timestamp: number;

  metadata?: {
    userId?: string;
    deviceId?: string;
    ip?: string;
    previousState?: any;
    newState?: any;
  };
}

export interface SystemHealthState {
  healthScore: number; // 0 - 100
  activeIncidents: number;
  autoHealEnabled: boolean;
  lastHealTimestamp?: number;
}