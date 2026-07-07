import { AIService } from "./src/core/ai/ai.service.js";

const ai = new AIService();

const result = await ai.ask({
  prompt: "Bonjour, explique-moi UniMentorAI en 1 phrase",
  task: "chat"
});

console.log("RESULT =>", result);
