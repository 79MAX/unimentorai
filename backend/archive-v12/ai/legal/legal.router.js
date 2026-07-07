import { CGUEngine } from "./cgu.engine.js";
import { AIPolicyEngine } from "./ai-policy.engine.js";
import { ModerationEngine } from "./moderation.engine.js";
import { PaymentPolicyEngine } from "./payment-policy.engine.js";

export class LegalRouter {

  static evaluate(request = {}) {

    const cgu = CGUEngine.check(request);
    const ai = AIPolicyEngine.validate(request.input || "");
    const mod = ModerationEngine.scan(request.input || "");
    const pay = PaymentPolicyEngine.validate(request.payment || {});

    const allowed =
      cgu.allowed &&
      ai.allowed &&
      mod.safe &&
      pay.valid;

    return {
      allowed,
      breakdown: { cgu, ai, mod, pay },
      timestamp: Date.now()
    };
  }
}

