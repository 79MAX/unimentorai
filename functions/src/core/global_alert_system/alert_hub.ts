import { EventEmitter } from "events";
import { SecurityAlert } from "./alert_types";

class AlertHub extends EventEmitter {

  publish(alert: SecurityAlert) {
    this.emit("alert", alert);
  }

  subscribe(handler: (alert: SecurityAlert) => void) {
    this.on("alert", handler);
  }
}

export const alertHub = new AlertHub();