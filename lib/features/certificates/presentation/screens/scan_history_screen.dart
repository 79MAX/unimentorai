import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class ScanHistoryScreen extends StatefulWidget {
  const ScanHistoryScreen({super.key});

  @override
  State<ScanHistoryScreen> createState() =>
      _ScanHistoryScreenState();
}

class _ScanHistoryScreenState
    extends State<ScanHistoryScreen> {

  String filter = 'all';
  String search = '';

  final TextEditingController searchController =
      TextEditingController();

  String get userId =>
      FirebaseAuth.instance.currentUser!.uid;

  /// 📄 EXPORT PDF
  Future<void> exportPDF(List<QueryDocumentSnapshot> docs) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (context) => pw.Column(
            crossAxisAlignment:
                pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                'UniMentorAI Scan Wallet',
                style: const pw.TextStyle(
                    fontSize: 20,
                    fontWeight:
                        pw.FontWeight.bold),
              ),
              pw.SizedBox(height: 20),

              ...docs.map((doc) {
                final data =
                    doc.data() as Map<String, dynamic>;

                return pw.Container(
                  margin:
                      const pw.EdgeInsets.only(bottom: 10),
                  child: pw.Text(
                    "${data['courseName']} - ${data['certificateId']} - ${data['status']}",
                  ),
                );
              }),
            ],
          ),
      ),
    );

    await Printing.layoutPdf(
      onLayout: (format) async => pdf.save(),
    );
  }

  /// 🔍 FILTER LOGIC
  bool matchFilter(Map<String, dynamic> data) {
    final status = data['status'];

    if (filter == 'valid' && status != 'valid') {
      return false;
    }

    if (filter == 'invalid' && status != 'invalid') {
      return false;
    }

    if (search.isNotEmpty) {
      final text = (data['courseName'] ?? '')
              .toString()
              .toLowerCase() +
          (data['certificateId'] ?? '')
              .toString()
              .toLowerCase();

      if (!text.contains(search.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Scan Wallet'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            onPressed: () async {
              final snapshot = await FirebaseFirestore
                  .instance
                  .collection('scan_history')
                  .where('userId', isEqualTo: userId)
                  .get();

              await exportPDF(snapshot.docs);
            },
          )
        ],
      ),

      body: Column(
        children: [

          /// 🔍 SEARCH BAR
          Padding(
            padding: const EdgeInsets.all(10),
            child: TextField(
              controller: searchController,
              decoration: const InputDecoration(
                hintText:
                    'Search certificate or course...',
                border: OutlineInputBorder(),
              ),
              onChanged: (value) {
                setState(() {
                  search = value;
                });
              },
            ),
          ),

          /// 🎛 FILTER BUTTONS
          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceEvenly,
            children: [

              ChoiceChip(
                label: const Text('All'),
                selected: filter == 'all',
                onSelected: (_) {
                  setState(() => filter = 'all');
                },
              ),

              ChoiceChip(
                label: const Text('Valid'),
                selected: filter == 'valid',
                onSelected: (_) {
                  setState(() => filter = 'valid');
                },
              ),

              ChoiceChip(
                label: const Text('Invalid'),
                selected: filter == 'invalid',
                onSelected: (_) {
                  setState(() => filter = 'invalid');
                },
              ),
            ],
          ),

          const SizedBox(height: 10),

          /// 📊 LIST
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('scan_history')
                  .where('userId', isEqualTo: userId)
                  .orderBy('scannedAt',
                      descending: true)
                  .snapshots(),

              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Center(
                      child:
                          CircularProgressIndicator());
                }

                final docs = snapshot.data!.docs;

                final filtered = docs.where((doc) {
                  final data =
                      doc.data() as Map<String, dynamic>;
                  return matchFilter(data);
                }).toList();

                if (filtered.isEmpty) {
                  return const Center(
                    child: Text('No results found'),
                  );
                }

                return ListView.builder(
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final data = filtered[index]
                        .data() as Map<String, dynamic>;

                    final isValid =
                        data['status'] == 'valid';

                    return ListTile(
                      leading: Icon(
                        isValid
                            ? Icons.verified
                            : Icons.error,
                        color: isValid
                            ? Colors.green
                            : Colors.red,
                      ),
                      title:
                          Text(data['courseName'] ?? ''),
                      subtitle: Text(
                          data['certificateId'] ?? ''),
                      trailing: Text(
                        data['status'] ?? '',
                        style: TextStyle(
                          color: isValid
                              ? Colors.green
                              : Colors.red,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
}




