import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:logger/logger.dart';
import '../services/security_service.dart';

/// Configuration centralisée et sécurisée de l'application
class AppConfig {
  static final AppConfig _instance = AppConfig._internal();
  factory AppConfig() => _instance;
  AppConfig._internal();

  final Logger _logger = Logger();
  final SecurityService _securityService = SecurityService();
  bool _isInitialized = false;

  // Configuration Firebase
  String? _firebaseProjectId;
  String? _firebaseApiKey;
  String? _firebaseAppId;
  String? _firebaseMessagingSenderId;

  // Configuration des paiements
  String? _stripePublishableKey;
  String? _stripeSecretKey;
  String? _paypalClientId;
  String? _paypalClientSecret;
  String? _kkiapayPublicKey;
  String? _kkiapayPrivateKey;
  String? _wiseApiKey;

  // Configuration IA
  String? _openaiApiKey;
  String? _googleTranslateApiKey;

  // Configuration sécurité
  String? _encryptionKey;
  String? _jwtSecret;

  // Configuration environnement
  String? _environment;
  bool? _debugMode;
  String? _logLevel;

  // Configuration cache et performance
  int? _cacheDurationHours;
  int? _maxTranslationsPerCourse;
  int? _maxCacheSizeMB;

  // Configuration RGPD
  int? _dataRetentionDays;
  bool? _anonymizeLogs;
  bool? _enableAnalytics;

  /// Initialise la configuration depuis les variables d'environnement
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // Charger le fichier .env
      await dotenv.load();

      // Initialiser le service de sécurité
      await _securityService.initialize();

      // Charger la configuration Firebase
      _firebaseProjectId = dotenv.env['FIREBASE_PROJECT_ID'];
      _firebaseApiKey = await _securityService.getApiKey('FIREBASE_API');
      _firebaseAppId = dotenv.env['FIREBASE_APP_ID'];
      _firebaseMessagingSenderId = dotenv.env['FIREBASE_MESSAGING_SENDER_ID'];

      // Charger la configuration des paiements
      _stripePublishableKey = await _securityService.getApiKey('STRIPE_PUBLISHABLE');
      _stripeSecretKey = await _securityService.getApiKey('STRIPE_SECRET');
      _paypalClientId = await _securityService.getApiKey('PAYPAL_CLIENT_ID');
      _paypalClientSecret = await _securityService.getApiKey('PAYPAL_CLIENT_SECRET');
      _kkiapayPublicKey = await _securityService.getApiKey('KKIAPAY_PUBLIC');
      _kkiapayPrivateKey = await _securityService.getApiKey('KKIAPAY_PRIVATE');
      _wiseApiKey = await _securityService.getApiKey('WISE_API');

      // Charger la configuration IA
      _openaiApiKey = await _securityService.getApiKey('OPENAI');
      _googleTranslateApiKey = await _securityService.getApiKey('GOOGLE_TRANSLATE');

      // Charger la configuration sécurité
      _encryptionKey = dotenv.env['ENCRYPTION_KEY'];
      _jwtSecret = dotenv.env['JWT_SECRET'];

      // Charger la configuration environnement
      _environment = dotenv.env['ENVIRONMENT'] ?? 'development';
      _debugMode = dotenv.env['DEBUG_MODE']?.toLowerCase() == 'true';
      _logLevel = dotenv.env['LOG_LEVEL'] ?? 'info';

      // Charger la configuration cache et performance
      _cacheDurationHours = int.tryParse(dotenv.env['CACHE_DURATION_HOURS'] ?? '24');
      _maxTranslationsPerCourse = int.tryParse(dotenv.env['MAX_TRANSLATIONS_PER_COURSE'] ?? '2');
      _maxCacheSizeMB = int.tryParse(dotenv.env['MAX_CACHE_SIZE_MB'] ?? '100');

      // Charger la configuration RGPD
      _dataRetentionDays = int.tryParse(dotenv.env['DATA_RETENTION_DAYS'] ?? '365');
      _anonymizeLogs = dotenv.env['ANONYMIZE_LOGS']?.toLowerCase() == 'true';
      _enableAnalytics = dotenv.env['ENABLE_ANALYTICS']?.toLowerCase() == 'true';

