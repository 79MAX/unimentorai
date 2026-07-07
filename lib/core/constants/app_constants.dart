class AppConstants {
  // API Configuration
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.unimentorai.com',
  );
  
  static const String firebaseFunctionsUrl = String.fromEnvironment(
    'FIREBASE_FUNCTIONS_URL', 
    defaultValue: 'https://us-central1-unimentorai-prod.cloudfunctions.net',
  );
  
  // Security
  static const int maxTranslationsPerCourse = 2;
  static const int maxApiCallsPerHour = 1000;
  static const int cacheDurationHours = 24;
  
  // Payment Plans
  static const Map<String, double> subscriptionPlans = {
    'freemium': 0.0,
    'premium': 9.99,
    'pro': 19.99,
  };
  
  // Supported Languages
  static const List<String> supportedLanguages = [
    'en', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ko'
  ];
  
  // Cache Keys
  static const String userCacheKey = 'user_data';
  static const String coursesCacheKey = 'courses_data';
  static const String translationsCacheKey = 'translations_data';
  
  // Error Messages
static const String genericErrorMessage =
    "Une erreur inattendue s'est produite.";

static const String networkErrorMessage =
    'Problème de connexion internet.';

static const String authErrorMessage =
    "Erreur d'authentification.";
}




