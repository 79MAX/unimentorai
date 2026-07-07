
 /**
  * ========================
  * 🎨 AI CHAT FORMATTER
  * UniMentorAI SaaS Presentation Layer
  * ========================
  * Transforms raw AI data → structured UI-ready response
  */

class AIChatFormatter {

  /**
   * ========================
   * 📦 BASE RESPONSE WRAPPER
   * ========================
   */
  base(intent, data, summary = null) {

    return {
      success: true,
      intent,
      timestamp: new Date(),

      summary: summary || "Analyse générée avec succès.",

      data,

      meta: {
        version: "1.0",
        source: "UniMentorAI AI Engine"
      }
    };
  }

  /**
   * ========================
   * 📊 FORMAT REVENUE RESPONSE
   * ========================
   */
  formatRevenue(data) {

    return this.base(
      "revenue",
      data,
      `💰 Ton revenu total est de ${data?.revenue?.total || 0} avec une activité globale stable.`
    );
  }

  /**
   * ========================
   * 📈 FORMAT GROWTH RESPONSE
   * ========================
   */
  formatGrowth(data) {

    return this.base(
      "growth",
      data,
      `📈 État du business: ${data?.analysis?.state || "stable"} avec un score de ${data?.analysis?.score || 0}/100.`
    );
  }

  /**
   * ========================
   * 🔮 FORMAT FORECAST RESPONSE
   * ========================
   */
  formatForecast(data) {

    return this.base(
      "forecast",
      data,
      `🔮 Prévision générée avec une tendance de ${data?.forecast?.meta?.trend || 0}.`
    );
  }

  /**
   * ========================
   * 💡 FORMAT STRATEGY RESPONSE
   * ========================
   */
  formatStrategy(data) {

    return this.base(
      "strategy",
      data,
      `💡 Stratégie recommandée: ${data?.strategy?.focus || "optimisation générale du système"}.`
    );
  }

  /**
   * ========================
   * ⚠️ FORMAT ERROR RESPONSE
   * ========================
   */
  formatError(message = "Erreur inconnue") {

    return {
      success: false,
      intent: "error",
      timestamp: new Date(),
      summary: "Une erreur est survenue lors de l'analyse.",
      error: message
    };
  }

  /**
   * ========================
   * 🚀 FORMAT GENERIC RESPONSE
   * ========================
   */
  formatGeneric(intent, data) {

    return this.base(
      intent,
      data,
      "Analyse complète disponible dans le dashboard."
    );
  }
}

module.exports = new AIChatFormatter();
