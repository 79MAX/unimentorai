export class LearningMemoryStore {

  private static patterns: LearnedPattern[] = [];

  static addPattern(pattern: LearnedPattern) {
    this.patterns.push(pattern);
  }

  static getPatterns() {
    return this.patterns;
  }

  static findSimilar(type: string) {
    return this.patterns.filter(p => p.patternType === type);
  }
}