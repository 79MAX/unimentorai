export default class Validator {

  // =========================
  // CLEAN INPUT (FAST PATH)
  // =========================
  clean(text) {

    return String(text)
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/^\s*json\s*/gi, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim();
  }

  // =========================
  // SAFE JSON EXTRACTOR
  // =========================
  extract(text) {

    const objStart = text.indexOf("{");
    const objEnd = text.lastIndexOf("}");

    if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
      return text.slice(objStart, objEnd + 1);
    }

    const arrStart = text.indexOf("[");
    const arrEnd = text.lastIndexOf("]");

    if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
      return text.slice(arrStart, arrEnd + 1);
    }

    return null;
  }

  // =========================
  // BASIC JSON FIX (LLM SAFE)
  // =========================
  fixJson(str) {

    return str
      // trailing commas fix
      .replace(/,\s*([}\]])/g, "$1")

      // smart quote cleanup
      .replace(/'/g, '"');
  }

  // =========================
  // MAIN PARSER
  // =========================
  parse(text = "") {

    try {

      if (typeof text !== "string" || !text.trim()) {
        return null;
      }

      // 1. CLEAN
      const cleaned = this.clean(text);

      // 2. TRY DIRECT PARSE (FAST PATH)
      try {
        const direct = JSON.parse(cleaned);
        return this.validate(direct);
      } catch {}

      // 3. EXTRACT BLOCK
      const extracted = this.extract(cleaned);

      if (!extracted) return null;

      // 4. FIX COMMON LLM ERRORS
      const fixed = this.fixJson(extracted);

      // 5. FINAL PARSE
      const parsed = JSON.parse(fixed);

      return this.validate(parsed);

    } catch {
      return null;
    }
  }

  // =========================
  // STRUCTURE VALIDATION (SAFE GUARD)
  // =========================
  validate(obj) {

    if (!obj || typeof obj !== "object") {
      return null;
    }

    // prevent prototype pollution
    if (obj.__proto__ || obj.constructor !== Object) {
      return null;
    }

    return obj;
  }
}
