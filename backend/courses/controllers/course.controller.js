import { CourseService } from "../services/course.service.js";

/* =========================
   📚 COURSE CONTROLLER (V1 PRO)
========================= */

/* =========================
   📖 GET ALL COURSES
========================= */
export const getCourses = async (req, res) => {
  try {

    const courses = await CourseService.getAll();

    return res.status(200).json({
      success: true,
      data: courses
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: err.message
    });
  }
};

/* =========================
   🧑‍🎓 ENROLL COURSE
========================= */
export const enrollCourse = async (req, res) => {
  try {

    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const result = await CourseService.enroll(
      courseId,
      req.user.id
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Course not found or enrollment failed"
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Error enrolling course",
      error: err.message
    });
  }
};

/* =========================
   📊 UPDATE PROGRESS
========================= */
export const updateProgress = async (req, res) => {
  try {

    const { courseId, progress } = req.body;

    if (!courseId || progress === undefined) {
      return res.status(400).json({
        success: false,
        message: "courseId and progress are required"
      });
    }

    const result = await CourseService.updateProgress(
      courseId,
      req.user.id,
      progress
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Course or user not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Error updating progress",
      error: err.message
    });
  }
};
