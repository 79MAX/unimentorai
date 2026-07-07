export class LiveTranslationGateway {

  static async translate(
    text: string,
    targetLanguage: string
  ) {

    // Future:
    // OpenAI realtime
    // DeepL
    // Google Live Translation

    return {
      translatedText: text,
      language: targetLanguage,
    };
  }
}