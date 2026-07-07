import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/analytics/analytics_service.dart';

/// Connexion e-mail / mot de passe + Google (Firebase Auth).
class SecureLoginScreen extends StatefulWidget {
  const SecureLoginScreen({super.key});

  @override
  State<SecureLoginScreen> createState() => _SecureLoginScreenState();
}

class _SecureLoginScreenState extends State<SecureLoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _auth = AuthService();
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final user = await _auth.loginWithEmail(_email.text, _password.text);
    setState(() => _loading = false);

    if (user != null) {
      await AnalyticsService.logLoginSuccess();
    } else if (mounted) {
      setState(() => _error = 'Connexion impossible. Vérifiez e-mail et mot de passe.');
    }
  }

  Future<void> _google() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final user = await _auth.signInWithGoogle();
    setState(() => _loading = false);
    if (user != null) {
      await AnalyticsService.logLoginSuccess();
    } else if (mounted) {
      setState(() => _error = 'Connexion Google annulée ou refusée.');
    }
  }

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Connexion')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              autocorrect: false,
              decoration: const InputDecoration(labelText: 'E-mail'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _password,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Mot de passe'),
            ),
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
            ],
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _loading ? null : _login,
              child: _loading
                  ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Se connecter'),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _loading ? null : _google,
              icon: const Icon(Icons.login),
              label: const Text('Continuer avec Google'),
            ),
            TextButton(
              onPressed: _loading ? null : () => context.go('/login'),
              child: const Text('Créer un compte'),
            ),
          ],
        ),
      ),
    );
}
