import { spawn } from "child_process";

export default class Executor {

  constructor() {
    this.timeout = 120000; // stable
    this.debug = process.env.DEBUG === "true";

    this.queue = Promise.resolve();
  }

  // =========================
  // QUEUE (SAFE SERIAL EXEC)
  // =========================
  run(model, prompt) {
    this.queue = this.queue.then(() => this._run(model, prompt));
    return this.queue;
  }

  // =========================
  // CLEAN OUTPUT (Ollama SAFE)
  // =========================
  clean(text = "") {
    return String(text)
      // remove thinking blocks
      .replace(/Thinking\.\.\.[\s\S]*?(?=\n\n|$)/gi, "")
      .replace(/\.{3}done thinking\./gi, "")

      // remove ANSI + spinner garbage
      .replace(/\x1b\[[0-9;]*m/g, "")
      .replace(/\u001b\[[0-9;]*m/g, "")
      .replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/g, "")

      .trim();
  }

  // =========================
  // CORE EXECUTION
  // =========================
  _run(model, prompt) {

    return new Promise((resolve) => {

      let output = "";
      let error = "";
      let finished = false;

      if (this.debug) {
        console.log("⚙️ EXECUTOR START");
        console.log("🤖 MODEL:", model);
      }

      // =========================
      // SPAWN SAFE (IMPORTANT)
      // =========================
      const child = spawn("ollama", ["run", model], {
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      });

      // =========================
      // SAFE FINISH WRAPPER
      // =========================
      const finish = (data) => {

        if (finished) return;
        finished = true;

        clearTimeout(timer);

        try {
          child.stdout?.removeAllListeners();
          child.stderr?.removeAllListeners();
          child.removeAllListeners();
        } catch {}

        resolve(data);
      };

      // =========================
      // TIMEOUT SAFE (PARTIAL OUTPUT)
      // =========================
      const timer = setTimeout(() => {

        if (this.debug) {
          console.log("⛔ TIMEOUT:", model);
        }

        try {
          child.kill("SIGTERM");
        } catch {}

        finish({
          model,
          output: output ? this.clean(output) : null,
          error: "TIMEOUT",
          partial: output.length > 0
        });

      }, this.timeout);

      // =========================
      // STDOUT STREAM
      // =========================
      child.stdout.on("data", (d) => {
        output += d.toString();
      });

      child.stderr.on("data", (d) => {
        error += d.toString();
      });

      // =========================
      // CLOSE EVENT
      // =========================
      child.on("close", (code) => {

        if (this.debug) {
          console.log("🔚 EXIT:", code);
          console.log("📦 OUTPUT LENGTH:", output.length);
        }

        finish({
          model,
          output: this.clean(output) || null,
          error: error.trim() || null,
          exitCode: code
        });
      });

      // =========================
      // SPAWN ERROR
      // =========================
      child.on("error", (err) => {

        if (this.debug) {
          console.log("💥 SPAWN ERROR:", err.message);
        }

        finish({
          model,
          output: null,
          error: err.message || "SPAWN_ERROR"
        });
      });

      // =========================
      // PROMPT SAFE WRITE (CRITICAL FIX)
      // =========================
      try {
        child.stdin.write(prompt + "\n");
        child.stdin.end();
      } catch (e) {
        finish({
          model,
          output: null,
          error: "STDIN_WRITE_FAILED"
        });
      }
    });
  }
}
