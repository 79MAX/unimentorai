import { MentorEngine } from "../core/mentor.engine.js";
import { ContextBuilder } from "./context.builder.js";

export class MentorService {

  /* =========================
     🧠 MAIN ASK ORCHESTRATOR
  ========================= */
  static async ask({
    user,
    message,
    course,
    history = [],
    aiProvider
  }) {

    try {

      /* =========================
         🔍 INPUT VALIDATION
      ========================= */
      if (!user || !message) {
        throw new Error("Missing required parameters");
      }

      const cleanMessage = String(message).trim();

      /* =========================
         📦 BUILD CONTEXT
      ========================= */
      const context = ContextBuilder.build(user, course, history);

      /* =========================
         🧠 AI CALL (MENTOR ENGINE)
      ========================= */
      const result = await MentorEngine.generateResponse({
        user,
        message: cleanMessage,
        context,
        aiProvider
      });

      /* =========================
         📊 LOGGING (DEBUG / AUDIT)
      ========================= */
      console.log("[MENTOR_SERVICE]", {
        userId: user.id,
        course: course?.title,
        messageLength: cleanMessage.length,
        mode: result?.mode
      });

      /* =========================
         📤 RESPONSE WRAPPER
      ========================= */
      return {
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {

      /* =========================
         ⚠️ ERROR HANDLING
      ========================= */
      console.error("[MENTOR_SERVICE_ERROR]", {
        message: error.message,
        userId: user?.id
      });

      return {
        success: false,
        error: "Mentor service failed",
        fallback: {
          reply: "I’m currently unable to process your request. Please try again shortly.",
          mode: "MENTOR_FALLBACK"
        }
      };
    }
  }
}
