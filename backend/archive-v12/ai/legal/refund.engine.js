export class RefundEngine {
  static process(payment) {
    return {
      approved: payment.amount > 10,
      amount: payment.amount || 0
    };
  }
}

