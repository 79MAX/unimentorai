import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

/// ===============================
/// AUTH STATUS (CLEAN STATE MACHINE)
/// ===============================
enum AuthStatus {
  loading,
  authenticated,
  unauthenticated,
  error,
}

/// ===============================
/// AUTH STATE
/// ===============================
class AuthState {
  final User? user;
  final AuthStatus status;
  final String? error;

  const AuthState({
    this.user,
    this.status = AuthStatus.loading,
    this.error,
  });

  bool get isLoading => status == AuthStatus.loading;
  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isUnauthenticated => status == AuthStatus.unauthenticated;
  bool get hasError => status == AuthStatus.error;

  bool get needsVerification =>
      user != null && !user!.emailVerified;

  AuthState copyWith({
    User? user,
    AuthStatus? status,
    String? error,
    bool clearError = false,
  }) => AuthState(
      user: user ?? this.user,
      status: status ?? this.status,
      error: clearError ? null : error ?? this.error,
    );

  factory AuthState.initial() => const AuthState(
        
      );
}

/// ===============================
/// AUTH CONTROLLER (ROBUST)
/// ===============================
class AuthController extends StateNotifier<AuthState> {
  final FirebaseAuth _auth;
  StreamSubscription<User?>? _sub;

  AuthController(this._auth) : super(AuthState.initial()) {
    _init();
  }

  void _init() {
    try {
      final currentUser = _auth.currentUser;

      // instant sync (cache Firebase)
      state = AuthState(
        user: currentUser,
        status: currentUser == null
            ? AuthStatus.unauthenticated
            : AuthStatus.authenticated,
      );

      // realtime listener
      _sub = _auth.authStateChanges().listen(
        (user) {
          state = AuthState(
            user: user,
            status: user == null
                ? AuthStatus.unauthenticated
                : AuthStatus.authenticated,
          );
        },
        onError: (e) {
          state = AuthState(
            status: AuthStatus.error,
            error: e.toString(),
          );
        },
      );
    } catch (e) {
      state = AuthState(
        status: AuthStatus.error,
        error: e.toString(),
      );
    }
  }

  /// ===============================
  /// SIGN OUT (SAFE)
  /// ===============================
  Future<void> signOut() async {
    try {
      state = state.copyWith(
        status: AuthStatus.loading,
        clearError: true,
      );

      await _auth.signOut();

      state = const AuthState(
        status: AuthStatus.unauthenticated,
      );
    } catch (e) {
      state = AuthState(
        user: state.user,
        status: AuthStatus.error,
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
/// PROVIDER
/// ===============================
final authControllerProvider =
    StateNotifierProvider<AuthController, AuthState>((ref) => AuthController(FirebaseAuth.instance));
