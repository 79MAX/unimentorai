import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/widgets.dart';

import '../firebase/firebase_options.dart';

/// ===============================
/// APP INITIALIZER (BOOTSTRAP CORE)
/// ===============================
/// 👉 Point d'entrée unique pour initialisation globale
/// 👉 Extensible: Firebase, Crashlytics, RemoteConfig, Analytics, etc.
class AppInitializer {
  static bool _initialized = false;

  /// 🚀 Init globale de l'app (safe + idempotent)
  static Future<void> init() async {
    if (_initialized) return;

    WidgetsFlutterBinding.ensureInitialized();

    await _initFirebase();

    _initialized = true;
  }

  /// 🔥 Firebase bootstrap centralisé
  static Future<void> _initFirebase() async {
    if (Firebase.apps.isNotEmpty) return;

    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  }

  /// 🧠 Reset (utile tests / hot restart avancé / QA)
  static void reset() {
    _initialized = false;
  }
}

