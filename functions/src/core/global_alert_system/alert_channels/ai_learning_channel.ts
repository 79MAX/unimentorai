import { SecurityAlert } from "../alert_types";

export class AiLearningChannel {

  static send(alert: SecurityAlert) {
    console.log("🧠 AI learning from alert:", alert.type);
  }
}