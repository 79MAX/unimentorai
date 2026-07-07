export default class AIRouter {

  constructor() {

    this.models = {
      CODE: "qwen3-coder:30b",
      ANALYSIS: "gemma4",
      FAST: "llama3.1:8b",
      GENERAL: "llama3"
    };

    this.patterns = {
      CODE: /(bug|error|fix|refactor|debug|code|api|crash)/i,
      ANALYSIS: /(analyse|analyze|optimize|architecture|design|explain)/i
    };
  }

  normalize(text = "") {
    return String(text).trim().toLowerCase();
  }

  detectIntent(text = "") {

    const t = this.normalize(text);

    if (this.patterns.CODE.test(t)) return "CODE";
    if (this.patterns.ANALYSIS.test(t)) return "ANALYSIS";
    if (t.length < 25) return "FAST";

    return "GENERAL";
  }

  selectModel(intent = "GENERAL") {
    return this.models[intent] || this.models.GENERAL;
  }

  chat(message) {

    const intent = this.detectIntent(message);
    const model = this.selectModel(intent);

    return {
      status: "ok",
      intent,
      model,
      input: message,
      timestamp: Date.now()
    };
  }
}
