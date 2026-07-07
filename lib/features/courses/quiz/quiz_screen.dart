import 'package:flutter/material.dart';

/// Quiz screen for course content
class QuizScreen extends StatefulWidget {
  final String courseId;

  const QuizScreen({
    super.key,
    required this.courseId,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Quiz'),
      ),
      body: const Center(
        child: Text('Quiz Content'),
      ),
    );
}

