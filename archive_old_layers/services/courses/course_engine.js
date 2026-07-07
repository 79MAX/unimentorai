/**
 * 📚 COURSE ENGINE — UNIMENTORAI MVP (OPTIMIZED)
 * Offline-first + scalable + production-safe
 */

export class CourseEngine {

  // 🧠 MEMORY LAYERS (separated)
  static courses = new Map();
  static userProgress = new Map();

  // 🚀 INIT ENGINE
  static init() {
    console.log("📚 COURSE ENGINE INITIALIZED");
  }

  // 📦 VALIDATION LAYER (IMPORTANT FIX)
  static validateCourse(data) {

    if (!data?.id || !data?.title) {
      throw new Error("INVALID_COURSE_DATA");
    }

    if (!Array.isArray(data.lessons)) {
      throw new Error("INVALID_LESSONS_STRUCTURE");
    }

    return true;
  }

  // 📦 CREATE COURSE (SAFE VERSION)
  static createCourse(data) {

    this.validateCourse(data);

    const course = {
      id: data.id,
      title: data.title,
      language: data.language || "fr",
      level: data.level || "beginner",
      lessons: data.lessons || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "ACTIVE"
    };

    this.courses.set(course.id, course);

    // 💾 AUTO SAVE OFFLINE
    this.saveOffline(course);

    return course;
  }

  // 📖 GET COURSE (SAFE)
  static getCourse(courseId) {
    return this.courses.get(courseId) || this.loadOffline(courseId);
  }

  // 📘 GET LESSON (SAFE SEARCH)
  static getLesson(courseId, lessonId) {

    const course = this.getCourse(courseId);

    if (!course?.lessons) return null;

    return course.lessons.find(l => l.id === lessonId) || null;
  }

  // 📊 START PROGRESS (IMPROVED STATE MODEL)
  static startCourse(userId, courseId) {

    if (!userId || !courseId) {
      throw new Error("INVALID_USER_OR_COURSE");
    }

    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, {});
    }

    const progressState = {
      courseId,
      completedLessons: [],
      progress: 0,
      startedAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.userProgress.get(userId)[courseId] = progressState;

    return progressState;
  }

  // 📈 COMPLETE LESSON (SAFE + CONSISTENT)
  static completeLesson(userId, courseId, lessonId) {

    const userData = this.userProgress.get(userId);

    if (!userData?.[courseId]) {
      throw new Error("COURSE_NOT_STARTED");
    }

    const progress = userData[courseId];

    // prevent duplicates
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    const course = this.getCourse(courseId);

    if (!course) {
      throw new Error("COURSE_NOT_FOUND");
    }

    const total = course.lessons.length || 1;
    const done = progress.completedLessons.length;

    progress.progress = Math.min(
      100,
      Math.round((done / total) * 100)
    );

    progress.lastUpdated = Date.now();

    // 💾 AUTO SAVE PROGRESS
    this.saveProgress(userId, courseId, progress);

    return progress;
  }

  // 🧠 AI EXPLANATION (SAFE WRAPPER)
  static async explainLesson(lesson, aiService, context = {}) {

    if (!lesson || !aiService) {
      throw new Error("INVALID_AI_REQUEST");
    }

    return await aiService.ask(
      `Explique ce cours simplement: ${lesson.title}`,
      {
        level: context.level || "beginner",
        language: context.language || "fr"
      }
    );
  }

  // 🧪 QUIZ ENGINE (IMPROVED SAFETY)
  static evaluateQuiz(answers = [], correctAnswers = []) {

    if (!Array.isArray(answers) || !Array.isArray(correctAnswers)) {
      throw new Error("INVALID_QUIZ_DATA");
    }

    let score = 0;

    const length = Math.min(answers.length, correctAnswers.length);

    for (let i = 0; i < length; i++) {
      if (answers[i] === correctAnswers[i]) {
        score++;
      }
    }

    const percentage = Math.round((score / length) * 100);

    return {
      score,
      total: length,
      percentage,
      passed: percentage >= 50
    };
  }

  // 💾 OFFLINE SAVE (SAFE SERIALIZATION)
  static saveOffline(course) {

    try {

      const serialized = JSON.stringify(course);

      localStorage.setItem(`course_${course.id}`, serialized);

      return true;

    } catch (error) {
      console.error("OFFLINE_SAVE_ERROR", error);
      return false;
    }
  }

  // 📥 LOAD OFFLINE (SAFE PARSING)
  static loadOffline(courseId) {

    try {

      const data = localStorage.getItem(`course_${courseId}`);

      if (!data) return null;

      return JSON.parse(data);

    } catch (error) {
      console.error("OFFLINE_LOAD_ERROR", error);
      return null;
    }
  }

  // 💾 SAVE PROGRESS (NEW — IMPORTANT FIX)
  static saveProgress(userId, courseId, progress) {

    try {

      const key = `progress_${userId}_${courseId}`;

      localStorage.setItem(key, JSON.stringify(progress));

      return true;

    } catch (error) {
      return false;
    }
  }

  // 📊 LOAD PROGRESS
  static loadProgress(userId, courseId) {

    try {

      const key = `progress_${userId}_${courseId}`;

      const data = localStorage.getItem(key);

      return data ? JSON.parse(data) : null;

    } catch (error) {
      return null;
    }
  }
}
