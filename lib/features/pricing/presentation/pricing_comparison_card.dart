import 'package:flutter/material.dart';

class PricingComparisonCard extends StatelessWidget {
  final List<Map<String, dynamic>> tiers;
  final String currency;
  final void Function()? onExportPdf;

  const PricingComparisonCard({
    super.key,
    required this.tiers,
    required this.currency,
    this.onExportPdf,
  });

  @override
  Widget build(BuildContext context) => Card(
      margin: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Comparatif des offres', style: Theme.of(context).textTheme.titleLarge),
                if (onExportPdf != null)
                  ElevatedButton.icon(
                    onPressed: onExportPdf,
                    icon: const Icon(Icons.picture_as_pdf),
                    label: const Text('Exporter PDF'),
                  ),
              ],
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columns: const [
                DataColumn(label: Text('Offre')),
                DataColumn(label: Text('Prix min/an')),
                DataColumn(label: Text('Prix/utilisateur')),
                DataColumn(label: Text('Discounts')),
                DataColumn(label: Text('Fonctionnalités')),
              ],
              rows: tiers.map((tier) => DataRow(
                cells: [
                  DataCell(Text(tier['name'] ?? '')),
                  DataCell(Text('${tier['min_price']} $currency')),
                  DataCell(Text('${tier['price_per_user']} $currency')),
                  DataCell(Text((tier['volume_discounts'] as List).isNotEmpty
                    ? (tier['volume_discounts'] as List).map((d) => '-${d['discount_percent']}% >${d['threshold']}').join(', ')
                    : '-')),
                  DataCell(Wrap(
                    children: (tier['features'] as List).map<Widget>((f) => Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2.0),
                      child: Chip(label: Text(f.toString()), visualDensity: VisualDensity.compact),
                    )).toList(),
                  )),
                ],
              )).toList(),
            ),
          ),
        ],
      ),
    );
} 




