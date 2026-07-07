import 'add_etape_screen.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AddEtapeScreen extends StatefulWidget {
  final String courseId;

  const AddEtapeScreen({super.key, required this.courseId});

  @override
  State<AddEtapeScreen> createState() => _AddEtapeScreenState();
}

class _AddEtapeScreenState extends State<AddEtapeScreen> {
  final _formKey = GlobalKey<FormState>();

  String _title = '';
  String _content = '';
  String _type = 'texte';
  final int _ordre = 1;

  bool _isSaving = false;

  final List<String> _types = ['texte', 'video', 'quiz', 'image'];

  Future<void> _saveEtape() async {
    if (!_formKey.currentState!.validate()) return;

    _formKey.currentState!.save();

    setState(() => _isSaving = true);

    try {
      final etapesRef = FirebaseFirestore.instance
          .collection('cours')
          .doc(widget.courseId)
          .collection('etapes');

      // Automatiser ordre si nécessaire (récupérer le max + 1)
      final snapshot = await etapesRef.orderBy('ordre', descending: true).limit(1).get();
      int newOrdre = 1;
      if (snapshot.docs.isNotEmpty) {
        final lastOrdre = snapshot.docs.first.data()['ordre'];
        if (lastOrdre is int) {
          newOrdre = lastOrdre + 1;
        }
      }

      await etapesRef.add({
        'title': _title,
        'content': _content,
        'type': _type,
        'ordre': newOrdre,
        'createdAt': FieldValue.serverTimestamp(),
      });

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Étape ajoutée avec succès !')),
      );

      Navigator.of(context).pop(); // Retour à la page précédente
    } catch (e) {
      setState(() => _isSaving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de l\'ajout : $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Ajouter une étape'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isSaving
            ? const Center(child: CircularProgressIndicator())
            : Form(
                key: _formKey,
                child: ListView(
                  children: [
                    TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Titre',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) =>
                          (value == null || value.isEmpty) ? 'Veuillez saisir un titre' : null,
                      onSaved: (value) => _title = value!.trim(),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Contenu (texte, URL, etc.)',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) =>
                          (value == null || value.isEmpty) ? 'Veuillez saisir le contenu' : null,
                      onSaved: (value) => _content = value!.trim(),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      initialValue: _type,
                      decoration: const InputDecoration(
                        labelText: 'Type d\'étape',
                        border: OutlineInputBorder(),
                      ),
                      items: _types
                          .map((type) =>
                              DropdownMenuItem(value: type, child: Text(type.capitalize())))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) setState(() => _type = value);
                      },
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: _saveEtape,
                      icon: const Icon(Icons.save),
                      label: const Text('Enregistrer'),
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(50),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
}

extension StringExtension on String {
  String capitalize() => length > 0 ? '${this[0].toUpperCase()}${substring(1)}' : '';
}




