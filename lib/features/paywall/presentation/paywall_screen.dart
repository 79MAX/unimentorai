import 'package:flutter/material.dart';

/// ===============================
/// PAYWALL SAAS (PRODUCTION READY)
/// ===============================
/// 👉 Stripe + Mobile Money ready
/// 👉 UX clean type Netflix / Coursera
class PaywallScreen extends StatelessWidget {
  const PaywallScreen({super.key});

  static const String _title = 'UniMentorAI Premium';
  static const String _desc =
      'Débloque tous les cours, certificats et mentors IA.';

  void _payWithStripe() {
    debugPrint('💳 Stripe checkout lancé');
    // TODO: ouvrir Stripe Checkout URL backend
  }

  void _payWithMobileMoney(String provider) {
    debugPrint('📱 Mobile Money: $provider');
    // TODO: call backend API (MTN / Orange / Moov)
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Column(
                children: [

                  const Icon(Icons.lock, size: 80, color: Colors.blue),

                  const SizedBox(height: 16),

                  Text(
                    _title,
                    textAlign: TextAlign.center,
                    style: Theme.of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    _desc,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 15),
                  ),

                  const SizedBox(height: 24),

                  /// ===============================
                  /// STRIPE PLAN
                  /// ===============================
                  _PlanCard(
                    title: 'Premium International',
                    price: '9.99€ / mois',
                    icon: Icons.public,
                    onTap: _payWithStripe,
                  ),

                  const SizedBox(height: 20),

                  /// MOBILE MONEY TITLE
                  const Text(
                    'Paiements locaux (Afrique)',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 10),

                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _MMButton(
                        label: 'MTN MoMo',
                        onTap: () => _payWithMobileMoney('MTN'),
                      ),
                      _MMButton(
                        label: 'Orange Money',
                        onTap: () => _payWithMobileMoney('Orange'),
                      ),
                      _MMButton(
                        label: 'Moov Money',
                        onTap: () => _payWithMobileMoney('Moov'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 25),

                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Plus tard'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
}

/// ===============================
/// PLAN CARD (STRIPE)
/// ===============================
class _PlanCard extends StatelessWidget {
  final String title;
  final String price;
  final IconData icon;
  final VoidCallback onTap;

  const _PlanCard({
    required this.title,
    required this.price,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.blue),
          ),
          child: Row(
            children: [
              Icon(icon, color: Colors.blue),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(price),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 14),
            ],
          ),
        ),
      ),
    );
}

/// ===============================
/// MOBILE MONEY BUTTON
/// ===============================
class _MMButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _MMButton({
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => ElevatedButton(
      onPressed: onTap,
      child: Text(label),
    );
}
