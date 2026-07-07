/// Schéma d'événements UniMentorAI — Firebase Analytics (GA4).
///
/// Règles : noms ≤ 40 caractères, `[a-zA-Z][a-zA-Z0-9_]*`, pas d'infos personnelles
/// dans les paramètres (pas d'email, téléphone, nom affiché).
///
/// Versionnez le schéma pour comparer les cohortes dans BigQuery / Looker.
abstract final class AnalyticsEvents {
  /// Version du contrat d'événements (incrémenter à chaque breaking change).
  static const int schemaVersion = 1;

  static const String appOpen = 'app_open';
  static const String loginSuccess = 'login_success';
  static const String postAuthGateResolved = 'post_auth_gate_resolved';

  static const String onboardingStarted = 'onboarding_started';
  static const String onboardingStepViewed = 'onboarding_step_viewed';
  static const String onboardingStepCompleted = 'onboarding_step_completed';
  static const String onboardingCompleted = 'onboarding_completed';
  static const String onboardingSkipped = 'onboarding_skipped';

  static const String dashboardViewed = 'dashboard_viewed';
  static const String dashboardSectionExpanded = 'dashboard_section_expanded';
  static const String dashboardCourseOpen = 'dashboard_course_open';
  static const String dashboardMentorProfileOpen = 'dashboard_mentor_profile_open';
  static const String dashboardMentoringCta = 'dashboard_mentoring_cta';
  static const String dashboardOpportunityOpen = 'dashboard_opportunity_open';

  static const String consentAnalyticsAccepted = 'consent_analytics_accepted';
}

/// Clés de paramètres standardisées (éviter les typos côté app).
abstract final class AnalyticsParams {
  static const String schemaVersion = 'schema_version';
  static const String source = 'source';
  static const String stepId = 'step_id';
  static const String stepIndex = 'step_index';
  static const String totalSteps = 'total_steps';
  static const String goalIds = 'goal_ids';
  static const String levelId = 'level_id';
  static const String languageCode = 'language_code';
  static const String courseCount = 'course_count';
  static const String mentorCount = 'mentor_count';
  static const String hasOpportunity = 'has_opportunity';
  static const String courseId = 'course_id';
  static const String mentorUserId = 'mentor_user_id';
  static const String opportunityKind = 'opportunity_kind';
  static const String gateDestination = 'gate_destination';
}




