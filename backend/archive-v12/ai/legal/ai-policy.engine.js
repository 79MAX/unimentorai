export class AIPolicyEngine {
  static validate(input = "") {
    const banned = ["illegal","fraud","exploit"];
    return {
      allowed: !banned.some(x => input.includes(x))
    };
  }
}

