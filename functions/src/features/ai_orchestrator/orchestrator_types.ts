export interface SecurityEvent {
  type: string;
  userId?: string;
  deviceId?: string;
  ip?: string;
  score?: number;
  timestamp: number;
  metadata?: any;
}

export interface OrchestratorDecision {
  action: "ALLOW" | "BLOCK" | "ESCALATE" | "MONITOR";
  reason: string;
  confidence: number;
  targetSystems: string[];
}