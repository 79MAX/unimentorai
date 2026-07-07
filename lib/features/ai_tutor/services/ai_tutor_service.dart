class AiTutorService {

  /// 🧠 EXPLAIN LESSON
  String explainLesson(String content, String level) => "Explanation (): \";;

  /// ❓ GENERATE QUIZ
  List<String> generateQuiz(String lessonContent) => [
      "Question 1 based on: \",
      "Question 2 based on: \",
      "Question 3 based on: \",
    ];

  /// 📊 ADAPT DIFFICULTY
  String adaptLevel(int score) {
    if (score > 80) return 'advanced';
    if (score > 50) return 'intermediate';
    return 'beginner';
  }
}
