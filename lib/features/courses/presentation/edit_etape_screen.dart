import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class EditEtapeScreen extends StatefulWidget {
  final String courseId;
  final String etapeId;
  final Map<String, dynamic> initialData;

  const EditEtapeScreen({
    super.key,
    required this.courseId,
    required this.etapeId,
    required this.initialData,
  });

  @override
  State<EditEtapeScreen> createState() => _EditEtapeScreenState();
}

class _EditEtapeScreenState extends State<EditEtapeScreen> {
  final _formKey = GlobalKey<FormState>();

  late String _title;
  late String _content;
  late String _type;
  late int _ordre;

  final List<String> _types = ['texte', 'video', 'quiz', 'image'];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _title = widget.initialData['title'] ?? '';
    _content = widget.initialData['content'] ?? '';
    _type = widget.initialData['type'] ?? 'texte';
    _ordre = widget.initialData['ordre'] ?? 1;
  }

  Future<void> _saveChanges() async {
    if (!_formKey.currentState!.validate()) return;

    _formKey.currentState!.save();

    setState(() => _isLoading = true);

    try {
      await FirebaseFirestore.instance
          .collection('cours')
          .doc(widget.courseId)
          .collection('etapes')
          .doc(widget.etapeId)
          .update({
        'title': _title,
        'content': _content,
        'type': _type,
        'ordre': _ordre,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      if (!mounted) return;
      Navigator.of(context).pop();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Étape modifiée avec succès')),
      );
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de la modification : $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Modifier l\'étape'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : Form(
                key: _formKey,
                child: ListView(
                  children: [
                    TextFormField(
                      initialValue: _title,
                      decoration: const InputDecoration(labelText: 'Titre'),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Veuillez entrer un titre';
                        }
                        return null;
                      },
                      onSaved: (value) => _title = value!.trim(),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      initialValue: _type,
                      decoration: const InputDecoration(labelText: 'Type'),
                      items: _types
                          .map((type) => DropdownMenuItem(
                                value: type,
                                child: Text(type),
                              ))
                          .toList(),
                      onChanged: (value) {
                        setState(() {
                          _type = value ?? 'texte';
                        });
                      },
                      onSaved: (value) => _type = value ?? 'texte',
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      initialValue: _content,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: 'Contenu',
                        hintText: 'Texte ou URL selon le type',
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Veuillez entrer le contenu';
                        }
                        return null;
                      },
                      onSaved: (value) => _content = value!.trim(),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      initialValue: _ordre.toString(),
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Ordre',
                        hintText: 'Position de l\'étape dans le cours',
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Veuillez entrer un ordre';
                        }
                        if (int.tryParse(value.trim()) == null) {
                          return 'Veuillez entrer un nombre valide';
                        }
                        return null;
                      },
                      onSaved: (value) => _ordre = int.parse(value!.trim()),
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: _saveChanges,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(50),
                      ),
                      child: const Text('Enregistrer les modifications'),
                    ),
                  ],
                ),
              ),
      ),
    );
}




