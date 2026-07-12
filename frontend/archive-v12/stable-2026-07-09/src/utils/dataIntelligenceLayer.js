
/* =========================
   V10 DATA INTELLIGENCE ENGINE
========================= */

export function analyzeSystem(data = {}) {

    const metrics = data?.metrics || {};
    const ai = data?.ai || {};
    const logs = Array.isArray(data?.logs) ? data.logs : [];

    /* =========================
       CORE METRICS EXTRACTION
    ========================= */

    const cpuLoad = metrics.cpuLoad || 0;
    const heapUsed = metrics.heapUsedMB || 0;
    const freeMem = metrics.freeMem || 0;
    const totalMem = metrics.totalMem || 1;

    const memoryRatio = freeMem / totalMem;

    /* =========================
       AI SCORE ENGINE V10
    ========================= */

    const baseScore =
        (cpuLoad * 15) +
        (heapUsed * 0.4) +
        ((1 - memoryRatio) * 50);

    const score = Math.min(100, Math.max(0, Math.round(baseScore)));

    /* =========================
       STATUS ENGINE
    ========================= */

    let status = "stable";
    let level = "P3";
    let action = "SYSTEM_OPTIMAL";

    if (score > 70) {
        status = "critical";
        level = "P0";
        action = "AUTO_SCALE + MEMORY_CLEAN + ALERT";
    }

    else if (score > 40) {
        status = "warning";
        level = "P1";
        action = "CACHE_OPTIMIZE + SCALE_UP";
    }

    /* =========================
       LOG INTELLIGENCE ENGINE
    ========================= */

    const logAnalysis = logs.map(log => {

        let severity = "info";

        if (log.level === "error") severity = "critical";
        else if (log.level === "warn") severity = "warning";
        else if (log.level === "debug") severity = "debug";

        return {
            ...log,
            severity
        };

    });

    /* =========================
       INSIGHTS ENGINE
    ========================= */

    const insights = [];

    if (cpuLoad > 1) {
        insights.push("High CPU load detected");
    }

    if (heapUsed > 50) {
        insights.push("Memory pressure increasing");
    }

    if (logs.length > 5) {
        insights.push("High system activity detected");
    }

    /* =========================
       FINAL INTELLIGENCE OBJECT
    ========================= */

    return {
        version: "V10-INTELLIGENCE",

        score,
        status,
        level,
        action,

        memoryRatio,

        analysis: {
            cpuLoad,
            heapUsed,
            freeMem,
            totalMem
        },

        logs: logAnalysis,

        insights,

        timestamp: Date.now()
    };
}

/* =========================
   NORMALIZER (SAFE UI FORMAT)
========================= */

export function normalizeDashboard(data = {}) {

    return {
        health: data?.health || null,
        ai: data?.ai || null,
        live: data?.live || null
    };

}