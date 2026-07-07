import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../domain/auth_repository.dart';
import '../infrastructure/firebase_auth_repository.dart';

/// =====================================================
/// FIREBASE INSTANCE PROVIDER
/// =====================================================
/// Centralisation Firebase (testable + injectable)
final firebaseAuthProvider = Provider<FirebaseAuth>((ref) => FirebaseAuth.instance);

/// =====================================================
/// AUTH REPOSITORY PROVIDER
/// =====================================================
/// Couche abstraction SaaS (clean architecture)
final authRepositoryProvider = Provider<AuthRepository>((ref) {
final firebase = ref.watch(firebaseAuthProvider);

return FirebaseAuthRepository(firebase);
});

/// =====================================================
/// AUTH STATE STREAM (SOURCE OF TRUTH)
/// =====================================================
/// 👉 utilisé par GoRouter + UI + guards
final authStateProvider = StreamProvider<User?>((ref) {
final repository = ref.watch(authRepositoryProvider);

return repository.authStateChanges().handleError((error) {
throw Exception('Auth stream error: $error');
});
});

/// =====================================================
/// CURRENT USER (SYNC SAFE ACCESS)
/// =====================================================
/// 👉 évite d'attendre le stream pour UI simple
final currentUserProvider = Provider<User?>((ref) {
final repository = ref.read(authRepositoryProvider);
return repository.currentUser();
});

/// =====================================================
/// AUTH LOADING STATE
/// =====================================================
/// 👉 utile pour splash screen / bootstrap
final authLoadingProvider = Provider<bool>((ref) {
final authState = ref.watch(authStateProvider);
return authState.isLoading;
});

/// =====================================================
/// AUTH ERROR STATE
/// =====================================================
/// 👉 debugging production
final authErrorProvider = Provider<String?>((ref) {
final authState = ref.watch(authStateProvider);
return authState.hasError
? authState.error.toString()
: null;
});

