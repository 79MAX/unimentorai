import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class CourseStructureOverview extends StatefulWidget {
  const CourseStructureOverview({super.key});

  @override
  State<CourseStructureOverview> createState() => _CourseStructureOverviewState();
}

class _CourseStructureOverviewState extends State<CourseStructureOverview> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Map<String, dynamic>>> fetchCoursesAndModules() async {
    final List<Map<String, dynamic>> overview = [];

    final QuerySnapshot coursesSnapshot = await _firestore.collection('courses').get();

    for (final courseDoc in coursesSnapshot.docs) {
      final String courseId = courseDoc.id;
      final Map<String, dynamic> courseData = courseDoc.data() as Map<String, dynamic>;

      final QuerySnapshot modulesSnapshot = await _firestore
          .collection('courses')
          .doc(courseId)
          .collection('modules')
          .get();

      final List<Map<String, dynamic>> modules = modulesSnapshot.docs.map((modDoc) => {
          'moduleId': modDoc.id,
          'moduleData': modDoc.data(),
        }).toList();

      overview.add({
        'courseId': courseId,
        'courseData': courseData,
        'modules': modules,
      });
    }

    return overview;
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Structure des Cours')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: fetchCoursesAndModules(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Erreur : ${snapshot.error}'));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('Aucun cours trouvé.'));
          }

          final data = snapshot.data!;
          return ListView.builder(
            itemCount: data.length,
            itemBuilder: (context, index) {
              final course = data[index];
              return ExpansionTile(
                title: Text(course['courseData']['title'] ?? 'Cours sans titre'),
                subtitle: Text('ID : ${course['courseId']}'),
                children: (course['modules'] as List).map<Widget>((mod) => ListTile(
                    title: Text(mod['moduleData']['title'] ?? 'Module sans titre'),
                    subtitle: Text('ID : ${mod['moduleId']}'),
                  )).toList(),
              );
            },
          );
        },
      ),
    );
}




