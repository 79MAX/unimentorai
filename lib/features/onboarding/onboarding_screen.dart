import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int pageIndex = 0;

  void nextPage() {
    if (pageIndex < 2) {
      _controller.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      context.go('/home');
    }
  }

  Widget buildPage(String title, String desc, IconData icon) => Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, size: 100, color: Colors.blue),
        const SizedBox(height: 20),
        Text(
          title,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: Text(desc, textAlign: TextAlign.center),
        ),
      ],
    );

  @override
  Widget build(BuildContext context) => Scaffold(
      body: PageView(
        controller: _controller,
        onPageChanged: (index) {
          setState(() => pageIndex = index);
        },
        children: [
          buildPage(
            'Apprends intelligemment',
            'Accède à des formations modernes adaptées à ton niveau.',
            Icons.school,
          ),
          buildPage(
            'Mentorat IA',
            'Pose tes questions et reçois des réponses instantanées.',
            Icons.smart_toy,
          ),
          buildPage(
            'Certifications',
            'Obtiens des certificats reconnus internationalement.',
            Icons.verified,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: nextPage,
        child: Icon(pageIndex == 2 ? Icons.check : Icons.arrow_forward),
      ),
    );
}
