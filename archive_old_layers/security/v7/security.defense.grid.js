/* =========================
   SECURITY AI V7.1
   AUTONOMOUS DEFENSE GRID (HARDENED)
   - Immutable event processing
   - Stable AI risk scoring
   - SOC/SIEM streaming ready
   - Memory-safe + performance optimized
========================= */

class DefenseGrid {
  constructor() {
    this.nodes = new Map();
    this.threatGraph = new Map();
    this.userProfiles = new Map();
    this.globalBlacklist = new Set();
  }

  /* =========================
     REGISTER NODE (SAFE MERGE)
  ========================== */
  registerNode(nodeId, config = {}) {
    this.nodes.set(nodeId, {
      score: 100,
      load: 0,
      status: "healthy",
      ...config,
    });
  }

  /* =========================
     EVENT INGEST (IMMUTABLE CORE)
  ========================== */
  ingest(rawEvent) {
    if (!rawEvent) return null;

    // IMMUTABILITY LAYER (prevents tampering)
    const event = Object.freeze({
      event: rawEvent.event,
      payload: Object.freeze({ ...(rawEvent.payload || {}) }),
      riskScore: rawEvent.riskScore || 0,
      timestamp: Date.now(),
    });

    const userId = event.payload.userId;
    const profile = this._getUserProfile(userId);

    this._updateBehavior(profile, event);

    const risk = this._computeRisk(profile, event);

    this._updateThreatGraph(event, risk);

    return this._decide(event, risk);
  }

  /* =========================
     USER PROFILE (FAST PATH)
  ========================== */
  _getUserProfile(userId) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        riskBaseline: 20,
        devices: new Set(),
        ips: new Set(),
        behaviorScore: 50,
      });
    }

    return this.userProfiles.get(userId);
  }

  /* =========================
     BEHAVIOR TRACKING
  ========================== */
  _updateBehavior(profile, event) {
    const { ip, deviceId } = event.payload;

    if (ip) profile.ips.add(ip);
    if (deviceId) profile.devices.add(deviceId);
  }

  /* =========================
     AI RISK ENGINE (STABLE + DETERMINISTIC)
  ========================== */
  _computeRisk(profile, event) {
    const { ip, deviceId } = event.payload;

    let score = profile.riskBaseline;

    // unknown device
    if (deviceId && !profile.devices.has(deviceId)) {
      score += 30;
    }

    // unknown IP
    if (ip && !profile.ips.has(ip)) {
      score += 25;
    }

    // external risk injection (controlled)
    score += Math.min(30, event.riskScore * 0.5);

    // behavior drift (fixed formula)
    const drift = Math.abs(profile.behaviorScore - score);

    if (drift > 50) {
      score += 15;
    }

    return Math.min(100, Math.round(score));
  }

  /* =========================
     THREAT GRAPH (AGGREGATED INTELLIGENCE)
  ========================== */
  _updateThreatGraph(event, risk) {
    const ip = event.payload.ip || "unknown";

    if (!this.threatGraph.has(ip)) {
      this.threatGraph.set(ip, {
        hits: 0,
        risk: 0,
      });
    }

    const node = this.threatGraph.get(ip);

    node.hits += 1;

    // weighted average (more stable than raw mean)
    node.risk = node.risk * 0.7 + risk * 0.3;
  }

  /* =========================
     AUTONOMOUS DECISION ENGINE
  ========================== */
  _decide(event, risk) {
    const ip = event.payload.ip;

    if (risk >= 85) {
      if (ip) this.globalBlacklist.add(ip);
      return this._action("BLOCK", event, risk);
    }

    if (risk >= 65) {
      return this._action("STEP_UP_AUTH", event, risk);
    }

    if (risk >= 40) {
      return this._action("MONITOR", event, risk);
    }

    return this._action("ALLOW", event, risk);
  }

  /* =========================
     ACTION ENGINE (SOC FORMAT)
  ========================== */
  _action(type, event, risk) {
    const action = Object.freeze({
      type,
      risk,
      userId: event.payload.userId || null,
      ip: event.payload.ip || null,
      timestamp: Date.now(),
    });

    console.warn("DEFENSE_ACTION", action);

    return action;
  }

  /* =========================
     BLACKLIST ENGINE
  ========================== */
  isBlacklisted(ip) {
    return this.globalBlacklist.has(ip);
  }

  /* =========================
     INSIGHT ENGINE (O(1))
  ========================== */
  getInsight() {
    return {
      nodes: this.nodes.size,
      threats: this.threatGraph.size,
      blacklistedIPs: this.globalBlacklist.size,
      usersTracked: this.userProfiles.size,
    };
  }

  /* =========================
     SELF HEALING SYSTEM
  ========================== */
  heal() {
    for (const node of this.nodes.values()) {
      node.status = node.load > 80 ? "degraded" : "healthy";
    }
  }
}

/* =========================
   SINGLETON
========================= */
export const defenseGrid = new DefenseGrid();

/* =========================
   PUBLIC API
========================= */
export function processSecurityEvent(event) {
  return defenseGrid.ingest(event);
}

export function getSecurityInsight() {
  return defenseGrid.getInsight();
}

export function isIPBlocked(ip) {
  return defenseGrid.isBlacklisted(ip);
}
