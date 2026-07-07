export type SecurityModule =
  | "FRAUD_ENGINE"
  | "SELF_HEALING"
  | "THREAT_INTELLIGENCE"
  | "ZERO_TRUST"
  | "OBSERVABILITY"
  | "INCIDENT_RESPONSE";

export interface OrchestrationEvent {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source: SecurityModule;
  timestamp: number;
  payload?: any;
}

export interface OrchestrationDecision {
  action: string;
  targetModule: SecurityModule;
  confidence: number;
}