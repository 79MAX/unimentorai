/**
 * 🧠 UniMentorAI - AI ROUTER (PRODUCTION READY)
 * Secure + scalable + Firebase Functions compatible
 */

const AIOrchestrator = require("./orchestrator");

const orchestrator = new AIOrchestrator();

/**
 * 🔐 VALIDATION SIMPLE
 */
function validateRequest(req) {
  if (!req) return "EMPTY_REQUEST";
  if (!req.userId) return "MISSING_USER_ID";
  if (!req.type) return "MISSING_TYPE";
  return null;
}

/**
 * 📡 MAIN ROUTER ENTRY
 * Compatible Firebase HTTPS / Callable / internal calls
 */
async function handleAIRequest(req, context = {}) {
  try {

    // ========================
    // 🔐 VALIDATION
    // ========================
    const error = validateRequest(req);
    if (error) {
      return {
        success: false,
        error
      };
    }

    const { userId, type, payload, context: reqContext } = req;

    // ========================
    // 🧠 EXECUTE ORCHESTRATOR
    // ========================
    const result = await orchestrator.process({
      userId,
      type,
      payload: payload || {},
      context: {
        ...context,
        ...reqContext
      }
    });

    // ========================
    // 📊 OPTIONAL DEBUG LOG
    // ========================
    console.log("AI ROUTER EXEC:", {
      userId,
      type,
      success: result?.success
    });

    return result;

  } catch (error) {

    console.error("AI ROUTER FATAL ERROR:", error);

    return {
      success: false,
      error: "ROUTER_INTERNAL_ERROR",
      details: error.message
    };
  }
}

/**
 * 🌐 Firebase HTTPS WRAPPER (OPTIONAL)
 */
async function httpHandler(req, res) {
  const result = await handleAIRequest(req.body || {});

  return res.json(result);
}

/**
 * 📡 EXPORT CLEAN API
 */
module.exports = {
  handleAIRequest,
  httpHandler
};
