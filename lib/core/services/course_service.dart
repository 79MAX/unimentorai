import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/course_model.dart';
import '../models/translation_model.dart';
import 'security_service.dart';

/// Service de gestion des cours avec traductions intelligentes
class CourseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final SecurityService _securityService = SecurityService();

  /// Recherche un cours et l'ajoute automatiquement s'il n'existe pas
  Future<CourseModel?> searchAndCreateCourse(String query, String language) async {
    try {
      // 1. Rechercher dans Firestore
      final existingCourse = await _searchCourseInFirestore(query, language);
      if (existingCourse != null) {
        return existingCourse;
      }

      // 2. Créer un cours basique
      final newCourse = _createBasicCourse(query, language);
      await _saveCourseToFirestore(newCourse);
      return newCourse;
    } catch (e) {
      return null;
    }
  }

  /// Traduit un cours avec limitation des coûts
  Future<CourseModel?> translateCourse(CourseModel course, String targetLanguage) async {
    try {
      // Vérifier si la traduction existe déjà
      final existingTranslation = await _getExistingTranslation(course.id, targetLanguage);
      if (existingTranslation != null) {
        return _applyTranslationToCourse(course, existingTranslation);
      }

      // Vérifier le nombre de traductions existantes
      final translationCount = await _getTranslationCount(course.id);
      if (translationCount >= 2) {
        throw CourseException('Limite de traductions atteinte (max 2)');
      }

      // Effectuer la traduction basique
      final translation = _performBasicTranslation(course, targetLanguage);
      await _saveTranslationToFirestore(translation);
      return _applyTranslationToCourse(course, translation);
    } catch (e) {
      throw CourseException('Erreur lors de la traduction: $e');
    }
  }

  /// Propose une correction de traduction
  Future<void> proposeTranslationCorrection(
    String courseId,
    String language,
    String originalText,
    String correctedText,
    String userId,
  ) async {
    try {
      final correction = TranslationCorrection(
        id: _generateId(),
        courseId: courseId,
        language: language,
        originalText: originalText,
        correctedText: correctedText,
        proposedBy: userId,
        proposedAt: DateTime.now(),
        votes: 1,
        voters: [userId],
        status: CorrectionStatus.pending,
      );

      await _firestore
          .collection('courses')
          .doc(courseId)
          .collection('translations')
          .doc(language)
          .collection('corrections')
          .doc(correction.id)
          .set(correction.toJson());
    } catch (e) {
      throw CourseException('Erreur lors de la proposition de correction');
    }
  }

  /// Vote pour une correction
  Future<void> voteForCorrection(String correctionId, String courseId, String language, String userId) async {
    try {
      final correctionRef = _firestore
          .collection('courses')
          .doc(courseId)
          .collection('translations')
          .doc(language)
          .collection('corrections')
          .doc(correctionId);

      await _firestore.runTransaction((transaction) async {
        final correctionDoc = await transaction.get(correctionRef);
        if (!correctionDoc.exists) {
          throw CourseException('Correction non trouvée');
        }

        final correction = TranslationCorrection.fromJson(
          correctionDoc.data() as Map<String, dynamic>,
        );

        if (correction.voters.contains(userId)) {
          throw CourseException('Vous avez déjà voté pour cette correction');
        }

        final updatedCorrection = correction.copyWith(
          votes: correction.votes + 1,
          voters: [...correction.voters, userId],
          status: correction.votes + 1 >= 3 ? CorrectionStatus.approved : CorrectionStatus.pending,
        );

        transaction.update(correctionRef, updatedCorrection.toJson());

        // Appliquer la correction si elle est approuvée
        if (updatedCorrection.status == CorrectionStatus.approved) {
          await _applyApprovedCorrection(courseId, language, updatedCorrection);
        }
      });
    } catch (e) {
      throw CourseException('Erreur lors du vote');
    }
  }

  /// Recherche dans Firestore
  Future<CourseModel?> _searchCourseInFirestore(String query, String language) async {
    try {
      final querySnapshot = await _firestore
          .collection('courses')
          .where('title', isGreaterThanOrEqualTo: query)
          .where('title', isLessThanOrEqualTo: '$query\uf8ff')
          .where('language', isEqualTo: language)
          .limit(1)
          .get();

      if (querySnapshot.docs.isNotEmpty) {
        return CourseModel.fromJson(querySnapshot.docs.first.data());
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  /// Crée un cours basique
  CourseModel _createBasicCourse(String title, String language) => CourseModel(
      id: _generateId(),
      title: title,
      description: 'Description du cours $title',
      language: language,
      content: 'Contenu du cours $title en $language',
      steps: [
        CourseStep(
          id: '1',
          title: 'Introduction',
          content: 'Introduction au cours $title',
          order: 1,
          duration: const Duration(minutes: 5),
        ),
        CourseStep(
          id: '2',
          title: 'Développement',
          content: 'Développement du cours $title',
          order: 2,
          duration: const Duration(minutes: 20),
        ),
        CourseStep(
          id: '3',
          title: 'Conclusion',
          content: 'Conclusion du cours $title',
          order: 3,
          duration: const Duration(minutes: 5),
        ),
      ],
      difficulty: CourseDifficulty.beginner,
      duration: const Duration(minutes: 30),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      isPublished: true,
      tags: [title.toLowerCase()],
      authorId: 'system',
      rating: 0.0,
      studentCount: 0,
    );

  /// Effectue une traduction basique
  TranslationModel _performBasicTranslation(CourseModel course, String targetLanguage) => TranslationModel(
      id: _generateId(),
      courseId: course.id,
      language: targetLanguage,
      originalText: course.content,
      translatedText: 'Traduction basique de "${course.content}" en $targetLanguage',
      translatedAt: DateTime.now(),
      translatorId: 'system',
      quality: TranslationQuality.automatic,
      isVerified: false,
    );

  /// Sauvegarde un cours dans Firestore
  Future<void> _saveCourseToFirestore(CourseModel course) async {
    await _firestore.collection('courses').doc(course.id).set(course.toJson());
  }

  /// Sauvegarde une traduction dans Firestore
  Future<void> _saveTranslationToFirestore(TranslationModel translation) async {
    await _firestore
        .collection('courses')
        .doc(translation.courseId)
        .collection('translations')
        .doc(translation.language)
        .set(translation.toJson());
  }

  /// Applique une traduction à un cours
  CourseModel _applyTranslationToCourse(CourseModel course, TranslationModel translation) => course.copyWith(
      content: translation.translatedText,
      language: translation.language,
      updatedAt: DateTime.now(),
    );

  /// Applique une correction approuvée
  Future<void> _applyApprovedCorrection(
    String courseId,
    String language,
    TranslationCorrection correction,
  ) async {
    try {
      await _firestore
          .collection('courses')
          .doc(courseId)
          .collection('translations')
          .doc(language)
          .update({
        'translatedText': correction.correctedText,
        'isVerified': true,
        'lastCorrectionAt': DateTime.now(),
      });
    } catch (e) {
      // Log error but don't throw
    }
  }

  /// Génère un ID unique
  String _generateId() => DateTime.now().millisecondsSinceEpoch.toString();

  /// Récupère une traduction existante
  Future<TranslationModel?> _getExistingTranslation(String courseId, String language) async {
    try {
      final doc = await _firestore
          .collection('courses')
          .doc(courseId)
          .collection('translations')
          .doc(language)
          .get();

      if (doc.exists) {
        return TranslationModel.fromJson(doc.data()!);
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  /// Compte le nombre de traductions
  Future<int> _getTranslationCount(String courseId) async {
    try {
      final snapshot = await _firestore
          .collection('courses')
          .doc(courseId)
          .collection('translations')
          .get();

      return snapshot.docs.length;
    } catch (e) {
      return 0;
    }
  }
}

/// Exception de cours
class CourseException implements Exception {
  final String message;
  CourseException(this.message);

  @override
  String toString() => 'CourseException: $message';
}



