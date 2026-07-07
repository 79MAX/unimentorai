import 'package:flutter/material.dart';
import 'auth_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final AuthService authService = AuthService();

  bool isLoading = false;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> register() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (!_validateInputs(email, password)) return;

    setState(() => isLoading = true);

    try {
      await authService.register(
        email: email,
        password: password,
        name: _extractName(email),
      );

      if (!mounted) return;

      _showMessage('Compte créé 🚀');

      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      _showMessage('Erreur: ${_formatError(e)}');
    } finally {
      if (mounted) {
        setState(() => isLoading = false);
      }
    }
  }

  bool _validateInputs(String email, String password) {
    if (email.isEmpty || password.isEmpty) {
      _showMessage('Veuillez remplir tous les champs');
      return false;
    }

    if (!email.contains('@')) {
      _showMessage('Email invalide');
      return false;
    }

    if (password.length < 6) {
      _showMessage('Mot de passe trop court (min 6 caractères)');
      return false;
    }

    return true;
  }

  String _extractName(String email) => email.split('@').first;

  String _formatError(Object e) {
    final message = e.toString();

    if (message.contains('email-already-in-use')) {
      return 'Email déjà utilisé';
    }
    if (message.contains('weak-password')) {
      return 'Mot de passe trop faible';
    }
    if (message.contains('invalid-email')) {
      return 'Email invalide';
    }

    return 'Erreur inconnue';
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Créer un compte'),
        centerTitle: true,
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 12),

            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Mot de passe',
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: isLoading ? null : register,
                child: isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Créer compte'),
              ),
            ),
          ],
        ),
      ),
    );
}