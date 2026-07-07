class ProgressModel {
  final String userId;
  final String courseId;
  final int completedLessons;
  final double progress; // 0 - 1

  ProgressModel({
    required this.userId,
    required this.courseId,
    required this.completedLessons,
    required this.progress,
  });

  factory ProgressModel.fromMap(Map<String, dynamic> data) => ProgressModel(
      userId: data['userId'] ?? '',
      courseId: data['courseId'] ?? '',
      completedLessons: data['completedLessons'] ?? 0,
      progress: (data['progress'] ?? 0).toDouble(),
    );

  Map<String, dynamic> toMap() => {
      'userId': userId,
      'courseId': courseId,
      'completedLessons': completedLessons,
      'progress': progress,
    };
}
