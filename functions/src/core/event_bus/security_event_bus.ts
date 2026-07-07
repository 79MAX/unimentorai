import { EventEmitter } from "events";
import { SecurityEvent } from "./event_types";

class SecurityBus extends EventEmitter {

  emitEvent(event: SecurityEvent) {
    this.emit(event.type, event);
    this.emit("ALL_EVENTS", event);
  }

  subscribe(type: string, handler: (event: SecurityEvent) => void) {
    this.on(type, handler);
  }
}

export const securityEventBus = new SecurityBus();