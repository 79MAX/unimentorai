export interface SecurityEvent {
  type: string;
  score: number;
  userId?: string;
  deviceId?: string;
  ip?: string;
  timestamp: number;
}

export interface LearnedPattern {
  id: string;
  patternType: string;
  confidence: number;
  frequency: number;
  lastSeen: number;
}

export interface AdaptiveRule {
  ruleId: string;
  condition: string;
  action: string;
  weight: number;
  active: boolean;
}