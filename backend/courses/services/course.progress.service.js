import Course from "../models/course.model.js";
import { CertificateTriggerService } from "../../certificates/services/certificate.trigger.service.js";

/* =========================
   📊 COURSE PROGRESS SERVICE
========================= */

export class CourseProgressService {

  static async updateProgress(courseId, userId, progress) {

    try {

      /* =========================
         📚 GET COURSE
      ========================= */
      const course = await Course.findById(courseId);

      if (!course) {
        throw new Error("Course not found");
      }

      /* =========================
         👤 FIND STUDENT (SAFE CAST)
      ========================= */
      const student = course.students.find(
        s => String(s.userId) === String(userId)
      );

      if (!student) {
        throw new Error("Student not enrolled in course");
      }

      /* =========================
         📊 NORMALIZE PROGRESS
      ========================= */
      const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

      const wasCompleted = student.completed === true;

      student.progress = safeProgress;

      /* =========================
         🏆 AUTO CERTIFICATE TRIGGER
      ========================= */
      const justCompleted =
        safeProgress >= 100 && !wasCompleted;

      let certificateResult = null;

      if (justCompleted) {

        student.completed = true;

        certificateResult =
          await CertificateTriggerService.handleCourseCompletion({
            userId,
            course,
            progress: safeProgress
          });
      }

      /* =========================
         💾 SAVE COURSE
      ========================= */
      await course.save();

      /* =========================
         📦 RETURN CLEAN RESPONSE
      ========================= */
      return {
        courseId,
        userId,
        progress: safeProgress,
        completed: student.completed,
        certificate: certificateResult?.certificate || null
      };

    } catch (error) {

      console.error("[COURSE_PROGRESS_ERROR]", {
        message: error.message,
        courseId,
        userId
      });

      throw error;
    }
  }
}
