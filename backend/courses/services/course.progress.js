/* =========================
   📊 COURSE PROGRESS ENGINE
   V1 PRODUCTION READY
========================= */

export class CourseProgress {

  /* =========================
     📈 CALCULATE PROGRESS
  ========================= */
  static calculate(completedLessons = 0, totalLessons = 0) {

    const completed = Number(completedLessons);
    const total = Number(totalLessons);

    if (
      Number.isNaN(completed) ||
      Number.isNaN(total) ||
      total <= 0
    ) {
      return 0;
    }

    const progress =
      Math.round((completed / total) * 100);

    return this.normalize(progress);
  }

  /* =========================
     🎓 COURSE COMPLETION
  ========================= */
  static isCompleted(progress = 0) {
    return this.normalize(progress) >= 100;
  }

  /* =========================
     🛡️ NORMALIZE VALUE
  ========================= */
  static normalize(value = 0) {

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, Math.round(numericValue))
    );
  }
}
