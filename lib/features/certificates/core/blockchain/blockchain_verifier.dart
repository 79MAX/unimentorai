import 'blockchain_hash_engine.dart';

class BlockchainVerifier {

  static bool verifyCertificate({
    required String storedHash,
    required String incomingHash,
  }) => BlockchainHashEngine.verifyHash(
      originalHash: storedHash,
      currentHash: incomingHash,
    );

  /// TRUST SCORE (OPTIONAL UPGRADE FOR FRAUD ENGINE)
  static int trustScore(bool isValid) => isValid ? 100 : 0;
}




