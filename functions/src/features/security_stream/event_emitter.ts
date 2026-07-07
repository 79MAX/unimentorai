import { EventStore } from "./event_store";
import { SecurityEvent } from "./event_types";

export class EventEmitter {

  static async emit(event: SecurityEvent) {

    // 📊 store event
    await EventStore.save(event);

    // ⚡ optional: console stream (SOC debugging)
    console.log("[SECURITY_EVENT]", {
      type: event.type,
      severity: event.severity,
      message: event.message,
      timestamp: event.timestamp,
    });

    return true;
  }
}