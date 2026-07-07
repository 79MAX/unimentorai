export class JobsVectorEngine {

  /* =========================
     🧠 EMBEDDING ENGINE (FAST + STABLE)
  ========================= */
  static embed(text = "") {

    if (!text) return [];

    let seed = 0;

    // ⚡ faster than split + reduce
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i);
    }

    const vector = new Array(32);

    // 🚀 precomputed math loop (no allocations inside loop)
    for (let i = 0; i < 32; i++) {

      const x = seed * (i + 1);

      vector[i] =
        Math.sin(x) * 0.6 +
        Math.cos(seed / (i + 2)) * 0.4;
    }

    return vector;
  }

  /* =========================
     📊 COSINE SIMILARITY (OPTIMIZED)
  ========================= */
  static cosine(a, b) {

    if (!a?.length || !b?.length) return 0;

    let dot = 0;
    let na = 0;
    let nb = 0;

    const len = a.length < b.length ? a.length : b.length;

    for (let i = 0; i < len; i++) {

      const av = a[i];
      const bv = b[i];

      dot += av * bv;
      na += av * av;
      nb += bv * bv;
    }

    const denom = Math.sqrt(na) * Math.sqrt(nb);

    // ⚡ avoid NaN propagation
    if (denom === 0) return 0;

    return dot / denom;
  }

  /* =========================
     🧠 HYBRID FAST SIMILARITY (OPTIONAL BOOST)
  ========================= */
  static hybridSimilarity(textA = "", textB = "") {

    const a = this.embed(textA);
    const b = this.embed(textB);

    return this.cosine(a, b);
  }
}

