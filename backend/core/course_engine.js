/**
 * 📚 COURSE ENGINE — UNIMENTORAI MVP FINAL
 * Core learning system (offline + AI ready + scalable)
 */

export class CourseEngine {

  static courses = new Map();
  static userProgress = new Map();

  // 🚀 INIT ENGINE
  static init() {
    console.log("📚 COURSE ENGINE INITIALIZED");
  }

  // 📦 CREATE COURSE
  static createCourse({ id, title, description = "", level = "beginner", language = "fr", lessons = [] }) {

    if (!id || !title) {
      throw new Error("INVALID_COURSE_DATA");
    }

    const course = {
      id,
      title,
      description,
      level,
      language,
      lessons,
      createdAt: Date.now(),
      status: "ACTIVE"
    };

    this.courses.set(id, course);

    return course;
  }

  // 📖 GET COURSE
  static getCourse(courseId) {
    return this.courses.get(courseId) || null;
  }

  // 📚 GET ALL COURSES
  static getAllCourses() {
    return Array.from(this.courses.values());
  }

  // 📘 GET LESSON
  static getLesson(courseId, lessonId) {

    const course = this.getCourse(courseId);

    if (!course) return null;

    return course.lessons.find(l => l.id === lessonId) || null;
  }

  // 🚀 START COURSE
  static startCourse(userId, courseId) {

    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, {});
    }

    this.userProgress.get(userId)[courseId] = {
      completedLessons: [],
      progress: 0,
      startedAt: Date.now(),
      lastUpdate: Date.now()
    };

    return this.userProgress.get(userId)[courseId];
  }

  // 📈 COMPLETE LESSON
  static completeLesson(userId, courseId, lessonId) {

    const userCourses = this.userProgress.get(userId);

    if (!userCourses || !userCourses[courseId]) {
      throw new Error("COURSE_NOT_STARTED");
    }

    const progress = userCourses[courseId];

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    const course = this.getCourse(courseId);

    const total = course?.lessons?.length || 1;
    const done = progress.completedLessons.length;

    progress.progress = Math.round((done / total) * 100);
    progress.lastUpdate = Date.now();

    return progress;
  }

  // 🧠 GET PROGRESS
  static getProgress(userId, courseId) {

    const userCourses = this.userProgress.get(userId);

    if (!userCourses) return null;

    return userCourses[courseId] || null;
  }

  // 🧪 QUIZ ENGINE (BASIC MVP)
  static evaluateQuiz(answers, correctAnswers) {

    if (!Array.isArray(answers) || !Array.isArray(correctAnswers)) {
      throw new Error("INVALID_QUIZ_DATA");
    }

    let score = 0;

    answers.forEach((ans, index) => {
      if (ans === correctAnswers[index]) {
        score++;
      }
    });

    const total = correctAnswers.length;

    return {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      passed: score / total >= 0.5
    };
  }

  // 💾 OFFLINE SAVE (safe version)
  static saveOffline(course) {

    try {

      if (typeof localStorage === "undefined") return false;

      localStorage.setItem(
        `course_${course.id}`,
        JSON.stringify(course)
      );

      return true;

    } catch (error) {
      console.error("OFFLINE_SAVE_ERROR", error);
      return false;
    }
  }

  // 📥 LOAD OFFLINE
  static loadOffline(courseId) {

    try {

      if (typeof localStorage === "undefined") return null;

      const data = localStorage.getItem(`course_${courseId}`);

      return data ? JSON.parse(data) : null;

    } catch (error) {
      return null;
    }
  }
}

