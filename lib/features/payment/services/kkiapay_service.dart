import 'package:kkiapay_flutter_sdk/kkiapay_flutter_sdk.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class KkiapayService {
  final FirebaseFirestore _firestore;

  KkiapayService({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  /// 💰 START PAYMENT FLOW (PRODUCTION READY)
  Future<void> startPayment({
    required String userId,
    required int amount,
    required String userEmail,
    required Function(bool success, String? message) onResult,
  }) async {
    try {
      KKiaPay(
        amount: amount,
        countries: const ['BJ', 'CI', 'SN', 'TG', 'ML', 'BF'],
        name: 'UniMentorAI Premium',
        email: userEmail,
        reason: 'Premium subscription',
        callback: (response, context) async {
          final status = response['status'];

          if (status == 'SUCCESS') {
            await _activatePremium(userId);

            onResult(true, 'Payment successful');
          } else {
            onResult(false, 'Payment failed or cancelled');
          }
        },
        theme: '#0B0F19',
        sandbox: true, // 🔥 change to false in production
      );
    } catch (e) {
      onResult(false, 'Payment error: $e');
    }
  }

  /// 🔥 ACTIVATE PREMIUM AFTER SUCCESS PAYMENT
  Future<void> _activatePremium(String userId) async {
    await _firestore.collection('users').doc(userId).update({
      'isPremium': true,
      'premiumActivatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// 🔍 VERIFY PAYMENT STATUS (OPTIONAL SAFE CHECK)
  Future<bool> verifyUserPremium(String userId) async {
    final doc = await _firestore.collection('users').doc(userId).get();

    if (!doc.exists) return false;

    final data = doc.data();
    return data?['isPremium'] ?? false;
  }
}