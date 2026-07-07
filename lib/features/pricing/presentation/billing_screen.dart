import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'services/pricing_service.dart';

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> {
  String segment = 'schools';
  String tier = 'Starter';
  int users = 100;
  String region = 'africa';
  List<String> addons = [];
  String email = '';
  bool cguAccepted = false;
  bool loading = false;
  String? invoiceUrl;
  String? error;
  Map<String, dynamic>? config;
  Map<String, dynamic> breakdown = {};
  final PricingService _service = PricingService();

  @override
  void initState() {
    super.initState();
    _service.loadConfig().then((_) {
      setState(() {
        config = _service._config;
        _updateBreakdown();
      });
    });
  }

  void _updateBreakdown() {
    if (config == null) return;
    breakdown = _service.pricingBreakdown(
      segment: segment,
      tier: tier,
      users: users,
      region: region,
      addons: addons,
    );
  }

  Future<void> _payAndGenerateInvoice() async {
    setState(() { loading = true; error = null; invoiceUrl = null; });
    try {
      // 1. Créer PaymentIntent côté backend (à adapter selon ton endpoint Stripe)
      final amountCents = ((breakdown['total'] ?? 0) * 100).round();
      final paymentIntentRes = await http.post(
        Uri.parse('https://YOUR_CLOUD_FUNCTION_URL/create-payment-intent'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'amount': amountCents,
          'currency': 'eur',
          'email': email,
        }),
      );
      final paymentIntent = json.decode(paymentIntentRes.body);
      if (paymentIntent['clientSecret'] == null) throw Exception('Erreur paiement Stripe');
      // 2. Lancer le paiement Stripe côté Flutter
      await Stripe.instance.initPaymentSheet(paymentSheetParameters: SetupPaymentSheetParameters(
        paymentIntentClientSecret: paymentIntent['clientSecret'],
        merchantDisplayName: 'UniMentorAI',
        customerEmail: email,
      ));
      await Stripe.instance.presentPaymentSheet();
      // 3. Appeler la Cloud Function pour générer la facture
      final invoiceRes = await http.post(
        Uri.parse('https://YOUR_CLOUD_FUNCTION_URL/generate-invoice'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'segment': segment,
          'tier': tier,
          'users': users,
          'region': region,
          'addons': addons,
          'email': email,
          'pricing': breakdown,
          'paymentIntentId': paymentIntent['id'],
        }),
      );
      final invoice = json.decode(invoiceRes.body);
      if (invoice['url'] == null) throw Exception('Erreur génération facture');
      setState(() { invoiceUrl = invoice['url']; });
    } catch (e) {
      setState(() { error = e.toString(); });
    } finally {
      setState(() { loading = false; });
    }
  }

  void _onFieldChanged() {
    setState(_updateBreakdown);
  }

  @override
  Widget build(BuildContext context) {
    final currency = (config?['currencies'] as List?)?.first ?? 'EUR';
    return Scaffold(
      appBar: AppBar(title: const Text('Souscription & Facturation')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DropdownButtonFormField<String>(
              initialValue: segment,
              items: const [
                DropdownMenuItem(value: 'schools', child: Text('Écoles/Universités')),
                DropdownMenuItem(value: 'enterprises', child: Text('Entreprises')),
                DropdownMenuItem(value: 'ngos', child: Text('ONG/Associations')),
              ],
              onChanged: (v) { setState(() { segment = v!; tier = 'Starter'; }); _onFieldChanged(); },
              decoration: const InputDecoration(labelText: 'Segment'),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              initialValue: tier,
              items: const [
                DropdownMenuItem(value: 'Starter', child: Text('Starter')),
                DropdownMenuItem(value: 'Pro', child: Text('Pro')),
                DropdownMenuItem(value: 'Premium', child: Text('Premium')),
              ],
              onChanged: (v) { setState(() { tier = v!; }); _onFieldChanged(); },
              decoration: const InputDecoration(labelText: 'Offre'),
            ),
            const SizedBox(height: 8),
            TextFormField(
              initialValue: users.toString(),
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Nombre d’utilisateurs'),
              onChanged: (v) { setState(() { users = int.tryParse(v) ?? users; }); _onFieldChanged(); },
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              initialValue: region,
              items: const [
                DropdownMenuItem(value: 'africa', child: Text('Afrique')),
                DropdownMenuItem(value: 'europe', child: Text('Europe')),
                DropdownMenuItem(value: 'america', child: Text('Amérique')),
                DropdownMenuItem(value: 'asia', child: Text('Asie')),
              ],
              onChanged: (v) { setState(() { region = v!; }); _onFieldChanged(); },
              decoration: const InputDecoration(labelText: 'Région'),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(
                  label: const Text('Support 24h'),
                  selected: addons.contains('support_24h'),
                  onSelected: (v) { setState(() { if (v) { addons.add('support_24h'); } else { addons.remove('support_24h'); } }); _onFieldChanged(); },
                ),
                FilterChip(
                  label: const Text('On-premise'),
                  selected: addons.contains('on_premise'),
                  onSelected: (v) { setState(() { if (v) { addons.add('on_premise'); } else { addons.remove('on_premise'); } }); _onFieldChanged(); },
                ),
                FilterChip(
                  label: const Text('Développement sur-mesure'),
                  selected: addons.contains('custom_dev'),
                  onSelected: (v) { setState(() { if (v) { addons.add('custom_dev'); } else { addons.remove('custom_dev'); } }); _onFieldChanged(); },
                ),
                FilterChip(
                  label: const Text('Formation'),
                  selected: addons.contains('training'),
                  onSelected: (v) { setState(() { if (v) { addons.add('training'); } else { addons.remove('training'); } }); _onFieldChanged(); },
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Email de facturation'),
              onChanged: (v) { setState(() { email = v; }); },
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            if (breakdown.isNotEmpty) ...[
              Text('Détail du calcul :', style: Theme.of(context).textTheme.titleMedium),
              Text('Prix de base : ${breakdown['base'] ?? '-'} $currency'),
              Text('Prix minimum : ${breakdown['min_price'] ?? '-'} $currency'),
              Text('Discount volume : -${breakdown['volume_discount'] ?? 0}%'),
              Text('Discount régional : -${breakdown['region_discount'] ?? 0}%'),
              Text('Options : +${breakdown['addons_total'] ?? 0} $currency'),
              Text('Total estimé : ${breakdown['total'] ?? '-'} $currency/an', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 16),
            ],
            CheckboxListTile(
              value: cguAccepted,
              onChanged: (v) => setState(() { cguAccepted = v ?? false; }),
              title: const Text('J’accepte les Conditions Générales d’Utilisation (CGU) et la politique RGPD.'),
            ),
            ElevatedButton(
              onPressed: cguAccepted && !loading && email.isNotEmpty ? _payAndGenerateInvoice : null,
              child: loading ? const CircularProgressIndicator() : const Text('Payer & Générer la facture'),
            ),
            if (invoiceUrl != null) ...[
              const SizedBox(height: 16),
              const Text('Votre facture est disponible ici :'),
              SelectableText(invoiceUrl!),
            ],
            if (error != null) ...[
              const SizedBox(height: 16),
              Text('Erreur : $error', style: const TextStyle(color: Colors.red)),
            ],
          ],
        ),
      ),
    );
  }
} 




