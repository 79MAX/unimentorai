class CourseProgress {
  final String courseId;
  final double progress;
  final DateTime updatedAt;

  CourseProgress({
    required this.courseId,
    required this.progress,
    required this.updatedAt,
  }) : assert(progress >= 0 && progress <= 100,
            'Progress must be between 0 and 100');

  /// Copie avec modification partielle (très utile UI)
  CourseProgress copyWith({
    String? courseId,
    double? progress,
    DateTime? updatedAt,
  }) => CourseProgress(
      courseId: courseId ?? this.courseId,
      progress: progress ?? this.progress,
      updatedAt: updatedAt ?? this.updatedAt,
    );

  /// JSON → Model (robuste)
  factory CourseProgress.fromJson(Map<String, dynamic> json) => CourseProgress(
      courseId: json['courseId'] ?? '',
      progress: (json['progress'] ?? 0).toDouble(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : DateTime.now(),
    );

  /// Model → JSON
  Map<String, dynamic> toJson() => {
        'courseId': courseId,
        'progress': progress,
        'updatedAt': updatedAt.toIso8601String(),
      };

  /// Vérifie si terminé
  bool get isCompleted => progress >= 100;

  /// Vérifie si en cours
  bool get isInProgress => progress > 0 && progress < 100;

  /// Objet vide safe (utile fallback UI)
  factory CourseProgress.empty(String courseId) => CourseProgress(
      courseId: courseId,
      progress: 0,
      updatedAt: DateTime.now(),
    );
}
