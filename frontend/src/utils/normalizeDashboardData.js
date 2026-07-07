
/* =========================
   V10 DASHBOARD NORMALIZER
========================= */

export function normalizeDashboardData(raw = {}) {

    /* =========================
       SAFE INPUT PROTECTION
    ========================= */

    if (!raw || typeof raw !== "object") {
        return {
            health: null,
            ai: null,
            live: null,
            meta: {
                valid: false,
                reason: "invalid_input"
            }
        };
    }

    /* =========================
       HEALTH NORMALIZATION
    ========================= */

    const health = raw.health ? {
        status: raw.health.status || "unknown",
        version: raw.health.version || "V10-UNKNOWN",
        clients: raw.health.clients ?? 0,
        uptime: raw.health.uptime ?? 0
    } : null;

    /* =========================
       AI NORMALIZATION
    ========================= */

    const ai = raw.ai ? {
        status: raw.ai.status || "stable",
        level: raw.ai.level || "P3",
        score: typeof raw.ai.score === "number" ? raw.ai.score : 0,
        action: raw.ai.action || "NO_ACTION"
    } : null;

    /* =========================
       LIVE STREAM NORMALIZATION
    ========================= */

    const live = raw.live ? {

        type: raw.live.type || "UNKNOWN_STREAM",
        timestamp: raw.live.timestamp || Date.now(),

        metrics: {
            cpuLoad: raw.live.metrics?.cpuLoad ?? 0,
            totalMem: raw.live.metrics?.totalMem ?? 0,
            freeMem: raw.live.metrics?.freeMem ?? 0,
            heapUsedMB: raw.live.metrics?.heapUsedMB ?? 0,
            rssMB: raw.live.metrics?.rssMB ?? 0,
            uptime: raw.live.metrics?.uptime ?? 0,
            platform: raw.live.metrics?.platform || "unknown",
            clients: raw.live.metrics?.clients ?? 0
        },

        ai: raw.live.ai || ai,

        logs: Array.isArray(raw.live.logs)
            ? raw.live.logs
            : [],

        system: {
            clients: raw.live.system?.clients ?? 0,
            uptime: raw.live.system?.uptime ?? 0,
            version: raw.live.system?.version || "V10-UNKNOWN"
        }

    } : null;

    /* =========================
       META INTELLIGENCE
    ========================= */

    const meta = {
        valid: true,
        version: "V10-NORMALIZER",
        hasHealth: !!health,
        hasAI: !!ai,
        hasLive: !!live
    };

    /* =========================
       FINAL OUTPUT
    ========================= */

    return {
        health,
        ai,
        live,
        meta
    };
}

/* =========================
   SAFE MERGER (OPTIONAL EXTENSION)
========================= */

export function mergeLiveUpdates(prev, update) {

    if (!update) return prev;

    return {
        ...prev,
        ...update,
        metrics: {
            ...(prev?.metrics || {}),
            ...(update?.metrics || {})
        }
    };
}