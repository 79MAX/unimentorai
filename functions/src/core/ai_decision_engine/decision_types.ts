export type DecisionAction =
  | "ALLOW"
  | "CHALLENGE"
  | "BLOCK"
  | "AUTO_BAN"
  | "ESCALATE";

export interface SecurityDecision {
  action: DecisionAction;
  score: number;
  reason: string[];
  confidence: number;
  timestamp: number;
}