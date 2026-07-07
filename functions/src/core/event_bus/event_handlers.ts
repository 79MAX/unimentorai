import { securityEventBus } from "./security_event_bus";
import { SecurityEvent } from "./event_types";

export class EventHandlers {

  static emitFraud(event: SecurityEvent) {
    securityEventBus.emitEvent({
      ...event,
      type: "FRAUD_DETECTED",
      timestamp: Date.now(),
    });
  }

  static emitAutoBan(event: SecurityEvent) {
    securityEventBus.emitEvent({
      ...event,
      type: "AUTO_BAN",
      timestamp: Date.now(),
    });
  }

  static emitThreatSpike(event: SecurityEvent) {
    securityEventBus.emitEvent({
      ...event,
      type: "THREAT_SPIKE",
      timestamp: Date.now(),
    });
  }
}