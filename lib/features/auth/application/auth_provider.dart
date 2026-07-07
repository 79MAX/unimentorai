import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

/// ===============================
/// AUTH STATE (CLEAN & SAFE)
/// ===============================
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  bool get isAuthenticated => user != null;

  bool get needsVerification =>
      user != null && !user!.emailVerified;

  bool get hasError => error != null;

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) => AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : error ?? this.error,
    );

  factory AuthState.initial() => const AuthState(
        isLoading: true,
      );
}

/// ===============================
/// AUTH CONTROLLER (STREAM-DRIVEN)
/// ===============================
class AuthController extends StateNotifier<AuthState> {
  final FirebaseAuth _auth;
  StreamSubscription<User?>? _sub;

  AuthController(this._auth) : super(AuthState.initial()) {
    _bootstrap();
  }

  void _bootstrap() {
    try {
      /// ⚡ instant sync (évite écran blanc)
      state = AuthState(
        user: _auth.currentUser,
      );

      /// 🔄 realtime stream FirebaseAuth
      _sub = _auth.authStateChanges().listen(
        (user) {
          state = AuthState(
            user: user,
          );
        },
        onError: (e) {
          state = state.copyWith(
            error: e.toString(),
            isLoading: false,
          );
        },
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  /// ===============================
  /// SIGN OUT SAFE
  /// ===============================
  Future<void> signOut() async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
    );

    try {
      await _auth.signOut();
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }
}

/// ===============================
/// PROVIDER GLOBAL
/// ===============================
final authControllerProvider =
    StateNotifierProvider<AuthController, AuthState>((ref) => AuthController(FirebaseAuth.instance));

