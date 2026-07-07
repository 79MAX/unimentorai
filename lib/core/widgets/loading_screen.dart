import 'package:flutter/material.dart';

/// ===============================
/// GLOBAL LOADING SCREEN (SAAS READY PRO)
/// ===============================
/// 👉 Utilisable partout (Auth, API, Firebase, Init)
/// 👉 Anti écran blanc
/// 👉 UX propre et scalable
class LoadingScreen extends StatelessWidget {
  final String message;

  const LoadingScreen({
    super.key,
    this.message = 'Chargement en cours...',
  });

  @override
  Widget build(BuildContext context) => Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 320),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const _Spinner(),
              const SizedBox(height: 18),
              _LoadingText(message: message),
            ],
          ),
        ),
      ),
    );
}

/// ===============================
/// SPINNER
/// ===============================
class _Spinner extends StatelessWidget {
  const _Spinner();

  @override
  Widget build(BuildContext context) => const SizedBox(
      width: 44,
      height: 44,
      child: CircularProgressIndicator(
        strokeWidth: 3,
      ),
    );
}

/// ===============================
/// LOADING TEXT (DYNAMIC + SAFE)
/// ===============================
class _LoadingText extends StatelessWidget {
  final String message;

  const _LoadingText({
    required this.message,
  });

  @override
  Widget build(BuildContext context) => Text(
      message,
      textAlign: TextAlign.center,
      style: const TextStyle(
        fontSize: 14,
        color: Colors.grey,
        fontWeight: FontWeight.w500,
      ),
    );
}
