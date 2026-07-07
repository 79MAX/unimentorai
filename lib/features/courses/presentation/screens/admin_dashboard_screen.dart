import 'package:flutter/material.dart';
import '../services/admin_service.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final service = AdminService();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Control Tower'),
        backgroundColor: Colors.black,
      ),

      body: FutureBuilder(
        future: service.getStats(),
        builder: (context, snapshot) {

          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final stats = snapshot.data!;

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [

                _StatCard(
                  title: 'Total Users',
                  value: stats['totalUsers'].toString(),
                ),

                _StatCard(
                  title: 'Admins',
                  value: stats['admins'].toString(),
                ),

                _StatCard(
                  title: 'Students',
                  value: stats['students'].toString(),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;

  const _StatCard({
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) => Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(title),
        trailing: Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
}




