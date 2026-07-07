class CourseModel {
  final String id;
  final String title;
  final String description;
  final String category;
  final String level; // beginner | intermediate | advanced
  final bool isPremium;
  final String language;
  final List<String> lessons;

  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.level,
    required this.isPremium,
    required this.language,
    required this.lessons,
  });

  factory CourseModel.fromMap(String id, Map<String, dynamic> data) => CourseModel(
      id: id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      category: data['category'] ?? '',
      level: data['level'] ?? 'beginner',
      isPremium: data['isPremium'] ?? false,
      language: data['language'] ?? 'en',
      lessons: List<String>.from(data['lessons'] ?? []),
    );

  Map<String, dynamic> toMap() => {
      'title': title,
      'description': description,
      'category': category,
      'level': level,
      'isPremium': isPremium,
      'language': language,
      'lessons': lessons,
    };
}
