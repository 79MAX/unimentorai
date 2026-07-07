import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/analytics/analytics_service.dart';

/// Inscription Firebase (e-mail + mot de passe).
class RegisterPasswordScreen extends StatefulWidget {
  const RegisterPasswordScreen({super.key});

  @override
  State<RegisterPasswordScreen> createState() => _RegisterPasswordScreenState();
}

class _RegisterPasswordScreenState extends State<RegisterPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _pwd1 = TextEditingController();
  final _pwd2 = TextEditingController();
  final _auth = AuthService();
  bool _loading = false;
  String? _error;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    final user = await _auth.signUpWithEmail(_email.text.trim(), _pwd1.text);
    setState(() => _loading = false);
    if (user != null) {
      await AnalyticsService.logLoginSuccess();
    } else if (mounted) {
      setState(() => _error = 'Inscription impossible (e-mail déjà utilisé ou mot de passe trop faible).');
    }
  }

  @override
  void dispose() {
    _email.dispose();
    _pwd1.dispose();
    _pwd2.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Créer un compte')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _email,
                keyboardType: TextInputType.emailAddress,
                autocorrect: false,
                decoration: const InputDecoration(labelText: 'E-mail'),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'E-mail requis';
                  if (!v.contains('@')) return 'E-mail invalide';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _pwd1,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Mot de passe'),
                validator: (v) => (v == null || v.length < 6) ? '6 caractères minimum' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _pwd2,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Confirmer le mot de passe'),
                validator: (v) => v != _pwd1.text ? 'Les mots de passe ne correspondent pas' : null,
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Text('S’inscrire'),
              ),
              TextButton(
                onPressed: _loading ? null : () => context.go('/login'),
                child: const Text('J’ai déjà un compte'),
              ),
            ],
          ),
        ),
      ),
    );
}
