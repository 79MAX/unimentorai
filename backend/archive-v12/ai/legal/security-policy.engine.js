export class SecurityPolicyEngine {
  static scan(req = {}) {
    return {
      allowed: req.ip !== "blacklisted"
    };
  }
}

