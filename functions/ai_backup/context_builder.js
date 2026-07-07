function buildContext(userId, data = {}) {
    return {
        userId,
        timestamp: new Date(),
        ...data
    };
}

module.exports = { buildContext };

