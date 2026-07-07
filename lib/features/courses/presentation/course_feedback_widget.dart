import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class CourseFeedbackWidget extends StatefulWidget {
  final String courseId;
  final String lang;
  const CourseFeedbackWidget({super.key, required this.courseId, required this.lang});

  @override
  State<CourseFeedbackWidget> createState() => _CourseFeedbackWidgetState();
}

class _CourseFeedbackWidgetState extends State<CourseFeedbackWidget> {
  int rating = 0;
  final TextEditingController _controller = TextEditingController();
  bool submitted = false;
  bool loading = false;

  @override
  Widget build(BuildContext context) {
    final labels = {
      'fr': 'Votre avis sur ce cours',
      'en': 'Your feedback on this course',
      'ar': 'رأيك في هذا المقرر',
      'pt': 'Seu feedback sobre este curso',
      'es': 'Tu opinión sobre este curso',
    };
    final submitLabel = {
      'fr': 'Envoyer',
      'en': 'Submit',
      'ar': 'إرسال',
      'pt': 'Enviar',
      'es': 'Enviar',
    };
    final thanks = {
      'fr': 'Merci pour votre retour !',
      'en': 'Thank you for your feedback!',
      'ar': 'شكراً لملاحظاتك!',
      'pt': 'Obrigado pelo seu feedback!',
      'es': '¡Gracias por tu opinión!',
    };
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 24),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: submitted
            ? Center(child: Text(thanks[widget.lang] ?? thanks['fr']!))
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(labels[widget.lang] ?? labels['fr']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: List.generate(5, (i) => IconButton(
                      icon: Icon(
                        Icons.star,
                        color: i < rating ? Colors.amber : Colors.grey,
                        semanticLabel: '${i + 1} ${widget.lang == 'fr' ? 'étoile' : 'star'}',
                      ),
                      onPressed: () => setState(() => rating = i + 1),
                    )),
                  ),
                  TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      labelText: widget.lang == 'fr' ? 'Commentaire (optionnel)' : 'Comment (optional)',
                      border: const OutlineInputBorder(),
                    ),
                    minLines: 1,
                    maxLines: 3,
                  ),
                  const SizedBox(height: 12),
                  loading
                      ? const Center(child: CircularProgressIndicator())
                      : ElevatedButton(
                          onPressed: rating == 0 || loading
                              ? null
                              : () async {
                                  setState(() => loading = true);
                                  final user = FirebaseAuth.instance.currentUser;
                                  await FirebaseFirestore.instance.collection('course_feedback').add({
                                    'courseId': widget.courseId,
                                    'userId': user?.uid ?? '',
                                    'rating': rating,
                                    'comment': _controller.text.trim(),
                                    'lang': widget.lang,
                                    'createdAt': FieldValue.serverTimestamp(),
                                  });
                                  setState(() {
                                    submitted = true;
                                    loading = false;
                                  });
                                },
                          child: Text(submitLabel[widget.lang] ?? submitLabel['fr']!),
                        ),
                ],
              ),
      ),
    );
  }
} 
 
 




