import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

/// Widget Kkiapay : clé publique locale, vérification via Cloud Function.
class PaiementKkiapayScreen extends StatefulWidget {
  const PaiementKkiapayScreen({
    super.key,
    this.amount = 5000,
    this.currency = 'XOF',
    this.designation = 'UniMentorAI',
  });

  final int amount;
  final String currency;
  final String designation;

  @override
  State<PaiementKkiapayScreen> createState() => _PaiementKkiapayScreenState();
}

class _PaiementKkiapayScreenState extends State<PaiementKkiapayScreen> {
  final _txController = TextEditingController();
  final _security = SecurityService();
  bool _loadingKey = true;
  String? _publicKey;
  bool _verifying = false;

  @override
  void initState() {
    super.initState();
    _loadPublicKey();
  }

  Future<void> _loadPublicKey() async {
    await _security.initialize();
    final key = await _security.getApiKey('KKIAPAY_PUBLIC');
    if (mounted) {
      setState(() {
        _publicKey = key;
        _loadingKey = false;
      });
    }
  }

  @override
  void dispose() {
    _txController.dispose();
    super.dispose();
  }

  void _toast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _openWidget() async {
    final pk = _publicKey;
    if (pk == null || pk.isEmpty) {
      _toast('Enregistrez KKIAPAY_PUBLIC (écran admin).');
      return;
    }
    final uri = Uri.https('pay.kkiapay.me', '/widget', {
      'public_key': pk,
      'amount': '${widget.amount}',
      'currency': widget.currency,
      'designation': widget.designation,
    });
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && mounted) {
      _toast('Impossible d’ouvrir Kkiapay.');
    }
  }

  Future<void> _verify() async {
    final id = _txController.text.trim();
    if (id.isEmpty) {
      _toast('Saisissez l’identifiant de transaction.');
      return;
    }
    setState(() => _verifying = true);
    try {
      final callable =
          FirebaseFunctions.instance.httpsCallable('verifyKkiapayTransaction');
      final res = await callable.call(<String, dynamic>{'transactionId': id});
      final d = res.data;
      if (!mounted) return;
      if (d is Map && d['success'] == true) {
        _toast('Paiement confirmé.');
      } else if (d is Map) {
        _toast(d['status']?.toString() ?? 'En cours ou refusé');
      } else {
        _toast('Réponse serveur invalide');
      }
    } catch (e) {
      if (mounted) _toast('$e');
    } finally {
      if (mounted) setState(() => _verifying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loadingKey) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final missingKey = _publicKey == null || _publicKey!.isEmpty;

    return Scaffold(
      appBar: AppBar(title: const Text('Paiement Kkiapay')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            missingKey
                ? 'Clé publique absente : configurez KKIAPAY_PUBLIC dans l’admin.'
                : 'Montant : ${widget.amount} ${widget.currency}',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: missingKey ? null : _openWidget,
            child: const Text('Ouvrir le paiement Kkiapay'),
          ),
          const SizedBox(height: 24),
          Text(
            'Après le paiement, saisissez l’identifiant de transaction puis vérifiez côté serveur.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _txController,
            decoration: const InputDecoration(
              labelText: 'ID transaction',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: _verifying ? null : _verify,
            child: _verifying
                ? const SizedBox(
                    height: 22,
                    width: 22,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Vérifier le paiement'),
          ),
        ],
      ),
    );
  }
}





