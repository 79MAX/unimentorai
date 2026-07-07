export class PaymentPolicyEngine {
  static validate(payment = {}) {
    return {
      valid: !!payment.method,
      secure: true
    };
  }
}

