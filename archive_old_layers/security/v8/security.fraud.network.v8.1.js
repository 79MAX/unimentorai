/* =========================
   SECURITY AI V8.1
   GLOBAL FRAUD INTELLIGENCE NETWORK (HARDENED)
   - High-performance Map engine
   - Safe payload normalization
   - Reduced GC pressure
   - Stable scoring model
========================= */

class FraudIntelligenceNetwork {
  constructor() {
    this.ipReputation = new Map();
    this.deviceGraph = new Map();
    this.userGraph = new Map();
    this.attackStreams = [];

    this.blacklist = new Set();

    // cache (perf optimization)
    this._heatmapCache = null;
    this._heatmapDirty = true;
  }

  /* =========================
     INGEST (HOT PATH OPTIMIZED)
  ========================== */
  ingest(event) {
    if (!event) return null;

    const payload = event.payload || {};

    const normalized = {
      type: event.type,
      payload,
      riskScore: event.riskScore || 0,
      timestamp: Date.now(),
    };

    this._updateIP(normalized);
    this._updateDevice(normalized);
    this._updateUser(normalized);

    const risk = this._computeRisk(normalized);

    this._record(normalized, risk);

    return this._decide(normalized, risk);
  }

  /* =========================
     IP REPUTATION ENGINE (FAST PATH)
  ========================== */
  _updateIP(event) {
    const ip = event.payload.ip;
    if (!ip) return;

    let record = this.ipReputation.get(ip);

    if (!record) {
      record = { hits: 0, risk: 0, lastSeen: 0 };
      this.ipReputation.set(ip, record);
    }

    record.hits++;
    record.lastSeen = Date.now();

    // stable exponential smoothing
    record.risk = record.risk * 0.85 + event.riskScore * 0.15;

    if (record.risk > 85) this.blacklist.add(ip);

    this._heatmapDirty = true;
  }

  /* =========================
     DEVICE GRAPH (MINIMAL UPDATE COST)
  ========================== */
  _updateDevice(event) {
    const { deviceId, userId } = event.payload;
    if (!deviceId) return;

    let node = this.deviceGraph.get(deviceId);

    if (!node) {
      node = { users: new Set(), risk: 0, hits: 0 };
      this.deviceGraph.set(deviceId, node);
    }

    node.hits++;
    node.risk = node.risk * 0.8 + event.riskScore * 0.2;

    if (userId) node.users.add(userId);
  }

  /* =========================
     USER BEHAVIOR GRAPH
  ========================== */
  _updateUser(event) {
    const { userId, ip, deviceId } = event.payload;
    if (!userId) return;

    let user = this.userGraph.get(userId);

    if (!user) {
      user = { risk: 0, ips: new Set(), devices: new Set() };
      this.userGraph.set(userId, user);
    }

    if (ip) user.ips.add(ip);
    if (deviceId) user.devices.add(deviceId);

    user.risk = user.risk * 0.9 + event.riskScore * 0.1;
  }

  /* =========================
     GLOBAL RISK ENGINE (OPTIMIZED)
  ========================== */
  _computeRisk(event) {
    const { ip, deviceId } = event.payload;

    let score = event.riskScore;

    if (ip && this.blacklist.has(ip)) {
      score += 45;
    }

    const ipData = ip && this.ipReputation.get(ip);
    if (ipData) score += ipData.risk * 0.45;

    const device = deviceId && this.deviceGraph.get(deviceId);
    if (device) score += device.risk * 0.25;

    return score > 100 ? 100 : score | 0;
  }

  /* =========================
     DECISION ENGINE
  ========================== */
  _decide(event, risk) {
    const { ip, userId, deviceId } = event.payload;

    if (risk >= 90) {
      if (ip) this.blacklist.add(ip);
      return this._action("GLOBAL_BLOCK", event, risk);
    }

    if (risk >= 75) {
      return this._action("STEP_UP_AUTH", event, risk);
    }

    if (risk >= 55) {
      return this._action("MONITOR", event, risk);
    }

    return this._action("ALLOW", event, risk);
  }

  /* =========================
     ACTION ENGINE (LIGHTWEIGHT)
  ========================== */
  _action(type, event, risk) {
    return {
      type,
      risk,
      userId: event.payload.userId || null,
      ip: event.payload.ip || null,
      deviceId: event.payload.deviceId || null,
      timestamp: Date.now(),
    };
  }

  /* =========================
     EVENT STORAGE (ROLLING WINDOW)
  ========================== */
  _record(event, risk) {
    this.attackStreams.push({ event, risk });

    if (this.attackStreams.length > 8000) {
      this.attackStreams.shift();
    }
  }

  /* =========================
     ANALYTICS (CACHE OPTIMIZED)
  ========================== */
  getAnalytics() {
    return {
      ipsTracked: this.ipReputation.size,
      devicesTracked: this.deviceGraph.size,
      usersTracked: this.userGraph.size,
      blacklistSize: this.blacklist.size,
      eventsStored: this.attackStreams.length,
    };
  }

  /* =========================
     HEATMAP (LAZY CACHE - MAJOR PERF WIN)
  ========================== */
  getHeatmap() {
    if (!this._heatmapDirty && this._heatmapCache) {
      return this._heatmapCache;
    }

    const result = [];

    for (const [ip, data] of this.ipReputation) {
      result.push({
        ip,
        risk: data.risk,
        hits: data.hits,
      });
    }

    this._heatmapCache = result.sort((a, b) => b.risk - a.risk);
    this._heatmapDirty = false;

    return this._heatmapCache;
  }

  /* =========================
     CLEANUP (MEMORY SAFE)
  ========================== */
  cleanup() {
    const now = Date.now();
    const DAY = 86400000;

    for (const [ip, data] of this.ipReputation) {
      if (now - data.lastSeen > DAY) {
        this.ipReputation.delete(ip);
        this._heatmapDirty = true;
      }
    }
  }

  /* =========================
     BLACKLIST CHECK
  ========================== */
  isBlacklisted(ip) {
    return this.blacklist.has(ip);
  }
}

/* =========================
   SINGLETON EXPORT
========================= */
export const fraudNetwork = new FraudIntelligenceNetwork();

/* =========================
   PUBLIC API
========================= */
export const processFraudEvent = (event) =>
  fraudNetwork.ingest(event);

export const getFraudAnalytics = () =>
  fraudNetwork.getAnalytics();

export const getFraudHeatmap = () =>
  fraudNetwork.getHeatmap();

export const isBlacklistedIP = (ip) =>
  fraudNetwork.isBlacklisted(ip);
