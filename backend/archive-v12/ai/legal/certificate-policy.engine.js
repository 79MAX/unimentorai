export class CertificatePolicyEngine {
  static generate(userId, courseId) {
    return {
      id: `${userId}-${courseId}-${Date.now()}`,
      verified: true
    };
  }
}

