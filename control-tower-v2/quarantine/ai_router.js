const { handleAIRequest } = require('./ai_service');

async function aiRouter(req, res) {
    try {
        const { message, context } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await handleAIRequest(message, context || {});

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        return res.status(500).json({
            success: false,
            error: "AI service temporarily unavailable"
        });
    }
}

module.exports = { aiRouter };

