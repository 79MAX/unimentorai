import 'dart:convert';

/// Profil collecté à l'onboarding (objectifs, niveau, langue d'apprentissage).
class OnboardingProfile {
  final List<String> goalIds;
  final String levelId;
  final String languageCode;
  final DateTime completedAt;

  const OnboardingProfile({
    required this.goalIds,
    required this.levelId,
    required this.languageCode,
    required this.completedAt,
  });

  Map<String, dynamic> toMap() => {
        'goalIds': goalIds,
        'levelId': levelId,
        'languageCode': languageCode,
        'completedAt': completedAt.toIso8601String(),
      };

  factory OnboardingProfile.fromMap(Map<String, dynamic> m) {
    final goals = (m['goalIds'] as List?)?.cast<String>() ?? const <String>[];
    return OnboardingProfile(
      goalIds: goals,
      levelId: (m['levelId'] ?? 'intermediate').toString(),
      languageCode: (m['languageCode'] ?? 'fr').toString(),
      completedAt: DateTime.tryParse((m['completedAt'] ?? '').toString()) ?? DateTime.now(),
    );
  }

  String toJsonString() => jsonEncode(toMap());

  static OnboardingProfile? fromJsonString(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    try {
      return OnboardingProfile.fromMap(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }
}




