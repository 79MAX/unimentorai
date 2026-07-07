import { SecurityAlert } from "../alert_types";

export class WarRoomChannel {

  static send(alert: SecurityAlert) {
    console.log("🛰️ WAR ROOM ALERT:", alert.type, alert.severity);
  }
}