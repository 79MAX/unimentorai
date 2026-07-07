import { JobsAPIEngine } from "../api/jobs.api.engine.js";

export class JobsAINextLevelEngine {

  static execute(user, jobs) {

    const result = JobsAPIEngine.run(user, jobs);

    return {
      ...result,
      system: "JOBS_AI_NEXT_LEVEL",
      intelligence: "VECTOR_HYBRID_SCORING"
    };
  }
}

