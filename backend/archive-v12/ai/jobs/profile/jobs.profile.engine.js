export class JobsProfileEngine {

  static buildProfile(user = {}) {

    const skills = user.skills || [];

    return {
      skillCount: skills.length,

      seniority:
        skills.length > 10 ? "EXPERT"
        : skills.length > 5 ? "INTERMEDIATE"
        : "BEGINNER",

      jobReadinessScore: Math.min(100, skills.length * 8)
    };
  }
}

