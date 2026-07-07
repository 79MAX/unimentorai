class FraudService {

  Future<bool> check(String userId, String certificateId) async {
    // MVP RULES (upgrade later AI)
    if (certificateId.toLowerCase().contains('fake')) {
      return true;
    }

    return false;
  }
}




