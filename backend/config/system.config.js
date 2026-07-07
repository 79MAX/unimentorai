const SYSTEM_VERSION = process.env.SYSTEM_VERSION;

export const SYSTEM_CONFIG = {
    /* =========================
       CORE SYSTEM
    ========================= */

    version: SYSTEM_VERSION || "INTELLIGENCE_ENGINE",
    name: "UniMentorAI",
    environment: process.env.NODE_ENV || "development",

    /* =========================
       INTELLIGENCE ENGINE
    ========================= */

    intelligence: {
        enabled: true,
        mode: "adaptive",
        level: "P3",

        scoring: {
            max: 10,
            warningThreshold: 4,
            criticalThreshold: 2
        }
    },

    /* =========================
       STREAM CONFIG
    ========================= */

    stream: {
        heartbeatInterval: 2000,
        retryMaxDelay: 8000,
        maxLogs: 50,
        compression: true
    },

    /* =========================
       SYSTEM METRICS
    ========================= */

    metrics: {
        collectCpu: true,
        collectMemory: true,
        collectClients: true,
        collectUptime: true
    },

    /* =========================
       SECURITY LAYER
    ========================= */

    security: {
        enabled: true,
        riskMultiplier: 10,
        anomalyDetection: true
    },

    /* =========================
       UI LAYER (IMPORTANT)
    ========================= */

    ui: {
        exposeVersion: false,   // 💣 CRUCIAL : empêche affichage V10/V11
        theme: "dark",
        glowEffects: true
    }
};