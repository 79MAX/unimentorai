import { JobsMatchEngine } from "../match/jobs.match.engine.js";
import { JobsRecommendationEngine } from "../recommendation/jobs.recommendation.engine.js";
import { JobsAnalyticsEngine } from "../analytics/jobs.analytics.engine.js";
import { JobsProfileEngine } from "../profile/jobs.profile.engine.js";

export class JobsAPIEngine {

  static run(user = {}, jobs = []) {

    const matched = JobsMatchEngine.match(user, jobs);
    const top = JobsRecommendationEngine.top(matched);
    const analytics = JobsAnalyticsEngine.analyze(matched);
    const profile = JobsProfileEngine.buildProfile(user);

    return {
      timestamp: Date.now(),
      profile,
      analytics,
      recommendations: top,
      totalMatches: matched.length
    };
  }
}

