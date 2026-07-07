import 'package:cloud_firestore/cloud_firestore.dart';
import '../domain/models/payment_model.dart';

class PaymentService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// 💳 CREATE PAYMENT RECORD
  Future<void> createPayment(PaymentModel payment) async {
    await _firestore
        .collection('payments')
        .add(payment.toMap());
  }

  /// 🔁 UPDATE PAYMENT STATUS
  Future<void> updateStatus(String paymentId, String status) async {
    await _firestore
        .collection('payments')
        .doc(paymentId)
        .update({'status': status});
  }

  /// 📦 GET USER PAYMENTS
  Stream<List<PaymentModel>> getUserPayments(String userId) => _firestore
        .collection('payments')
        .where('userId', isEqualTo: userId)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) =>
                PaymentModel.fromMap(doc.id, doc.data())
            ).toList());
}
