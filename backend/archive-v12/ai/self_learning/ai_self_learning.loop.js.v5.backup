/**
 * 🔁 SELF LEARNING LOOP — AI IMPROVEMENT ENGINE (PRODUCTION)
 * Level: OpenAI / Meta ML feedback system style
 *
 * ROLE:
 * - Capture prediction vs reality
 * - Store structured learning memory
 * - Compute error signals
 * - Feed improvement loop
 */

export class AiSelfLearningLoop {

  /* =========================
     🧠 MEMORY CORE (RING BUFFER)
  ========================= */
  static memory = {
    logs: [],
    stats: {
      total: 0,
      lastError: 0,
      avgError: 0
    }
  };

  /* =========================
     🔁 SINGLE LEARNING STEP
  ========================= */
  static learn({ prediction = {}, actual = {} }) {

    const error = this.computeError(prediction, actual);

    const entry = {
      timestamp: Date.now(),
      prediction,
      actual,
      error
    };

    this.memory.logs.push(entry);
    this.memory.stats.total++;

    this.updateStats(error);
    this.pruneMemory();

    return {
      status: "LEARNED",
      error,
      memorySize: this.memory.logs.length,
      stats: this.memory.stats
    };
  }

  /* =========================
     📊 ERROR COMPUTATION ENGINE
  ========================= */
  static computeError(prediction, actual) {

    return {
      growthError: Math.abs((prediction.growth || 0) - (actual.growth || 0)),
      churnError: Math.abs((prediction.churn || 0) - (actual.churn || 0)),
      revenueError: Math.abs((prediction.revenue || 0) - (actual.revenue || 0)),

      totalError:
        Math.abs((prediction.growth || 0) - (actual.growth || 0)) +
        Math.abs((prediction.churn || 0) - (actual.churn || 0)) +
        Math.abs((prediction.revenue || 0) - (actual.revenue || 0))
    };
  }

  /* =========================
     📈 STATS ENGINE (ONLINE LEARNING METRICS)
  ========================= */
  static updateStats(error) {

    const prevAvg = this.memory.stats.avgError || 0;
    const total = this.memory.stats.total;

    this.memory.stats.lastError = error.totalError;

    this.memory.stats.avgError =
      ((prevAvg * (total - 1)) + error.totalError) / total;
  }

  /* =========================
     🧹 MEMORY OPTIMIZATION (SLIDING WINDOW)
  ========================= */
  static pruneMemory(maxSize = 1000) {

    if (this.memory.logs.length > maxSize) {
      this.memory.logs.splice(0, this.memory.logs.length - maxSize);
    }
  }

  /* =========================
     📦 BATCH LEARNING (ORCHESTRATOR MODE)
  ========================= */
  static batchLearn(buffer = []) {

    let totalError = 0;

    for (let i = 0; i < buffer.length; i++) {

      const item = buffer[i];

      const error = this.computeError(
        item.prediction || {},
        item.actual || {}
      );

      totalError += error.totalError;
    }

    const avgError = buffer.length ? totalError / buffer.length : 0;

    this.memory.stats.avgError = avgError;

    return {
      status: "BATCH_LEARNED",
      samples: buffer.length,
      avgError: Math.round(avgError)
    };
  }

  /* =========================
     ⚡ AUTO IMPROVEMENT SIGNAL
  ========================= */
  static autoImprove() {

    const avg = this.memory.stats.avgError;

    return {
      status: "MODEL_UPDATED",

      improvementSignal:
        avg > 50 ? "HIGH_OPTIMIZATION_REQUIRED"
        : avg > 20 ? "MODERATE_TUNING"
        : "MODEL_STABLE",

      avgError: Math.round(avg || 0)
    };
  }

  /* =========================
     🧠 MEMORY INSPECTION (DEBUG / AI OPS)
  ========================= */
  static getMemory() {

    return {
      size: this.memory.logs.length,
      stats: this.memory.stats
    };
  }
}

