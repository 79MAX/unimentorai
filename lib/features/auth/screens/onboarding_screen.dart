import 'package:flutter/material.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int currentStep = 0;

  final steps = [
    {
      'title': 'Bienvenue',
      'description': 'Commencez votre parcours d\'apprentissage',
      'icon': Icons.school,
    },
    {
      'title': 'Explorez les cours',
      'description': 'Découvrez des milliers de cours disponibles',
      'icon': Icons.explore,
    },
    {
      'title': 'Certifiez-vous',
      'description': 'Obtenez des certifications reconnues',
      'icon': Icons.verified,
    },
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Column(
          children: [
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      steps[currentStep]['icon'] as IconData,
                      size: 80,
                      color: Colors.blue,
                    ),
                    const SizedBox(height: 20),
                    Text(
                      steps[currentStep]['title'] as String,
                      style: const TextStyle(
                          fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      steps[currentStep]['description'] as String,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (currentStep > 0)
                    ElevatedButton(
                      onPressed: () =>
                          setState(() => currentStep = currentStep - 1),
                      child: const Text('Précédent'),
                    ),
                  const Spacer(),
                  if (currentStep < steps.length - 1)
                    ElevatedButton(
                      onPressed: () =>
                          setState(() => currentStep = currentStep + 1),
                      child: const Text('Suivant'),
                    )
                  else
                    ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Commencer'),
                    ),
                ],
              ),
            ),
          ],
        ),
      );
}

