export class ResponseActions {

  static execute(incident: any) {

    switch (incident.severity) {

      case "CRITICAL":
        console.log("🚨 AUTO BLOCK + WAR ROOM ESCALATION");
        break;

      case "HIGH":
        console.log("🟡 CHALLENGE USER + NOTIFY SOC");
        break;

      case "MEDIUM":
        console.log("🟠 MONITOR + LOG INTENSIVELY");
        break;

      default:
        console.log("🟢 LOG ONLY");
    }
  }
}