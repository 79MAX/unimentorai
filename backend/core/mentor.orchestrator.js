class MentorOrchestrator {
  constructor(deps = {}) {
    this.contextAnalyzer = deps.contextAnalyzer;
    this.memoryStore = deps.memoryStore;
    this.learningEngine = deps.learningEngine;
    this.personalityEngine = deps.personalityEngine;
    this.difficultyAdjuster = deps.difficultyAdjuster;
    this.dialogueEngine = deps.dialogueEngine;
    this.responseGenerator = deps.responseGenerator;
    this.feedbackLoop = deps.feedbackLoop;
    this.analyticsEngine = deps.analyticsEngine;
  }

  // =========================
  // 🧠 SAFE EXEC WRAPPER
  // =========================
  async safeRun(label, fn, fallback = {}) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`⚠️ ${label} failed:`, err.message);
      return fallback;
    }
  }

  // =========================
  // 🚀 MAIN PIPELINE
  // =========================
  async run(userId, input = {}) {
    const message = input.text || "";

    const startTime = Date.now();

    // =========================
    // 🧠 PARALLEL CONTEXT LOAD
    // =========================
    const [context, memory] = await Promise.all([
      this.safeRun("contextAnalyzer", () =>
        this.contextAnalyzer?.analyze?.(userId, message), {}
      ),
      this.safeRun("memoryStore", () =>
        this.memoryStore?.get?.(userId), {}
      )
    ]);

    // =========================
    // 🧠 SEQUENTIAL INTELLIGENCE LAYER
    // =========================
    const learning = await this.safeRun(
      "learningEngine",
      () => this.learningEngine?.process?.(userId, message, context),
      {}
    );

    const personality = await this.safeRun(
      "personalityEngine",
      () => this.personalityEngine?.adapt?.(userId, context),
      {}
    );

    const difficulty = await this.safeRun(
      "difficultyAdjuster",
      () => this.difficultyAdjuster?.adjust?.(userId, learning),
      {}
    );

    const dialogue = await this.safeRun(
      "dialogueEngine",
      () => this.dialogueEngine?.process?.(message, memory, context),
      {}
    );

    // =========================
    // 🧠 RESPONSE GENERATION (CORE AI)
    // =========================
    const response = await this.safeRun(
      "responseGenerator",
      () =>
        this.responseGenerator?.generate?.({
          message,
          context,
          memory,
          learning,
          personality,
          difficulty,
          dialogue
        }),
      { response: "AI initializing..." }
    );

    // =========================
    // 🧠 SIDE SYSTEMS (NON BLOCKING)
    // =========================
    this.feedbackLoop?.store?.(userId, { message, response }).catch?.(() => {});
    this.analyticsEngine?.track?.(userId, {
      context,
      learning,
      difficulty
    }).catch?.(() => {});

    // =========================
    // 🚀 FINAL OUTPUT
    // =========================
    return {
      userId,
      response,
      context,
      learning,
      metadata: {
        processingTime: Date.now() - startTime,
        success: true
      }
    };
  }
}

export default MentorOrchestrator;
