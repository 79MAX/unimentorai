/// 🎯 UniMentorAI Funnel Engine
/// Gère la conversion utilisateur :
/// Visitor → User → Active → Paid
library;

class FunnelService {
  /// 🟢 STEP 1: VISITOR → SIGNUP
  String signupMessage() => 'Start learning with AI in 30 seconds';

  /// 🟡 STEP 2: USER → ACTIVE
  String activationMessage() => 'Complete your first lesson to unlock AI tutor';

  /// 🔵 STEP 3: ACTIVE → PAID
  String conversionMessage() => 'Unlock Premium certification & global courses';

  /// 🔥 CORE ENGINE: CONTEXTUAL MESSAGE SYSTEM
  String contextualMessage({
    required bool isPremium,
    required bool hasCompletedLesson,
  }) {
    if (!hasCompletedLesson) {
      return activationMessage();
    }

    if (!isPremium) {
      return conversionMessage();
    }

    return 'You are a Premium learner 🚀 Keep growing globally';
  }
}