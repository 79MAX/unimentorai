import 'package:flutter/material.dart';

import '../../../core/analytics/analytics_events.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/onboarding/onboarding_profile.dart';
import '../../../core/onboarding/onboarding_storage.dart';

/// Onboarding court : objectifs → niveau → langue → validation.
class IntelligentOnboardingScreen extends StatefulWidget {
  const IntelligentOnboardingScreen({super.key});

  @override
  State<IntelligentOnboardingScreen> createState() => _IntelligentOnboardingScreenState();
}

class _IntelligentOnboardingScreenState extends State<IntelligentOnboardingScreen> {
  final PageController _page = PageController();
  int _index = 0;
  static const _total = 4;

  final Set<String> _goals = {};
  String _levelId = 'beginner';
  String _languageCode = 'fr';

  static const _goalCatalog = <String, String>{
    'career': 'Carrière & emploi',
    'skills_tech': 'Compétences tech / data',
    'leadership': 'Leadership & management',
    'entrepreneurship': 'Entrepreneuriat',
    'languages': 'Langues',
    'impact_social': 'Impact social & ONG',
  };

  static const _levels = <String, String>{
    'beginner': 'Débutant',
    'intermediate': 'Intermédiaire',
    'advanced': 'Avancé',
  };

  static const _languages = <String, String>{
    'fr': 'Français',
    'en': 'English',
    'pt': 'Português',
    'ar': 'العربية',
  };

  @override
  void initState() {
    super.initState();
    AnalyticsService.logOnboardingStarted();
    AnalyticsService.logOnboardingStepViewed(stepId: 'goals', stepIndex: 0, totalSteps: _total);
  }

  @override
  void dispose() {
    _page.dispose();
    super.dispose();
  }

  void _onPageChanged(int i) {
    setState(() => _index = i);
    final ids = ['goals', 'level', 'language', 'review'];
    AnalyticsService.logOnboardingStepViewed(
      stepId: ids[i.clamp(0, ids.length - 1)],
      stepIndex: i,
      totalSteps: _total,
    );
  }

  Future<void> _complete() async {
    final profile = OnboardingProfile(
      goalIds: _goals.toList()..sort(),
      levelId: _levelId,
      languageCode: _languageCode,
      completedAt: DateTime.now(),
    );
    await OnboardingStorage().save(profile);
    await AnalyticsService.logOnboardingStepCompleted(
      stepId: 'review',
      stepIndex: _total - 1,
      totalSteps: _total,
    );
    await AnalyticsService.logOnboardingCompleted(
      goalIds: profile.goalIds,
      levelId: profile.levelId,
      languageCode: profile.languageCode,
    );
    if (!mounted) return;
    Navigator.pushReplacementNamed(context, '/home');
  }

  void _next() {
    if (_index < _total - 1) {
      final ids = ['goals', 'level', 'language', 'review'];
      AnalyticsService.logOnboardingStepCompleted(
        stepId: ids[_index],
        stepIndex: _index,
        totalSteps: _total,
      );
      _page.nextPage(duration: const Duration(milliseconds: 280), curve: Curves.easeOut);
    } else {
      _complete();
    }
  }

  bool get _canContinue {
    if (_index == 0) return _goals.isNotEmpty;
    return true;
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Personnaliser UniMentorAI'),
        actions: [
          TextButton(
            onPressed: () async {
              await AnalyticsService.logEvent(AnalyticsEvents.onboardingSkipped);
              await OnboardingStorage().save(
                OnboardingProfile(
                  goalIds: const ['career'],
                  levelId: 'intermediate',
                  languageCode: 'fr',
                  completedAt: DateTime.now(),
                ),
              );
              if (mounted) Navigator.pushReplacementNamed(context, '/home');
            },
            child: const Text('Plus tard'),
          ),
        ],
      ),
      body: Column(
        children: [
          LinearProgressIndicator(value: (_index + 1) / _total),
          Expanded(
            child: PageView(
              controller: _page,
              onPageChanged: _onPageChanged,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _GoalsStep(catalog: _goalCatalog, selected: _goals, onToggle: (k) {
                  setState(() {
                    if (_goals.contains(k)) {
                      _goals.remove(k);
                    } else {
                      _goals.add(k);
                    }
                  });
                }),
                _RadioStep(
                  title: 'Votre niveau actuel',
                  options: _levels,
                  value: _levelId,
                  onChanged: (v) => setState(() => _levelId = v),
                ),
                _RadioStep(
                  title: 'Langue principale d’apprentissage',
                  options: _languages,
                  value: _languageCode,
                  onChanged: (v) => setState(() => _languageCode = v),
                ),
                _ReviewStep(
                  goals: _goals.map((k) => _goalCatalog[k] ?? k).toList(),
                  level: _levels[_levelId]!,
                  language: _languages[_languageCode]!,
                ),
              ],
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _canContinue ? _next : null,
                  child: Text(_index == _total - 1 ? 'Voir mon tableau de bord' : 'Continuer'),
                ),
              ),
            ),
          ),
        ],
      ),
    );
}

class _GoalsStep extends StatelessWidget {
  final Map<String, String> catalog;
  final Set<String> selected;
  final void Function(String key) onToggle;

  const _GoalsStep({
    required this.catalog,
    required this.selected,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) => ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Que souhaitez-vous développer en priorité ?',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        const Text('Sélectionnez au moins un objectif (gros boutons, choix multiples).'),
        const SizedBox(height: 20),
        ...catalog.entries.map(
          (e) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: SizedBox(
              height: 52,
              width: double.infinity,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  backgroundColor: selected.contains(e.key)
                      ? Theme.of(context).colorScheme.primary.withValues(alpha: 0.12)
                      : null,
                ),
                onPressed: () => onToggle(e.key),
                child: Text(e.value, textAlign: TextAlign.center),
              ),
            ),
          ),
        ),
      ],
    );
}

class _RadioStep extends StatelessWidget {
  final String title;
  final Map<String, String> options;
  final String value;
  final ValueChanged<String> onChanged;

  const _RadioStep({
    required this.title,
    required this.options,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) => ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(title, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 16),
        ...options.entries.map(
          (e) => RadioListTile<String>(
            value: e.key,
            groupValue: value,
            title: Text(e.value),
            onChanged: (v) {
              if (v != null) onChanged(v);
            },
          ),
        ),
      ],
    );
}

class _ReviewStep extends StatelessWidget {
  final List<String> goals;
  final String level;
  final String language;

  const _ReviewStep({
    required this.goals,
    required this.level,
    required this.language,
  });

  @override
  Widget build(BuildContext context) => ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text('Récapitulatif', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 16),
        const Text('Nous préparerons :'),
        const SizedBox(height: 12),
        _bullet('3 cours alignés sur vos objectifs'),
        _bullet('2 profils mentors compatibles langue / compétences'),
        _bullet('1 opportunité (événement ou programme)'),
        const Divider(height: 32),
        Text('Objectifs : ${goals.join(', ')}'),
        const SizedBox(height: 8),
        Text('Niveau : $level'),
        const SizedBox(height: 8),
        Text('Langue : $language'),
      ],
    );

  static Widget _bullet(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.check_circle, size: 22),
            const SizedBox(width: 8),
            Expanded(child: Text(t)),
          ],
        ),
      );
}





