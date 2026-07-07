export class MentoringCore {

  /* =========================
     🧠 SAFE UTIL
  ========================= */
  static normalizeSkills(skills = []) {
    return skills
      .filter(Boolean)
      .map(s => String(s).toLowerCase().trim());
  }

  /* =========================
     🤝 MENTOR MATCHING ENGINE (IMPROVED)
  ========================= */
  static matchMentors(user = {}, mentors = []) {

    const userSkills = this.normalizeSkills(user.skills);

    return mentors
      .map(mentor => {

        const mentorSkills = this.normalizeSkills(mentor.skills);

        const commonSkills = mentorSkills.filter(skill =>
          userSkills.includes(skill)
        );

        const baseScore = mentorSkills.length
          ? (commonSkills.length / mentorSkills.length)
          : 0;

        // bonus si mentor très compatible globalement
        const relevanceBoost = commonSkills.length > 3 ? 10 : 0;

        const score = Math.min(
          100,
          Math.round((baseScore * 100) + relevanceBoost)
        );

        return {
          mentorId: mentor.id,
          name: mentor.name,
          expertise: mentorSkills,
          commonSkills,
          matchScore: score,
          availability: mentor.available ?? true
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  /* =========================
     📅 SESSION CREATION ENGINE (SAFE)
  ========================= */
  static createSession(userId, mentorId, topic = "general") {

    const id = `SESSION-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      sessionId: id,
      userId,
      mentorId,
      topic,
      status: "PENDING",
      mode: "MENTORING",
      createdAt: new Date().toISOString()
    };
  }

  /* =========================
     💬 SESSION MESSAGE ENGINE (IMPROVED)
  ========================= */
  static createMessage(content, type = "TEXT", sender = "USER") {

    return {
      id: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      sender,
      content: String(content),
      timestamp: new Date().toISOString()
    };
  }

  /* =========================
     🔄 REVERSE MENTORING ENGINE (ENTERPRISE)
  ========================= */
  static reverseMentoring(mentor = {}, junior = {}) {

    const mentorSkills = this.normalizeSkills(mentor.skills);
    const juniorSkills = this.normalizeSkills(junior.skills);

    return {
      mentorId: mentor.id,
      juniorId: junior.id,

      focusAreas: [
        "Digital Skills",
        "Innovation",
        "Modern Tools"
      ],

      flow: {
        mentorTeaches: juniorSkills,
        juniorTeaches: mentor.areasToLearn || []
      },

      compatibilityScore: {
        mentorToJunior: mentorSkills.length,
        juniorToMentor: juniorSkills.length
      },

      mode: "REVERSE_MENTORING"
    };
  }

  /* =========================
     ⭐ SESSION RATING SYSTEM
  ========================= */
  static rateSession(sessionId, rating = 0, feedback = "") {

    const normalizedRating = Math.min(5, Math.max(0, rating));

    return {
      sessionId,
      rating: normalizedRating,
      feedback: String(feedback),
      status:
        normalizedRating >= 4 ? "EXCELLENT" :
        normalizedRating >= 3 ? "GOOD" : "NEEDS_IMPROVEMENT",
      ratedAt: new Date().toISOString()
    };
  }
}
