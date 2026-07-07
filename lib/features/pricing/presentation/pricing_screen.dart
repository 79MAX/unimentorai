import 'package:flutter/material.dart';
import 'package:printing/printing.dart';
import 'package:pdf/widgets.dart' as pw;
import 'services/pricing_service.dart';
import 'pricing_comparison_card.dart';

class PricingScreen extends StatefulWidget {
  const PricingScreen({super.key});

  @override
  State<PricingScreen> createState() => _PricingScreenState();
}

class _PricingScreenState extends State<PricingScreen> {
  final PricingService _service = PricingService();
  String segment = 'schools';
  String tier = 'Starter';
  int users = 100;
  String region = 'africa';
  List<String> addons = [];
  bool cguAccepted = false;
  Map<String, dynamic>? config;

  @override
  void initState() {
    super.initState();
    _service.loadConfig().then((_) {
      setState(() {
        config = _service._config;
      });
    });
  }

  Future<void> _exportPdf() async {
    if (config == null) return;
    final tiers = config![segment]['tiers'] as List;
    final currency = (config!['currencies'] as List).first;
    final price = _service.estimatePricing(
      segment: segment,
      tier: tier,
      users: users,
      region: region,
      addons: addons,
    );
    final breakdown = _service.pricingBreakdown(
      segment: segment,
      tier: tier,
      users: users,
      region: region,
      addons: addons,
    );
    final pdf = pw.Document();
    pdf.addPage(
      pw.MultiPage(
        build: (context) => [
          pw.Text('Devis UniMentorAI', style: const pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 12),
          pw.Text('Segment : $segment'),
          pw.Text('Offre : $tier'),
          pw.Text('Nombre d’utilisateurs : $users'),
          pw.Text('Région : $region'),
          pw.Text('Options : ${addons.join(", ")}'),
          pw.SizedBox(height: 12),
          pw.Text('Détail du calcul :'),
          pw.Bullet(text: 'Prix de base : ${breakdown['base']} $currency'),
          pw.Bullet(text: 'Prix minimum : ${breakdown['min_price']} $currency'),
          pw.Bullet(text: 'Discount volume : -${breakdown['volume_discount']}%'),
          pw.Bullet(text: 'Discount régional : -${breakdown['region_discount']}%'),
          pw.Bullet(text: 'Options : +${breakdown['addons_total']} $currency'),
          pw.Bullet(text: 'Total estimé : ${breakdown['total']} $currency/an'),
          pw.SizedBox(height: 16),
          pw.Text('Comparatif des offres', style: const pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
          pw.Table.fromTextArray(
            headers: ['Offre', 'Prix min/an', 'Prix/utilisateur', 'Discounts', 'Fonctionnalités'],
            data: tiers.map((tier) => [
              tier['name'],
              '${tier['min_price']} $currency',
              '${tier['price_per_user']} $currency',
              (tier['volume_discounts'] as List).isNotEmpty
                ? (tier['volume_discounts'] as List).map((d) => '-${d['discount_percent']}% >${d['threshold']}').join(', ')
                : '-',
              (tier['features'] as List).join(', '),
            ]).toList(),
          ),
          pw.SizedBox(height: 16),
          pw.Text('Conditions Générales d’Utilisation (CGU) et politique RGPD', style: const pw.TextStyle(fontWeight: pw.FontWeight.bold)),
          pw.Text('L’utilisation de la plateforme UniMentorAI implique l’acceptation des CGU et le respect de la politique de confidentialité RGPD. Voir https://unimentor.ai/cgu pour le détail.'),
        ],
      ),
    );
    await Printing.layoutPdf(onLayout: (format) async => pdf.save());
  }

  @override
  Widget build(BuildContext context) {
    if (config == null) {
      return const Center(child: CircularProgressIndicator());
    }
    final tiers = config![segment]['tiers'] as List;
    final currency = (config!['currencies'] as List).first;
    final price = _service.estimatePricing(
      segment: segment,
      tier: tier,
      users: users,
      region: region,
      addons: addons,
    );
    return Scaffold(
      appBar: AppBar(title: const Text('Grille tarifaire UniMentorAI')),
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
              onChanged: (v) => setState(() { segment = v!; tier = 'Starter'; }),
              decoration: const InputDecoration(labelText: 'Segment'),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              initialValue: tier,
              items: (config![segment]['tiers'] as List).map<DropdownMenuItem<String>>((t) =>
                DropdownMenuItem(value: t['name'], child: Text(t['name']))).toList(),
              onChanged: (v) => setState(() { tier = v!; }),
              decoration: const InputDecoration(labelText: 'Offre'),
            ),
            const SizedBox(height: 8),
            TextFormField(
              initialValue: users.toString(),
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Nombre d’utilisateurs'),
              onChanged: (v) => setState(() { users = int.tryParse(v) ?? users; }),
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
              onChanged: (v) => setState(() { region = v!; }),
              decoration: const InputDecoration(labelText: 'Région'),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(
                  label: const Text('Support 24h'),
                  selected: addons.contains('support_24h'),
                  onSelected: (v) => setState(() {
                    if (v) { addons.add('support_24h'); } else { addons.remove('support_24h'); }
                  }),
                ),
                FilterChip(
                  label: const Text('On-premise'),
                  selected: addons.contains('on_premise'),
                  onSelected: (v) => setState(() {
                    if (v) { addons.add('on_premise'); } else { addons.remove('on_premise'); }
                  }),
                ),
                FilterChip(
                  label: const Text('Développement sur-mesure'),
                  selected: addons.contains('custom_dev'),
                  onSelected: (v) => setState(() {
                    if (v) { addons.add('custom_dev'); } else { addons.remove('custom_dev'); }
                  }),
                ),
                FilterChip(
                  label: const Text('Formation'),
                  selected: addons.contains('training'),
                  onSelected: (v) => setState(() {
                    if (v) { addons.add('training'); } else { addons.remove('training'); }
                  }),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text('Prix estimé :', style: Theme.of(context).textTheme.titleMedium),
            Text('$price $currency/an', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 16),
            PricingComparisonCard(
              tiers: List<Map<String, dynamic>>.from(tiers),
              currency: currency,
              onExportPdf: _exportPdf,
            ),
            const SizedBox(height: 16),
            CheckboxListTile(
              value: cguAccepted,
              onChanged: (v) => setState(() { cguAccepted = v ?? false; }),
              title: const Text('J’accepte les Conditions Générales d’Utilisation (CGU) et la politique RGPD.'),
            ),
            ElevatedButton(
              onPressed: cguAccepted ? () {/* TODO: Intégrer souscription */} : null,
              child: const Text('Souscrire'),
            ),
          ],
        ),
      ),
    );
  }
} 




