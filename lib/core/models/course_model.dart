/// Modèle de cours optimisé et fonctionnel
class CourseModel {
  final String id;
  final String title;
  final String description;
  final String language;
  final String content;
  final List<CourseStep> steps;
  final CourseDifficulty difficulty;
  final Duration duration;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isPublished;
  final List<String> tags;
  final String authorId;
  /// `null` = catalogue global B2C ; sinon cours rattaché à une organisation B2B.
  final String? organizationId;
  final double rating;
  final int studentCount;
  final String? thumbnailUrl;
  final String? videoUrl;
  final Map<String, dynamic>? metadata;
  final CourseProgress? userProgress;

  const CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.language,
    required this.content,
    required this.steps,
    required this.difficulty,
    required this.duration,
    required this.createdAt,
    required this.updatedAt,
    required this.isPublished,
    required this.tags,
    required this.authorId,
    this.organizationId,
    required this.rating,
    required this.studentCount,
    this.thumbnailUrl,
    this.videoUrl,
    this.metadata,
    this.userProgress,
  });

  factory CourseModel.fromJson(Map<String, dynamic> json) => CourseModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      language: json['language'] ?? 'fr',
      content: json['content'] ?? '',
      steps: (json['steps'] as List<dynamic>?)
          ?.map((step) => CourseStep.fromJson(step))
          .toList() ?? [],
      difficulty: CourseDifficulty.values.firstWhere(
        (e) => e.name == json['difficulty'],
        orElse: () => CourseDifficulty.beginner,
      ),
      duration: Duration(minutes: json['duration'] ?? 30),
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt']) 
          : DateTime.now(),
      isPublished: json['isPublished'] ?? true,
      tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
      authorId: json['authorId'] ?? '',
      organizationId: json['organizationId'] is String ? json['organizationId'] as String : null,
      rating: (json['rating'] ?? 0.0).toDouble(),
      studentCount: json['studentCount'] ?? 0,
      thumbnailUrl: json['thumbnailUrl'],
      videoUrl: json['videoUrl'],
      metadata: json['metadata'],
      userProgress: json['userProgress'] != null 
          ? CourseProgress.fromJson(json['userProgress']) 
          : null,
    );

  Map<String, dynamic> toJson() => {
      'id': id,
      'title': title,
      'description': description,
      'language': language,
      'content': content,
      'steps': steps.map((step) => step.toJson()).toList(),
      'difficulty': difficulty.name,
      'duration': duration.inMinutes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isPublished': isPublished,
      'tags': tags,
      'authorId': authorId,
      if (organizationId != null) 'organizationId': organizationId,
      'rating': rating,
      'studentCount': studentCount,
      'thumbnailUrl': thumbnailUrl,
      'videoUrl': videoUrl,
      'metadata': metadata,
      'userProgress': userProgress?.toJson(),
    };

  // Méthodes utilitaires
  bool get isCompleted => userProgress?.isCompleted ?? false;
  double get progressPercentage => userProgress?.progressPercentage ?? 0.0;
  Duration get remainingDuration => Duration(
    milliseconds: duration.inMilliseconds - (userProgress?.completedDuration.inMilliseconds ?? 0),
  );

  CourseModel copyWith({
    String? id,
    String? title,
    String? description,
    String? language,
    String? content,
    List<CourseStep>? steps,
    CourseDifficulty? difficulty,
    Duration? duration,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isPublished,
    List<String>? tags,
    String? authorId,
    String? organizationId,
    double? rating,
    int? studentCount,
    String? thumbnailUrl,
    String? videoUrl,
    Map<String, dynamic>? metadata,
    CourseProgress? userProgress,
  }) => CourseModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      language: language ?? this.language,
      content: content ?? this.content,
      steps: steps ?? this.steps,
      difficulty: difficulty ?? this.difficulty,
      duration: duration ?? this.duration,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isPublished: isPublished ?? this.isPublished,
      tags: tags ?? this.tags,
      authorId: authorId ?? this.authorId,
      organizationId: organizationId ?? this.organizationId,
      rating: rating ?? this.rating,
      studentCount: studentCount ?? this.studentCount,
      thumbnailUrl: thumbnailUrl ?? this.thumbnailUrl,
      videoUrl: videoUrl ?? this.videoUrl,
      metadata: metadata ?? this.metadata,
      userProgress: userProgress ?? this.userProgress,
    );

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CourseModel &&
        other.id == id &&
        other.title == title &&
        other.language == language;
  }

  @override
  int get hashCode => id.hashCode ^ title.hashCode ^ language.hashCode;
}

