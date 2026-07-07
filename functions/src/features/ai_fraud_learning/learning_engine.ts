import { LearningMemoryStore } from "./learning_memory_store";
import { PatternAnalyzer } from "./pattern_analyzer";
import { AdaptivePolicyEngine } from "./adaptive_policy_engine";

export class SelfLearningSecurityAI {

  static async runLearningCycle() {

    // 🧠 1. CHARGER HISTORIQUE
    const events = await LearningMemoryStore.getRecentEvents();

    // 🔍 2. DÉTECTER PATTERNS
    const patterns = PatternAnalyzer.detectPatterns(events);

    // ⚙️ 3. AJUSTER POLICIES
    const newPolicies = AdaptivePolicyEngine.adjustThresholds(patterns);

    console.log("🧠 AI LEARNING UPDATE:", newPolicies);

    return {
      patterns,
      newPolicies,
      timestamp: Date.now(),
    };
  }

  static async feedbackLoop(event: any, decision: any) {

    await LearningMemoryStore.saveEvent(event, decision);
  }
}