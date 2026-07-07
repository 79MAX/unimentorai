import Course from "./models/course.model.js";

/* =========================
   📚 DEFAULT COURSES SEED
========================= */

const defaultCourses = [
  {
    title: "Introduction à l'Intelligence Artificielle",
    description: "Découvrir les bases de l'intelligence artificielle moderne.",
    level: "BEGINNER",
    category: "AI",
    duration: "4 semaines",
    isPublished: true
  },
  {
    title: "JavaScript Fondamentaux",
    description: "Apprendre JavaScript de zéro jusqu'aux bases solides.",
    level: "BEGINNER",
    category: "PROGRAMMING",
    duration: "6 semaines",
    isPublished: true
  },
  {
    title: "Entrepreneuriat Digital",
    description: "Créer, lancer et développer une activité numérique rentable.",
    level: "INTERMEDIATE",
    category: "BUSINESS",
    duration: "8 semaines",
    isPublished: true
  }
];

/* =========================
   🌱 DATABASE SEEDER
========================= */

export async function seedCourses() {

  try {

    const existingCourses =
      await Course.countDocuments();

    if (existingCourses > 0) {

      console.log(
        `📚 Seed skipped (${existingCourses} courses already exist)`
      );

      return {
        success: true,
        seeded: false,
        count: existingCourses
      };
    }

    const insertedCourses =
      await Course.insertMany(defaultCourses);

    console.log(
      `✅ ${insertedCourses.length} default courses created`
    );

    return {
      success: true,
      seeded: true,
      count: insertedCourses.length
    };

  } catch (error) {

    console.error(
      "[COURSE_SEED_ERROR]",
      error.message
    );

    return {
      success: false,
      error: error.message
    };
  }
}
