export function scaleCourse(course, options = {}) {

  const maxUsers = options.maxUsers || 1000;
  const enableCache = options.cache !== false;

  /* =========================
     ⚡ CORE SCALING ENGINE
  ========================= */
  const scaledCourse = {
    ...course,

    /* =========================
       📊 METADATA SCALING
    ========================= */
    metadata: {
      ...course.metadata,

      scalable: true,
      maxUsers,
      optimized: true,
      version: course.metadata?.version || "1.0",
      generatedAt: new Date().toISOString()
    },

    /* =========================
       🚀 PERFORMANCE LAYER
    ========================= */
    performance: {
      cacheable: enableCache,
      lazyLoad: true,
      chunkedModules: true,
      compressionReady: true
    },

    /* =========================
       🧠 LOAD OPTIMIZATION STRATEGY
    ========================= */
    optimization: {
      moduleSplitting: true,
      progressiveLoading: true,
      prefetchNextLesson: true
    }
  };

  return scaledCourse;
}
