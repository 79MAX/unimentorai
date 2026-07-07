import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _firestore =
      FirebaseFirestore.instance;

  /// USERS
  CollectionReference<Map<String, dynamic>> get users =>
      _firestore.collection('users');

  /// WEBINARS
  CollectionReference<Map<String, dynamic>> get webinars =>
      _firestore.collection('webinars');

  /// SESSIONS
  CollectionReference<Map<String, dynamic>> get sessions =>
      _firestore.collection('sessions');

  /// GENERIC TIMESTAMP
  FieldValue get timestamp =>
      FieldValue.serverTimestamp();
}




