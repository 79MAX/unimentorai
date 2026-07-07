import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/models/course_progress_model.dart';

class CourseProgressService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  String _docId(String userId, String courseId) =>
      '${userId}_$courseId';

  Future<CourseProgress?> getProgress(
    String userId,
    String courseId,
  ) async {
    final doc = await _db
        .collection('course_progress')
        .doc(_docId(userId, courseId))
        .get();

    if (!doc.exists) return null;

    return CourseProgress.fromMap(doc.data()!);
  }

  Future<void> saveProgress(CourseProgress progress) async {
    await _db
        .collection('course_progress')
        .doc(_docId(progress.userId, progress.courseId))
        .set(progress.toMap());
  }

  Future<double> getCourseProgress(
    String userId,
    String courseId,
  ) async {
    final doc = await _db
        .collection('course_progress')
        .doc(_docId(userId, courseId))
        .get();

    if (!doc.exists) return 0.0;

    return (doc.data()?['progress'] ?? 0.0).toDouble();
  }

  Future<void> saveCourseProgress(
    String userId,
    String courseId,
    double progress,
  ) async {
    await _db
        .collection('course_progress')
        .doc(_docId(userId, courseId))
        .set({
      'userId': userId,
      'courseId': courseId,
      'progress': progress,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }
}

