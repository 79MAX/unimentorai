/* =========================
   AI PIPELINE V3 (PRODUCTION ENGINE)
   - High-performance orchestration
   - AI SaaS ready
   - Observability-first design
========================= */

/* =========================
   DEFAULT CONTEXT (IMMUTABLE BASE)
========================= */
const DEFAULT_CONTEXT = Object.freeze({
  user: null,
  input: null,
  metadata: Object.freeze({}),
});

/* =========================
   PIPELINE RUNNER (FAST PATH)
========================= */
export async function runPipeline(stages = [], input, context = {}) {
  let data = input;
  const ctx = { ...DEFAULT_CONTEXT, ...context };

  const trace = {
    start: Date.now(),
    steps: new Array(stages.length),
  };

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const start = Date.now();

    try {
      data = await executeStage(stage, data, ctx);

      trace.steps[i] = {
        name: stage?.name || "unknown",
        duration: Date.now() - start,
        status: "success",
      };
    } catch (err) {
      trace.steps[i] = {
        name: stage?.name || "unknown",
        duration: Date.now() - start,
        status: "error",
        error: err?.message || "UNKNOWN_ERROR",
      };

      if (stage?.critical) {
        throw enrichError(err, stage);
      }
    }
  }

  return {
    output: data,
    trace: finalizeTrace(trace),
  };
}

/* =========================
   STAGE EXECUTOR (SAFE + FAST)
========================= */
async function executeStage(stage, input, ctx) {
  if (!stage || typeof stage.run !== "function") {
    throw new Error("Invalid pipeline stage");
  }

  return stage.run(input, ctx);
}

/* =========================
   ERROR ENRICHMENT (AI OPS READY)
========================= */
function enrichError(err, stage) {
  const error = new Error(err?.message || "PIPELINE_ERROR");

  error.stage = stage?.name || "unknown";
  error.critical = stage?.critical || false;

  return error;
}

/* =========================
   TRACE FINALIZER (OBSERVABILITY OPTIMIZED)
========================= */
function finalizeTrace(trace) {
  const total = Date.now() - trace.start;

  let success = 0;
  let failed = 0;

  for (let i = 0; i < trace.steps.length; i++) {
    const s = trace.steps[i];
    if (s?.status === "success") success++;
    else failed++;
  }

  return {
    ...trace,
    total,
    success,
    failed,
  };
}

/* =========================
   CLEAN INPUT STAGE
========================= */
export function cleanInputStage() {
  return {
    name: "clean_input",
    critical: true,
    run: async (input) => {
      if (typeof input === "string") {
        return input.trim().toLowerCase();
      }
      return input;
    },
  };
}

/* =========================
   ENRICH CONTEXT STAGE
========================= */
export function enrichContextStage() {
  return {
    name: "enrich_context",
    run: async (input, ctx) => ({
      input,
      user: ctx.user,
      timestamp: Date.now(),
    }),
  };
}

/* =========================
   AI ROUTER STAGE (OPTIMIZED INTENT ENGINE)
========================= */
export function aiRouterStage(handlerMap = {}) {
  const router = handlerMap;

  return {
    name: "ai_router",
    run: async (input) => {
      const key = detectIntent(input);

      const handler = router[key];
      return handler ? handler(input) : input;
    },
  };
}

/* =========================
   INTENT DETECTION (FAST STRING SCAN)
========================= */
function detectIntent(input) {
  if (!input) return "unknown";

  const text = String(input);

  if (text.includes("course")) return "course";
  if (text.includes("certificate")) return "certificate";
  if (text.includes("mentor")) return "mentoring";
  if (text.includes("payment")) return "billing";

  return "general";
}

/* =========================
   EMBEDDING STAGE (LLM READY)
========================= */
export function embeddingStage(embeddingFn) {
  return {
    name: "embedding",
    run: async (input) => {
      if (!embeddingFn) return input;

      const vector = await embeddingFn(input);

      return { input, vector };
    },
  };
}

/* =========================
   RECOMMENDATION STAGE (AI PERSONALIZATION READY)
========================= */
export function recommendationStage(recommendFn) {
  return {
    name: "recommendation",
    run: async (input, ctx) => {
      if (!recommendFn) return input;

      const recommendations = await recommendFn(input, ctx);

      return { input, recommendations };
    },
  };
}
