import { FraudMemoryStore } from "./fraud_memory_store";
import { PatternLearner } from "./pattern_learner";
import { AdaptiveWeights } from "./adaptive_weights";

export class SelfLearningEngine {

  static async learnAndAdapt() {

    // 📡 1. LOAD HISTORY
    const history = await FraudMemoryStore.getRecent(300);

    // 🧠 2. PATTERN DETECTION
    const patterns = PatternLearner.extractPatterns(history);

    // ⚙️ 3. ADAPTIVE SCORE BOOST
    const boost = AdaptiveWeights.calculateAdjustment(patterns);

    // 💾 4. STORE LEARNING RESULT
    await FraudMemoryStore.store({
      type: "SELF_LEARNING_UPDATE",
      patterns,
      boost,
      timestamp: Date.now(),
    });

    return {
      patterns,
      adaptiveRiskBoost: boost,
      message: "AI model updated successfully",
    };
  }
}