export class CGUEngine {
  static check(userAction = {}) {
    const banned = ["fraud","hack","spam","illegal"];
    if (banned.includes(userAction.type)) {
      return { allowed: false, reason: "CGU_VIOLATION" };
    }
    return { allowed: true };
  }
}

