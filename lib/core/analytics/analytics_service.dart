import 'package:firebase_analytics/firebase_analytics.dart';

import 'analytics_events.dart';

/// Façade analytics : un seul point d'entrée + schéma [AnalyticsEvents].
class AnalyticsService {
  AnalyticsService._();
  static final FirebaseAnalytics _a = FirebaseAnalytics.instance;

  static Map<String, Object> _base(Map<String, Object>? extra) => {
        AnalyticsParams.schemaVersion: AnalyticsEvents.schemaVersion,
        ...?extra,
      };

  static Future<void> logEvent(String name, [Map<String, Object>? parameters]) async {
    await _a.logEvent(name: name, parameters: _base(parameters));
  }

  static Future<void> logScreenView(String screenName) async {
    await _a.logScreenView(screenName: screenName);
  }

  static Future<void> logLoginSuccess() =>
      logEvent(AnalyticsEvents.loginSuccess, const {AnalyticsParams.source: 'local_auth'});

  static Future<void> logPostAuthGate({required String destination}) => logEvent(
        AnalyticsEvents.postAuthGateResolved,
        {AnalyticsParams.gateDestination: destination},
      );

  static Future<void> logOnboardingStarted() => logEvent(AnalyticsEvents.onboardingStarted);

  static Future<void> logOnboardingStepViewed({
    required String stepId,
    required int stepIndex,
    required int totalSteps,
  }) =>
      logEvent(AnalyticsEvents.onboardingStepViewed, {
        AnalyticsParams.stepId: stepId,
        AnalyticsParams.stepIndex: stepIndex,
        AnalyticsParams.totalSteps: totalSteps,
      });

  static Future<void> logOnboardingStepCompleted({
    required String stepId,
    required int stepIndex,
    required int totalSteps,
  }) =>
      logEvent(AnalyticsEvents.onboardingStepCompleted, {
        AnalyticsParams.stepId: stepId,
        AnalyticsParams.stepIndex: stepIndex,
        AnalyticsParams.totalSteps: totalSteps,
      });

  static Future<void> logOnboardingCompleted({
    required List<String> goalIds,
    required String levelId,
    required String languageCode,
  }) =>
      logEvent(AnalyticsEvents.onboardingCompleted, {
        AnalyticsParams.goalIds: goalIds.join(','),
        AnalyticsParams.levelId: levelId,
        AnalyticsParams.languageCode: languageCode,
      });

  static Future<void> logDashboardViewed({
    required int courseCount,
    required int mentorCount,
    required bool hasOpportunity,
  }) =>
      logEvent(AnalyticsEvents.dashboardViewed, {
        AnalyticsParams.courseCount: courseCount,
        AnalyticsParams.mentorCount: mentorCount,
        AnalyticsParams.hasOpportunity: hasOpportunity,
      });

  static Future<void> logDashboardCourseOpen(String courseId) => logEvent(
        AnalyticsEvents.dashboardCourseOpen,
        {AnalyticsParams.courseId: courseId},
      );

  static Future<void> logDashboardMentoringCta() => logEvent(AnalyticsEvents.dashboardMentoringCta);

  static Future<void> logDashboardOpportunityOpen(String kind) => logEvent(
        AnalyticsEvents.dashboardOpportunityOpen,
        {AnalyticsParams.opportunityKind: kind},
      );

  static Future<void> logConsentAnalyticsAccepted() => logEvent(AnalyticsEvents.consentAnalyticsAccepted);
}




