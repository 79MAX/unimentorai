import { LearningMemoryStore } from "./learning_memory_store";
import { PatternExtractor } from "./pattern_extractor";
import { AdaptivePolicyEngine } from "./adaptive_policy_engine";

export class SecurityAICore {

  static learn(event: any) {

    // 🧠 1. EXTRACT PATTERN
    const pattern = PatternExtractor.extract(event);

    // 📦 2. STORE MEMORY
    LearningMemoryStore.addPattern({
      id: `pattern_${Date.now()}`,
      patternType: pattern.patternType,
      confidence: pattern.confidence,
      frequency: 1,
      lastSeen: Date.now(),
    });

    // ⚙️ 3. GENERATE ADAPTIVE RULE
    const rule = AdaptivePolicyEngine.generateRule({
      id: `pattern_${Date.now()}`,
      patternType: pattern.patternType,
      confidence: pattern.confidence,
      frequency: 1,
      lastSeen: Date.now(),
    });

    if (rule) {
      console.log("🧠 New security rule generated:", rule);
    }

    return pattern;
  }
}