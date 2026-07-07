import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/user_profile.dart';

/// =====================================================
/// USER PROFILE STATE (SOURCE OF TRUTH)
/// =====================================================
/// 👉 synchronisé avec Firestore plus tard
final userProfileProvider =
StateProvider<UserProfile?>((ref) => null);

/// =====================================================
/// RAW PROFILE ACCESS (SYNC SAFE)
/// =====================================================
final currentUserProfileProvider =
Provider<UserProfile?>((ref) => ref.watch(userProfileProvider));

/// =====================================================
/// ONBOARDING STATUS
/// =====================================================
final onboardingCompletedProvider =
Provider<bool>((ref) {
final profile = ref.watch(currentUserProfileProvider);
return profile?.onboardingCompleted ?? false;
});

/// =====================================================
/// EMAIL VERIFIED STATUS
/// =====================================================
final emailVerifiedProvider =
Provider<bool>((ref) {
final profile = ref.watch(currentUserProfileProvider);
return profile?.emailVerified ?? false;
});

/// =====================================================
/// ROLE SYSTEM (RBAC - SaaS READY)
/// =====================================================
final userRoleProvider =
Provider<String>((ref) {
final profile = ref.watch(currentUserProfileProvider);
return profile?.role ?? 'guest';
});

/// =====================================================
/// USER STATE FLAGS (COMPOSITE LOGIC)
/// =====================================================
final isAuthenticatedProvider =
Provider<bool>((ref) {
final profile = ref.watch(currentUserProfileProvider);
return profile != null;
});

final isAdminProvider =
Provider<bool>((ref) {
final profile = ref.watch(currentUserProfileProvider);
return profile?.role == 'admin';
});

