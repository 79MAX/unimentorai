import 'package:flutter/material.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentIndex = 0;

  final List<_OnboardingData> _pages = const [
    _OnboardingData(
      title: 'Bienvenue sur UniMentorAI',
      description:
          'Une plateforme intelligente pour apprendre, évoluer et réussir.',
      icon: Icons.school,
    ),
    _OnboardingData(
      title: 'Apprends à ton rythme',
      description:
          'Des cours adaptés à ton niveau, accessibles partout et à tout moment.',
      icon: Icons.access_time,
    ),
    _OnboardingData(
      title: 'Certifications reconnues',
      description:
          'Obtiens des certificats valorisants pour booster ta carrière.',
      icon: Icons.verified,
    ),
  ];

  /// ===============================
  /// NEXT / FINISH FLOW
  /// ===============================
  void _nextPage() {
    if (_currentIndex < _pages.length - 1) {
      _controller.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _finishOnboarding();
    }
  }

  void _finishOnboarding() {
    if (!mounted) return;
    Navigator.of(context).pop();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            /// ===============================
            /// PAGES
            /// ===============================
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _pages.length,
                onPageChanged: (index) {
                  setState(() => _currentIndex = index);
                },
                itemBuilder: (context, index) {
                  final page = _pages[index];

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          page.icon,
                          size: 90,
                          color: Colors.blue,
                        ),

                        const SizedBox(height: 30),

                        Text(
                          page.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 15),

                        Text(
                          page.description,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 16,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            /// ===============================
            /// INDICATORS (OPTIMISÉ)
            /// ===============================
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_pages.length, (index) {
                  final isActive = index == _currentIndex;

                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: isActive ? 22 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isActive ? Colors.blue : Colors.grey.shade400,
                      borderRadius: BorderRadius.circular(20),
                    ),
                  );
                }),
              ),
            ),

            /// ===============================
            /// BUTTON
            /// ===============================
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _nextPage,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    _currentIndex == _pages.length - 1
                        ? 'Commencer'
                        : 'Suivant',
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
}

/// ===============================
/// DATA MODEL CLEAN
/// ===============================
class _OnboardingData {
  final String title;
  final String description;
  final IconData icon;

  const _OnboardingData({
    required this.title,
    required this.description,
    required this.icon,
  });
}
