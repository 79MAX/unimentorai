import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'services/reverse_mentoring_service.dart';

class ReverseMentoringScreen extends StatefulWidget {
  const ReverseMentoringScreen({super.key});

  @override
  State<ReverseMentoringScreen> createState() => _ReverseMentoringScreenState();
}

class _ReverseMentoringScreenState extends State<ReverseMentoringScreen> {
  final ReverseMentoringService _service = ReverseMentoringService();
  final _formKey = GlobalKey<FormState>();

  final _languagesCtrl = TextEditingController();
  final _masteredCtrl = TextEditingController();
  final _learnCtrl = TextEditingController();

  bool _savingProfile = false;
  bool _matching = false;
  List<Map<String, dynamic>> _matches = const [];
  String? _errorText;

  String? _uid;

  @override
  void initState() {
    super.initState();
    _uid = FirebaseAuth.instance.currentUser?.uid;
  }

  @override
  void dispose() {
    _languagesCtrl.dispose();
    _masteredCtrl.dispose();
    _learnCtrl.dispose();
    super.dispose();
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  List<Map<String, dynamic>> _parseCompetencies(String raw) {
    // Format attendu: "topic:level, topic2:level2"
    // Exemple: "Python:4, Leadership:3"
    final parts = raw
        .split(',')
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList();

    final out = <Map<String, dynamic>>[];
    for (final p in parts) {
      final kv = p.split(':').map((e) => e.trim()).toList();
      final topic = kv[0];
      final level = kv.length >= 2 ? int.tryParse(kv[1]) : 3;
      if (topic.isEmpty) continue;
      out.add({'topic': topic, 'level': (level ?? 3).clamp(0, 5)});
    }
    return out;
  }

  List<String> _parseLanguages(String raw) => raw
        .split(',')
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .map((e) => e.toLowerCase())
        .toList();

  @override
  Widget build(BuildContext context) {
    if (_uid == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Reverse Mentoring')),
        body: const Center(child: Text('Veuillez vous connecter.')),
      );
    }

    final uid = _uid!;
    return Scaffold(
      appBar: AppBar(title: const Text('Reverse Mentoring')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '1) Profil (compétences maîtrisées + besoins d’apprentissage)',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
                stream: FirebaseFirestore.instance
                    .collection('reverse_mentoring_profiles')
                    .doc(uid)
                    .snapshots(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  final data = snapshot.data?.data();
                  if (data != null) {
                    final languages = (data['languages'] as List?)?.cast<String>() ?? [];
                    final mastered = (data['competenciesMastered'] as List?) ?? [];
                    final toLearn = (data['competenciesToLearn'] as List?) ?? [];

                    // Ne pas écraser l’état si l’utilisateur tape (simple heuristique).
                    if (_languagesCtrl.text.isEmpty && languages.isNotEmpty) {
                      _languagesCtrl.text = languages.join(', ');
                    }
                    if (_masteredCtrl.text.isEmpty && mastered.isNotEmpty) {
                      _masteredCtrl.text = mastered.map((e) {
                        final m = e as Map<String, dynamic>;
                        return '${m['topic'] ?? ''}:${m['level'] ?? 3}';
                      }).join(', ');
                    }
                    if (_learnCtrl.text.isEmpty && toLearn.isNotEmpty) {
                      _learnCtrl.text = toLearn.map((e) {
                        final m = e as Map<String, dynamic>;
                        return '${m['topic'] ?? ''}:${m['level'] ?? 3}';
                      }).join(', ');
                    }
                  }

                  return Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _languagesCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Langues (séparées par virgule)',
                            hintText: 'fr, sw, en',
                          ),
                          validator: (v) => (v == null || v.trim().isEmpty) ? 'Requis' : null,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: _masteredCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Compétences maîtrisées',
                            hintText: 'topic:level, topic2:level',
                          ),
                          validator: (v) => (v == null || v.trim().isEmpty) ? 'Requis' : null,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: _learnCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Besoins d’apprentissage',
                            hintText: 'topic:level, topic2:level',
                          ),
                          validator: (v) => (v == null || v.trim().isEmpty) ? 'Requis' : null,
                        ),
                        const SizedBox(height: 12),
                        if (_errorText != null)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text(_errorText!, style: const TextStyle(color: Colors.red)),
                          ),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _savingProfile
                                ? null
                                : () async {
                                    setState(() {
                                      _savingProfile = true;
                                      _errorText = null;
                                    });
                                    try {
                                      if (!_formKey.currentState!.validate()) return;
                                      await _service.upsertProfile(
                                        languages: _parseLanguages(_languagesCtrl.text),
                                        competenciesMastered: _parseCompetencies(_masteredCtrl.text),
                                        competenciesToLearn: _parseCompetencies(_learnCtrl.text),
                                      );
                                      _showSnack('Profil reverse mentoring sauvegardé.');
                                    } catch (e) {
                                      setState(() {
                                        _errorText = 'Erreur sauvegarde profil.';
                                      });
                                    } finally {
                                      if (mounted) {
                                        setState(() => _savingProfile = false);
                                      }
                                    }
                                  },
                            child: _savingProfile
                                ? const SizedBox(
                                    height: 18,
                                    width: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  )
                                : const Text('Sauvegarder'),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),
              const Text(
                '2) Matching intelligent (serveur)',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _matching
                      ? null
                      : () async {
                          setState(() {
                            _matching = true;
                            _errorText = null;
                          });
                          try {
                            final matches = await _service.matchCandidates(limit: 5);
                            setState(() => _matches = matches);
                          } catch (e) {
                            setState(() => _errorText = 'Erreur matching.');
                          } finally {
                            if (mounted) setState(() => _matching = false);
                          }
                        },
                  icon: const Icon(Icons.search),
                  label: Text(_matching ? 'Recherche…' : 'Trouver des matchs'),
                ),
              ),
              const SizedBox(height: 12),
              if (_matches.isEmpty)
                const Text('Aucun match affiché (sauvegardez votre profil puis réessayez).')
              else
                ..._matches.map((m) {
                  final candidateId = m['candidateId']?.toString() ?? '';
                  final score = (m['score'] is num) ? (m['score'] as num).toInt() : 0;
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      title: Text('Candidat: $candidateId'),
                      subtitle: Text('Score: $score'),
                      trailing: ElevatedButton(
                        onPressed: () async {
                          try {
                            final sessionId = await _service.createSession(candidateId: candidateId, startTime: DateTime.now());
                            _showSnack('Session créée: $sessionId');
                          } catch (_) {
                            _showSnack('Erreur création session.');
                          }
                        },
                        child: const Text('Créer session'),
                      ),
                    ),
                  );
                }),
              const SizedBox(height: 20),
              const Text(
                '3) Sessions & évaluation bilatérale',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
                stream: _service.getSessionsForUser(uid),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    return const Text('Aucune session trouvée.');
                  }
                  final sessions = snapshot.data!.docs;
                  return Column(
                    children: sessions.map((doc) {
                      final data = doc.data();
                      final sessionId = doc.id;
                      final mentorId = data['mentorId']?.toString() ?? '';
                      final menteeId = data['menteeId']?.toString() ?? '';
                      final isMentor = uid == mentorId;
                      final partnerName = isMentor ? (data['menteeDisplayName'] ?? menteeId) : (data['mentorDisplayName'] ?? mentorId);

                      final startTs = data['startTime'];
                      final start = startTs is Timestamp ? startTs.toDate() : null;

                      final mentorFeedbackRating = data['mentorFeedbackRating'];
                      final menteeFeedbackRating = data['menteeFeedbackRating'];
                      final shouldFeedbackMentor = uid == menteeId;
                      final missingRating = shouldFeedbackMentor ? (mentorFeedbackRating == null) : (menteeFeedbackRating == null);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Avec: ${partnerName.toString()}',
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 6),
                              Text('Début: ${start?.toString() ?? (data['startTime']?.toString() ?? '')}'),
                              Text('Statut: ${data['status'] ?? ''}'),
                              const SizedBox(height: 10),
                              if (!missingRating)
                                const Text('Feedback déjà soumis.')
                              else
                                SessionFeedbackCard(
                                  sessionId: sessionId,
                                  isFeedbackAboutMentor: shouldFeedbackMentor,
                                  onSubmit: (rating, text) async {
                                    await _service.submitFeedback(
                                      sessionId: sessionId,
                                      rating: rating,
                                      feedbackText: text,
                                    );
                                  },
                                ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
} 

class SessionFeedbackCard extends StatefulWidget {
  final String sessionId;
  final bool isFeedbackAboutMentor; // mentee -> mentor
  final Future<void> Function(int rating, String text) onSubmit;

  const SessionFeedbackCard({
    super.key,
    required this.sessionId,
    required this.isFeedbackAboutMentor,
    required this.onSubmit,
  });

  @override
  State<SessionFeedbackCard> createState() => _SessionFeedbackCardState();
}

class _SessionFeedbackCardState extends State<SessionFeedbackCard> {
  final _feedbackCtrl = TextEditingController();
  int _rating = 5;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _feedbackCtrl.text = '';
  }

  @override
  void dispose() {
    _feedbackCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.isFeedbackAboutMentor ? 'Évaluer le mentor' : 'Évaluer le mentoré';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        DropdownButtonFormField<int>(
          initialValue: _rating,
          onChanged: (v) => setState(() => _rating = v ?? 5),
          items: const [
            DropdownMenuItem(value: 5, child: Text('5 - Excellent')),
            DropdownMenuItem(value: 4, child: Text('4 - Très bien')),
            DropdownMenuItem(value: 3, child: Text('3 - Bien')),
            DropdownMenuItem(value: 2, child: Text('2 - Passable')),
            DropdownMenuItem(value: 1, child: Text('1 - Insuffisant')),
          ],
          decoration: const InputDecoration(labelText: 'Note (1..5)'),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _feedbackCtrl,
          minLines: 2,
          maxLines: 4,
          decoration: const InputDecoration(
            labelText: 'Commentaire',
            hintText: 'Décrivez ce qui a le mieux fonctionné...',
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _submitting
                ? null
                : () async {
                    setState(() => _submitting = true);
                    try {
                      final text = _feedbackCtrl.text.trim();
                      await widget.onSubmit(_rating, text);
                      if (mounted) {
                        _feedbackCtrl.clear();
                      }
                    } finally {
                      if (mounted) setState(() => _submitting = false);
                    }
                  },
            child: _submitting ? const Text('Envoi…') : const Text('Soumettre'),
          ),
        ),
      ],
    );
  }
}




