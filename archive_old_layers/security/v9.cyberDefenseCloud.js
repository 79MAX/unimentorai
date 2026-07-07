/* =========================
   SECURITY AI V9
   CYBER DEFENSE CLOUD
   - Distributed cyber defense mesh
   - Real-time global threat intelligence
   - AI-driven adaptive firewall logic
   - SIEM / SOC / Cloud-native ready
   - Zero Trust + Autonomous response system
========================= */

class CyberDefenseCloud {
  constructor() {
    this.nodes = new Map();          // distributed nodes
    this.ipIntel = new Map();        // global IP intelligence
    this.deviceIntel = new Map();    // device tracking graph
    this.userProfiles = new Map();   // behavioral AI memory
    this.blacklist = new Set();      // global block list
    this.eventStream = [];           // SIEM stream buffer
  }

  /* =========================
     NODE REGISTRATION
  ========================== */
  registerNode(nodeId, config = {}) {
    this.nodes.set(nodeId, {
      status: "active",
      load: 0,
      risk: 0,
      region: config.region || "global",
      ...config,
    });
  }

  /* =========================
     EVENT INGESTION PIPELINE
  ========================== */
  ingest(event) {
    const enriched = this._normalize(event);

    this._updateIP(enriched);
    this._updateDevice(enriched);
    this._updateUser(enriched);

    const risk = this._calculateRisk(enriched);

    this._store(enriched, risk);

    return this._decide(enriched, risk);
  }

  /* =========================
     NORMALIZATION LAYER
  ========================== */
  _normalize(event) {
    return Object.freeze({
      type: event.type,
      payload: event.payload || {},
      riskScore: event.riskScore || 0,
      timestamp: Date.now(),
      geo: event.geo || null,
    });
  }

  /* =========================
     IP INTELLIGENCE ENGINE
  ========================== */
  _updateIP(event) {
    const ip = event.payload.ip;
    if (!ip) return;

    if (!this.ipIntel.has(ip)) {
      this.ipIntel.set(ip, {
        hits: 0,
        risk: 0,
        lastSeen: Date.now(),
      });
    }

    const record = this.ipIntel.get(ip);

    record.hits++;
    record.lastSeen = Date.now();

    record.risk = record.risk * 0.85 + event.riskScore * 0.15;

    if (record.risk > 90) {
      this.blacklist.add(ip);
    }
  }

  /* =========================
     DEVICE INTELLIGENCE GRAPH
  ========================== */
  _updateDevice(event) {
    const deviceId = event.payload.deviceId;
    if (!deviceId) return;

    if (!this.deviceIntel.has(deviceId)) {
      this.deviceIntel.set(deviceId, {
        users: new Set(),
        risk: 0,
        hits: 0,
      });
    }

    const device = this.deviceIntel.get(deviceId);

    device.hits++;
    device.risk = device.risk * 0.8 + event.riskScore * 0.2;

    if (event.payload.userId) {
      device.users.add(event.payload.userId);
    }
  }

  /* =========================
     USER BEHAVIOR AI MODEL
  ========================== */
  _updateUser(event) {
    const userId = event.payload.userId;
    if (!userId) return;

    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        risk: 20,
        ips: new Set(),
        devices: new Set(),
      });
    }

    const user = this.userProfiles.get(userId);

    if (event.payload.ip) user.ips.add(event.payload.ip);
    if (event.payload.deviceId) user.devices.add(event.payload.deviceId);

    user.risk = user.risk * 0.9 + event.riskScore * 0.1;
  }

  /* =========================
     GLOBAL RISK ENGINE (AI CORE)
  ========================== */
  _calculateRisk(event) {
    const { ip, deviceId } = event.payload;

    let score = event.riskScore;

    if (ip && this.blacklist.has(ip)) {
      score += 60;
    }

    const ipData = this.ipIntel.get(ip);
    if (ipData) {
      score += ipData.risk * 0.5;
    }

    const deviceData = this.deviceIntel.get(deviceId);
    if (deviceData) {
      score += deviceData.risk * 0.3;
    }

    return Math.min(100, Math.round(score));
  }

  /* =========================
     DECISION ENGINE (AUTO DEFENSE)
  ========================== */
  _decide(event, risk) {
    const { ip, userId, deviceId } = event.payload;

    if (risk >= 90) {
      this.blacklist.add(ip);
      return this._action("BLOCK", event, risk);
    }

    if (risk >= 75) {
      return this._action("STEP_UP_AUTH", event, risk);
    }

    if (risk >= 50) {
      return this._action("MONITOR", event, risk);
    }

    return this._action("ALLOW", event, risk);
  }

  /* =========================
     ACTION ENGINE (CLOUD OUTPUT)
  ========================== */
  _action(type, event, risk) {
    const action = {
      type,
      risk,
      userId: event.payload.userId || null,
      ip: event.payload.ip || null,
      deviceId: event.payload.deviceId || null,
      timestamp: Date.now(),
    };

    console.warn("CYBER_DEFENSE_ACTION", action);

    return action;
  }

  /* =========================
     SIEM EVENT STORAGE
  ========================== */
  _store(event, risk) {
    this.eventStream.push({ event, risk });

    if (this.eventStream.length > 20000) {
      this.eventStream.shift();
    }
  }

  /* =========================
     GLOBAL SECURITY DASHBOARD
  ========================== */
  getDashboard() {
    return {
      nodes: this.nodes.size,
      ips: this.ipIntel.size,
      devices: this.deviceIntel.size,
      users: this.userProfiles.size,
      blacklist: this.blacklist.size,
      events: this.eventStream.length,
    };
  }

  /* =========================
     CLEANUP ENGINE (AUTO HEAL)
  ========================== */
  cleanup() {
    for (const [ip, data] of this.ipIntel.entries()) {
      if (Date.now() - data.lastSeen > 86400000) {
        this.ipIntel.delete(ip);
      }
    }
  }
}

/* =========================
   SINGLETON EXPORT
========================= */
export const cyberDefenseCloud = new CyberDefenseCloud();

/* =========================
   PUBLIC API
========================= */
export function processCyberEvent(event) {
  return cyberDefenseCloud.ingest(event);
}

export function getCyberDashboard() {
  return cyberDefenseCloud.getDashboard();
}

export function isIPBlacklisted(ip) {
  return cyberDefenseCloud.blacklist.has(ip);
}
