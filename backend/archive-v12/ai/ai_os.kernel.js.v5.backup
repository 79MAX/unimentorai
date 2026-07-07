/**
 * 🧠 AI OPERATING SYSTEM KERNEL — PRO MAX
 */

import { AiOrchestratorEngine } from "./orchestrator/ai_orchestrator.engine.js";
import { RealtimeGateway } from "./realtime/realtime.gateway.js";

export class AIOS {

  static state = {
    mode: "AUTONOMOUS",
    health: 100,
    lastTick: null
  };

  static init(server) {

    console.log("🧠 AI OS PRO MAX BOOTING...");

    RealtimeGateway.init(server);

    setInterval(async () => {

      const result = await AiOrchestratorEngine.run({
        source: "AI_OS_HEARTBEAT"
      });

      this.state.lastTick = Date.now();
      this.state.health = result?.health || 100;

    }, 3000);

    console.log("⚡ AI OS FULLY AUTONOMOUS");
  }

  static run(payload) {
    return AiOrchestratorEngine.run(payload);
  }

  static status() {
    return {
      mode: this.state.mode,
      health: this.state.health,
      lastTick: this.state.lastTick
    };
  }
}

