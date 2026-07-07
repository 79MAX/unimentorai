import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ConsentBanner extends StatefulWidget {
  final VoidCallback onAccepted;
  const ConsentBanner({super.key, required this.onAccepted});

  @override
  State<ConsentBanner> createState() => _ConsentBannerState();
}

class _ConsentBannerState extends State<ConsentBanner> {
  bool _visible = false;

  @override
  void initState() {
    super.initState();
    _checkConsent();
  }

  Future<void> _checkConsent() async {
    final prefs = await SharedPreferences.getInstance();
    final consentGiven = prefs.getBool('consent_given') ?? false;
    if (!consentGiven) {
      setState(() => _visible = true);
    }
  }

  Future<void> _acceptConsent() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('consent_given', true);
    setState(() => _visible = false);
    widget.onAccepted();
  }

  @override
  Widget build(BuildContext context) {
    if (!_visible) return const SizedBox.shrink();
    return Material(
      color: Colors.black.withValues(alpha: 0.7),
      child: SafeArea(
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Nous utilisons des cookies et collectons des données pour améliorer votre expérience. En continuant, vous acceptez notre politique de confidentialité.',
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _acceptConsent,
                child: const Text('J’accepte'),
              ),
            ],
          ),
        ),
      ),
    );
  }
} 




