import { SecurityAICore } from "./model_feedback_loop";

export class SelfLearningSecurityAI {

  static processEvent(event: any) {

    const result = SecurityAICore.learn(event);

    return {
      status: "LEARNED",
      pattern: result.patternType,
      confidence: result.confidence,
    };
  }
}