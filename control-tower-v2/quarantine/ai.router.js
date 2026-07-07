export class AIModelRouter {
  constructor() {
    this.models = {
      code: "qwen2.5-coder:7b",
      reasoning: "deepseek-r1:8b",
      chat: "llama3.1:8b",
      creative: "gemma4:latest",
      heavy: "qwen3-coder:30b"
    };
  }

  selectModel(task) {
    const normalizedTask = task?.toLowerCase?.();
    return this.models[normalizedTask] || this.models.chat;
  }

  validateTask(task) {
    return Object.keys(this.models).includes(task);
  }
}
