const crypto = require('crypto');

function flattenText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => flattenText(item)).join(' ');
  }
  if (typeof value === 'object') {
    return Object.values(value).map((item) => flattenText(item)).join(' ');
  }
  return '';
}

function normalizeText(value) {
  return flattenText(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

function tokenize(value) {
  return new Set(
    normalizeText(value)
      .split(' ')
      .filter(Boolean)
  );
}

function jaccard(a, b) {
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = [...setA].filter((token) => setB.has(token)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function moduleSimilarity(existingModules = [], candidateModules = []) {
  if (existingModules.length === 0 && candidateModules.length === 0) return 1;
  if (existingModules.length === 0 || candidateModules.length === 0) return 0;

  const existingTitles = existingModules.map((m) => m.title || '').join(' ');
  const candidateTitles = candidateModules.map((m) => m.title || '').join(' ');
  return jaccard(existingTitles, candidateTitles);
}

function contentSimilarity(existingContent = '', candidateContent = '') {
  return jaccard(existingContent, candidateContent);
}

function fingerprintCourse(course) {
  const title = normalizeText(course.title);
  const moduleTitles = (course.modules || []).map((m) => normalizeText(m.title)).join('|');
  return crypto.createHash('sha256').update(`${title}::${moduleTitles}`).digest('hex');
}

function detectDuplicateRisk(existingCourse, candidateCourse, thresholds = {}) {
  const titleScore = jaccard(existingCourse.title, candidateCourse.title);
  const modulesScore = moduleSimilarity(existingCourse.modules, candidateCourse.modules);
  const contentScore = contentSimilarity(existingCourse.content, candidateCourse.content);

  const titleThreshold = thresholds.titleThreshold ?? 0.85;
  const modulesThreshold = thresholds.modulesThreshold ?? 0.7;
  const contentThreshold = thresholds.contentThreshold ?? 0.65;
  const weightedScore = (titleScore * 0.45) + (modulesScore * 0.35) + (contentScore * 0.2);

  return {
    weightedScore,
    titleScore,
    modulesScore,
    contentScore,
    isDuplicateRisk:
      titleScore >= titleThreshold &&
      (modulesScore >= modulesThreshold || contentScore >= contentThreshold),
  };
}

module.exports = {
  normalizeText,
  jaccard,
  moduleSimilarity,
  contentSimilarity,
  fingerprintCourse,
  detectDuplicateRisk,
};

