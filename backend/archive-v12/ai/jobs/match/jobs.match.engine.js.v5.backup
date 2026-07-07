import { JobsVectorEngine } from "../vector/jobs.vector.engine.js";

export class JobsMatchEngine {

  static match(user = {}, jobs = []) {

    const userVector = JobsVectorEngine.embed(
      (user.skills || []).join(" ")
    );

    return jobs.map(job => {

      const jobVector = JobsVectorEngine.embed(
        (job.skills || []).join(" ")
      );

      const semantic = JobsVectorEngine.cosine(userVector, jobVector);
      const skill = this.skillScore(user.skills || [], job.skills || []);

      const score = Math.round((semantic * 70) + (skill * 30));

      return {
        ...job,
        score,
        semanticScore: Math.round(semantic * 100),
        skillScore: Math.round(skill),
        level: this.level(score)
      };
    })
    .sort((a, b) => b.score - a.score);
  }

  static skillScore(userSkills = [], jobSkills = []) {

    const set = new Set(userSkills.map(s => s.toLowerCase()));

    let match = 0;

    for (const s of jobSkills) {
      if (set.has(s.toLowerCase())) match++;
    }

    return jobSkills.length
      ? (match / jobSkills.length) * 100
      : 0;
  }

  static level(score) {

    if (score >= 85) return "PERFECT";
    if (score >= 70) return "STRONG";
    if (score >= 50) return "GOOD";
    if (score >= 30) return "WEAK";
    return "NO_MATCH";
  }
}

