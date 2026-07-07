/* =========================
   🤖 AI COURSE GENERATOR
   UniMentorAI - Structured Learning Engine
========================= */

import { AIProvider } from "../../ai/ai.provider.js";

/* =========================
   🚀 GENERATE STRUCTURED COURSE
========================= */
export async function generateCourse({
  topic,
  level = "beginner",
  language = "en",
  audience = "student",
  durationDays = 30
}) {

  if (!topic) {
    throw new Error("TOPIC_REQUIRED");
  }

  /* =========================
     🧠 AI PROMPT ENGINE (STRUCTURED OUTPUT)
  ========================= */
  const prompt = `
You are an expert instructional designer for an AI learning platform (UniMentorAI).

Create a COMPLETE structured online course in JSON format.

STRICT REQUIREMENTS:
- Language: ${language}
- Level: ${level}
- Audience: ${audience}
- Duration: ${durationDays} days

TOPIC:
${topic}

OUTPUT FORMAT (JSON ONLY):

{
  "title": "",
  "description": "",
  "level": "",
  "language": "",
  "durationDays": ${durationDays},

  "modules": [
    {
      "title": "",
      "lessons": [
        {
          "title": "",
          "content": "",
          "quiz": [
            {
              "question": "",
              "options": [],
              "answer": ""
            }
          ],
          "exercise": ""
        }
      ]
    }
  ],

  "finalExam": {
    "questions": []
  },

  "learningOutcomes": [],
  "tags": []
}

RULES:
- Return ONLY valid JSON
- Make it practical and professional
- Adapt difficulty to level
- Include real-world examples
`;

  /* =========================
     🤖 AI GENERATION
  ========================= */
  const content = await AIProvider.generate(prompt);

  let parsedContent;

  /* =========================
     🔐 SAFE JSON PARSING
  ========================= */
  try {
    parsedContent = JSON.parse(content);
  } catch (err) {

    console.error("[COURSE_PARSE_ERROR]", err.message);

    parsedContent = {
      raw: content,
      parseError: true
    };
  }

  /* =========================
     📦 COURSE OBJECT
  ========================= */
  return {
    id: `AI-COURSE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

    topic,
    level,
    language,

    ...parsedContent,

    metadata: {
      generatedBy: "UniMentorAI_AI_ENGINE",
      model: "structured-course-v1",
      createdAt: new Date().toISOString()
    }
  };
}
