import fs from "fs";
import path from "path";

/**
 * ==================================================
 * SECURITY OBSERVABILITY ENGINE V2
 * UniMentorAI Security Audit & Event Stream
 * ==================================================
 */

class SecurityObservability {
  constructor() {
    this.logBuffer = [];
    this.maxBufferSize = 50;
    this.logFile = path.join("logs", "security.log");
  }

  /**
   * ==================================================
   * MAIN LOG ENTRY
   * ==================================================
   */
  async log(event) {
    const enrichedEvent = this._enrich(event);

    this._pushToBuffer(enrichedEvent);

    // Async flush (non-blocking)
    if (this.logBuffer.length >= this.maxBufferSize) {
      this._flush();
    }

    return true;
  }

  /**
   * ==================================================
   * EVENT ENRICHMENT
   * ==================================================
   */
  _enrich(event) {
    return {
      ...event,
      system: "UniMentorAI",
      timestamp: new Date().toISOString(),
      severity: this._calculateSeverity(event),
    };
  }

  /**
   * ==================================================
   * BUFFER MANAGEMENT
   * ==================================================
   */
  _pushToBuffer(event) {
    this.logBuffer.push(event);
  }

  /**
   * ==================================================
   * FLUSH TO STORAGE
   * ==================================================
   */
  async _flush() {
    const logsToWrite = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this._writeToFile(logsToWrite);
    } catch (error) {
      console.error("❌ Security observability flush error:", error);
    }
  }

  /**
   * ==================================================
   * FILE STORAGE (FUTURE: DB / ELASTIC / KAFKA)
   * ==================================================
   */
  async _writeToFile(logs) {
    const dir = path.dirname(this.logFile);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const formatted = logs
      .map((log) => JSON.stringify(log))
      .join("\n") + "\n";

    fs.appendFileSync(this.logFile, formatted);
  }

  /**
   * ==================================================
   * SEVERITY ENGINE
   * ==================================================
   */
  _calculateSeverity(event) {
    if (event.decision === "BLOCK") return "CRITICAL";
    if (event.decision === "QUARANTINE") return "HIGH";
    if (event.decision === "THROTTLE") return "MEDIUM";
    if (event.decision === "CHALLENGE") return "LOW";
    return "INFO";
  }

  /**
   * ==================================================
   * ANALYTICS READY HOOK
   * ==================================================
   */
  getRecentLogs(limit = 100) {
    return this.logBuffer.slice(-limit);
  }

  /**
   * ==================================================
   * FUTURE AI FEED (FOR ML MODELS)
   * ==================================================
   */
  exportForAI() {
    return this.logBuffer.map((log) => ({
      risk: log.riskScore,
      action: log.action,
      decision: log.decision,
      severity: log.severity,
      timestamp: log.timestamp,
    }));
  }
}

export const securityObservability =
  new SecurityObservability();