/// Étape d'un cours
class CourseStep {
  final String id;
  final String title;
  final String content;
  final int order;
  final Duration duration;
  final String? videoUrl;
  final String? audioUrl;
  final List<String>? resources;
  final Map<String, dynamic>? metadata;
  final bool? isCompleted;
  final DateTime? completedAt;

  const CourseStep({
    required this.id,
    required this.title,
    required this.content,
    required this.order,
    required this.duration,
    this.videoUrl,
    this.audioUrl,
    this.resources,
    this.metadata,
    this.isCompleted,
    this.completedAt,
  });

  factory CourseStep.fromJson(Map<String, dynamic> json) => CourseStep(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      order: json['order'] ?? 0,
      duration: Duration(minutes: json['duration'] ?? 5),
      videoUrl: json['videoUrl'],
      audioUrl: json['audioUrl'],
      resources: (json['resources'] as List<dynamic>?)?.cast<String>(),
      metadata: json['metadata'],
      isCompleted: json['isCompleted'],
      completedAt: json['completedAt'] != null 
          ? DateTime.parse(json['completedAt']) 
          : null,
    );

  Map<String, dynamic> toJson() => {
      'id': id,
      'title': title,
      'content': content,
      'order': order,
      'duration': duration.inMinutes,
      'videoUrl': videoUrl,
      'audioUrl': audioUrl,
      'resources': resources,
      'metadata': metadata,
      'isCompleted': isCompleted,
      'completedAt': completedAt?.toIso8601String(),
    };

  CourseStep copyWith({
    String? id,
    String? title,
    String? content,
    int? order,
    Duration? duration,
    String? videoUrl,
    String? audioUrl,
    List<String>? resources,
    Map<String, dynamic>? metadata,
    bool? isCompleted,
    DateTime? completedAt,
  }) => CourseStep(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      order: order ?? this.order,
      duration: duration ?? this.duration,
      videoUrl: videoUrl ?? this.videoUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      resources: resources ?? this.resources,
      metadata: metadata ?? this.metadata,
      isCompleted: isCompleted ?? this.isCompleted,
      completedAt: completedAt ?? this.completedAt,
    );
}

/// Progression d'un cours
class CourseProgress {
  final String userId;
  final String courseId;
  final List<String> completedSteps;
  final Duration completedDuration;
  final DateTime startedAt;
  final DateTime? completedAt;
  final Map<String, dynamic>? stepProgress;

  const CourseProgress({
    required this.userId,
    required this.courseId,
    required this.completedSteps,
    required this.completedDuration,
    required this.startedAt,
    this.completedAt,
    this.stepProgress,
  });

  factory CourseProgress.fromJson(Map<String, dynamic> json) => CourseProgress(
      userId: json['userId'] ?? '',
      courseId: json['courseId'] ?? '',
      completedSteps: (json['completedSteps'] as List<dynamic>?)?.cast<String>() ?? [],
      completedDuration: Duration(minutes: json['completedDuration'] ?? 0),
      startedAt: json['startedAt'] != null 
          ? DateTime.parse(json['startedAt']) 
          : DateTime.now(),
      completedAt: json['completedAt'] != null 
          ? DateTime.parse(json['completedAt']) 
          : null,
      stepProgress: json['stepProgress'],
    );

  Map<String, dynamic> toJson() => {
      'userId': userId,
      'courseId': courseId,
      'completedSteps': completedSteps,
      'completedDuration': completedDuration.inMinutes,
      'startedAt': startedAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'stepProgress': stepProgress,
    };

  bool get isCompleted => completedAt != null;
  double get progressPercentage {
    if (stepProgress == null) return 0.0;
    final totalSteps = stepProgress!.length;
    if (totalSteps == 0) return 0.0;
    return completedSteps.length / totalSteps;
  }

  CourseProgress copyWith({
    String? userId,
    String? courseId,
    List<String>? completedSteps,
    Duration? completedDuration,
    DateTime? startedAt,
    DateTime? completedAt,
    Map<String, dynamic>? stepProgress,
  }) => CourseProgress(
      userId: userId ?? this.userId,
      courseId: courseId ?? this.courseId,
      completedSteps: completedSteps ?? this.completedSteps,
      completedDuration: completedDuration ?? this.completedDuration,
      startedAt: startedAt ?? this.startedAt,
      completedAt: completedAt ?? this.completedAt,
      stepProgress: stepProgress ?? this.stepProgress,
    );
}

/// Difficulté d'un cours
enum CourseDifficulty {
  beginner,
  intermediate,
  advanced,
  expert,
}

