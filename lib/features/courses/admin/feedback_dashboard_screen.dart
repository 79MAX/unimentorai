import 'dart:io';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

class FeedbackDashboardScreen extends StatefulWidget {
  const FeedbackDashboardScreen({super.key});

  @override
  State<FeedbackDashboardScreen> createState() => _FeedbackDashboardScreenState();
}

class _FeedbackDashboardScreenState extends State<FeedbackDashboardScreen> {
  String? selectedCourseId;
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Feedbacks des cours')),
      body: Column(
        children: [
          FutureBuilder<QuerySnapshot>(
            future: FirebaseFirestore.instance.collection('course_feedback').get(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) return const LinearProgressIndicator();
              final feedbacks = snapshot.data!.docs;
              final courses = feedbacks.map((f) => f['courseId'] as String).toSet().toList();
              final filtered = selectedCourseId == null
                  ? feedbacks
                  : feedbacks.where((f) => f['courseId'] == selectedCourseId).toList();
              final avg = filtered.isEmpty
                  ? 0.0
                  : filtered.map((f) => f['rating'] as int).reduce((a, b) => a + b) / filtered.length;
              return Expanded(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Semantics(
                        label: 'Filtrer les feedbacks par cours',
                        hint: 'Sélectionner un cours pour filtrer les feedbacks',
                        child: DropdownButton<String>(
                          value: selectedCourseId,
                          hint: Text('Filtrer par cours', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                          items: [
                            DropdownMenuItem(child: Text('Tous les cours', textScaleFactor: MediaQuery.of(context).textScaleFactor)),
                            ...courses.map((c) => DropdownMenuItem(value: c, child: Text(c, textScaleFactor: MediaQuery.of(context).textScaleFactor))),
                          ],
                          onChanged: (v) => setState(() => selectedCourseId = v),
                        ),
                      ),
                    ),
                    Semantics(
                      label: 'Bouton exporter en CSV',
                      hint: 'Exporter les feedbacks filtrés au format CSV',
                      button: true,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.download),
                        label: Text('Exporter en CSV', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                        onPressed: () async {
                          final rows = <String>['courseId,userId,rating,comment,lang,createdAt'];
                          for (final f in filtered) {
                            final createdAt = f['createdAt'] != null
                                ? (f['createdAt'] as Timestamp).toDate().toIso8601String()
                                : '';
                            rows.add([
                              f['courseId'],
                              f['userId'],
                              f['rating'].toString(),
                              '"${(f['comment'] as String).replaceAll('"', '""')}"',
                              f['lang'],
                              createdAt
                            ].join(','));
                          }
                          final csv = rows.join('\n');
                          final dir = await getTemporaryDirectory();
                          final file = File('${dir.path}/feedback_export.csv');
                          await file.writeAsString(csv);
                          await Share.shareXFiles([XFile(file.path)], text: 'Export feedbacks UniMentorAI');
                        },
                      ),
                    ),
                    Semantics(
                      label: 'Note moyenne',
                      hint: 'Note moyenne des feedbacks filtrés',
                      child: Text(
                        'Note moyenne : ${avg.toStringAsFixed(2)} / 5',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                        textScaleFactor: MediaQuery.of(context).textScaleFactor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: ListView.builder(
                        itemCount: filtered.length,
                        itemBuilder: (context, i) {
                          final f = filtered[i];
                          return Semantics(
                            label: 'Feedback du cours ${f['courseId']}',
                            hint: 'Note ${f['rating']}, commentaire, langue ${f['lang']}, utilisateur ${f['userId']}, date',
                            child: Card(
                              margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                              child: ListTile(
                                leading: const Icon(Icons.star, color: Colors.amber),
                                title: Text('Cours : ${f['courseId']}', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Note : ${f['rating']}', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                                    if ((f['comment'] as String).isNotEmpty)
                                      Text('Commentaire : ${f['comment']}', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                                    Text('Langue : ${f['lang']}', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                                    Text('Utilisateur : ${f['userId']}', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                                  ],
                                ),
                                trailing: Text(
                                  f['createdAt'] != null ? (f['createdAt'] as Timestamp).toDate().toString().split(' ').first : '',
                                  textScaleFactor: MediaQuery.of(context).textScaleFactor,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
} 
 
 




