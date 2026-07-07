
const Payment = require("../models/payment.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");

class PaymentService {

  /**
   * ========================
   * 💰 CREATE PAYMENT INTENT
   * ========================
   */
  async createPayment({ userId, type, amount, method, courseId, subscriptionPlan }) {

    if (!userId || !type || !amount || !method) {
      throw new Error("Missing required payment fields");
    }

    const reference = `PAY_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const payment = await Payment.create({
      user: userId,
      type,
      amount,
      method,
      course: courseId || null,
      subscriptionPlan: subscriptionPlan || null,
      reference,
      status: "pending"
    });

    return payment;
  }

  /**
   * ========================
   * ✅ CONFIRM PAYMENT
   * ========================
   */
  async confirmPayment(paymentId, transactionId) {

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "completed") {
      return payment; // idempotence protection
    }

    payment.status = "completed";
    payment.transactionId = transactionId;

    await payment.save();

    // Trigger business logic
    await this.postPaymentActions(payment);

    return payment;
  }

  /**
   * ========================
   * 🚀 POST PAYMENT ACTIONS
   * ========================
   * Unlock content, update subscription, etc.
   */
  async postPaymentActions(payment) {

    const userId = payment.user;

    // ========================
    // 📚 COURSE PAYMENT
    // ========================
    if (payment.type === "course" && payment.course) {

      await this.unlockCourse(userId, payment.course);
    }

    // ========================
    // 💎 SUBSCRIPTION PAYMENT
    // ========================
    if (payment.type === "subscription") {

      await User.findByIdAndUpdate(userId, {
        "subscription.plan": payment.subscriptionPlan || "basic",
        "subscription.status": "active"
      });
    }

    // ========================
    // 🧠 AI SERVICE PAYMENT (future)
    // ========================
    if (payment.type === "ai_service") {
      // placeholder for AI credit system
    }
  }

  /**
   * ========================
   * 📚 UNLOCK COURSE ACCESS
   * ========================
   */
  async unlockCourse(userId, courseId) {

    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    // Here you would normally add user-course relation
    // (future Enrollment model)

    return {
      success: true,
      message: "Course unlocked successfully",
      userId,
      courseId
    };
  }

  /**
   * ========================
   * 📊 GET USER PAYMENTS
   * ========================
   */
  async getUserPayments(userId) {

    return await Payment.find({ user: userId })
      .sort({ createdAt: -1 });
  }

  /**
   * ========================
   * 🔎 GET PAYMENT BY REF
   * ========================
   */
  async getPaymentByReference(reference) {

    return await Payment.findOne({ reference });
  }
}

module.exports = new PaymentService();
