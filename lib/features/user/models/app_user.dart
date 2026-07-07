import 'package:cloud_firestore/cloud_firestore.dart';

class AppUser {
  final String uid;
  final String email;
  final String fullName;
  final String role; // student | admin | mentor
  final bool isPremium;
  final bool onboardingCompleted;
  final DateTime createdAt;

  const AppUser({
    required this.uid,
    required this.email,
    required this.fullName,
    required this.role,
    required this.isPremium,
    required this.onboardingCompleted,
    required this.createdAt,
  });

  factory AppUser.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>?;

    if (data == null) return AppUser.empty(doc.id);

    return AppUser(
      uid: doc.id,
      email: data['email'] ?? '',
      fullName: data['fullName'] ?? '',
      role: data['role'] ?? 'student',
      isPremium: data['isPremium'] ?? false,
      onboardingCompleted: data['onboardingCompleted'] ?? false,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  factory AppUser.empty(String uid) => AppUser(
        uid: uid,
        email: '',
        fullName: '',
        role: 'student',
        isPremium: false,
        onboardingCompleted: false,
        createdAt: DateTime.now(),
      );

  Map<String, dynamic> toMap() => {
        'email': email,
        'fullName': fullName,
        'role': role,
        'isPremium': isPremium,
        'onboardingCompleted': onboardingCompleted,
        'createdAt': createdAt,
      };

  AppUser copyWith({
    String? email,
    String? fullName,
    String? role,
    bool? isPremium,
    bool? onboardingCompleted,
    DateTime? createdAt,
  }) => AppUser(
      uid: uid,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      role: role ?? this.role,
      isPremium: isPremium ?? this.isPremium,
      onboardingCompleted: onboardingCompleted ?? this.onboardingCompleted,
      createdAt: createdAt ?? this.createdAt,
    );
}
