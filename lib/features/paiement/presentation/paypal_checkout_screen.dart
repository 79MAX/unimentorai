import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/models/payment_result.dart';

/// Pousse l’écran de checkout PayPal si [createResult] contient [PaymentResult.paypalApproveUrl].
/// Retourne le [PaymentResult] après capture serveur, ou `null` si l’utilisateur ferme l’écran sans confirmer.
Future<PaymentResult?> completePayPalPaymentInApp(
  BuildContext context,
  PaymentResult createResult,
) async {
  if (!createResult.requiresPayPalBrowserApproval) {
    return createResult;
  }
  return Navigator.of(context).push<PaymentResult>(
    MaterialPageRoute<PaymentResult>(
      builder: (_) => PayPalCheckoutScreen(
        orderId: createResult.transactionId!,
        approveUrl: createResult.paypalApproveUrl!,
      ),
    ),
  );
}

/// Flux PayPal : ouverture de l’URL d’approbation (navigateur / app PayPal), puis capture via Cloud Function.
class PayPalCheckoutScreen extends StatefulWidget {
  const PayPalCheckoutScreen({
    super.key,
    required this.orderId,
    required this.approveUrl,
    this.autoLaunchApproveUrl = true,
  });

  final String orderId;
  final String approveUrl;

  /// Si vrai, tente d’ouvrir PayPal une fois au premier frame.
  final bool autoLaunchApproveUrl;

  @override
  State<PayPalCheckoutScreen> createState() => _PayPalCheckoutScreenState();
}

class _PayPalCheckoutScreenState extends State<PayPalCheckoutScreen>
    with WidgetsBindingObserver {
  bool _capturing = false;
  bool _openedPayPal = false;
  bool _resumeHintShown = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    if (widget.autoLaunchApproveUrl) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _openPayPal());
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed &&
        _openedPayPal &&
        !_resumeHintShown &&
        mounted) {
      _resumeHintShown = true;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Si vous avez terminé sur PayPal, appuyez sur « Confirmer le paiement ».',
          ),
        ),
      );
    }
  }

  void _toast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _openPayPal() async {
    final uri = Uri.tryParse(widget.approveUrl);
    if (uri == null) {
      _toast('URL PayPal invalide.');
      return;
    }
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!mounted) return;
    if (ok) {
      setState(() => _openedPayPal = true);
    } else {
      _toast('Impossible d’ouvrir PayPal.');
    }
  }

  Future<void> _capture() async {
    setState(() => _capturing = true);
    try {
      final callable =
          FirebaseFunctions.instance.httpsCallable('capturePayPalOrder');
      final res = await callable.call(<String, dynamic>{
        'orderId': widget.orderId,
      });
      final d = res.data;
      if (!mounted) return;
      if (d is! Map) {
        _toast('Réponse serveur invalide.');
        return;
      }
      final success = d['success'] == true;
      final result = PaymentResult(
        isSuccess: success,
        transactionId: (d['captureId'] ?? widget.orderId).toString(),
        error: success ? null : (d['status']?.toString() ?? 'Capture échouée'),
      );
      if (success) {
        Navigator.of(context).pop(result);
      } else {
        _toast(result.error ?? 'Capture PayPal refusée');
      }
    } catch (e) {
      if (mounted) _toast('$e');
    } finally {
      if (mounted) setState(() => _capturing = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Paiement PayPal')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'Commande PayPal',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          SelectableText(
            widget.orderId,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 20),
          Text(
            '1. Ouvrez PayPal pour approuver le paiement.\n'
            '2. Revenez dans UniMentorAI.\n'
            '3. Confirmez pour enregistrer le paiement.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            onPressed: _openPayPal,
            icon: const Icon(Icons.open_in_browser),
            label: const Text('Ouvrir PayPal'),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: _capturing ? null : _capture,
            child: _capturing
                ? const SizedBox(
                    height: 22,
                    width: 22,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Confirmer le paiement'),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: _capturing ? null : () => Navigator.of(context).pop(),
            child: const Text('Annuler'),
          ),
        ],
      ),
    );
}





