export default class Cleaner {

  // =========================
  // FAST SAFE TEXT CLEAN
  // =========================
  static text(input = "") {

    if (!input) return "";

    return String(input)
      .normalize("NFKC") // 🔥 unicode fix (important LLM)
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
  }

  // =========================
  // REMOVE LLM THINKING PATTERNS
  // =========================
  static removeThinking(text = "") {

    return String(text)
      // generic "thinking blocks"
      .replace(/thinking\.\.\.[\s\S]*?(\n\n|$)/gi, "")

      // deepseek/qwen style endings
      .replace(/\.\.\.done thinking\./gi, "")

      // chain-of-thought leaks
      .replace(/let's think[\s\S]*?(\n\n|$)/gi, "")

      // reasoning markers
      .replace(/reasoning:[\s\S]*?(\n\n|$)/gi, "");
  }

  // =========================
  // REMOVE ANSI + CONTROL CHARS
  // =========================
  static stripAnsi(text = "") {

    return String(text)
      .replace(/\x1b\[[0-9;]*m/g, "") // colors
      .replace(/[\u0000-\u001F\u007F]/g, "");
  }

  // =========================
  // FINAL OUTPUT CLEANER
  // =========================
  static output(text = "") {

    if (!text) return null;

    let cleaned = text;

    cleaned = this.removeThinking(cleaned);
    cleaned = this.stripAnsi(cleaned);

    return cleaned.trim();
  }
}
