import { securityEventPipeline } from "./security_event_pipeline";

export class EventDispatcher {

  static init() {

    securityEventPipeline.on("event", (event) => {

      switch (event.type) {

        case "FRAUD_DETECTED":
          console.log("🚨 Routing to Fraud Engine");
          break;

        case "AUTO_BAN":
          console.log("🔴 Routing to Ban System");
          break;

        case "THREAT_SPIKE":
          console.log("🌍 Routing to Threat Intelligence");
          break;

        default:
          console.log("📡 General event received");
      }
    });
  }
}