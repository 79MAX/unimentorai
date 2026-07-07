export class ObservabilityControlPlaneV7 {
  constructor({
    clusters = [],
    aiEngine = null,
    alertEngine = null,
    autoScale = true,
    healthCheckInterval = 5000,
  } = {}) {
    this.clusters = new Map();

    this.aiEngine = aiEngine;
    this.alertEngine = alertEngine;

    this.autoScale = autoScale;
    this.healthCheckInterval = healthCheckInterval;

    this.globalState = {
      totalEvents: 0,
      totalIncidents: 0,
      systemHealth: "HEALTHY",
    };

    this.subscribers = new Map();
    this.leaderClusterId = null;

    clusters.forEach((c) => this.registerCluster(c));

    this._interval = null;
    this.startHealthMonitor();
  }

  /* =========================
     CLUSTER MANAGEMENT
  ========================== */
  registerCluster(cluster) {
    if (!cluster?.nodeId) return;

    this.clusters.set(cluster.nodeId, {
      instance: cluster,
      status: "ACTIVE",
      lastSeen: Date.now(),
    });

    this.emit("CLUSTER_REGISTERED", cluster.nodeId);
  }

  unregisterCluster(clusterId) {
    this.clusters.delete(clusterId);
    this.emit("CLUSTER_REMOVED", clusterId);
  }

  /* =========================
     GLOBAL INGEST ROUTING
  ========================== */
  ingest(event) {
    const cluster = this.selectCluster();

    if (!cluster) return;

    try {
      cluster.ingest(event);
      this.globalState.totalEvents++;
    } catch (err) {
      this.emit("INGEST_ERROR", err);
      return;
    }

    this.evaluateGlobalHealth();

    this.emit("EVENT_ROUTED", {
      cluster: cluster.nodeId,
      event,
    });
  }

  /* =========================
     LOAD BALANCER (OPTIMIZED)
  ========================== */
  selectCluster() {
    const entries = [...this.clusters.values()];
    if (!entries.length) return null;

    let best = entries[0];

    for (let i = 1; i < entries.length; i++) {
      const current = entries[i];

      if (this.getLoad(current) < this.getLoad(best)) {
        best = current;
      }
    }

    return best.instance;
  }

  getLoad(clusterWrapper) {
    return clusterWrapper.instance.eventQueue?.length || 0;
  }

  /* =========================
     HEALTH ENGINE
  ========================== */
  evaluateGlobalHealth() {
    const total = this.clusters.size;
    if (!total) return;

    let unhealthy = 0;

    for (const c of this.clusters.values()) {
      if (c.status !== "ACTIVE") unhealthy++;
    }

    const ratio = unhealthy / total;

    this.globalState.systemHealth =
      ratio > 0.5 ? "CRITICAL" :
      ratio > 0.2 ? "DEGRADED" :
      "HEALTHY";
  }

  /* =========================
     AUTO SCALING ENGINE
  ========================== */
  autoScaleEngine() {
    if (!this.autoScale) return;

    const avg = this.getAverageLoad();

    if (avg > 80) return this.scaleUp();
    if (avg < 20) return this.scaleDown();
  }

  getAverageLoad() {
    const values = [...this.clusters.values()]
      .map((c) => this.getLoad(c));

    if (!values.length) return 0;

    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  scaleUp() {
    this.emit("AUTO_SCALE_UP", { reason: "HIGH_LOAD" });
  }

  scaleDown() {
    this.emit("AUTO_SCALE_DOWN", { reason: "LOW_LOAD" });
  }

  /* =========================
     INCIDENT COORDINATION
  ========================== */
  processIncident(incident) {
    this.globalState.totalIncidents++;

    try {
      this.aiEngine?.processIncident?.(incident);
      this.alertEngine?.triggerAlert?.(incident);
    } catch (e) {
      this.emit("PIPELINE_ERROR", e);
    }

    this.emit("INCIDENT_PROCESSED", incident);
  }

  /* =========================
     HEALTH MONITOR LOOP
  ========================== */
  startHealthMonitor() {
    if (this._interval) return;

    this._interval = setInterval(() => {
      this.checkClusters();
      this.autoScaleEngine();
    }, this.healthCheckInterval);
  }

  stopHealthMonitor() {
    if (!this._interval) return;

    clearInterval(this._interval);
    this._interval = null;
  }

  checkClusters() {
    const now = Date.now();

    for (const [id, c] of this.clusters.entries()) {
      if (now - c.lastSeen > 15000) {
        this.unregisterCluster(id);
      }
    }
  }

  /* =========================
     EVENT BUS
  ========================== */
  on(event, cb) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }

    this.subscribers.get(event).add(cb);
    return () => this.off(event, cb);
  }

  off(event, cb) {
    this.subscribers.get(event)?.delete(cb);
  }

  emit(event, payload) {
    const subs = this.subscribers.get(event);
    if (!subs) return;

    for (const cb of subs) {
      try {
        cb(payload);
      } catch (e) {
        console.error("[ControlPlane Error]", e);
      }
    }
  }

  /* =========================
     PUBLIC API
  ========================== */
  getSystemState() {
    return {
      ...this.globalState,
      clusters: this.clusters.size,
      avgLoad: this.getAverageLoad(),
    };
  }
}
