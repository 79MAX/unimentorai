import 'package:flutter/material.dart';

import 'cookie_policy_screen.dart';
// TODO: add later
// import 'privacy_policy_screen.dart';
// import 'terms_of_service_screen.dart';
// import 'refund_policy_screen.dart';

class LegalSettingsScreen extends StatelessWidget {
  const LegalSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('⚖️ Legal Center'),
        centerTitle: true,
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),

        children: [

          /// HEADER
          const Text(
            'Legal & Compliance',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 6),

          const Text(
            'Manage your legal information, privacy settings and platform policies.',
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey,
            ),
          ),

          const SizedBox(height: 20),

          /// 🍪 COOKIE POLICY
          _LegalCard(
            icon: Icons.cookie,
            title: 'Cookie Policy',
            subtitle: 'How we use cookies for AI, analytics & personalization',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const CookiePolicyScreen(),
                ),
              );
            },
          ),

          const SizedBox(height: 12),

          /// 🔐 PRIVACY POLICY
          _LegalCard(
            icon: Icons.privacy_tip,
            title: 'Privacy Policy',
            subtitle: 'How we collect, store and protect your data',
            onTap: () {
              // TODO: connect PrivacyPolicyScreen
            },
          ),

          const SizedBox(height: 12),

          /// 📜 TERMS OF SERVICE
          _LegalCard(
            icon: Icons.description,
            title: 'Terms of Service',
            subtitle: 'Rules and conditions of using UniMentorAI',
            onTap: () {
              // TODO: connect Terms screen
            },
          ),

          const SizedBox(height: 12),

          /// 💸 REFUND POLICY
          _LegalCard(
            icon: Icons.payments,
            title: 'Refund Policy',
            subtitle: 'Payments, refunds and subscription rules',
            onTap: () {
              // TODO: connect Refund screen
            },
          ),

          const SizedBox(height: 30),

          /// FOOTER INFO
          const Center(
            child: Text(
              'UniMentorAI • Legal Compliance System',
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey,
              ),
            ),
          ),
        ],
      ),
    );
}

/// 🧩 REUSABLE CARD (MODERN UI)
class _LegalCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _LegalCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: CircleAvatar(
          child: Icon(icon),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
}