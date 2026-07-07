import { DecisionAction } from "./decision_types";

export class ActionExecutor {

  static execute(action: DecisionAction, event: any) {

    switch (action) {

      case "ALLOW":
        console.log("🟢 Request allowed");
        break;

      case "CHALLENGE":
        console.log("🟡 Triggering verification challenge");
        break;

      case "BLOCK":
        console.log("🔴 Request blocked");
        break;

      case "AUTO_BAN":
        console.log("⛔ User auto-banned");
        break;

      case "ESCALATE":
        console.log("🚨 Escalating to SOC War Room");
        break;
    }
  }
}