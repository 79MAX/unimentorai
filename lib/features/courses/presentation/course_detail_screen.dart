import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/course_progress_service.dart';
import '../../quiz/quiz_screen.dart';
import 'package:url_launcher/url_launcher.dart';

class CourseDetailScreen extends StatefulWidget {
  final Map<String, dynamic> courseData;
  final String? courseId;

  const CourseDetailScreen({
    super.key,
    required this.courseData,
    this.courseId,
  });

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final CourseProgressService _progressService = CourseProgressService();
  bool _isLoading = true;
  double _progressPercent = 0.0;

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    if (widget.courseId == null) {
      setState(() {
        _progressPercent = 0.0;
        _isLoading = false;
      });
      return;
    }

    try {
      final progress = await _progressService.getCourseProgress(widget.courseId!);
      if (!mounted) return;
      setState(() {
        _progressPercent = progress;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _progressPercent = 0.0;
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur chargement progression : $e')),
      );
    }
  }

  Future<void> _markComplete() async {
    if (widget.courseId == null) return;

    setState(() => _isLoading = true);

    try {
      await _progressService.saveCourseProgress(widget.courseId!, 1.0);
      if (!mounted) return;
      setState(() {
        _progressPercent = 1.0;
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cours marqué comme terminé !')),
      );
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur sauvegarde : $e')),
      );
    }
  }

  Widget _buildEtapeWidget(Map<String, dynamic> etape, String type) {
    final title = etape['title'] ?? 'Sans titre';
    final content = etape['content'] ?? '';

    switch (type) {
      case 'texte':
        return Card(
          child: ListTile(
            title: Text(title),
            subtitle: Text(content),
          ),
        );

      case 'video':
        return Card(
          child: ListTile(
            title: Text(title),
            subtitle: const Text('📺 Vidéo'),
            onTap: () async {
              final uri = Uri.tryParse(content);
              if (uri != null && await canLaunchUrl(uri)) {
                launchUrl(uri, mode: LaunchMode.externalApplication);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Lien vidéo invalide')),
                );
              }
            },
          ),
        );

      case 'image':
        return Card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                title: Text(title),
                subtitle: const Text('🖼️ Image'),
              ),
              Image.network(content, errorBuilder: (context, _, __) => const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text('Impossible de charger l’image.'),
                )),
            ],
          ),
        );

      case 'quiz':
        return Card(
          color: Colors.orange[50],
          child: ListTile(
            title: Text(title),
            subtitle: const Text('📝 Quiz'),
            onTap: () {
              if (widget.courseId != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => QuizScreen(
                      courseId: widget.courseId!,
                      courseTitle: widget.courseData['titre'] ?? 'Cours',
                    ),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('ID du cours manquant')),
                );
              }
            },
          ),
        );

      default:
        return Card(
          child: ListTile(
            title: Text(title),
            subtitle: const Text('Type inconnu'),
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final course = widget.courseData;
    final title = course['titre'] ?? 'Titre inconnu';
    final description = course['description'] ?? 'Pas de description disponible.';

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text(description),
                      const SizedBox(height: 16),
                      LinearProgressIndicator(
                        value: _progressPercent,
                        backgroundColor: Colors.grey[300],
                        color: Colors.blue,
                        minHeight: 10,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Progression : ${(_progressPercent * 100).toStringAsFixed(0)}%',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _progressPercent >= 1.0 ? null : _markComplete,
                        icon: const Icon(Icons.check),
                        label: const Text('Marquer comme terminé'),
                        style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
                      ),
                    ],
                  ),
                ),
                const Divider(),
                Expanded(
                  child: StreamBuilder<QuerySnapshot>(
                    stream: FirebaseFirestore.instance
                        .collection('cours')
                        .doc(widget.courseId)
                        .collection('etapes')
                        .orderBy('ordre')
                        .snapshots(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                        return const Center(child: Text('Aucune étape disponible.'));
                      }

                      final etapes = snapshot.data!.docs;

                      return ListView.builder(
                        itemCount: etapes.length,
                        itemBuilder: (context, index) {
                          final etape = etapes[index].data() as Map<String, dynamic>;
                          final type = etape['type'] ?? 'texte';
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            child: _buildEtapeWidget(etape, type),
                          );
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }
}







