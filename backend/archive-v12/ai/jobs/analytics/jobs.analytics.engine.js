export class JobsAnalyticsEngine {

  static analyze(jobs = []) {

    const total = jobs.length;

    const avg =
      total
        ? jobs.reduce((s, j) => s + (j.score || 0), 0) / total
        : 0;

    const high = jobs.filter(j => (j.score || 0) > 80).length;

    return {
      totalJobs: total,
      averageMatchScore: Math.round(avg),
      highDemandJobs: high,
      demandRate: total ? Math.round((high / total) * 100) : 0
    };
  }
}

