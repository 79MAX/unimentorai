/**
 * VIDEO TUTOR KNOWLEDGE BASE - UniMentorAI
 * Structured educational knowledge repository for AI tutor system
 */

class VideoTutorKnowledgeBase {
  constructor({ db, logger }) {
    this.db = db;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: fetch relevant knowledge for tutoring
   */
  async getRelevantKnowledge({ courseId, skillId, query }) {
    try {
      const [concepts, explanations, examples] = await Promise.all([
        this._getConcepts(courseId, skillId),
        this._getExplanations(skillId),
        this._getExamples(skillId)
      ]);

      const filtered = this._filterByQuery(
        { concepts, explanations, examples },
        query
      );

      return {
        knowledge: filtered,
        summary: this._buildSummary(filtered),
        confidence: this._computeConfidence(filtered)
      };

    } catch (error) {
      this.logger.error("KnowledgeBase error", error);
      return this._fallback();
    }
  }

  /**
   * 📚 Retrieve core concepts
   */
  async _getConcepts(courseId, skillId) {
    return await this.db.knowledge.find({
      courseId,
      skillId,
      type: "concept"
    }) || [];
  }

  /**
   * 📖 Retrieve explanations
   */
  async _getExplanations(skillId) {
    return await this.db.knowledge.find({
      skillId,
      type: "explanation"
    }) || [];
  }

  /**
   * 💡 Retrieve examples
   */
  async _getExamples(skillId) {
    return await this.db.knowledge.find({
      skillId,
      type: "example"
    }) || [];
  }

  /**
   * 🔍 Filter knowledge by query relevance
   */
  _filterByQuery(data, query) {
    if (!query) return data;

    const q = query.toLowerCase();

    const filterList = (list) =>
      list.filter(item =>
        (item.title || "").toLowerCase().includes(q) ||
        (item.content || "").toLowerCase().includes(q)
      );

    return {
      concepts: filterList(data.concepts),
      explanations: filterList(data.explanations),
      examples: filterList(data.examples)
    };
  }

  /**
   * 🧠 Build pedagogical summary
   */
  _buildSummary(data) {
    return {
      conceptCount: data.concepts.length,
      explanationCount: data.explanations.length,
      exampleCount: data.examples.length,
      readiness: this._computeReadiness(data)
    };
  }

  /**
   * 📊 Compute knowledge readiness score
   */
  _computeReadiness(data) {
    let score = 0;

    score += data.concepts.length * 10;
    score += data.explanations.length * 8;
    score += data.examples.length * 6;

    return Math.min(100, score);
  }

  /**
   * 📊 Confidence in knowledge quality
   */
  _computeConfidence(data) {
    const total = data.concepts.length +
                  data.explanations.length +
                  data.examples.length;

    if (total > 20) return "high";
    if (total > 10) return "medium";
    return "low";
  }

  /**
   * 🔄 Fallback safe response
   */
  _fallback() {
    return {
      knowledge: {
        concepts: [],
        explanations: [],
        examples: []
      },
      summary: {
        conceptCount: 0,
        explanationCount: 0,
        exampleCount: 0,
        readiness: 0
      },
      confidence: "low"
    };
  }
}

module.exports = VideoTutorKnowledgeBase;
