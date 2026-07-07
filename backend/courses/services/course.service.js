import Course from "../models/course.model.js";

/* =========================
   📚 COURSE SERVICE (V1 PRO)
========================= */

export class CourseService {

  /* =========================
     📖 GET ALL COURSES
  ========================= */
  static async getAll() {
    return Course.find({ isPublished: true })
      .select("-students") // optimisation perf
      .lean();
  }

  /* =========================
     🧑‍🎓 ENROLL USER
  ========================= */
  static async enroll(courseId, userId) {

    if (!courseId || !userId) return null;

    const course = await Course.findById(courseId);

    if (!course) return null;

    // éviter double inscription
    const alreadyEnrolled = course.students.some(
      s => s.userId.toString() === userId
    );

    if (alreadyEnrolled) return course;

    course.students.push({
      userId,
      progress: 0,
      completed: false
    });

    return course.save();
  }

  /* =========================
     📊 UPDATE PROGRESS
  ========================= */
  static async updateProgress(courseId, userId, progress) {

    if (!courseId || !userId) return null;

    const course = await Course.findById(courseId);

    if (!course) return null;

    const student = course.students.find(
      s => s.userId.toString() === userId
    );

    if (!student) return null;

    // sécurité valeur progress
    const safeProgress = Math.min(100, Math.max(0, progress));

    student.progress = safeProgress;

    if (safeProgress >= 100) {
      student.completed = true;
    }

    return course.save();
  }
}
