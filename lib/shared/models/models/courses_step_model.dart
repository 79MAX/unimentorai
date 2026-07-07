class CourseStepModel {
  final String id;
  final String title;
  final String content;

  CourseStepModel({
    required this.id,
    required this.title,
    required this.content,
  });

  factory CourseStepModel.fromMap(Map<String, dynamic> map, String docId) => CourseStepModel(
      id: docId,
      title: map['title'] ?? 'Étape sans titre',
      content: map['content'] ?? '',
    );
}




