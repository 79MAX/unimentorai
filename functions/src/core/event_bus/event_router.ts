import { securityEventBus } from "./security_event_bus";
import { SecurityEvent } from "./event_types";

export class EventRouter {

  static register() {

    // 🚨 FRAUD EVENTS → ORCHESTRATOR + WAR ROOM
    securityEventBus.subscribe("FRAUD_DETECTED", (event: SecurityEvent) => {
      console.log("🚨 Fraud routed to orchestrator", event);
    });

    // 🧠 ALL EVENTS → SELF LEARNING ENGINE
    securityEventBus.subscribe("ALL_EVENTS", (event: SecurityEvent) => {
      console.log("🧠 Learning system processing event");
    });

    // 🌍 THREAT EVENTS → GLOBAL INTELLIGENCE
    securityEventBus.subscribe("THREAT_SPIKE", (event: SecurityEvent) => {
      console.log("🌍 Threat intelligence update");
    });

    // 🔴 AUTO BAN EVENTS → RESPONSE SYSTEM
    securityEventBus.subscribe("AUTO_BAN", (event: SecurityEvent) => {
      console.log("🔴 Auto ban executed");
    });
  }
}