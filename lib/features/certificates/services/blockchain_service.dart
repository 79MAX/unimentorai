import 'dart:convert';
import 'package:crypto/crypto.dart';

class BlockchainService {

  Future<String> generateHash(String certificateId) async {
    final bytes = utf8.encode(certificateId);
    final digest = sha256.convert(bytes);
    return digest.toString();
  }
}




