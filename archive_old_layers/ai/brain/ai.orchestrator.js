import { performance } from "node:perf_hooks";

import { MemoryService } from "../../memory/services/memory.service.js";
import { TutorStrategyService } from "../../services/tutor.strategy.service.js";
import { RankingService } from "../../ranking/services/ranking.service.js";
import { MentorService } from "../../mentor/services/mentor.service.js";
import { TutorFeedbackService } from "../../services/tutor.feedback.service.js";
import { MemoryWriter } from "../../memory/core/memory.writer.js";

export class AIOrchestrator {

  static MODES = {
    STANDARD: "STANDARD",
    SAFE_FALLBACK: "SAFE_FALLBACK"
  };

  /* =========================
     🧠 MAIN BRAIN EXECUTION
  ========================= */
  static async execute({
    user,
    message,
    course = null,
    history = [],
    feedback = null,
    availableCourses = [],
    aiProvider
  } = {}) {

    const traceId = this.generateTraceId();
    const startedAt = performance.now();

    try {

      /* =========================
         🔐 VALIDATION
      ========================= */
      this.validateInput({
        user,
        message,
        aiProvider
      });

      /* =========================
         🧠 LOAD MEMORY + FEEDBACK
         (PARALLEL)
      ========================= */
      const [memory, feedbackSignals] =
        await Promise.all([
          MemoryService.get(user.id),
          Promise.resolve(
            feedback
              ? TutorFeedbackService.analyze(feedback)
              : {}
          )
        ]);

      /* =========================
         🎯 BUILD STRATEGY
      ========================= */
      const strategy =
        TutorStrategyService.build({
          userMemory: memory,
          course,
          feedback: feedbackSignals
        });

      /* =========================
         🤖 MENTOR EXECUTION
      ========================= */
      const mentorResult =
        await MentorService.ask({
          user,
          message,
          course,
          history,
          aiProvider,
          strategy,
          traceId
        });

      /* =========================
         🧠 MEMORY SIGNAL EXTRACTION
      ========================= */
      const memorySignals =
        MemoryWriter.extractFromSession({
          weakAreas: mentorResult?.weakAreas,
          strongAreas: mentorResult?.strongAreas,
          progress: mentorResult?.progress,
          lastTopic: mentorResult?.topic,
          confidence: mentorResult?.confidence
        });

      /* =========================
         💾 UPDATE MEMORY
      ========================= */
      const updatedMemory =
        await MemoryService.patch(
          user.id,
          memorySignals
        );

      /* =========================
         📊 PERSONALIZED RANKING
      ========================= */
      const recommendations =
        availableCourses?.length
          ? RankingService.getRankedCourses(
              availableCourses,
              updatedMemory
            )
          : [];

      const executionTime =
        Math.round(performance.now() - startedAt);

      /* =========================
         ✅ SUCCESS RESPONSE
      ========================= */
      return {
        success: true,

        traceId,

        reply:
          mentorResult?.reply ??
          mentorResult,

        strategy,

        memory: updatedMemory,

        recommendations,

        metadata: {
          mode:
            strategy?.mode ??
            this.MODES.STANDARD,

          generatedAt:
            new Date().toISOString(),

          executionTimeMs:
            executionTime,

          recommendationCount:
            recommendations.length
        }
      };

    } catch (error) {

      const executionTime =
        Math.round(performance.now() - startedAt);

      console.error(
        "[AI_ORCHESTRATOR_ERROR]",
        {
          traceId,
          executionTimeMs: executionTime,
          message: error.message,
          stack: error.stack
        }
      );

      return {
        success: false,

        traceId,

        reply:
          "Une erreur temporaire est survenue lors du traitement de votre demande.",

        strategy: null,
        memory: null,
        recommendations: [],

        metadata: {
          mode: this.MODES.SAFE_FALLBACK,
          generatedAt:
            new Date().toISOString(),

          executionTimeMs:
            executionTime
        },

        error: {
          message: error.message
        }
      };
    }
  }

  /* =========================
     🔐 INPUT VALIDATION
  ========================= */
  static validateInput({
    user,
    message,
    aiProvider
  }) {

    if (!user?.id) {
      throw new Error(
        "User ID is required"
      );
    }

    if (!message?.trim()) {
      throw new Error(
        "Message is required"
      );
    }

    if (!aiProvider) {
      throw new Error(
        "AI provider is required"
      );
    }
  }

  /* =========================
     🧾 TRACE ID GENERATOR
  ========================= */
  static generateTraceId() {

    return [
      "BRAIN",
      Date.now().toString(36),
      crypto.randomUUID().slice(0, 8)
    ].join("-");
  }
}
