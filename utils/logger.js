export default class Logger {

  constructor({ debug = false, context = "AI-OS" } = {}) {
    this.debug = debug;
    this.context = context;
  }

  // =========================
  // BASE LOG FORMATTER
  // =========================
  format(level, label, data) {

    const time = new Date().toISOString();

    return {
      time,
      context: this.context,
      level,
      label,
      data
    };
  }

  // =========================
  // SAFE PRINT
  // =========================
  print(obj) {
    try {
      console.log(JSON.stringify(obj, null, 2));
    } catch {
      console.log("[LOGGER ERROR] Non serializable data");
    }
  }

  // =========================
  // INFO
  // =========================
  info(label, data = null) {

    if (!this.debug) return;

    this.print(this.format("INFO", label, data));
  }

  // =========================
  // WARN
  // =========================
  warn(label, data = null) {

    this.print(this.format("WARN", label, data));
  }

  // =========================
  // ERROR (SMART STACK TRIM)
  // =========================
  error(label, err) {

    const cleanError = {
      message: err?.message || err,
      stack: err?.stack
        ? err.stack.split("\n").slice(0, 5)
        : null
    };

    this.print(this.format("ERROR", label, cleanError));
  }

  // =========================
  // RAW SAFE OUTPUT
  // =========================
  raw(data) {

    try {
      this.print(this.format("RAW", "OUTPUT", data));
    } catch {
      console.log("[LOGGER RAW FAIL]");
    }
  }

  // =========================
  // SPECIAL: ROUTE TRACE (AI-OS)
  // =========================
  trace(step, meta = {}) {

    if (!this.debug) return;

    this.print(this.format("TRACE", step, meta));
  }
}
