import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('UniMentorAI'),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.go('/profile'), // future-ready
          ),
        ],
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            /// ===============================
            /// HEADER
            /// ===============================
            const Text(
              'Tableau de bord',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 20),

            /// ===============================
            /// QUICK ACTIONS (SAAS STYLE)
            /// ===============================
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [

                _ActionCard(
                  title: 'Cours',
                  icon: Icons.school,
                  onTap: () => context.go('/courses'),
                ),

                _ActionCard(
                  title: 'Premium',
                  icon: Icons.lock,
                  onTap: () => context.go('/paywall'),
                ),

                _ActionCard(
                  title: 'Mentor IA',
                  icon: Icons.smart_toy,
                  onTap: () => context.go('/ai-mentor'),
                ),

                _ActionCard(
                  title: 'Profil',
                  icon: Icons.person,
                  onTap: () => context.go('/profile'),
                ),
              ],
            ),

            const SizedBox(height: 30),

            /// ===============================
            /// STATUS SECTION (future SaaS metrics)
            /// ===============================
            const Text(
              'Activité récente',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 10),

            const Card(
              child: ListTile(
                leading: Icon(Icons.play_circle),
                title: Text('Bienvenue sur UniMentorAI'),
                subtitle: Text('Continue ton apprentissage'),
              ),
            ),
          ],
        ),
      ),
    );
}

/// ===============================
/// REUSABLE DASHBOARD CARD
/// ===============================
class _ActionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: 150,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
        ),
        child: Column(
          children: [
            Icon(icon, size: 30),
            const SizedBox(height: 10),
            Text(title),
          ],
        ),
      ),
    );
}
