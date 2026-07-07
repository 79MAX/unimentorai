import { SecurityAlert } from "../alert_types";

export class ApiChannel {

  static send(alert: SecurityAlert) {
    console.log("📡 API ALERT PUSHED:", alert.type);
  }
}