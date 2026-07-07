const { generateResponse } = require('./prompt_engine');

async function handleAIRequest(message, context) {
    const prompt = buildPrompt(message, context);
    return await generateResponse(prompt);
}

function buildPrompt(message, context) {
    return 
You are an AI educational mentor.

Context:


Question:


Give a clear, structured answer.
;
}

module.exports = { handleAIRequest };

