import engine from "../engine/auto-fix-engine.js";

// =========================
// INPUT
// =========================
const input = process.argv.slice(2).join(" ") || "fix project";

// =========================
// CONFIG
// =========================
const DEBUG = process.env.DEBUG === "true";
const WATCHDOG_MS = 60000;

// =========================
// HIGH PRECISION TIMER
// =========================
function startTimer() {
  const start = process.hrtime.bigint();
  return () => Number(process.hrtime.bigint() - start) / 1e9;
}

// =========================
// SAFE PRINT
// =========================
function print(data) {
  try {
    console.log(JSON.stringify(data, null, 2));
  } catch {
    console.log("[NON SERIALIZABLE OUTPUT]", data);
  }
}

// =========================
// WATCHDOG (SAFE + CLEAN)
// =========================
function createWatchdog(ms, onTrigger) {
  return setTimeout(() => {
    console.log("⚠️ WATCHDOG: ENGINE STILL RUNNING");
    if (onTrigger) onTrigger();
  }, ms);
}

// =========================
// MAIN
// =========================
async function main() {

  console.log("================================");
  console.log("🚀 AI-OS V10 AUTONOMOUS RUNNER");
  console.log("================================");
  console.log("🧠 INPUT:", input);
  console.log("================================");

  if (!engine?.run) {
    throw new Error("ENGINE_INVALID: run() missing");
  }

  const stopTimer = startTimer();

  // =========================
  // WATCHDOG HANDLE (CAN BE CLEARED)
  // =========================
  const watchdog = createWatchdog(WATCHDOG_MS);

  try {

    const result = await engine.run(input);

    const duration = stopTimer();

    clearTimeout(watchdog);

    console.log("\n================================");
    console.log("🔥 RESULT");
    console.log("================================");

    print(result);

    console.log("================================");
    console.log("⏱️ TIME:", duration.toFixed(3), "s");
    console.log("================================");

    if (DEBUG) {
      console.log("🧪 DEBUG MODE ENABLED");
    }

    return process.exit(0);

  } catch (err) {

    clearTimeout(watchdog);

    console.log("\n================================");
    console.log("❌ ENGINE FAILURE");
    console.log("================================");

    console.error({
      message: err?.message,
      stack: err?.stack?.split("\n").slice(0, 5)
    });

    console.log("================================");

    return process.exit(1);
  }
}

// =========================
// GLOBAL SAFETY NET
// =========================
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err?.message || err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err?.message || err);
});

main();
