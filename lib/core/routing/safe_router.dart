import '../services/app_orchestrator_service.dart';

class SafeRouter {
  final AppOrchestratorService orchestrator;

  SafeRouter(this.orchestrator);

  Future<String> resolve(String userId) async {
    try {
      final route = await orchestrator.getUserNextStep(userId);

      if (route.isEmpty) {
        return '/onboarding';
      }

      return route;
    } catch (e) {
      return '/onboarding'; // SAFE FALLBACK GLOBAL
    }
  }
}