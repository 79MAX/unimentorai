/* =========================
   RECOMMENDATION ENGINE V3
   - AI-ready SaaS core
   - Hybrid + semantic ranking
   - Performance optimized
========================= */

/* =========================
   MAIN CONTENT-BASED ENGINE
========================= */
export function generateRecommendations({
  items = [],
  user = {},
  context = {},
}) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const prefs = user.preferences || {};
  const skills = user.skills || [];

  const results = [];

  for (const item of items) {
    let score = 0;

    /* POPULARITY */
    score += (item.popularity ?? 0) * 0.2;

    /* CATEGORY MATCH */
    if (prefs.category && item.category === prefs.category) {
      score += 2;
    }

    /* SKILLS MATCH */
    if (item.tags?.length && skills.length) {
      let match = 0;

      for (const t of item.tags) {
        if (skills.includes(t)) match++;
      }

      score += match * 1.5;
    }

    /* LEVEL MATCH */
    if (prefs.level && item.level === prefs.level) {
      score += 1.5;
    }

    /* CONTEXT INTENT BOOST */
    if (context.intent && item.tags?.includes(context.intent)) {
      score += 2;
    }

    /* RECENCY BOOST */
    if (item.createdAt) {
      const age =
        (Date.now() - new Date(item.createdAt).getTime()) /
        86400000;

      if (age < 30) score += 1;
    }

    results.push({
      ...item,
      score,
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .map((r) => ({
      ...r,
      score: Number(r.score.toFixed(4)),
    }));
}

/* =========================
   SEMANTIC (RAG / VECTOR SEARCH)
========================= */
export function semanticRecommendations({
  items = [],
  userVector = [],
}) {
  if (!Array.isArray(items) || !userVector.length) return items;

  const scored = [];

  for (const item of items) {
    const sim = cosineSimilarity(userVector, item.embedding || []);
    scored.push({
      ...item,
      score: sim,
    });
  }

  return scored.sort((a, b) => b.score - a.score);
}

/* =========================
   HYBRID RECOMMENDATION ENGINE
   (FIXED WEIGHTING BUG)
========================= */
export function hybridRecommendations({
  items = [],
  user = {},
  userVector = [],
  context = {},
}) {
  const content = generateRecommendations({
    items,
    user,
    context,
  });

  if (!userVector.length) return content;

  const semantic = semanticRecommendations({
    items: content,
    userVector,
  });

  return semantic
    .map((item) => {
      const contentScore = item.score ?? 0;

      // semantic boost (AI layer)
      const finalScore = contentScore * 0.6 + item.score * 0.4;

      return {
        ...item,
        score: finalScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/* =========================
   COSINE SIMILARITY (SAFE + FAST)
========================= */
function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length) return 0;

  let dot = 0,
    normA = 0,
    normB = 0;

  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const x = a[i];
    const y = b[i];

    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
}

/* =========================
   FALLBACK ENGINE
========================= */
export function fallbackRecommendations(items = []) {
  return Array.isArray(items) ? items.slice(0, 10) : [];
}
