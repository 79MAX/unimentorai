class AiTutorModel {
  final String question;
  final String answer;
  final String level;

  AiTutorModel({
    required this.question,
    required this.answer,
    required this.level,
  });

  Map<String, dynamic> toMap() => {
      'question': question,
      'answer': answer,
      'level': level,
    };

  factory AiTutorModel.fromMap(Map<String, dynamic> map) => AiTutorModel(
      question: map['question'] ?? '',
      answer: map['answer'] ?? '',
      level: map['level'] ?? 'beginner',
    );
}