      _isInitialized = true;
      _logger.i('AppConfig initialisé avec succès');
    } catch (e) {
      _logger.e('Erreur initialisation AppConfig: $e');
      rethrow;
    }
  }

  // Getters pour Firebase
  String get firebaseProjectId => _firebaseProjectId ?? '';
  String get firebaseApiKey => _firebaseApiKey ?? '';
  String get firebaseAppId => _firebaseAppId ?? '';
  String get firebaseMessagingSenderId => _firebaseMessagingSenderId ?? '';

  // Getters pour les paiements
  String get stripePublishableKey => _stripePublishableKey ?? '';
  String get stripeSecretKey => _stripeSecretKey ?? '';
  String get paypalClientId => _paypalClientId ?? '';
  String get paypalClientSecret => _paypalClientSecret ?? '';
  String get kkiapayPublicKey => _kkiapayPublicKey ?? '';
  String get kkiapayPrivateKey => _kkiapayPrivateKey ?? '';
  String get wiseApiKey => _wiseApiKey ?? '';

  // Getters pour l'IA
  String get openaiApiKey => _openaiApiKey ?? '';
  String get googleTranslateApiKey => _googleTranslateApiKey ?? '';

  // Getters pour la sécurité
  String get encryptionKey => _encryptionKey ?? '';
  String get jwtSecret => _jwtSecret ?? '';

  // Getters pour l'environnement
  String get environment => _environment ?? 'development';
  bool get debugMode => _debugMode ?? false;
  String get logLevel => _logLevel ?? 'info';

  // Getters pour le cache et les performances
  int get cacheDurationHours => _cacheDurationHours ?? 24;
  int get maxTranslationsPerCourse => _maxTranslationsPerCourse ?? 2;
  int get maxCacheSizeMB => _maxCacheSizeMB ?? 100;

  // Getters pour RGPD
  int get dataRetentionDays => _dataRetentionDays ?? 365;
  bool get anonymizeLogs => _anonymizeLogs ?? true;
  bool get enableAnalytics => _enableAnalytics ?? true;

  /// Vérifie si toutes les clés API requises sont configurées
  bool get isFullyConfigured => firebaseApiKey.isNotEmpty &&
           stripePublishableKey.isNotEmpty &&
           paypalClientId.isNotEmpty &&
           kkiapayPublicKey.isNotEmpty &&
           openaiApiKey.isNotEmpty &&
           googleTranslateApiKey.isNotEmpty;

  /// Obtient les clés API manquantes
  List<String> getMissingApiKeys() {
    final missingKeys = <String>[];
    
    if (firebaseApiKey.isEmpty) missingKeys.add('Firebase API Key');
    if (stripePublishableKey.isEmpty) missingKeys.add('Stripe Publishable Key');
    if (paypalClientId.isEmpty) missingKeys.add('PayPal Client ID');
    if (kkiapayPublicKey.isEmpty) missingKeys.add('Kkiapay Public Key');
    if (openaiApiKey.isEmpty) missingKeys.add('OpenAI API Key');
    if (googleTranslateApiKey.isEmpty) missingKeys.add('Google Translate API Key');

    return missingKeys;
  }

  /// Valide la configuration
  bool validateConfiguration() {
    try {
      // Vérifier les clés Firebase
      if (firebaseProjectId.isEmpty || firebaseApiKey.isEmpty) {
        _logger.w('Configuration Firebase incomplète');
        return false;
      }

      // Vérifier au moins une méthode de paiement
      if (stripePublishableKey.isEmpty && 
          paypalClientId.isEmpty && 
          kkiapayPublicKey.isEmpty) {
        _logger.w('Aucune méthode de paiement configurée');
        return false;
      }

      // Vérifier les services IA
      if (openaiApiKey.isEmpty && googleTranslateApiKey.isEmpty) {
        _logger.w('Aucun service IA configuré');
        return false;
      }

      // Vérifier la sécurité
      if (encryptionKey.isEmpty || encryptionKey.length != 32) {
        _logger.w('Clé de chiffrement invalide');
        return false;
      }

      _logger.i('Configuration validée avec succès');
      return true;
    } catch (e) {
      _logger.e('Erreur validation configuration: $e');
      return false;
    }
  }

  /// Obtient un résumé de la configuration (sans les clés sensibles)
  Map<String, dynamic> getConfigurationSummary() => {
      'environment': environment,
      'debugMode': debugMode,
      'logLevel': logLevel,
      'cacheDurationHours': cacheDurationHours,
      'maxTranslationsPerCourse': maxTranslationsPerCourse,
      'maxCacheSizeMB': maxCacheSizeMB,
      'dataRetentionDays': dataRetentionDays,
      'anonymizeLogs': anonymizeLogs,
      'enableAnalytics': enableAnalytics,
      'isFullyConfigured': isFullyConfigured,
      'missingApiKeys': getMissingApiKeys(),
    };

  /// Recharge la configuration depuis les variables d'environnement
  Future<void> reload() async {
    _isInitialized = false;
    await initialize();
  }

  /// Vérifie si l'application est en mode production
  bool get isProduction => environment.toLowerCase() == 'production';

  /// Vérifie si l'application est en mode développement
  bool get isDevelopment => environment.toLowerCase() == 'development';

  /// Obtient le niveau de log approprié
  Level get logLevelEnum {
    switch (logLevel.toLowerCase()) {
      case 'debug':
        return Level.debug;
      case 'info':
        return Level.info;
      case 'warning':
        return Level.warning;
      case 'error':
        return Level.error;
      default:
        return Level.info;
    }
  }
}










