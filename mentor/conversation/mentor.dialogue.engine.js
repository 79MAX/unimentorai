/**
 * ==========================================
 * 💬 MENTOR DIALOGUE ENGINE
 * UniMentorAI Conversation Planning System
 * ==========================================
 * Responsibilities:
 * - structure pedagogical conversations
 * - decide dialogue flow
 * - build response blueprint
 * - prepare response generator inputs
 * ==========================================
 */

class MentorDialogueEngine {

  constructor() {

    this.dialogueTemplates = {

      EXPLANATION: {
        flow: [
          "acknowledge",
          "explain",
          "example",
          "verify_understanding"
        ]
      },

      PRACTICE: {
        flow: [
          "acknowledge",
          "instruction",
          "exercise",
          "encourage"
        ]
      },

      ASSESSMENT: {
        flow: [
          "acknowledge",
          "question",
          "evaluation"
        ]
      },

      DEEP_DIVE: {
        flow: [
          "acknowledge",
          "deep_explanation",
          "real_world_application",
          "reflection"
        ]
      },

      HELP: {
        flow: [
          "empathy",
          "simplify",
          "example",
          "encourage"
        ]
      },

      GENERAL_LEARNING: {
        flow: [
          "acknowledge",
          "teach",
          "example"
        ]
      }
    };
  }

  /**
   * ==========================================
   * MAIN ENTRY
   * ==========================================
   */
  generate(userId, input, context) {

    const template =
      this.selectTemplate(context);

    return {

      dialogueType:
        context.intent,

      flow:
        template.flow,

      communicationStyle:
        this.determineStyle(context),

      priority:
        this.determinePriority(context),

      pedagogicalGoal:
        this.determineGoal(context),

      suggestedLength:
        this.determineLength(context)
    };
  }

  /**
   * ==========================================
   * TEMPLATE SELECTION
   * ==========================================
   */
  selectTemplate(context) {

    return (
      this.dialogueTemplates[
        context.intent
      ] ||
      this.dialogueTemplates
        .GENERAL_LEARNING
    );
  }

  /**
   * ==========================================
   * COMMUNICATION STYLE
   * ==========================================
   */
  determineStyle(context) {

    if (context.confusion > 0.7) {
      return "SIMPLIFIED";
    }

    if (context.engagement > 0.8) {
      return "INTERACTIVE";
    }

    if (
      context.intent === "DEEP_DIVE"
    ) {
      return "DETAILED";
    }

    return "BALANCED";
  }

  /**
   * ==========================================
   * PRIORITY ENGINE
   * ==========================================
   */
  determinePriority(context) {

    if (context.confusion > 0.7) {
      return "UNDERSTANDING";
    }

    if (
      context.intent === "PRACTICE"
    ) {
      return "APPLICATION";
    }

    if (
      context.intent === "ASSESSMENT"
    ) {
      return "VALIDATION";
    }

    return "LEARNING";
  }

  /**
   * ==========================================
   * PEDAGOGICAL GOAL
   * ==========================================
   */
  determineGoal(context) {

    switch (context.intent) {

      case "EXPLANATION":
        return "UNDERSTAND_CONCEPT";

      case "PRACTICE":
        return "APPLY_KNOWLEDGE";

      case "ASSESSMENT":
        return "MEASURE_MASTERY";

      case "DEEP_DIVE":
        return "DEVELOP_EXPERTISE";

      case "HELP":
        return "REMOVE_BLOCKER";

      default:
        return "PROGRESS";
    }
  }

  /**
   * ==========================================
   * RESPONSE LENGTH
   * ==========================================
   */
  determineLength(context) {

    if (context.confusion > 0.7) {
      return "SHORT";
    }

    if (
      context.intent === "DEEP_DIVE"
    ) {
      return "LONG";
    }

    return "MEDIUM";
  }

  /**
   * ==========================================
   * DIALOGUE INSIGHTS
   * ==========================================
   */
  insights(dialoguePlan) {

    return {

      type:
        dialoguePlan.dialogueType,

      style:
        dialoguePlan.communicationStyle,

      goal:
        dialoguePlan.pedagogicalGoal,

      priority:
        dialoguePlan.priority
    };
  }
}

module.exports =
  MentorDialogueEngine;
