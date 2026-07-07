import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AdminControlTowerScreen extends StatelessWidget {
  const AdminControlTowerScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Admin Control Tower'),
        centerTitle: true,
      ),

      body: SingleChildScrollView(
        child: Column(
          children: [

            /// 🔥 KPI DASHBOARD
            Padding(
              padding: const EdgeInsets.all(12),
              child: GridView(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 1.4,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),

                children: const [

                  _KpiCard(
                    title: 'Total Scans',
                    icon: Icons.qr_code,
                    color: Colors.blue,
                  ),

                  _KpiCard(
                    title: 'Fraud Detected',
                    icon: Icons.warning,
                    color: Colors.red,
                  ),

                  _KpiCard(
                    title: 'Certificates',
                    icon: Icons.card_membership,
                    color: Colors.green,
                  ),

                  _KpiCard(
                    title: 'Active Users',
                    icon: Icons.people,
                    color: Colors.orange,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            /// 📊 LIVE SCAN STREAM
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                'Live Scan Activity',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('scan_history')
                  .orderBy('scannedAt', descending: true)
                  .snapshots(),

              builder: (context, snapshot) {

                if (!snapshot.hasData) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                final docs = snapshot.data!.docs;

                return ListView.builder(
                  shrinkWrap: true,
                  physics:
                      const NeverScrollableScrollPhysics(),
                  itemCount: docs.length,
                  itemBuilder: (context, index) {

                    final data = docs[index].data()
                        as Map<String, dynamic>;

                    final isFraud =
                        data['status'] != 'valid';

                    return ListTile(
                      leading: Icon(
                        isFraud
                            ? Icons.dangerous
                            : Icons.verified,
                        color: isFraud
                            ? Colors.red
                            : Colors.green,
                      ),

                      title: Text(
                        data['courseName'] ?? '',
                      ),

                      subtitle: Text(
                        "Cert: ${data['certificateId']}",
                      ),

                      trailing: Text(
                        data['status'] ?? '',
                        style: TextStyle(
                          color: isFraud
                              ? Colors.red
                              : Colors.green,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
}

/// 💎 KPI CARD WIDGET
class _KpiCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;

  const _KpiCard({
    required this.title,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 30),
          const SizedBox(height: 10),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
}




