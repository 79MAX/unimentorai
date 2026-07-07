const { generateResponse } = require('./prompt_engine');
const { filterResponse } = require('./safety_filter');
const { buildContext } = require('./context_builder');

async function handleAIRequest(message, context) {

    const finalContext = buildContext(context?.userId, context);

    const prompt = buildPrompt(message, finalContext);

    let response = await generateResponse(prompt);

    response = filterResponse(response);

    return response;
}

function buildPrompt(message, context) {
    return 
You are an AI educational mentor.

Context:


Question:


Respond clearly and pedagogically.
;
}

module.exports = { handleAIRequest };

