import router from "../engine/router.js";

const input = (process.argv.slice(2).join(" ") || "hello").trim();
const DEBUG = process.env.DEBUG === "true";

// =========================
// TIMER
// =========================
function timer() {
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
    console.log("[NON SERIALIZABLE]", data);
  }
}

// =========================
// HEADER
// =========================
function header() {
  console.log("\n================================");
  console.log("🚀 AI-OS ROUTER RUNNER V10");
  console.log("================================");
  console.log("🧠 INPUT:", input || "EMPTY");
  console.log("================================");
}

// =========================
// VALIDATION
// =========================
function validate() {

  if (!input) {
    throw new Error("EMPTY_INPUT");
  }

  if (!router?.chat) {
    throw new Error("ROUTER_INVALID: chat() missing");
  }
}

// =========================
// MAIN
// =========================
async function main() {

  header();

  const stop = timer();

  try {

    validate();

    const result = await router.chat(input);

    const duration = stop();

    console.log("\n================================");
    console.log("🔥 RESULT");
    console.log("================================");

    print(result);

    console.log("================================");
    console.log("⏱️ TIME:", duration.toFixed(3), "s");
    console.log("================================");

    if (DEBUG) {
      console.log("🧪 DEBUG MODE ON");
    }

  } catch (err) {

    const duration = stop();

    console.log("\n================================");
    console.log("❌ ROUTER ERROR");
    console.log("================================");

    console.error({
      message: err?.message || err,
      time: duration.toFixed(3) + "s"
    });
  } finally {

    // 🔥 always exit cleanly
    setTimeout(() => process.exit(0), 10);
  }
}

// =========================
// GLOBAL SAFETY
// =========================
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err?.message || err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err?.message || err);
});

// =========================
// START
// =========================
main();
