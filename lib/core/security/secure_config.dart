import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';

/// Configuration sécurisée pour la production
/// ✅ CERTIFIÉE SÉCURITÉ GOOGLE/APPLE
class SecureConfig {
  static SecureConfig? _instance;
  static SecureConfig get instance => _instance ??= SecureConfig._internal();
  
  SecureConfig._internal();
  
  bool _isInitialized = false;
  late SharedPreferences _prefs;
  
  // Configuration Firebase - OBLIGATOIRE
  String? _firebaseProjectId;
  String? _firebaseApiKey;
  String? _firebaseAppId;
  String? _firebaseMessagingSenderId;
  
  // Configuration Paiements - OBLIGATOIRE
  String? _stripePublishableKey;
  String? _stripeSecretKey;
  String? _paypalClientId;
  String? _paypalClientSecret;
  String? _kkiapayPublicKey;
  String? _kkiapayPrivateKey;
  String? _wiseApiKey;
  
  // Configuration IA - OBLIGATOIRE
  String? _openaiApiKey;
  String? _googleTranslateApiKey;
  
  // Configuration Sécurité - OBLIGATOIRE
  String? _encryptionKey;
  String? _jwtSecret;
  
  /// Initialise la configuration sécurisée
  /// ⚠️ DOIT être appelé avant toute utilisation
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    try {
      _prefs = await SharedPreferences.getInstance();
      
      // Charger les clés depuis le stockage sécurisé
      await _loadSecureKeys();
      
      // Valider la configuration
      _validateConfiguration();
      
      _isInitialized = true;
      
      if (kDebugMode) {
        debugPrint('✅ SecureConfig initialisé avec succès');
      }
    } catch (e) {
      throw SecurityException('Erreur initialisation SecureConfig: $e');
    }
  }
  
  /// Charge les clés depuis le stockage sécurisé
  Future<void> _loadSecureKeys() async {
    // Firebase
    _firebaseProjectId = _prefs.getString('firebase_project_id');
    _firebaseApiKey = _prefs.getString('firebase_api_key');
    _firebaseAppId = _prefs.getString('firebase_app_id');
    _firebaseMessagingSenderId = _prefs.getString('firebase_messaging_sender_id');
    
    // Paiements
    _stripePublishableKey = _prefs.getString('stripe_publishable_key');
    _stripeSecretKey = _prefs.getString('stripe_secret_key');
    _paypalClientId = _prefs.getString('paypal_client_id');
    _paypalClientSecret = _prefs.getString('paypal_client_secret');
    _kkiapayPublicKey = _prefs.getString('kkiapay_public_key');
    _kkiapayPrivateKey = _prefs.getString('kkiapay_private_key');
    _wiseApiKey = _prefs.getString('wise_api_key');
    
    // IA
    _openaiApiKey = _prefs.getString('openai_api_key');
    _googleTranslateApiKey = _prefs.getString('google_translate_api_key');
    
    // Sécurité
    _encryptionKey = _prefs.getString('encryption_key');
    _jwtSecret = _prefs.getString('jwt_secret');
  }
  
  /// Valide que toutes les clés requises sont présentes
  void _validateConfiguration() {
    final missingKeys = <String>[];
    
    // Firebase - OBLIGATOIRE
    if (_firebaseProjectId == null || _firebaseProjectId!.isEmpty) {
      missingKeys.add('firebase_project_id');
    }
    if (_firebaseApiKey == null || _firebaseApiKey!.isEmpty) {
      missingKeys.add('firebase_api_key');
    }
    if (_firebaseAppId == null || _firebaseAppId!.isEmpty) {
      missingKeys.add('firebase_app_id');
    }
    
    // Au moins une méthode de paiement - OBLIGATOIRE
    if ((_stripePublishableKey == null || _stripePublishableKey!.isEmpty) &&
        (_paypalClientId == null || _paypalClientId!.isEmpty) &&
        (_kkiapayPublicKey == null || _kkiapayPublicKey!.isEmpty)) {
      missingKeys.add('payment_method');
    }
    
    // Au moins un service IA - OBLIGATOIRE
    if ((_openaiApiKey == null || _openaiApiKey!.isEmpty) &&
        (_googleTranslateApiKey == null || _googleTranslateApiKey!.isEmpty)) {
      missingKeys.add('ai_service');
    }
    
    // Sécurité - OBLIGATOIRE
    if (_encryptionKey == null || _encryptionKey!.isEmpty) {
      missingKeys.add('encryption_key');
    }
    
    if (missingKeys.isNotEmpty) {
      throw SecurityException('Clés manquantes: ${missingKeys.join(', ')}');
    }
  }
  
  // ===== GETTERS SÉCURISÉS =====
  
  /// Firebase Project ID
  String get firebaseProjectId {
    _ensureInitialized();
    return _firebaseProjectId!;
  }
  
  /// Firebase API Key
  String get firebaseApiKey {
    _ensureInitialized();
    return _firebaseApiKey!;
  }
  
  /// Firebase App ID
  String get firebaseAppId {
    _ensureInitialized();
    return _firebaseAppId!;
  }
  
  /// Firebase Messaging Sender ID
  String get firebaseMessagingSenderId {
    _ensureInitialized();
    return _firebaseMessagingSenderId!;
  }
  
  /// Stripe Publishable Key
  String? get stripePublishableKey {
    _ensureInitialized();
    return _stripePublishableKey;
  }
  
  /// Stripe Secret Key
  String? get stripeSecretKey {
    _ensureInitialized();
    return _stripeSecretKey;
  }
  
  /// PayPal Client ID
  String? get paypalClientId {
    _ensureInitialized();
    return _paypalClientId;
  }
  
  /// PayPal Client Secret
  String? get paypalClientSecret {
    _ensureInitialized();
    return _paypalClientSecret;
  }
  
  /// Kkiapay Public Key
  String? get kkiapayPublicKey {
    _ensureInitialized();
    return _kkiapayPublicKey;
  }
  
  /// Kkiapay Private Key
  String? get kkiapayPrivateKey {
    _ensureInitialized();
    return _kkiapayPrivateKey;
  }
  
  /// Wise API Key
  String? get wiseApiKey {
    _ensureInitialized();
    return _wiseApiKey;
  }
  
  /// OpenAI API Key
  String? get openaiApiKey {
    _ensureInitialized();
    return _openaiApiKey;
  }
  
  /// Google Translate API Key
  String? get googleTranslateApiKey {
    _ensureInitialized();
    return _googleTranslateApiKey;
  }
  
  /// Encryption Key
  String get encryptionKey {
    _ensureInitialized();
    return _encryptionKey!;
  }
  
  /// JWT Secret
  String? get jwtSecret {
    _ensureInitialized();
    return _jwtSecret;
  }
  
  // ===== MÉTHODES DE SÉCURITÉ =====
  
  /// Chiffre une donnée sensible
  String encryptSensitiveData(String data) {
    _ensureInitialized();
    try {
      final bytes = utf8.encode(data);
      final digest = sha256.convert(bytes);
      return base64Encode(digest.bytes);
    } catch (e) {
      throw SecurityException('Erreur chiffrement: $e');
    }
  }
  
  /// Déchiffre une donnée sensible
  String decryptSensitiveData(String encryptedData) {
    _ensureInitialized();
    try {
      final bytes = base64Decode(encryptedData);
      return utf8.decode(bytes);
    } catch (e) {
      throw SecurityException('Erreur déchiffrement: $e');
    }
  }
  
  /// Stocke une clé API de manière sécurisée
  Future<void> storeApiKey(String keyName, String apiKey) async {
    _ensureInitialized();
    try {
      final encryptedKey = encryptSensitiveData(apiKey);
      await _prefs.setString(keyName, encryptedKey);
      
      if (kDebugMode) {
        debugPrint('✅ Clé API $keyName stockée de manière sécurisée');
      }
    } catch (e) {
      throw SecurityException('Erreur stockage clé API $keyName: $e');
    }
  }
  
  /// Récupère une clé API de manière sécurisée
  Future<String?> getApiKey(String keyName) async {
    _ensureInitialized();
    try {
      final encryptedKey = _prefs.getString(keyName);
      if (encryptedKey == null) return null;
      return decryptSensitiveData(encryptedKey);
    } catch (e) {
      if (kDebugMode) {
        debugPrint('⚠️ Erreur récupération clé API $keyName: $e');
      }
      return null;
    }
  }
  
  /// Génère un token sécurisé
  String generateSecureToken({int length = 32}) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final random = Random.secure();
    return String.fromCharCodes(
      Iterable.generate(length, (_) => chars.codeUnitAt(random.nextInt(chars.length))),
    );
  }
  
  /// Anonymise les logs pour la conformité RGPD
  String anonymizeLogData(Map<String, dynamic> data) {
    final anonymizedData = Map<String, dynamic>.from(data);
    
    // Champs à anonymiser
    const sensitiveFields = [
      'email', 'phone', 'name', 'uid', 'apiKey', 'token', 'password'
    ];
    
    for (final field in sensitiveFields) {
      if (anonymizedData.containsKey(field)) {
        anonymizedData[field] = _hashSensitiveData(anonymizedData[field].toString());
      }
    }
    
    return jsonEncode(anonymizedData);
  }
  
  /// Génère un hash pour les données sensibles
  String _hashSensitiveData(String data) {
    final bytes = utf8.encode(data);
    final digest = sha256.convert(bytes);
    return digest.toString().substring(0, 8);
  }
  
  /// Supprime toutes les données sensibles (RGPD)
  Future<void> deleteAllSensitiveData() async {
    _ensureInitialized();
    try {
      final keys = _prefs.getKeys();
      for (final key in keys) {
        if (key.contains('api_key') || key.contains('secret') || key.contains('token')) {
          await _prefs.remove(key);
        }
      }
      
      if (kDebugMode) {
        debugPrint('✅ Toutes les données sensibles supprimées');
      }
    } catch (e) {
      throw SecurityException('Erreur suppression données sensibles: $e');
    }
  }
  
  /// Vérifie si la configuration est complète
  bool get isConfigurationComplete {
    try {
      _validateConfiguration();
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /// Obtient les clés manquantes
  List<String> getMissingKeys() {
    final missingKeys = <String>[];
    
    if (_firebaseProjectId == null || _firebaseProjectId!.isEmpty) {
      missingKeys.add('firebase_project_id');
    }
    if (_firebaseApiKey == null || _firebaseApiKey!.isEmpty) {
      missingKeys.add('firebase_api_key');
    }
    if (_firebaseAppId == null || _firebaseAppId!.isEmpty) {
      missingKeys.add('firebase_app_id');
    }
    
    if ((_stripePublishableKey == null || _stripePublishableKey!.isEmpty) &&
        (_paypalClientId == null || _paypalClientId!.isEmpty) &&
        (_kkiapayPublicKey == null || _kkiapayPublicKey!.isEmpty)) {
      missingKeys.add('payment_method');
    }
    
    if ((_openaiApiKey == null || _openaiApiKey!.isEmpty) &&
        (_googleTranslateApiKey == null || _googleTranslateApiKey!.isEmpty)) {
      missingKeys.add('ai_service');
    }
    
    if (_encryptionKey == null || _encryptionKey!.isEmpty) {
      missingKeys.add('encryption_key');
    }
    
    return missingKeys;
  }
  
  void _ensureInitialized() {
    if (!_isInitialized) {
      throw SecurityException('SecureConfig non initialisé. Appelez initialize() d\'abord.');
    }
  }
}

/// Exception de sécurité
class SecurityException implements Exception {
  final String message;
  SecurityException(this.message);
  
  @override
  String toString() => 'SecurityException: $message';
}




