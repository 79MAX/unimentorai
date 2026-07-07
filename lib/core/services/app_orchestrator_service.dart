class AppOrchestratorService {
  final OnboardingStorage onboardingStorage;
  final GamificationService gamificationService;
  final CertificateHashService hashService;

  AppOrchestratorService({
    required this.onboardingStorage,
    required this.gamificationService,
    required this.hashService,
  });

  /// SINGLE SOURCE OF TRUTH - FLOW ENGINE
  Future<String> getUserNextStep(String userId) async {
    try {
      final profile = await onboardingStorage.loadProfile();

      if (profile == null) {
        return '/onboarding';
      }

      // 1. ONBOARDING LOCK
      if (!profile.completed) {
        return '/onboarding';
      }

      // 2. FIRST LESSON LOCK
      if (!profile.firstLessonCompleted) {
        return '/ai-tutor';
      }

      // 3. LEARNING FLOW
      if (!profile.courseStarted) {
        return '/ai-tutor';
      }

      // 4. CERTIFICATION FLOW
      if (profile.courseCompleted) {
        return '/certificate';
      }

      // 5. PREMIUM CONVERSION FLOW
      if (!profile.isPremium) {
        return '/paywall';
      }

      // 6. DEFAULT SAFE HOME
      return '/home';

    } catch (e) {
      // CRITICAL SAFETY NET
      return '/onboarding';
    }
  }
}