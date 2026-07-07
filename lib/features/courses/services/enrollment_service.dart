import 'package:cloud_firestore/cloud_firestore.dart';
import 'models/enrollment_model.dart';

class EnrollmentService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// 🚀 INSCRIPTION À UN COURS
  Future<void> enroll({
    required String userId,
    required String courseId,
  }) async {

    final enrollmentRef = _firestore.collection('enrollments');

    // 🔍 vérifier si déjà inscrit
    final existing = await enrollmentRef
        .where('userId', isEqualTo: userId)
        .where('courseId', isEqualTo: courseId)
        .get();

    if (existing.docs.isNotEmpty) {
      throw Exception('Déjà inscrit à ce cours');
    }

    final enrollment = EnrollmentModel(
      userId: userId,
      courseId: courseId,
    );

    await enrollmentRef.add(enrollment.toMap());
  }

  /// 📚 cours d’un utilisateur
  Stream<QuerySnapshot> getUserEnrollments(String userId) => _firestore
        .collection('enrollments')
        .where('userId', isEqualTo: userId)
        .snapshots();

  /// 📊 progression update
  Future<void> updateProgress({
    required String userId,
    required String courseId,
    required int progress,
  }) async {

    final query = await _firestore
        .collection('enrollments')
        .where('userId', isEqualTo: userId)
        .where('courseId', isEqualTo: courseId)
        .get();

    if (query.docs.isNotEmpty) {
      await query.docs.first.reference.update({
        'progress': progress,
      });
    }
  }
}




