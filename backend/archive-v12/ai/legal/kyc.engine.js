export class KYCEngine {
  static verify(user = {}) {
    return {
      verified: !!user.email && !!user.phone
    };
  }
}

