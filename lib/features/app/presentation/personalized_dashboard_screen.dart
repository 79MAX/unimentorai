import 'package:flutter/material.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/models/course_model.dart';
import '../../../copackage:unimentorai/core/services/auth_service.dart';
import '../../../core/onboarding/onboarding_profile.dart';
import '../../../core/onboarding/onboarding_storage.dart';
import '../../../core/services/dashboard_feed_service.dart';
import './simple_course_preview_screen.dart';
import './reverse_mentoring_screen.dart';
import './webinar_screen.dart';
import '../../../shared/widgets/consent_banner.dart';

/// Tableau de bord 3 cours · 2 mentors · 1 opportunité.
class PersonalizedDashboardScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  final ThemeMode themeMode;

  const PersonalizedDashboardScreen({
    super.key,
    required this.onToggleTheme,
    required this.themeMode,
  });

  @override
  State<PersonalizedDashboardScreen> createState() => _PersonalizedDashboardScreenState();
}

class _PersonalizedDashboardScreenState extends State<PersonalizedDashboardScreen> {
  final _feed = DashboardFeedService();
  OnboardingProfile? _profile;
  var _loading = true;
  List<CourseModel> _courses = [];
  List<MentorCardVm> _mentors = [];
  OpportunityVm? _opportunity;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final profile = await OnboardingStorage().loadProfile();
    if (!mounted) return;
    if (profile == null) {
      Navigator.pushReplacementNamed(context, '/onboarding');
      return;
    }
    final courses = await _feed.loadRecommendedCourses(
      languageCode: profile.languageCode,
      goalIds: profile.goalIds,
    );
    final mentors = await _feed.loadMentorSuggestions(languageCode: profile.languageCode);
    final opp = await _feed.loadPrimaryOpportunity();
    setState(() {
      _profile = profile;
      _courses = courses;
      _mentors = mentors;
      _opportunity = opp;
      _loading = false;
    });
    await AnalyticsService.logDashboardViewed(
      courseCount: courses.length,
      mentorCount: mentors.length,
      hasOpportunity: opp != null,
    );
    await AnalyticsService.logScreenView('personalized_dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final p = _profile;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Votre accueil'),
        actions: [
          IconButton(
            tooltip: 'Thème',
            icon: Icon(widget.themeMode == ThemeMode.dark ? Icons.light_mode : Icons.dark_mode),
            onPressed: widget.onToggleTheme,
          ),
          PopupMenuButton<String>(
            onSelected: (v) async {
              if (v == 'redo_onboarding') {
                await OnboardingStorage().reset();
                if (mounted) Navigator.pushReplacementNamed(context, '/onboarding');
              } else if (v == 'sign_out') {
                await AuthService.instance.logout();
                if (mounted) Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
              }
            },
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'redo_onboarding', child: Text('Refaire l’onboarding')),
              if (FirebaseAuth.instance.currentUser != null)
                const PopupMenuItem(value: 'sign_out', child: Text('Se déconnecter')),
            ],
          ),
        ],
      ),
      body: Stack(
        children: [
          if (_loading || p == null)
            const Center(child: CircularProgressIndicator())
          else
            RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 88),
                children: [
                  Text(
                    'Votre sélection personnalisée',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Basée sur vos objectifs et votre langue (${p.languageCode.toUpperCase()}).',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),
                  const _SectionTitle(icon: Icons.school, title: '3 cours pour vous'),
                  const SizedBox(height: 8),
                  if (_courses.isEmpty)
                    const _EmptyHint(message: 'Aucun cours publié pour le moment. Explorez le catalogue bientôt.')
                  else
                    ..._courses.map((c) => _CourseCard(
                          title: c.title,
                          subtitle: c.description,
                          onTap: () async {
                            await AnalyticsService.logDashboardCourseOpen(c.id);
                            if (!mounted) return;
                            Navigator.push(
                              context,
                              MaterialPageRoute<void>(
                                builder: (_) => SimpleCoursePreviewScreen(course: c),
                              ),
                            );
                          },
                        )),
                  const SizedBox(height: 28),
                  const _SectionTitle(icon: Icons.groups_2, title: '2 mentors suggérés'),
                  const SizedBox(height: 8),
                  if (_mentors.isEmpty) ...[
                    const _EmptyHint(
                      message:
                          'Les profils mentors apparaîtront ici selon la communauté et vos langues. Lancez le reverse mentoring pour compléter votre profil.',
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton.icon(
                      onPressed: () async {
                        await AnalyticsService.logDashboardMentoringCta();
                        if (!mounted) return;
                        Navigator.push<void>(
                          context,
                          MaterialPageRoute<void>(builder: (_) => const ReverseMentoringScreen()),
                        );
                      },
                      icon: const Icon(Icons.handshake),
                      label: const Text('Reverse mentoring'),
                    ),
                  ] else
                    ..._mentors.map((m) => _MentorCard(
                          title: m.headline,
                          subtitle: 'Langues : ${m.languages.join(", ")}',
                          onTap: () {
                            AnalyticsService.logDashboardMentoringCta();
                            Navigator.push<void>(
                              context,
                              MaterialPageRoute<void>(builder: (_) => const ReverseMentoringScreen()),
                            );
                          },
                        )),
                  const SizedBox(height: 28),
                  const _SectionTitle(icon: Icons.flag, title: '1 opportunité'),
                  const SizedBox(height: 8),
                  _OpportunityCard(
                    opportunity: _opportunity,
                    onOpenWebinars: () async {
                      await AnalyticsService.logDashboardOpportunityOpen('webinar_list');
                      if (!mounted) return;
                      Navigator.push<void>(
                        context,
                        MaterialPageRoute<void>(builder: (_) => const WebinarScreen()),
                      );
                    },
                    onOpenLink: (url) async {
                      await AnalyticsService.logDashboardOpportunityOpen('external_link');
                      final u = Uri.tryParse(url);
                      if (u != null && await canLaunchUrl(u)) {
                        await launchUrl(u, mode: LaunchMode.externalApplication);
                      }
                    },
                  ),
                ],
              ),
            ),
          ConsentBanner(
            onAccepted: () async {
              await FirebaseAnalytics.instance.setAnalyticsCollectionEnabled(true);
              await AnalyticsService.logConsentAnalyticsAccepted();
            },
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final IconData icon;
  final String title;

  const _SectionTitle({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) => Row(
      children: [
        Icon(icon, size: 28),
        const SizedBox(width: 10),
        Expanded(
          child: Text(title, style: Theme.of(context).textTheme.titleLarge),
        ),
      ],
    );
}

class _CourseCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _CourseCard({
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        minVerticalPadding: 18,
        title: Text(title, maxLines: 2, overflow: TextOverflow.ellipsis),
        subtitle: Text(subtitle, maxLines: 2, overflow: TextOverflow.ellipsis),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
}

class _MentorCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _MentorCard({
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        minVerticalPadding: 18,
        leading: const CircleAvatar(child: Icon(Icons.person)),
        title: Text(title),
        subtitle: Text(subtitle, maxLines: 2, overflow: TextOverflow.ellipsis),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
}

class _OpportunityCard extends StatelessWidget {
  final OpportunityVm? opportunity;
  final VoidCallback onOpenWebinars;
  final void Function(String url) onOpenLink;

  const _OpportunityCard({
    required this.opportunity,
    required this.onOpenWebinars,
    required this.onOpenLink,
  });

  @override
  Widget build(BuildContext context) {
    final o = opportunity;
    if (o == null) {
      return Card(
        child: ListTile(
          minVerticalPadding: 20,
          leading: const Icon(Icons.event_available, size: 32),
          title: const Text('Événements & webinaires'),
          subtitle: const Text('Découvrez les sessions à venir ou les replays.'),
          trailing: const Icon(Icons.chevron_right),
          onTap: onOpenWebinars,
        ),
      );
    }
    final dateStr = o.startsAt != null
        ? '${o.startsAt!.day}/${o.startsAt!.month}/${o.startsAt!.year} ${o.startsAt!.hour.toString().padLeft(2, '0')}:${o.startsAt!.minute.toString().padLeft(2, '0')}'
        : '';
    return Card(
      child: ListTile(
        minVerticalPadding: 20,
        leading: const Icon(Icons.rocket_launch, size: 32),
        title: Text(o.title),
        subtitle: Text(dateStr.isEmpty ? 'Session à venir' : 'Début : $dateStr'),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {
          if (o.meetingLink.isNotEmpty) {
            onOpenLink(o.meetingLink);
          } else {
            onOpenWebinars();
          }
        },
      ),
    );
  }
}

class _EmptyHint extends StatelessWidget {
  final String message;

  const _EmptyHint({required this.message});

  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(message, style: Theme.of(context).textTheme.bodyMedium),
    );
}






