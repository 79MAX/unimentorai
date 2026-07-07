import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/auth_controller_provider.dart';
import 'login_screen.dart';

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(authControllerProvider);

    return _render(state);
  }

  /// ===============================
  /// DECISION ENGINE (SAFE + SCALABLE)
  /// ===============================
  Widget _render(AuthState state) {
    // 🔄 LOADING STATE (ANTI WHITE SCREEN)
    if (state.isLoading) {
      return const _SafeScaffold(
        child: Center(child: CircularProgressIndicator()),
      );
    }

    // ❌ ERROR STATE (SAFE FALLBACK)
    if (state.hasError) {
      return _SafeScaffold(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: Text(
              state.error ?? 'Une erreur est survenue',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.red),
            ),
          ),
        ),
      );
    }

    final user = state.user;

    // 🔐 NOT AUTHENTICATED
    if (user == null) {
      return const LoginScreen();
    }

    // 📩 EMAIL NOT VERIFIED (SaaS READY EXTENSION)
    if (!user.emailVerified) {
      return const _EmailVerificationScreen();
    }

    // 🚀 AUTHENTICATED
    return const _HomeScreen();
  }
}

/// ===============================
/// SAFE SCAFFOLD WRAPPER (ANTI CRASH UI)
/// ===============================
class _SafeScaffold extends StatelessWidget {
  final Widget child;

  const _SafeScaffold({required this.child});

  @override
  Widget build(BuildContext context) => Scaffold(
      body: SafeArea(child: child),
    );
}

/// ===============================
/// EMAIL VERIFICATION SCREEN
/// ===============================
class _EmailVerificationScreen extends StatelessWidget {
  const _EmailVerificationScreen();

  @override
  Widget build(BuildContext context) => const _SafeScaffold(
      child: Center(
        child: Text(
          'Vérifie ton email pour continuer',
          textAlign: TextAlign.center,
        ),
      ),
    );
}

/// ===============================
/// HOME SCREEN (SAFE PLACEHOLDER)
/// ===============================
class _HomeScreen extends StatelessWidget {
  const _HomeScreen();

  @override
  Widget build(BuildContext context) => const _SafeScaffold(
      child: Center(
        child: Text(
          'HOME - AUTH SUCCESS',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
}
