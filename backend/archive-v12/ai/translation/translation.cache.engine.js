
// ======================================
// 🌍 AI TRANSLATION CACHE ENGINE
// UniMentorAI - HIGH PERFORMANCE MEMORY LAYER (OPTIMIZED)
// ======================================

export class TranslationCacheEngine {

  constructor({ db, redis }) {

    this.db = db
    this.redis = redis // optional high-speed layer
  }

  // ======================================
  // 🔑 CACHE KEY GENERATOR (IMPROVED)
  // ======================================

  buildCacheKey({ courseId, targetLang }) {

    return `translation:${courseId}:${targetLang}`
  }

  // ======================================
  // 🚀 GET CACHE (REDIS → DB FALLBACK)
  // ======================================

  async getCachedTranslation({ courseId, targetLang }) {

    const key = this.buildCacheKey({ courseId, targetLang })

    // ==================================
    // ⚡ 1. TRY REDIS FIRST (FAST LAYER)
    // ==================================

    if (this.redis) {

      const cachedRedis =
        await this.redis.get(key)

      if (cachedRedis) {

        return {
          status: "CACHE_HIT_REDIS",
          data: JSON.parse(cachedRedis)
        }
      }
    }

    // ==================================
    // 🗄️ 2. FALLBACK DB
    // ==================================

    const cached =
      await this.db.translationCache.findOne({ key })

    if (!cached) return null

    // ==================================
    // 🧠 STATUS CHECK
    // ==================================

    const response = {
      status: cached.locked
        ? "LOCKED_CACHE"
        : "CACHE_HIT",
      data: cached
    }

    // ==================================
    // ⚡ SYNC BACK TO REDIS
    // ==================================

    if (this.redis) {

      await this.redis.set(
        key,
        JSON.stringify(cached),
        "EX",
        3600 // 1h TTL
      )
    }

    return response
  }

  // ======================================
  // 💾 UPSERT CACHE (ATOMIC FIX)
  // ======================================

  async storeTranslation({
    courseId,
    targetLang,
    content,
    status = "draft"
  }) {

    const key = this.buildCacheKey({ courseId, targetLang })

    // ==================================
    // ⚡ ATOMIC UPSERT (FIX RACE CONDITION)
    // ==================================

    const updated =
      await this.db.translationCache.findOneAndUpdate(

        { key },

        {
          $set: {
            content,
            status,
            updatedAt: new Date()
          },
          $setOnInsert: {
            key,
            courseId,
            targetLang,
            version: 1,
            createdAt: new Date()
          },
          $inc: {
            version: 1
          }
        },

        {
          upsert: true,
          new: true
        }
      )

    // ==================================
    // ⚡ SYNC REDIS
    // ==================================

    if (this.redis) {

      await this.redis.set(
        key,
        JSON.stringify(updated),
        "EX",
        3600
      )
    }

    return updated
  }

  // ======================================
  // 🚫 SMART INVALIDATION (NO DATA LOSS)
  // ======================================

  async invalidateCache({ courseId, targetLang }) {

    const key = this.buildCacheKey({ courseId, targetLang })

    // ==================================
    // ⚠️ SOFT INVALIDATION (NOT DELETE)
    // ==================================

    const updated =
      await this.db.translationCache.updateOne(

        { key },

        {
          $set: {
            status: "stale",
            invalidatedAt: new Date()
          }
        }
      )

    // ==================================
    // ⚡ REMOVE FROM REDIS ONLY
    // ==================================

    if (this.redis) {

      await this.redis.del(key)
    }

    return updated
  }

  // ======================================
  // 🧠 EXISTS CHECK (OPTIMIZED)
  // ======================================

  async exists({ courseId, targetLang }) {

    const key = this.buildCacheKey({ courseId, targetLang })

    if (this.redis) {

      const redisCheck =
        await this.redis.get(key)

      if (redisCheck) return true
    }

    const record =
      await this.db.translationCache.findOne({ key })

    return !!record
  }

  // ======================================
  // 📊 CACHE METADATA (ENHANCED)
  // ======================================

  async getCacheInfo({ courseId, targetLang }) {

    const key = this.buildCacheKey({ courseId, targetLang })

    const record =
      await this.db.translationCache.findOne({ key })

    if (!record) {

      return {
        exists: false
      }
    }

    return {

      exists: true,

      version: record.version || 1,

      status: record.status,

      isLocked: record.locked || false,

      lastUpdated: record.updatedAt,

      ageInMinutes:
        Math.floor((Date.now() - new Date(record.updatedAt)) / 60000)
    }
  }
}
