import 'dart:collection';

import '../models/course_progress.dart';

class CourseProgressService {
  final Map<String, CourseProgress> _progress = {};

  /// KEY FORMAT: userId_courseId
  String _key(String userId, String courseId) =>
      '${userId}_$courseId';

  /// GET progress (safe)
  CourseProgress? getProgress(String userId, String courseId) => _progress[_key(userId, courseId)];

  /// SAVE progress (immutable safe update)
  void saveProgress(CourseProgress progress) {
    final key = _key(progress.userId, progress.courseId);
    _progress[key] = progress;
  }

  /// UPDATE module completion (core logic safe)
  void completeModule({
    required String userId,
    required String courseId,
    required String moduleId,
  }) {
    final key = _key(userId, courseId);
    final current = _progress[key];

    if (current == null) return;

    if (current.completedModules.contains(moduleId)) {
      return;
    }

    final updatedModules = [
      ...current.completedModules,
      moduleId,
    ];

    final updated = current.copyWith(
      completedModules: updatedModules,
      isCompleted:
          updatedModules.length >= current.totalModules,
      lastAccessed: DateTime.now(),
    );

    _progress[key] = updated;
  }

  /// RESET progress
  void reset(String userId, String courseId) {
    _progress.remove(_key(userId, courseId));
  }

  /// CHECK completion
  bool isCompleted(String userId, String courseId) {
    final progress = _progress[_key(userId, courseId)];
    return progress?.isCompleted ?? false;
  }

  /// GLOBAL AVERAGE (safe)
  double getGlobalProgress() {
    if (_progress.isEmpty) return 0.0;

    final total = _progress.values
        .map((e) => e.progress)
        .reduce((a, b) => a + b);

    return total / _progress.length;
  }

  /// IMMUTABLE VIEW (UI SAFE)
  UnmodifiableMapView<String, CourseProgress> get allProgress =>
      UnmodifiableMapView(_progress);
}
