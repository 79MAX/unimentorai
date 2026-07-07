import AIRouter from "./router.js";
import Executor from "./executor.js";
import Validator from "./validator.js";
import Fallback from "./fallback.js";
import PromptBuilder from "../core/prompt.js";

class AutoFixEngine {

  constructor() {
    this.router = new AIRouter();
    this.executor = new Executor();
    this.validator = new Validator();
    this.fallback = new Fallback();
    this.prompt = new PromptBuilder();

    // 🔥 global safety timeout
    this.globalTimeout = 180000;
  }

  // =========================
  // SAFE LOGGER (DISABLE READY)
  // =========================
  log(step, data) {
    if (process.env.DEBUG !== "true") return;
    console.log(`🔹 ${step}:`, data);
  }

  // =========================
  // MAIN PIPELINE (STABLE V10)
  // =========================
  async run(input = "") {

    const start = Date.now();

    try {

      const clean = String(input).trim();

      if (!clean) {
        return { status: "error", error: "EMPTY_INPUT" };
      }

      // =========================
      // 1. ROUTING
      // =========================
      const intent = this.router.detectIntent(clean);
      const model = this.router.selectModel(intent);
      const prompt = this.prompt.build(intent, clean);

      this.log("Intent", intent);
      this.log("Model", model);

      // =========================
      // 2. EXECUTION (SAFE WRAP)
      // =========================
      const result = await this.withGlobalTimeout(
        this.executor.run(model, prompt)
      );

      const isValidOutput =
        result?.output &&
        typeof result.output === "string" &&
        result.output.trim().length > 0;

      // =========================
      // 3. FALLBACK (ONLY IF REAL FAILURE)
      // =========================
      if (!isValidOutput) {

        this.log("Fallback", "TRIGGERED");

        const fbResult = await this.fallback.run(
          this.executor,
          prompt,
          model,
          intent
        );

        return this.formatResponse(intent, fbResult, start);
      }

      // =========================
      // 4. VALIDATION
      // =========================
      const parsed = this.validator.parse(result.output);

      return this.formatResponse(intent, {
        model,
        output: parsed || result.output
      }, start);

    } catch (err) {

      return {
        status: "error",
        error: err?.message || "ENGINE_CRASH"
      };
    }
  }

  // =========================
  // GLOBAL TIMEOUT WRAPPER
  // =========================
  withGlobalTimeout(promise) {

    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("GLOBAL_TIMEOUT")), this.globalTimeout)
      )
    ]);
  }

  // =========================
  // CLEAN RESPONSE FORMATTER
  // =========================
  formatResponse(intent, result, start) {

    return {
      status: "ok",
      intent,
      model: result.model,
      output: result.output,
      time: Date.now() - start
    };
  }
}

export default new AutoFixEngine();
