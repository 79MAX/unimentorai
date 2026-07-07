import 'package:flutter/material.dart';

/// ===============================
/// MODEL (TYPE SAFE - IMPORTANT POUR SCALE)
/// ===============================
class QuizQuestion {
  final String question;
  final List<String> options;
  final String answer;

  const QuizQuestion({
    required this.question,
    required this.options,
    required this.answer,
  });
}

/// ===============================
/// QUIZ SCREEN
/// ===============================
class QuizScreen extends StatefulWidget {
  final String courseId;
  final String? quizId;

  const QuizScreen({
    super.key,
    required this.courseId,
    this.quizId,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

/// ===============================
/// STATE
/// ===============================
class _QuizScreenState extends State<QuizScreen> {
  int currentIndex = 0;
  int score = 0;
  bool isLoading = false;

  final List<QuizQuestion> questions = const [
    QuizQuestion(
      question: 'Quelle est la bonne réponse ?',
      options: ['A', 'B', 'C', 'D'],
      answer: 'B',
    ),
    QuizQuestion(
      question: 'Flutter est développé par ?',
      options: ['Google', 'Apple', 'Meta', 'Microsoft'],
      answer: 'Google',
    ),
  ];

  void _selectAnswer(String selected) {
    final currentQuestion = questions[currentIndex];

    if (selected == currentQuestion.answer) {
      score++;
    }

    final isLast = currentIndex == questions.length - 1;

    if (!isLast) {
      setState(() {
        currentIndex++;
      });
    } else {
      _finishQuiz();
    }
  }

  Future<void> _finishQuiz() async {
    setState(() => isLoading = true);

    try {
      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      setState(() => isLoading = false);

      _showResultDialog();
    } catch (_) {
      if (!mounted) return;
      setState(() => isLoading = false);
    }
  }

  void _showResultDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Résultat du quiz'),
        content: Text(
          'Score: $score / ${questions.length}',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _resetQuiz();
            },
            child: const Text('Recommencer'),
          ),
        ],
      ),
    );
  }

  void _resetQuiz() {
    setState(() {
      currentIndex = 0;
      score = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final question = questions[currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz'),
        centerTitle: true,
      ),

      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Question ${currentIndex + 1}/${questions.length}',
                    style: const TextStyle(fontSize: 16),
                  ),

                  const SizedBox(height: 20),

                  Text(
                    question.question,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 30),

                  ...question.options.map(
                    (option) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: ElevatedButton(
                        onPressed: () => _selectAnswer(option),
                        child: Text(option),
                      ),
                    ),
                  ),

                  const Spacer(),

                  Text(
                    'Score: $score',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
    );
  }
}