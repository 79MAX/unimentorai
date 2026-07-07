import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// ===============================
/// FIREBASE OPTIONS (UNI MENTOR AI)
/// ===============================
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;

      case TargetPlatform.iOS:
        return ios;

      case TargetPlatform.macOS:
        return macos;

      case TargetPlatform.windows:
        return windows;

      case TargetPlatform.linux:
        return linux;

      default:
        throw UnsupportedError(
          'Firebase non supporté sur cette plateforme',
        );
    }
  }

  // ===============================
  // WEB (IMPORTANT POUR TON ERREUR JS)
  // ===============================
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'YOUR_WEB_API_KEY',
    appId: 'YOUR_WEB_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  );

  // ===============================
  // ANDROID (OK)
  // ===============================
  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCXhwX3kPM7uXsGvSrHRNnia12c1gDetwg',
    appId: '1:690200033074:android:97bb7bda6b854ebc90492b',
    messagingSenderId: '690200033074',
    projectId: 'unimentorai-pjhwn',
    storageBucket: 'unimentorai-pjhwn.appspot.com',
  );

  // ===============================
  // iOS
  // ===============================
  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_IOS_API_KEY',
    appId: 'YOUR_IOS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    iosBundleId: 'com.example.unimentorai',
  );

  // ===============================
  // DESKTOP (réutilise base config)
  // ===============================
  static const FirebaseOptions macos = ios;

  static const FirebaseOptions windows = FirebaseOptions(
    apiKey: 'YOUR_WINDOWS_API_KEY',
    appId: 'YOUR_WINDOWS_APP_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  );

  static const FirebaseOptions linux = windows;
}
