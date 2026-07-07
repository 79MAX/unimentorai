class CourseProgress {
  final String courseId;
  final String userId;
  final int completedModules;
  final int totalModules;
  final DateTime lastAccessed;
  final bool isCompleted;
  final double progress;
  final DateTime updatedAt;

  const CourseProgress({
    required this.courseId,
    required this.userId,
    required this.completedModules,
    required this.totalModules,
    required this.lastAccessed,
    required this.isCompleted,
    required this.progress,
    required this.updatedAt,
  });

  double _calculateProgress(int completed, int total) {
    if (total <= 0) return 0;
    return (completed / total) * 100;
  }

  factory CourseProgress.empty(String courseId, String userId) {
    final now = DateTime.now();

    return CourseProgress(
      courseId: courseId,
      userId: userId,
      completedModules: 0,
      totalModules: 0,
      lastAccessed: now,
      isCompleted: false,
      progress: 0,
      updatedAt: now,
    );
  }

  CourseProgress copyWith({
    int? completedModules,
    int? totalModules,
    DateTime? lastAccessed,
    bool? isCompleted,
  }) {
    final newCompleted = completedModules ?? this.completedModules;
    final newTotal = totalModules ?? this.totalModules;

    return CourseProgress(
      courseId: courseId,
      userId: userId,
      completedModules: newCompleted,
      totalModules: newTotal,
      lastAccessed: lastAccessed ?? this.lastAccessed,
      isCompleted: isCompleted ?? this.isCompleted,
      progress: _calculateProgress(newCompleted, newTotal),
      updatedAt: DateTime.now(),
    );
  }
}
