export class CourseModel {
  static create(course) {
    return {
      id: `COURSE-${Date.now()}`,
      title: course.title,
      level: course.level || "beginner",
      modules: course.modules || [],
      createdAt: new Date().toISOString()
    };
  }
}

