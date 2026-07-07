import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('UniMentorAI Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await FirebaseAuth.instance.signOut();
            },
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bienvenue 👋',
              style: Theme.of(context).textTheme.headlineMedium,
            ),

            const SizedBox(height: 10),

            Text(
              user?.email ?? 'Utilisateur',
              style: const TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 30),

            const Text(
              'Modules',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 10),

            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                children: const [
                  _DashboardCard(title: 'Cours', icon: Icons.school),
                  _DashboardCard(title: 'Chatbot IA', icon: Icons.smart_toy),
                  _DashboardCard(title: 'Certificats', icon: Icons.card_membership),
                  _DashboardCard(title: 'Paiements', icon: Icons.payment),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;

  const _DashboardCard({
    required this.title,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) => Card(
      elevation: 3,
      child: InkWell(
        onTap: () {},
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 40),
              const SizedBox(height: 10),
              Text(title),
            ],
          ),
        ),
      ),
    );
}




