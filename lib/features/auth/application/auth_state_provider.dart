import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

/// =====================================================
/// AUTH STREAM (SINGLE SOURCE OF TRUTH)
/// =====================================================
final authStateProvider = StreamProvider<User?>((ref) => FirebaseAuth.instance.authStateChanges());

/// =====================================================
/// CURRENT USER (DERIVED FROM STREAM)
/// =====================================================
final currentUserProvider = Provider<User?>((ref) {
  final auth = ref.watch(authStateProvider);

  return auth.when(
    data: (user) => user,
    loading: () => null,
    error: (_, __) => null,
  );
});

/// =====================================================
/// AUTH STATUS (SAFE + REACTIVE)
/// =====================================================
final isLoggedInProvider = Provider<bool>((ref) {
  final auth = ref.watch(authStateProvider);

  return auth.maybeWhen(
    data: (user) => user != null,
    orElse: () => false,
  );
});

/// =====================================================
/// EMAIL VERIFICATION (SAFE)
/// =====================================================
final isEmailVerifiedProvider = Provider<bool>((ref) {
  final auth = ref.watch(authStateProvider);

  return auth.maybeWhen(
    data: (user) => user?.emailVerified ?? false,
    orElse: () => false,
  );
});
