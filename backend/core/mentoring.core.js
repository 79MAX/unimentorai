export class MentoringCore {

  /* =========================
     🤝 SMART MENTOR MATCHING ENGINE
  ========================= */
  static matchMentors(user, mentors = []) {

    const userSkills =
      (user.skills || [])
        .map(s => s.toLowerCase().trim());

    return mentors
      .map(mentor => {

        const mentorSkills =
          (mentor.skills || [])
            .map(s => s.toLowerCase().trim());

        const commonSkills =
          mentorSkills.filter(skill =>
            userSkills.includes(skill)
          );

        const matchScore =
          mentorSkills.length > 0
            ? (commonSkills.length / mentorSkills.length) * 100
            : 0;

        return {
          mentorId: mentor.id,
          name: mentor.name,
          expertise: mentorSkills,

          matchScore: Math.round(matchScore),

          commonSkills,

          availability:
            mentor.availability || "unknown"
        };
      })
      .sort((a, b) =>
        b.matchScore - a.matchScore
      );
  }

  /* =========================
     📅 SESSION CREATION ENGINE (SAAS SAFE)
  ========================= */
  static createSession(userId, mentorId, topic) {

    if (!userId || !mentorId || !topic) {
      throw new Error("Missing session parameters");
    }

    return {
      sessionId:
        `SESSION_${Date.now()}_${Math.floor(Math.random() * 1000)}`,

      userId,
      mentorId,
      topic,

      status: "PENDING",

      createdAt: new Date().toISOString(),

      messages: []
    };
  }

  /* =========================
     💬 SESSION MESSAGE ENGINE
  ========================= */
  static generateSessionMessage(type = "TEXT", content = "") {

    if (!content) {
      throw new Error("Message content required");
    }

    return {
      id: `MSG_${Date.now()}`,

      type,

      content: content.trim(),

      timestamp: new Date().toISOString()
    };
  }

  /* =========================
     🔄 REVERSE MENTORING ENGINE (IMPROVED LOGIC)
  ========================= */
  static reverseMentoring(mentor, junior) {

    return {
      sessionType: "REVERSE_MENTORING",

      mentor: {
        id: mentor.id,
        skills: mentor.skills || []
      },

      junior: {
        id: junior.id,
        skills: junior.skills || []
      },

      learningFlow: {
        mentorTeaches:
          (junior.skills || []),

        juniorTeaches:
          (mentor.areasToLearn || [])
      },

      focusAreas: [
        "Digital Skills",
        "Innovation",
        "Modern Tools",
        "Career Growth"
      ]
    };
  }

  /* =========================
     ⭐ RATING SYSTEM (SAAS GRADE)
  ========================= */
  static rateSession(sessionId, rating = 0, feedback = "") {

    if (!sessionId) {
      throw new Error("Session ID required");
    }

    const normalizedRating =
      Math.max(1, Math.min(5, rating));

    return {
      sessionId,

      rating: normalizedRating,

      feedback: feedback.trim(),

      status:
        normalizedRating >= 4
          ? "EXCELLENT"
          : normalizedRating >= 3
          ? "GOOD"
          : "NEEDS_IMPROVEMENT",

      ratedAt: new Date().toISOString()
    };
  }
}

