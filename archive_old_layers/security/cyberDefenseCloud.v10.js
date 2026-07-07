/* =========================
   SECURITY AI V10
   CYBER DEFENSE CLOUD
========================= */

class CyberDefenseCloud {
  constructor() {
    this.nodes = new Map();
    this.ipIntel = new Map();
    this.deviceIntel = new Map();
    this.userProfiles = new Map();
    this.blacklist = new Set();
    this.eventStream = [];
  }

  registerNode(nodeId, config = {}) {
    this.nodes.set(nodeId, {
      status: "active",
      load: 0,
      risk: 0,
      region: config.region ?? "global",
      ...config,
    });
  }

  ingest(event) {
    const e = this._normalize(event);

    this._updateIP(e);
    this._updateDevice(e);
    this._updateUser(e);

    const risk = this._calculateRisk(e);

    this._store(e, risk);

    return this._decide(e, risk);
  }

  _normalize(event = {}) {
    return Object.freeze({
      type: event.type,
      payload: event.payload ?? {},
      riskScore: event.riskScore ?? 0,
      timestamp: Date.now(),
      geo: event.geo ?? null,
    });
  }

  _get(map, key, factory) {
    if (!key) return null;
    if (!map.has(key)) map.set(key, factory());
    return map.get(key);
  }

  _updateIP({ payload, riskScore }) {
    const ip = payload.ip;
    if (!ip) return;

    const record = this._get(this.ipIntel, ip, () => ({
      hits: 0,
      risk: 0,
      lastSeen: Date.now(),
    }));

    record.hits++;
    record.lastSeen = Date.now();
    record.risk = record.risk * 0.85 + riskScore * 0.15;

    if (record.risk > 90) this.blacklist.add(ip);
  }

  _updateDevice({ payload, riskScore }) {
    const deviceId = payload.deviceId;
    if (!deviceId) return;

    const device = this._get(this.deviceIntel, deviceId, () => ({
      users: new Set(),
      risk: 0,
      hits: 0,
    }));

    device.hits++;
    device.risk = device.risk * 0.8 + riskScore * 0.2;

    if (payload.userId) device.users.add(payload.userId);
  }

  _updateUser({ payload, riskScore }) {
    const userId = payload.userId;
    if (!userId) return;

    const user = this._get(this.userProfiles, userId, () => ({
      risk: 20,
      ips: new Set(),
      devices: new Set(),
    }));

    if (payload.ip) user.ips.add(payload.ip);
    if (payload.deviceId) user.devices.add(payload.deviceId);

    user.risk = user.risk * 0.9 + riskScore * 0.1;
  }

  _calculateRisk({ payload, riskScore }) {
    const { ip, deviceId } = payload;

    let score = riskScore;

    if (ip && this.blacklist.has(ip)) score += 60;

    const ipData = this.ipIntel.get(ip);
    if (ipData) score += ipData.risk * 0.5;

    const deviceData = this.deviceIntel.get(deviceId);
    if (deviceData) score += deviceData.risk * 0.3;

    return Math.min(100, Math.round(score));
  }

  _decide(event, risk) {
    const { ip } = event.payload;

    if (risk >= 90) {
      if (ip) this.blacklist.add(ip);
      return this._action("BLOCK", event, risk);
    }

    if (risk >= 75) return this._action("STEP_UP_AUTH", event, risk);
    if (risk >= 50) return this._action("MONITOR", event, risk);

    return this._action("ALLOW", event, risk);
  }

  _action(type, event, risk) {
    const action = {
      type,
      risk,
      userId: event.payload.userId ?? null,
      ip: event.payload.ip ?? null,
      deviceId: event.payload.deviceId ?? null,
      timestamp: Date.now(),
    };

    console.warn("CYBER_DEFENSE_ACTION", action);

    return action;
  }

  _store(event, risk) {
    this.eventStream.push({ event, risk });

    if (this.eventStream.length > 20000) {
      this.eventStream.shift();
    }
  }

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

  cleanup() {
    const now = Date.now();

    for (const [ip, data] of this.ipIntel.entries()) {
      if (now - data.lastSeen > 86400000) {
        this.ipIntel.delete(ip);
      }
    }
  }
}

export const cyberDefenseCloud = new CyberDefenseCloud();

export function processCyberEvent(event) {
  return cyberDefenseCloud.ingest(event);
}

export function getCyberDashboard() {
  return cyberDefenseCloud.getDashboard();
}

export function isIPBlacklisted(ip) {
  return cyberDefenseCloud.blacklist.has(ip);
}

