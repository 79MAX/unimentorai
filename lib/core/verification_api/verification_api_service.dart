/// Central verification API service
class VerificationApiService {
  Future<Map<String, dynamic>> verifyIdentity(String userId) async => {
      'verified': true,
      'userId': userId,
    };
}

