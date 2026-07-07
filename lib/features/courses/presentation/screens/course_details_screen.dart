import 'package:flutter/material.dart';

class CourseDetailsScreen extends StatelessWidget {
  final String title;
  final String description;
  final String imageUrl;
  final String level;
  final num price;

  const CourseDetailsScreen({
    super.key,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.level,
    required this.price,
  });

  @override
  Widget build(BuildContext context) => Scaffold(
      body: CustomScrollView(
        slivers: [

          // 🔵 HERO IMAGE (STYLE UDEMY)
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                title,
                style: const TextStyle(fontSize: 16),
              ),
              background: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) =>
                    const ColoredBox(color: Colors.grey),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  // 🏷 LEVEL + PRICE
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(level.toUpperCase()),
                      ),

                      Text(
                        price == 0 ? 'GRATUIT' : '$price FCFA',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // 📖 DESCRIPTION
                  const Text(
                    'Description',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 10),

                  Text(
                    description,
                    style: const TextStyle(fontSize: 14, height: 1.5),
                  ),

                  const SizedBox(height: 30),

                  // 📊 INFO CARDS
                  const Row(
                    children: [
                      Expanded(
                        child: _InfoCard(
                          icon: Icons.school,
                          label: 'Certificat',
                        ),
                      ),
                      SizedBox(width: 10),
                      Expanded(
                        child: _InfoCard(
                          icon: Icons.access_time,
                          label: 'À ton rythme',
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 40),

                  // 🚀 CTA BUTTON
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                        backgroundColor: Colors.blue,
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Inscription au cours 🚀'),
                          ),
                        );
                      },
                      child: const Text(
                        "S'inscrire au cours",
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoCard({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.blue),
          const SizedBox(height: 5),
          Text(label),
        ],
      ),
    );
}




