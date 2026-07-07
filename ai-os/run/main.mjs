import AIRouter from "./AIRouter.js";
import Executor from "./Executor.js";

const router = new AIRouter({ debug: true });
const executor = new Executor();

const input = process.argv.slice(2).join(" ");

console.log("================================");
console.log("🚀 AI-OS START");
console.log("================================");
console.log("🧠 INPUT:", input);
console.log("================================");

const decision = router.chat(input);

console.log("🧠 Intent:", decision.intent);
console.log("🤖 Model :", decision.model);
console.log("================================");

const result = await executor.run(decision.model, input);

console.log("🔥 RESULT");
console.log("================================");
console.log(result);