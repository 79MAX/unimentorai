import { spawn } from "child_process";

run(model, prompt, intent = "GENERAL") {

  return new Promise((resolve) => {

    const timeout = this.timeoutMap?.[intent] || 60000;

    let output = "";
    let error = "";
    let done = false;

    const child = spawn("ollama", ["run", model], {
      windowsHide: true,
      shell: false,
      stdio: ["pipe", "pipe", "pipe"]
    });

    // =========================
    // SAFE FINISH (IDEMPOTENT)
    // =========================
    const finish = (data) => {
      if (done) return;
      done = true;

      if (timer) clearTimeout(timer);

      try {
        child.stdout?.removeAllListeners();
        child.stderr?.removeAllListeners();
        child.removeAllListeners();
      } catch {}

      resolve(data);
    };

    // =========================
    // TIMEOUT SAFE INIT FIRST
    // =========================
    const timer = setTimeout(() => {

      try {
        child.kill("SIGKILL");
      } catch {}

      finish({
        model,
        output: null,
        error: "TIMEOUT"
      });

    }, timeout);

    // =========================
    // STREAM OUTPUT (SAFE BUFFER LIMIT)
    // =========================
    const MAX_SIZE = 2_000_000; // 2MB safety

    child.stdout.on("data", (chunk) => {

      if (output.length < MAX_SIZE) {
        output += chunk.toString();
      }
    });

    child.stderr.on("data", (chunk) => {
      if (error.length < 200_000) {
        error += chunk.toString();
      }
    });

    // =========================
    // PROCESS END
    // =========================
    child.on("close", (code) => {

      finish({
        model,
        output: output.trim() || null,
        error: error.trim() || null,
        exitCode: code
      });
    });

    // =========================
    // SPAWN ERROR
    // =========================
    child.on("error", (err) => {

      finish({
        model,
        output: null,
        error: err?.message || "SPAWN_ERROR"
      });
    });

    // =========================
    // SAFE PROMPT INPUT
    // =========================
    try {
      if (child.stdin.writable) {
        child.stdin.write(prompt);
        child.stdin.end();
      } else {
        finish({
          model,
          output: null,
          error: "STDIN_NOT_WRITABLE"
        });
      }
    } catch (e) {
      finish({
        model,
        output: null,
        error: "STDIN_WRITE_FAILED"
      });
    }
  });
}
