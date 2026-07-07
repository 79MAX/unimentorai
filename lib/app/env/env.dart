import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Classe utilitaire pour accéder aux variables d'environnement de manière sécurisée.
class AppEnv {
  // Méthode d'initialisation à appeler dans main() avant l'utilisation de l'environnement
  static Future<void> load() async {
    await dotenv.load();
  }

  // Accès sécurisé aux variables sensibles
  static String get apiUrl => _getEnv('API_URL');
  static String get firebaseApiKey => _getEnv('FIREBASE_API_KEY');
  static String get stripeKey => _getEnv('STRIPE_KEY');
  static String get firebaseProjectId => _getEnv('FIREBASE_PROJECT_ID');
  static String get firebaseMessagingSenderId => _getEnv('FIREBASE_MESSAGING_SENDER_ID');
  static String get firebaseAppId => _getEnv('FIREBASE_APP_ID');

  // Fonction interne pour gestion d'erreur et fallback
  static String _getEnv(String key) {
    final value = dotenv.env[key];
    if (value == null || value.isEmpty) {
      throw Exception('⚠️ Variable d’environnement "$key" manquante ou vide dans .env');
    }
    return value;
  }
}




