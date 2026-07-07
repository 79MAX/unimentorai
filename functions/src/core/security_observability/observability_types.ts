export interface SecurityLog {
  id: string;
  type: "INFO" | "WARN" | "ERROR" | "SECURITY";
  message: string;
  timestamp: number;
  metadata?: any;
}

export interface SecurityMetric {
  name: string;
  value: number;
  timestamp: number;
}

export interface SecurityTrace {
  traceId: string;
  eventChain: string[];
  duration: number;
}