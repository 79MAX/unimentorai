import 'package:cloud_firestore/cloud_firestore.dart';

class EnrollmentModel {
  final String userId;
  final String courseId;
  final int progress;

  EnrollmentModel({
    required this.userId,
    required this.courseId,
    this.progress = 0,
  });

  Map<String, dynamic> toMap() => {
      'userId': userId,
      'courseId': courseId,
      'progress': progress,
      'enrolledAt': FieldValue.serverTimestamp(),
    };
}




