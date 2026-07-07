import { alertHub } from "./alert_hub";
import { WarRoomChannel } from "./alert_channels/war_room_channel";
import { ApiChannel } from "./alert_channels/api_channel";
import { DashboardChannel } from "./alert_channels/dashboard_channel";
import { AiLearningChannel } from "./alert_channels/ai_learning_channel";

export class AlertDispatcher {

  static init() {

    alertHub.subscribe((alert) => {

      // 🚨 WAR ROOM REAL TIME
      WarRoomChannel.send(alert);

      // 🌍 API CLIENTS
      ApiChannel.send(alert);

      // 🖥️ DASHBOARD
      DashboardChannel.send(alert);

      // 🧠 AI FEEDBACK LOOP
      AiLearningChannel.send(alert);
    });
  }
}