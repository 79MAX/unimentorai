import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class QuizScreen extends StatefulWidget {
  final String courseId;
  final String courseTitle;

  const QuizScreen({
    super.key,
    required this.courseId,
    required this.courseTitle,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final _auth = FirebaseAuth.instance;
  List<Map<String, dynamic>> questions = [];
  Map<int, String> userAnswers = {};
  bool isLoading = true;
  int tentatives = 0;

  @override
  void initState() {
    super.initState();
    _loadQuiz();
  }

  Future<void> _loadQuiz() async {
    final snapshot = await FirebaseFirestore.instance
        .collection('cours')
        .doc(widget.courseId)
        .collection('quiz')
        .get();

    questions = snapshot.docs.map((doc) => doc.data()).toList();

    // Charger tentatives
    final doc = await FirebaseFirestore.instance
        .collection('progression')
        .doc('${_auth.currentUser!.uid}_${widget.courseId}')
        .get();

    if (doc.exists) {
      tentatives = doc.data()!['tentatives'] ?? 0;
    }

    setState(() {
      isLoading = false;
    });
  }

  void _submitQuiz() async {
    int bonnes = 0;

    for (int i = 0; i < questions.length; i++) {
      if (userAnswers[i] == questions[i]['bonneReponse']) {
        bonnes++;
      }
    }

    final double score = (bonnes / questions.length) * 100;

    final docRef = FirebaseFirestore.instance
        .collection('progression')
        .doc('${_auth.currentUser!.uid}_${widget.courseId}');

    // 🎯 Si réussite
    if (score >= 70) {
      tentatives++;
      await docRef.set({
        'tentatives': tentatives,
        'score': score,
        'valide': true,
      });

      await CertificatService().generateCertificate(widget.courseId, widget.courseTitle);
      _showMessage('Bravo 🎉 Vous avez réussi avec $score% ! Certificat généré.');
    } 
    // ❌ Échec - gérer selon la tentative
    else {
      if (tentatives == 0) {
        tentatives++;
        await docRef.set({
          'tentatives': tentatives,
          'score': score,
          'valide': false,
        });
        _showMessage('Échec 😢 Vous avez obtenu $score%. La 2ᵉ tentative coûte 2 USD.');
      } else if (tentatives == 1) {
        await PaymentService.launchPayment(
          context: context,
          amountUsd: 2,
          description: '2ᵉ tentative test final - ${widget.courseTitle}',
          courseId: widget.courseId,
          tentative: 2,
        );
      } else if (tentatives == 2) {
        await PaymentService.launchPayment(
          context: context,
          amountUsd: 3,
          description: '3ᵉ tentative avec mentor IA - ${widget.courseTitle}',
          courseId: widget.courseId,
          tentative: 3,
        );
      } else {
        _showMessage('Maximum de tentatives atteint ❌. Veuillez contacter un mentor.');
      }
    }
  }

  void _showMessage(String msg) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        content: Text(msg),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Test final')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          for (int i = 0; i < questions.length; i++)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Q${i + 1}: ${questions[i]['question']}"),
                const SizedBox(height: 5),
                for (final String opt in List<String>.from(questions[i]['options']))
                  RadioListTile(
                    title: Text(opt),
                    value: opt,
                    groupValue: userAnswers[i],
                    onChanged: (val) {
                      setState(() {
                        userAnswers[i] = val as String;
                      });
                    },
                  ),
                const Divider(),
              ],
            ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _submitQuiz,
            child: const Text('Soumettre mes réponses'),
          )
        ],
      ),
    );
  }
}






