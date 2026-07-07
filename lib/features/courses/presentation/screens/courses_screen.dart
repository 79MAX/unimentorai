import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/course_model.dart';

class CoursesScreen extends StatelessWidget {
  const CoursesScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Mes cours 🚀')),

      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('courses').snapshots(),

        builder: (context, snapshot) {

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return const Center(
              child: Text('Aucun cours disponible'),
            );
          }

          final courses = snapshot.data!.docs
              .map(CourseModel.fromFirestore)
              .toList();

          return ListView.builder(
            itemCount: courses.length,
            itemBuilder: (context, index) {
              final course = courses[index];

              return Card(
                margin: const EdgeInsets.all(10),
                child: ListTile(
                  leading: course.imageUrl.isNotEmpty
                      ? Image.network(course.imageUrl, width: 50)
                      : const Icon(Icons.school),

                  title: Text(course.title),
                  subtitle: Text(course.description),

                  trailing: Text(
                    course.price == 0 ? 'Free' : '${course.price} FCFA',
                  ),
                ),
              );
            },
          );
        },
      ),
    );
}




