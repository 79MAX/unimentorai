import { EventEmitter } from "events";

export type SecurityEvent = {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: number;
  payload?: any;
};

class SecurityEventPipeline extends EventEmitter {

  // 📥 INGEST EVENT
  ingest(event: SecurityEvent) {
    this.emit("event", event);
  }

  // 📡 SUBSCRIBE TO STREAM
  subscribe(handler: (event: SecurityEvent) => void) {
    this.on("event", handler);
  }

  // 🔥 BROADCAST (FOR MULTI MODULES)
  broadcast(event: SecurityEvent) {
    this.emit("broadcast", event);
  }
}

export const securityEventPipeline = new SecurityEventPipeline();