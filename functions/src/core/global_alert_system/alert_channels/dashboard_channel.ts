import { SecurityAlert } from "../alert_types";

export class DashboardChannel {

  static send(alert: SecurityAlert) {
    console.log("🖥️ DASHBOARD UPDATE:", alert.message);
  }
}