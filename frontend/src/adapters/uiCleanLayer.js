
/* =========================
   UI CLEAN ABSTRACTION LAYER V12
   (PRODUCTION SAFE - NO INTERNAL LEAKS)
========================= */

export function cleanUI(ui = {}) {

    const intelligence = ui?.intelligence || {};
    const system = ui?.systemCard || {};
    const metrics = ui?.metrics || [];
    const logs = ui?.logs || [];
    const ai = ui?.aiCard || {};

    return {

        /* =========================
           HEADER STATE (CLEAN UX)
        ========================= */

        header: {
            connected: true,
            title: "Control Center",
            status: mapStatus(intelligence?.status || ai?.status)
        },

        /* =========================
           INTELLIGENCE LAYER (HUMANIZED)
        ========================= */

        intelligence: {
            score: normalizeScore(intelligence?.score || ai?.score),
            status: mapStatus(intelligence?.status || ai?.status),
            message: mapAction(intelligence?.action || ai?.action)
        },

        /* =========================
           METRICS (SAFE FORMAT)
        ========================= */

        metrics: (metrics || []).map(m => ({
            label: m.title || "Metric",
            value: m.value ?? 0,
            icon: m.icon || "📊",
            color: m.color || "#ffffff"
        })),

        /* =========================
           SYSTEM STATE (CLEAN ABSTRACT)
        ========================= */

        system: {
            status: mapStatus(system?.status),
            uptime: formatUptime(system?.uptime),
            clients: system?.clients ?? 0
        },

        /* =========================
           LOGS (HUMAN READABLE ONLY)
        ========================= */

        logs: (logs || []).slice(-6).map(l => ({
            level: l.level || "info",
            message: sanitizeLog(l.msg || l.message)
        }))

    };
}

/* =========================
   🧠 STATUS NORMALIZER
========================= */

function mapStatus(status) {

    switch (status) {

        case "critical":
            return "Attention required";

        case "warning":
            return "Performance degraded";

        case "stable":
            return "All systems operational";

        case "ok":
            return "System healthy";

        default:
            return "System active";
    }
}

/* =========================
   ⚡ ACTION NORMALIZER
========================= */

function mapAction(action) {

    if (!action) return "System running normally";

    return action
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
}

/* =========================
   📊 SCORE NORMALIZER
========================= */

function normalizeScore(score) {

    const s = Number(score || 0);

    if (s > 100) return 100;
    if (s < 0) return 0;

    return Math.round(s);
}

/* =========================
   ⏱ UPTIME FORMATTER
========================= */

function formatUptime(uptime) {

    const seconds = Math.floor(uptime || 0);

    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);

    return `${hours}h`;
}

/* =========================
   📜 LOG SANITIZER (IMPORTANT)
========================= */

function sanitizeLog(msg) {

    if (!msg) return "No message";

    return msg
        .replace(/V\d+/g, "")   // REMOVE V10/V11 leaks
        .replace(/CONTROL_CENTER/gi, "")
        .replace(/intelligence layer/gi, "")
        .trim();
}