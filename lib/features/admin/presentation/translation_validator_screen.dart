// 📁 lib/modules/admin/translation_validator_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../courses/provider/firestore_translation_service_provider.dart';

class TranslationValidatorScreen extends ConsumerStatefulWidget {
  const TranslationValidatorScreen({super.key});

  @override
  ConsumerState<TranslationValidatorScreen> createState() => _TranslationValidatorScreenState();
}

class _TranslationValidatorScreenState extends ConsumerState<TranslationValidatorScreen> {
  final _courseIdController = TextEditingController();
  final _fieldNameController = TextEditingController();
  final _langCodeController = TextEditingController();
  final _translationController = TextEditingController();

  bool _isLoading = false;
  String _statusMessage = '';

  Future<void> _loadExistingTranslation() async {
    setState(() => _isLoading = true);
    final service = ref.read(firestoreTranslationServiceProvider);
    final data = await service.getCourseTranslation(
      _courseIdController.text.trim(),
      _fieldNameController.text.trim(),
    );
    if (data != null && data[_langCodeController.text.trim()] != null) {
      _translationController.text = data[_langCodeController.text.trim()];
    } else {
      _translationController.text = '';
    }
    setState(() => _isLoading = false);
  }

  Future<void> _validateAndSave() async {
    setState(() => _isLoading = true);
    final service = ref.read(firestoreTranslationServiceProvider);
    await service.updateTranslation(
      courseId: _courseIdController.text.trim(),
      fieldName: _fieldNameController.text.trim(),
      languageCode: _langCodeController.text.trim(),
      translatedText: _translationController.text.trim(),
      verified: true,
    );
    setState(() {
      _isLoading = false;
      _statusMessage = '✅ Traduction validée et sauvegardée.';
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Validation de Traduction')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Semantics(
              label: 'Champ Course ID',
              hint: 'Saisir l\'identifiant du cours',
              textField: true,
              child: TextField(
                controller: _courseIdController,
                decoration: const InputDecoration(labelText: 'Course ID'),
              ),
            ),
            Semantics(
              label: 'Champ nom du champ',
              hint: 'Saisir le nom du champ à traduire',
              textField: true,
              child: TextField(
                controller: _fieldNameController,
                decoration: const InputDecoration(labelText: 'Nom du champ (ex: body)'),
              ),
            ),
            Semantics(
              label: 'Champ code langue',
              hint: 'Saisir le code langue, par exemple fr ou pt',
              textField: true,
              child: TextField(
                controller: _langCodeController,
                decoration: const InputDecoration(labelText: 'Code langue (ex: fr, pt)'),
              ),
            ),
            const SizedBox(height: 12),
            Semantics(
              label: 'Bouton charger traduction existante',
              hint: 'Charger la traduction existante pour ce champ',
              button: true,
              child: ElevatedButton(
                onPressed: _loadExistingTranslation,
                child: const Text('\uD83D\uDD0D Charger traduction existante'),
              ),
            ),
            const SizedBox(height: 16),
            Semantics(
              label: 'Champ texte traduit',
              hint: 'Saisir ou modifier la traduction',
              textField: true,
              child: TextField(
                controller: _translationController,
                maxLines: 6,
                decoration: const InputDecoration(labelText: 'Texte traduit'),
              ),
            ),
            const SizedBox(height: 12),
            Semantics(
              label: 'Bouton valider la traduction',
              hint: 'Valider et sauvegarder la traduction',
              button: true,
              child: ElevatedButton(
                onPressed: _validateAndSave,
                child: _isLoading ? const CircularProgressIndicator() : const Text('\u2705 Valider la traduction'),
              ),
            ),
            if (_statusMessage.isNotEmpty)
              Semantics(
                label: 'Message de statut',
                hint: 'Statut de la validation',
                liveRegion: true,
                child: Padding(
                  padding: const EdgeInsets.only(top: 16.0),
                  child: Text(
                    _statusMessage,
                    style: const TextStyle(color: Colors.green),
                    textScaleFactor: MediaQuery.of(context).textScaleFactor,
                  ),
                ),
              ),
          ],
        ),
      ),
    );

  @override
  void dispose() {
    _courseIdController.dispose();
    _fieldNameController.dispose();
    _langCodeController.dispose();
    _translationController.dispose();
    super.dispose();
  }
}





