export class ObservabilityQueryEngineV9 {
  constructor({ storage = null } = {}) {
    this.storage = storage;
  }

  /* =========================
     MAIN ENTRY POINT
  ========================== */
  query({
    type = "metrics",
    name,
    tenantId,
    from = 0,
    to = Date.now(),
    limit = 100,
    filters = {},
  } = {}) {
    switch (type) {
      case "metrics":
        return this.queryMetrics(name, from, to, limit);

      case "logs":
        return this.queryLogs(tenantId, from, to, limit, filters);

      case "events":
        return this.queryEvents(tenantId, from, to, limit);

      case "traces":
        return this.queryTraces(filters);

      default:
        return [];
    }
  }

  /* =========================
     METRICS QUERY
  ========================== */
  queryMetrics(name, from, to, limit) {
    const series = this.storage?.metricsStore?.get(name);
    if (!series?.length) return [];

    const out = [];

    for (let i = 0; i < series.length && out.length < limit; i++) {
      const p = series[i];
      if (p.timestamp >= from && p.timestamp <= to) {
        out.push(p);
      }
    }

    return out;
  }

  /* =========================
     EVENTS QUERY
  ========================== */
  queryEvents(tenantId, from, to, limit) {
    const events = this.storage?.indexByTenant?.get(tenantId);
    if (!events?.length) return [];

    return this._filterByTime(events, from, to, limit);
  }

  /* =========================
     LOGS QUERY (FAST FILTER PIPELINE)
  ========================== */
  queryLogs(tenantId, from, to, limit, filters) {
    const events = this.storage?.indexByTenant?.get(tenantId);
    if (!events?.length) return [];

    const out = [];

    for (let i = 0; i < events.length && out.length < limit; i++) {
      const item = events[i];

      if (!this._inRange(item, from, to)) continue;
      if (!this._match(item, filters)) continue;

      out.push(item);
    }

    return out;
  }

  /* =========================
     TRACES QUERY
  ========================== */
  queryTraces(filters = {}) {
    const traces = this.storage?.indexByTrace;
    if (!traces) return [];

    const out = [];

    for (const trace of traces.values()) {
      if (this._match(trace, filters)) {
        out.push(trace);
      }
    }

    return out;
  }

  /* =========================
     CORE FILTER ENGINE (OPTIMIZED)
  ========================== */
  _match(item, filters) {
    for (const k in filters) {
      if (item[k] !== filters[k]) return false;
    }
    return true;
  }

  _inRange(item, from, to) {
    const ts = item.timestamp || 0;
    return ts >= from && ts <= to;
  }

  _filterByTime(list, from, to, limit) {
    const out = [];

    for (let i = 0; i < list.length && out.length < limit; i++) {
      const item = list[i];
      if (this._inRange(item, from, to)) {
        out.push(item);
      }
    }

    return out;
  }

  /* =========================
     AGGREGATION ENGINE
  ========================== */
  aggregateMetrics(name, mode = "avg") {
    const series = this.storage?.metricsStore?.get(name);
    if (!series?.length) return 0;

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < series.length; i++) {
      const v = series[i].value;
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
    }

    switch (mode) {
      case "sum":
        return sum;
      case "max":
        return max;
      case "min":
        return min;
      case "avg":
      default:
        return sum / series.length;
    }
  }

  /* =========================
     TIMESERIES BUILDER (FAST PATH)
  ========================== */
  buildTimeSeries(name, from = 0) {
    const series = this.storage?.metricsStore?.get(name);
    if (!series?.length) return [];

    const out = [];

    for (let i = 0; i < series.length; i++) {
      const p = series[i];
      if (p.timestamp >= from) {
        out.push({
          time: p.timestamp,
          value: p.value,
        });
      }
    }

    return out;
  }

  /* =========================
     DASHBOARD SNAPSHOT
  ========================== */
  getDashboardSnapshot(tenantId) {
    return {
      events: this.storage?.indexByTenant?.get(tenantId)?.length || 0,
      metrics: this.storage?.metricsStore?.size || 0,
      traces: this.storage?.indexByTrace?.size || 0,
    };
  }
}
