import { AIOSv2 } from "./src/core/ai/ai.os.v2.js";

const os = new AIOSv2();

const result = await os.ask({
  prompt: "Explique-moi la différence entre IA et machine learning",
  task: "chat",
  context: {
    level: "beginner",
    domain: "education"
  }
});

console.log("AI OS v2 RESULT =>", result);
