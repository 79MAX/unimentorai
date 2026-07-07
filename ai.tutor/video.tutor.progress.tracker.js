/**
 * VIDEO TUTOR PROGRESS TRACKER - UniMentorAI
 * Tracks, analyzes and structures user learning progress
 */

class VideoTutorProgressTracker {
  constructor({ db, analytics, logger }) {
    this.db = db;
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: update progress state
   */
  async updateProgress({ userId, courseId, videoId, event }) {
    try {
      const current = await this._getProgress(userId, courseId);

      const updated = this._applyEvent(current, event, videoId);

      const metrics = this._computeMetrics(updated);

      await this._saveProgress(userId, courseId, updated, metrics);

      await this._trackAnalytics(userId, courseId, videoId, event, metrics);

      return {
        progress: updated,
        metrics,
        status: this._getStatus(metrics)
      };

    } catch (error) {
      this.logger.error("ProgressTracker error", error);

      return this._fallback();
    }
  }

  /**
   * 📦 Retrieve existing progress
   */
  async _getProgress(userId, courseId) {
    const data = await this.db.progress.findOne({
      userId,
      courseId
    });

    return data || {
      completedVideos: [],
      watchTime: 0,
      lastVideoId: null,
      streak: 0
    };
  }

  /**
   * ⚙️ Apply new event to progress state
   */
  _applyEvent(current, event, videoId) {
    const updated = { ...current };

    switch (event.type) {
      case "video_complete":
        if (!updated.completedVideos.includes(videoId)) {
          updated.completedVideos.push(videoId);
        }
        break;

      case "video_watch":
        updated.watchTime += event.duration || 0;
        updated.lastVideoId = videoId;
        break;

      case "video_skip":
        updated.lastVideoId = videoId;
        break;

      case "session_start":
        updated.streak = (updated.streak || 0) + 1;
        break;

      default:
        break;
    }

    updated.lastUpdated = Date.now();

    return updated;
  }

  /**
   * 📊 Compute learning metrics
   */
  _computeMetrics(progress) {
    const totalVideos = progress.totalVideos || 1;
    const completed = progress.completedVideos.length;

    const completionRate = completed / totalVideos;
    const avgWatchTime = progress.watchTime / Math.max(completed, 1);

    return {
      completionRate: Math.round(completionRate * 100),
      avgWatchTime,
      totalCompleted: completed,
      streak: progress.streak || 0,
      engagementScore: this._engagementScore(progress)
    };
  }

  /**
   * 🔥 Engagement scoring engine
   */
  _engagementScore(progress) {
    let score = 50;

    score += (progress.completedVideos.length || 0) * 2;
    score += (progress.watchTime || 0) / 60;

    if (progress.streak > 3) score += 10;
    if (progress.streak > 7) score += 20;

    return Math.min(100, Math.round(score));
  }

  /**
   * 📈 Save progress state
   */
  async _saveProgress(userId, courseId, progress, metrics) {
    await this.db.progress.updateOne(
      { userId, courseId },
      {
        $set: {
          ...progress,
          metrics,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  /**
   * 📊 Analytics tracking
   */
  async _trackAnalytics(userId, courseId, videoId, event, metrics) {
    await this.analytics.track("progress_update", {
      userId,
      courseId,
      videoId,
      event: event.type,
      completionRate: metrics.completionRate,
      engagementScore: metrics.engagementScore,
      timestamp: Date.now()
    });
  }

  /**
   * 🚦 Learning status classification
   */
  _getStatus(metrics) {
    if (metrics.completionRate > 80) return "advanced";
    if (metrics.completionRate > 40) return "intermediate";
    return "beginner";
  }

  /**
   * 🔄 Safe fallback
   */
  _fallback() {
    return {
      progress: null,
      metrics: {
        completionRate: 0,
        engagementScore: 50
      },
      status: "unknown"
    };
  }
}

module.exports = VideoTutorProgressTracker;
