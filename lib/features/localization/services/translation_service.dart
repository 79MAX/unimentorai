// 📁 lib/modules/localization/translation_service.dart

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TranslationService {
  static const String _langKey = 'preferred_language';

  /// Initialise la langue depuis les préférences ou utilise la langue système
  static Future<Locale> getInitialLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final langCode = prefs.getString(_langKey);
    if (langCode != null) {
      return Locale(langCode);
    } else {
      // Langue système par défaut ou fallback à l’anglais
      return WidgetsBinding.instance.platformDispatcher.locale ?? const Locale('en');
    }
  }

  /// Sauvegarde la langue choisie par l’utilisateur
  static Future<void> savePreferredLocale(Locale locale) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_langKey, locale.languageCode);
  }

  /// Liste des langues supportées
  static const supportedLocales = [
    Locale('en'),
    Locale('fr'),
    Locale('pt'),
    Locale('ar'),
    Locale('sw'),
    Locale('ha'),
    Locale('zh'),
    Locale('es')
  ];

  /// Vérifie si une langue est supportée
  static bool isSupported(Locale locale) => supportedLocales.any((l) => l.languageCode == locale.languageCode);

  /// Fallback vers l’anglais si la langue n’est pas supportée
  static Locale fallbackLocale(Locale? locale) {
    if (locale == null) return const Locale('en');
    return isSupported(locale) ? locale : const Locale('en');
  }
}




