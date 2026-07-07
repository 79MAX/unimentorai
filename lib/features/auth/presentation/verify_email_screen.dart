import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class VerifyEmailScreen extends StatefulWidget {
  const VerifyEmailScreen({super.key});

  @override
  State<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {
  Timer? _timer;

  bool _sending = false;
  bool _checking = false;
  String? _message;

  bool _isVerified = false;

  @override
  void initState() {
    super.initState();
    _startAutoCheck();
  }

  /// ===============================
  /// AUTO CHECK (OPTIMIZED + SAFE)
  /// ===============================
  void _startAutoCheck() {
    _timer = Timer.periodic(const Duration(seconds: 5), (_) {
      _checkEmailVerified();
    });
  }

  Future<void> _checkEmailVerified() async {
    if (_isVerified) return;

    setState(() => _checking = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      await user.reload();

      final refreshedUser = FirebaseAuth.instance.currentUser;

      if (refreshedUser?.emailVerified == true) {
        _isVerified = true;
        _timer?.cancel();

        if (!mounted) return;

        setState(() {
          _message = 'Email vérifié avec succès 🎉';
        });
      }
    } catch (_) {
      // silence safe (no crash UI)
    } finally {
      if (mounted) {
        setState(() => _checking = false);
      }
    }
  }

  /// ===============================
  /// RESEND EMAIL (SAFE + RATE CONTROL)
  /// ===============================
  Future<void> _resendEmail() async {
    if (_sending) return;

    setState(() {
      _sending = true;
      _message = null;
    });

    try {
      final user = FirebaseAuth.instance.currentUser;

      if (user != null && !user.emailVerified) {
        await user.sendEmailVerification();

        setState(() {
          _message = 'Email de vérification envoyé 📩';
        });
      }
    } catch (_) {
      setState(() {
        _message = "Impossible d'envoyer l'email";
      });
    } finally {
      if (mounted) {
        setState(() => _sending = false);
      }
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.mark_email_unread,
                    size: 80,
                    color: Colors.blue,
                  ),

                  const SizedBox(height: 20),

                  const Text(
                    'Vérifie ton email',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    'Un lien de vérification a été envoyé. '
                    'Clique dessus pour activer ton compte UniMentorAI.',
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 20),

                  /// MESSAGE
                  if (_message != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        _message!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.green),
                      ),
                    ),

                  const SizedBox(height: 20),

                  /// LOADING CHECK INDICATOR
                  if (_checking)
                    const Padding(
                      padding: EdgeInsets.only(bottom: 10),
                      child: CircularProgressIndicator(),
                    ),

                  /// RESEND BUTTON
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _sending ? null : _resendEmail,
                      child: _sending
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text("Renvoyer l'email"),
                    ),
                  ),

                  const SizedBox(height: 12),

                  /// MANUAL CHECK
                  TextButton(
                    onPressed: _isVerified ? null : _checkEmailVerified,
                    child: const Text("J'ai déjà vérifié"),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
}
