import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';
import 'package:encrypt/encrypt.dart' as enc;
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Service de sécurité centralisé : chiffrement AES-256, stockage sécurisé des clés.
class SecurityService {
  static final SecurityService _instance = SecurityService._internal();
  factory SecurityService() => _instance;
  SecurityService._internal();

  static const String _encryptionKeyStorageKey = '_aes_encryption_key';
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  SharedPreferences? _prefs;
  enc.Key? _encryptionKey;
  bool _isInitialized = false;

  /// Initialise le service (SharedPreferences + clé de chiffrement).
  /// À appeler au démarrage de l'app (ex. avant toute utilisation de storeApiKey/getApiKey).
  Future<void> initialize() async {
    if (_isInitialized) return;
    _prefs = await SharedPreferences.getInstance();
    final String? storedKey = await _secureStorage.read(key: _encryptionKeyStorageKey);
    if (storedKey != null && storedKey.length >= 32) {
      final keyBytes = base64Decode(storedKey);
      if (keyBytes.length >= 32) {
        _encryptionKey = enc.Key(Uint8List.fromList(keyBytes.sublist(0, 32)));
      }
    }
    if (_encryptionKey == null) {
      final random = Random.secure();
      final keyBytes = List<int>.generate(32, (_) => random.nextInt(256));
      _encryptionKey = enc.Key(Uint8List.fromList(keyBytes));
      await _secureStorage.write(
        key: _encryptionKeyStorageKey,
        value: base64Encode(keyBytes),
      );
    }
    _isInitialized = true;
  }

  Future<void> _ensureInitialized() async {
    if (!_isInitialized) await initialize();
  }

  /// Chiffre une donnée sensible (AES-256-CBC, IV aléatoire par chiffrement).
  String encryptSensitiveData(String data) {
    if (_encryptionKey == null || _prefs == null) {
      throw SecurityException('SecurityService non initialisé. Appelez initialize() avant.');
    }
    try {
      final iv = enc.IV.fromLength(16);
      final encrypter = enc.Encrypter(enc.AES(_encryptionKey!));
      final encrypted = encrypter.encrypt(data, iv: iv);
      return '${iv.base64}:${encrypted.base64}';
    } catch (e) {
      throw SecurityException('Erreur lors du chiffrement des données');
    }
  }

  /// Déchiffre une donnée sensible (format iv:ciphertext en base64).
  String decryptSensitiveData(String encryptedData) {
    if (_encryptionKey == null || _prefs == null) {
      throw SecurityException('SecurityService non initialisé. Appelez initialize() avant.');
    }
    try {
      final parts = encryptedData.split(':');
      if (parts.length != 2) throw const FormatException('Format chiffré invalide');
      final iv = enc.IV.fromBase64(parts[0]);
      final encrypted = enc.Encrypted.fromBase64(parts[1]);
      final encrypter = enc.Encrypter(enc.AES(_encryptionKey!));
      return encrypter.decrypt(encrypted, iv: iv);
    } catch (e) {
      throw SecurityException('Erreur lors du déchiffrement des données');
    }
  }

  /// Stocke une API key de manière sécurisée (chiffrée avec AES).
  Future<void> storeApiKey(String keyName, String apiKey) async {
    await _ensureInitialized();
    if (_isServerOnlyKeyName(keyName)) {
      throw SecurityException(
        'La clé $keyName ne doit pas être stockée sur l’appareil : configurez Cloud Functions / Firebase (secrets serveur).',
      );
    }
    try {
      final encryptedKey = encryptSensitiveData(apiKey);
      await _prefs!.setString('api_key_$keyName', encryptedKey);
    } catch (e) {
      throw SecurityException("Erreur lors du stockage de l'API key");
    }
  }

  /// Clés réservées au backend (Cloud Functions) — jamais exposées au client.
  static bool _isServerOnlyKeyName(String keyName) {
    const blocked = <String>{
      'STRIPE_SECRET',
      'PAYPAL_CLIENT_SECRET',
      'KKIAPAY_PRIVATE',
      'KKIAPAY_SECRET',
      'WISE_API',
      'WISE', // alias admin / doc ; token Wise uniquement côté serveur
    };
    return blocked.contains(keyName);
  }

  /// Récupère une API key (déchiffrée). Retourne null si absente ou erreur.
  Future<String?> getApiKey(String keyName) async {
    await _ensureInitialized();
    if (_isServerOnlyKeyName(keyName)) {
      if (kDebugMode) {
        debugPrint(
          'SecurityService: refus lecture clé serveur uniquement ($keyName). Utiliser Cloud Functions.',
        );
      }
      return null;
    }
    try {
      final encryptedKey = _prefs!.getString('api_key_$keyName');
      if (encryptedKey == null) return null;
      return decryptSensitiveData(encryptedKey);
    } catch (e) {
      if (kDebugMode) debugPrint('SecurityService getApiKey($keyName): $e');
      return null;
    }
  }

  /// Valide la sécurité d'un mot de passe
  PasswordSecurityResult validatePasswordSecurity(String password) {
    final issues = <String>[];

    if (password.length < 8) {
      issues.add('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!password.contains(RegExp(r'[A-Z]'))) {
      issues.add('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!password.contains(RegExp(r'[a-z]'))) {
      issues.add('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!password.contains(RegExp(r'[0-9]'))) {
      issues.add('Le mot de passe doit contenir au moins un chiffre');
    }

    return PasswordSecurityResult(
      isValid: issues.isEmpty,
      issues: issues,
      strength: _calculatePasswordStrength(password),
    );
  }

  PasswordStrength _calculatePasswordStrength(String password) {
    int score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (RegExp(r'[A-Z]').hasMatch(password)) score++;
    if (RegExp(r'[a-z]').hasMatch(password)) score++;
    if (RegExp(r'[0-9]').hasMatch(password)) score++;
    if (RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password)) score++;
    if (score <= 2) return PasswordStrength.weak;
    if (score <= 4) return PasswordStrength.medium;
    return PasswordStrength.strong;
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

  String _hashSensitiveData(String data) {
    final bytes = utf8.encode(data);
    final digest = sha256.convert(bytes);
    return digest.toString().substring(0, 8);
  }

  /// Supprime toutes les données sensibles (RGPD)
  Future<void> deleteAllSensitiveData() async {
    await _ensureInitialized();
    try {
      final keys = _prefs!.getKeys();
      for (final key in keys) {
        if (key.startsWith('api_key_')) {
          await _prefs!.remove(key);
        }
      }
    } catch (e) {
      throw SecurityException('Erreur lors de la suppression des données');
    }
  }
}

class PasswordSecurityResult {
  final bool isValid;
  final List<String> issues;
  final PasswordStrength strength;

  PasswordSecurityResult({
    required this.isValid,
    required this.issues,
    required this.strength,
  });
}

enum PasswordStrength { weak, medium, strong }

class SecurityException implements Exception {
  final String message;
  SecurityException(this.message);
  @override
  String toString() => 'SecurityException: $message';
}



