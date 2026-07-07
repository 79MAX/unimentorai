import 'package:cloud_firestore/cloud_firestore.dart';

class CourseProgress {
  final String userId;
  final String courseId;

  /// Modules complétés
  final List<String> completedModules;

  /// Total modules du cours
  final int totalModules;

  /// Dernière activité
  final DateTime lastAccessed;

  /// Statut final
  final bool isCompleted;

  const CourseProgress({
    required this.userId,
    required this.courseId,
    required this.completedModules,
    required this.totalModules,
    required this.lastAccessed,
    required this.isCompleted,
  });

  /// 🔥 Progression normalisée (0 → 1)
  double get progress {
    if (totalModules <= 0) return 0.0;
    return (completedModules.length / totalModules)
        .clamp(0.0, 1.0);
  }

  /// 📊 Progression en %
  double get progressPercent => progress * 100;

  /// 🧠 Factory sécurisée Firestore
  factory CourseProgress.fromMap(Map<String, dynamic> data) => CourseProgress(
      userId: data['userId']?.toString() ?? '',
      courseId: data['courseId']?.toString() ?? '',
      completedModules: (data['completedModules'] as List?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      totalModules: (data['totalModules'] ?? 0) is int
          ? data['totalModules']
          : int.tryParse(data['totalModules'].toString()) ?? 0,
      lastAccessed:
          (data['lastAccessed'] as Timestamp?)?.toDate() ??
              DateTime.now(),
      isCompleted: data['isCompleted'] == true,
    );

  /// 💾 Firestore serialization
  Map<String, dynamic> toMap() => {
      'userId': userId,
      'courseId': courseId,
      'completedModules': completedModules,
      'totalModules': totalModules,
      'lastAccessed': Timestamp.fromDate(lastAccessed),
      'isCompleted': isCompleted,
    };

  /// 🔁 copyWith (optimisé)
  CourseProgress copyWith({
    List<String>? completedModules,
    int? totalModules,
    DateTime? lastAccessed,
    bool? isCompleted,
  }) => CourseProgress(
      userId: userId,
      courseId: courseId,
      completedModules: completedModules ?? this.completedModules,
      totalModules: totalModules ?? this.totalModules,
      lastAccessed: lastAccessed ?? this.lastAccessed,
      isCompleted: isCompleted ?? this.isCompleted,
    );

  /// 🧠 Debug propre (production logging safe)
  @override
  String toString() => 'CourseProgress(userId: $userId, courseId: $courseId, progress: ${progressPercent.toStringAsFixed(1)}%, completed: ${completedModules.length}/$totalModules, isCompleted: $isCompleted)';

  /// ⚡ Equality optimisée (hash stable)
  @override
  bool operator ==(Object other) => identical(this, other) ||
        (other is CourseProgress &&
            other.userId == userId &&
            other.courseId == courseId);

  @override
  int get hashCode => Object.hash(userId, courseId);
}

