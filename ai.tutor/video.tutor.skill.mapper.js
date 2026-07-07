/**
 * VIDEO TUTOR SKILL MAPPER - UniMentorAI
 * Maps learning content and user progress into structured skills
 */

class VideoTutorSkillMapper {
  constructor({ analytics, progressTracker, logger }) {
    this.analytics = analytics;
    this.progressTracker = progressTracker;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: map user progress to skills
   */
  async mapUserSkills({ userId, courseId }) {
    try {
      const progress = await this.progressTracker.updateProgress({
        userId,
        courseId,
        videoId: null,
        event: { type: "skill_mapping_request" }
      });

      const skills = await this._buildSkillGraph(courseId);

      const userSkills = this._evaluateUserSkills(progress, skills);

      const mastery = this._computeMastery(userSkills);

      const gaps = this._detectSkillGaps(userSkills);

      await this._trackMapping(userId, courseId, mastery);

      return {
        skills: userSkills,
        mastery,
        gaps,
        status: this._getSkillLevel(mastery)
      };

    } catch (error) {
      this.logger.error("SkillMapper error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Build course skill graph
   */
  async _buildSkillGraph(courseId) {
    // In real system: DB or AI-generated curriculum graph
    return [
      { id: "basics", weight: 1 },
      { id: "intermediate", weight: 2 },
      { id: "advanced", weight: 3 },
      { id: "practical_application", weight: 4 }
    ];
  }

  /**
   * 📊 Evaluate user skill levels
   */
  _evaluateUserSkills(progress, skills) {
    const completion = progress.metrics?.completionRate || 0;
    const engagement = progress.metrics?.engagementScore || 50;

    return skills.map(skill => {
      let level = 0;

      // Base progression influence
      level += completion * 0.6;
      level += engagement * 0.4;

      // Skill weight adjustment
      level = level / (skill.weight || 1);

      return {
        skillId: skill.id,
        level: Math.min(100, Math.round(level)),
        weight: skill.weight
      };
    });
  }

  /**
   * 🎯 Compute overall mastery score
   */
  _computeMastery(userSkills) {
    if (!userSkills.length) return 0;

    const total = userSkills.reduce((sum, s) => sum + s.level, 0);
    return Math.round(total / userSkills.length);
  }

  /**
   * ⚠️ Detect skill gaps
   */
  _detectSkillGaps(userSkills) {
    return userSkills
      .filter(skill => skill.level < 50)
      .map(skill => ({
        skillId: skill.skillId,
        severity: skill.level < 20 ? "critical" : "medium"
      }));
  }

  /**
   * 📊 Skill level classification
   */
  _getSkillLevel(mastery) {
    if (mastery > 80) return "expert";
    if (mastery > 50) return "intermediate";
    return "beginner";
  }

  /**
   * 📈 Analytics tracking
   */
  async _trackMapping(userId, courseId, mastery) {
    await this.analytics.track("skill_mapping", {
      userId,
      courseId,
      mastery,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Safe fallback
   */
  _fallback() {
    return {
      skills: [],
      mastery: 0,
      gaps: [],
      status: "unknown"
    };
  }
}

module.exports = VideoTutorSkillMapper;
