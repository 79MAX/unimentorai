export default class Fallback {

  constructor() {

    this.models = [
      "llama3",
      "llama3.1:8b",
      "deepseek-r1:8b"
    ];

    this.maxRetries = 2;

    // 🔥 model health tracking (optional upgrade)
    this.health = {
      llama3: 1,
      "llama3.1:8b": 1,
      "deepseek-r1:8b": 1
    };
  }

  // =========================
  // SMALL DELAY (ANTI SPAM)
  // =========================
  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // =========================
  // SMART RUN
  // =========================
  async run(engine, prompt) {

    let lastError = null;

    for (const model of this.models) {

      // 🔥 skip bad models automatically
      if ((this.health[model] || 1) < 0.3) {
        continue;
      }

      for (let i = 0; i < this.maxRetries; i++) {

        try {

          // 🔥 exponential backoff (important)
          if (i > 0) {
            await this.sleep(300 * i);
          }

          const res = await engine.run(model, prompt);

          // =========================
          // SUCCESS CASE
          // =========================
          if (res?.output && res.output.trim().length > 0) {

            // 📈 reward model
            this.health[model] = Math.min(
              1,
              (this.health[model] || 0.5) + 0.1
            );

            return {
              model: `fallback(${model})`,
              output: res.output,
              attempts: i + 1
            };
          }

          // 📉 penalize empty outputs
          this.health[model] = Math.max(
            0,
            (this.health[model] || 0.5) - 0.1
          );

        } catch (err) {

          lastError = err?.message || "UNKNOWN_ERROR";

          // 📉 penalize crash
          this.health[model] = Math.max(
            0,
            (this.health[model] || 0.5) - 0.2
          );
        }
      }
    }

    // =========================
    // FINAL SAFE FAILURE
    // =========================
    return {
      model: "fallback_failed",
      output: null,
      error: lastError || "ALL_MODELS_FAILED"
    };
  }
}
