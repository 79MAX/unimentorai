import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:csv/csv.dart';

class SubscriptionsAdminScreen extends StatefulWidget {
  const SubscriptionsAdminScreen({super.key});

  @override
  State<SubscriptionsAdminScreen> createState() => _SubscriptionsAdminScreenState();
}

class _SubscriptionsAdminScreenState extends State<SubscriptionsAdminScreen> {
  String? filterSegment;
  String? filterStatus;
  String? filterEmail;
  DateTime? filterDate;
  List<QueryDocumentSnapshot> subscriptions = [];
  bool loading = true;
  bool isAdmin = true; // TODO: brancher auth admin

  @override
  void initState() {
    super.initState();
    _fetchSubscriptions();
  }

  Future<void> _fetchSubscriptions() async {
    setState(() { loading = true; });
    Query query = FirebaseFirestore.instance.collection('subscriptions');
    if (filterSegment != null && filterSegment!.isNotEmpty) {
      query = query.where('segment', isEqualTo: filterSegment);
    }
    if (filterEmail != null && filterEmail!.isNotEmpty) {
      query = query.where('email', isEqualTo: filterEmail);
    }
    // TODO: filterStatus, filterDate
    final snap = await query.get();
    setState(() {
      subscriptions = snap.docs;
      loading = false;
    });
  }

  Future<void> _exportCSV() async {
    final rows = [
      ['Email', 'Segment', 'Tier', 'Users', 'Region', 'Addons', 'URL', 'Date'],
      ...subscriptions.map((s) => [
        s['email'], s['segment'], s['tier'], s['users'], s['region'], (s['addons'] as List).join(','), s['url'], s['createdAt']?.toDate().toString() ?? ''
      ])
    ];
    final csv = const ListToCsvConverter().convert(rows);
    // Pour le web, proposer le téléchargement, sinon sauvegarder localement
    // (ici, debug uniquement ; en prod utiliser un partage de fichier)
    debugPrint(csv);
  }

  Future<void> _deleteSubscription(String id) async {
    await FirebaseFirestore.instance.collection('subscriptions').doc(id).delete();
    _fetchSubscriptions();
  }

  @override
  Widget build(BuildContext context) {
    if (!isAdmin) {
      return const Scaffold(body: Center(child: Text('Accès réservé aux administrateurs.')));
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Admin – Souscriptions & Factures'), actions: [
        IconButton(
          icon: const Icon(Icons.refresh),
          onPressed: _fetchSubscriptions,
          tooltip: 'Rafraîchir',
        ),
        IconButton(
          icon: const Icon(Icons.download),
          onPressed: _exportCSV,
          tooltip: 'Exporter CSV',
        ),
      ]),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      DropdownButton<String>(
                        value: filterSegment,
                        hint: const Text('Segment'),
                        items: const [
                          DropdownMenuItem(value: 'schools', child: Text('Écoles')),
                          DropdownMenuItem(value: 'enterprises', child: Text('Entreprises')),
                          DropdownMenuItem(value: 'ngos', child: Text('ONG')),
                        ],
                        onChanged: (v) => setState(() { filterSegment = v; _fetchSubscriptions(); }),
                      ),
                      SizedBox(
                        width: 200,
                        child: TextField(
                          decoration: const InputDecoration(labelText: 'Email'),
                          onChanged: (v) { filterEmail = v; },
                          onSubmitted: (_) => _fetchSubscriptions(),
                        ),
                      ),
                      // TODO: filtre statut/date
                    ],
                  ),
                ),
                Expanded(
                  child: ListView.separated(
                    itemCount: subscriptions.length,
                    separatorBuilder: (_, __) => const Divider(),
                    itemBuilder: (context, i) {
                      final s = subscriptions[i];
                      return ListTile(
                        title: Text('${s['email']} – ${s['segment']} / ${s['tier']}'),
                        subtitle: Text('Utilisateurs: ${s['users']} | Région: ${s['region']} | ${s['createdAt']?.toDate().toString() ?? ''}'),
                        trailing: Wrap(
                          spacing: 8,
                          children: [
                            if (s['url'] != null)
                              IconButton(
                                icon: const Icon(Icons.picture_as_pdf),
                                tooltip: 'Voir la facture',
                                onPressed: () => launchUrl(Uri.parse(s['url'])),
                              ),
                            IconButton(
                              icon: const Icon(Icons.delete),
                              tooltip: 'Supprimer',
                              onPressed: () => _deleteSubscription(s.id),
                            ),
                          ],
                        ),
                        isThreeLine: true,
                        onTap: () {},
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }
} 




