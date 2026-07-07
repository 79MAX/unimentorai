const LearningEngine = require("./ai.adaptive.learning.service");

/**
 * RECOMMENDATION ENGINE - UniMentorAI
 * Next Best Action system (NBA AI layer)
 * Powers personalization + learning path optimization
 */

class RecommendationEngine {

  constructor(learningEngine) {
    this.learningEngine = learningEngine || new LearningEngine();
  }

  /**
   * 🚀 MAIN RECOMMENDATION ENTRY
   */
  async generate(userId) {

    const profile = await this.learningEngine.getUserProfile(userId);
    const weak = profile.weakAreas || [];
    const strong = profile.strongAreas || [];

    const recommendations = [];

    // ========================
    // 1. LEVEL-BASED PATH
    // ========================
    recommendations.push(
      ...this.generateLevelBased(profile)
    );

    // ========================
    // 2. WEAKNESS-BASED LEARNING
    // ========================
    recommendations.push(
      ...this.generateWeaknessBased(weak)
    );

    // ========================
    // 3. STRENGTH EXPANSION PATH
    // ========================
    recommendations.push(
      ...this.generateStrengthBased(strong)
    );

    // ========================
    // 4. ENGAGEMENT BOOSTER
    // ========================
    recommendations.push(
      ...this.generateEngagementBoost(profile)
    );

    // ========================
    // 5. FINAL SCORING + SORTING
    // ========================
    const ranked = this.rankRecommendations(recommendations);

    return {
      personalized: true,
      total: ranked.length,
      recommendations: ranked.slice(0, 10),
    };
  }

  // ========================
  // 📈 LEVEL-BASED PATH
  // ========================
  generateLevelBased(profile) {

    const base = [];

    if (profile.level === "beginner") {
      base.push({
        type: "course",
        title: "Introduction fundamentals",
        priority: 3,
        reason: "Beginner learning path"
      });

      base.push({
        type: "quiz",
        title: "Basic knowledge test",
        priority: 2,
        reason: "Skill validation"
      });
    }

    if (profile.level === "intermediate") {
      base.push({
        type: "course",
        title: "Intermediate mastery path",
        priority: 3,
        reason: "Skill progression"
      });

      base.push({
        type: "project",
        title: "Build real-world project",
        priority: 2,
        reason: "Applied learning"
      });
    }

    if (profile.level === "advanced") {
      base.push({
        type: "project",
        title: "Advanced capstone project",
        priority: 3,
        reason: "Expert mastery"
      });
    }

    return base;
  }

  // ========================
  // 🎯 WEAKNESS-BASED LEARNING
  // ========================
  generateWeaknessBased(weakAreas) {

    return weakAreas.map(area => ({
      type: "lesson",
      title: `Improve ${area}`,
      priority: 4,
      reason: "Weak area improvement",
    }));
  }

  // ========================
  // 🧠 STRENGTH EXPANSION
  // ========================
  generateStrengthBased(strongAreas) {

    return strongAreas.map(area => ({
      type: "advanced_topic",
      title: `Advanced ${area}`,
      priority: 2,
      reason: "Strength expansion",
    }));
  }

  // ========================
  // ⚡ ENGAGEMENT BOOSTER
  // ========================
  generateEngagementBoost(profile) {

    const boosts = [];

    if (profile.streak > 3) {
      boosts.push({
        type: "reward",
        title: "Daily learning streak bonus",
        priority: 5,
        reason: "Motivation boost"
      });
    }

    if (profile.history.length > 10) {
      boosts.push({
        type: "assessment",
        title: "Knowledge checkpoint test",
        priority: 3,
        reason: "Progress evaluation"
      });
    }

    return boosts;
  }

  // ========================
  // 📊 SMART RANKING ENGINE
  // ========================
  rankRecommendations(items) {

    return items
      .map(item => ({
        ...item,
        score: this.calculateScore(item),
      }))
      .sort((a, b) => b.score - a.score);
  }

  // ========================
  // 🧠 SCORING ALGORITHM
  // ========================
  calculateScore(item) {

    let score = item.priority || 1;

    if (item.type === "lesson") score += 2;
    if (item.type === "course") score += 3;
    if (item.type === "project") score += 4;
    if (item.type === "quiz") score += 2;

    // boost engagement
    if (item.reason?.includes("Weak")) score += 2;

    return score;
  }

  /**
   * 🔍 QUICK RECOMMENDATION (REAL-TIME)
   */
  async quickRecommendations(userId) {

    const profile = await this.learningEngine.getUserProfile(userId);

    return this.generate(userId);
  }
}

module.exports = RecommendationEngine;
