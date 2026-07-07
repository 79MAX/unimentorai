const AIMetricsService = require("./ai.metrics.service");

/**
 * ADAPTIVE LEARNING ENGINE - UniMentorAI
 * Personalization + skill tracking + learning intelligence
 * Core of "AI Tutor Memory System"
 */

class AdaptiveLearningService {

  constructor() {
    // ⚠️ In production: replace with Redis / DB
    this.userProfiles = new Map();
  }

  /**
   * 🧠 GET USER PROFILE (LONG-TERM MEMORY)
   */
  async getUserProfile(userId) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        level: "beginner",
        skills: {},
        interests: [],
        history: [],
        weakAreas: [],
        strongAreas: [],
        streak: 0,
        lastActive: null,
      });
    }

    return this.userProfiles.get(userId);
  }

  /**
   * 📈 UPDATE USER LEARNING STATE
   */
  async update(userId, { input, response, type }) {

    const profile = await this.getUserProfile(userId);

    // ========================
    // 1. UPDATE HISTORY
    // ========================
    profile.history.push({
      input,
      type,
      timestamp: Date.now(),
    });

    // ========================
    // 2. UPDATE ACTIVITY STREAK
    // ========================
    const now = Date.now();

    if (profile.lastActive) {
      const diffDays =
        (now - profile.lastActive) / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) {
        profile.streak += 1;
      } else {
        profile.streak = 1;
      }
    } else {
      profile.streak = 1;
    }

    profile.lastActive = now;

    // ========================
    // 3. SKILL EXTRACTION (SIMPLE AI HEURISTIC)
    // ========================
    this.updateSkills(profile, input, type);

    // ========================
    // 4. LEVEL EVOLUTION ENGINE
    // ========================
    this.updateLevel(profile);

    // ========================
    // 5. WEAK / STRONG AREAS DETECTION
    // ========================
    this.analyzeStrengths(profile);

    // ========================
    // 6. SAVE PROFILE
    // ========================
    this.userProfiles.set(userId, profile);

    // ========================
    // 7. METRICS LOGGING
    // ========================
    await AIMetricsService.logInteraction({
      userId,
      prompt: input,
      response,
      type,
      success: true,
    });

    return profile;
  }

  /**
   * 🧠 SKILL EXTRACTION ENGINE
   */
  updateSkills(profile, input, type) {

    const keywords = input.toLowerCase().split(" ");

    keywords.forEach(word => {
      if (!profile.skills[word]) {
        profile.skills[word] = 0;
      }

      profile.skills[word] += 1;
    });

    // boost based on interaction type
    if (type === "quiz_generation") {
      profile.interests.push("assessment");
    }

    if (type === "course_generation") {
      profile.interests.push("learning");
    }
  }

  /**
   * 📈 LEVEL EVOLUTION SYSTEM
   */
  updateLevel(profile) {

    const totalInteractions = profile.history.length;

    if (totalInteractions > 50) {
      profile.level = "advanced";
    } else if (totalInteractions > 20) {
      profile.level = "intermediate";
    } else {
      profile.level = "beginner";
    }
  }

  /**
   * 🎯 ANALYZE STRENGTHS & WEAKNESSES
   */
  analyzeStrengths(profile) {

    const skills = profile.skills;

    const sortedSkills = Object.entries(skills)
      .sort((a, b) => b[1] - a[1]);

    profile.strongAreas = sortedSkills.slice(0, 5).map(s => s[0]);
    profile.weakAreas = sortedSkills.slice(-5).map(s => s[0]);
  }

  /**
   * 📊 GET USER INTELLIGENCE SNAPSHOT
   */
  async getUserIntelligence(userId) {

    const profile = await this.getUserProfile(userId);

    return {
      level: profile.level,
      streak: profile.streak,
      strongAreas: profile.strongAreas,
      weakAreas: profile.weakAreas,
      totalInteractions: profile.history.length,
    };
  }

  /**
   * 🔍 ANALYZE WEAKNESS (FOR RECOMMENDATION ENGINE)
   */
  async analyzeWeakness(userId) {

    const profile = await this.getUserProfile(userId);

    return {
      weakAreas: profile.weakAreas,
      suggestedFocus: profile.weakAreas[0] || "general learning",
      level: profile.level,
    };
  }

  /**
   * 🔁 RESET / CLEAN MEMORY (ADMIN TOOL)
   */
  async resetUser(userId) {
    this.userProfiles.delete(userId);
    return true;
  }
}

module.exports = new AdaptiveLearningService();
