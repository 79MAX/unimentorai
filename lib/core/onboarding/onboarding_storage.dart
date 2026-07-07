import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'onboarding_profile.dart';

class OnboardingStorage {
  static const String _doneKey = 'onboarding_v1_completed';
  static const String _profileKey = 'onboarding_v1_profile_json';

  Future<bool> isCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_doneKey) ?? false;
  }

  Future<OnboardingProfile?> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final json = prefs.getString(_profileKey);

    if (json == null || json.isEmpty) return null;

    try {
      return OnboardingProfile.fromJsonString(json);
    } catch (_) {
      return null;
    }
  }

  Future<void> save(OnboardingProfile profile) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setBool(_doneKey, true);
    await prefs.setString(_profileKey, profile.toJsonString());

    final uid = FirebaseAuth.instance.currentUser?.uid;

    if (uid != null) {
      await FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .set({
        'onboarding_v1': profile.toMap(),
        'learning_language': profile.languageCode,
        'updatedAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
    }
  }

  Future<void> reset() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(_doneKey);
    await prefs.remove(_profileKey);
  }
}