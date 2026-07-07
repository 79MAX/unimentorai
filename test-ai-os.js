import { AIOS } from "./src/core/ai/ai.os.js";

const os = new AIOS();

const result = await os.ask({
  prompt: "Bonjour, explique UniMentorAI en 1 phrase",
  task: "chat"
});

console.log("AI OS RESULT =>", result);
