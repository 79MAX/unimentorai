/**
 * ⚡ LIVE CONSOLE — UNIMENTORAI COMMAND CENTER (PRO MAX)
 * OpenAI / Stripe / Meta Internal Ops Console
 * Enterprise-grade realtime monitoring layer
 */

import React, {
  memo,
  useMemo,
  useCallback
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable
} from "react-native";

/* =========================
   🧠 EVENT CONFIG ENGINE
========================= */
const EVENT_CONFIG = {

  ERROR: {
    color: "#ef4444",
    icon: "🚨"
  },

  WARNING: {
    color: "#f59e0b",
    icon: "⚠️"
  },

  SUCCESS: {
    color: "#10b981",
    icon: "✅"
  },

  AI: {
    color: "#8b5cf6",
    icon: "🧠"
  },

  SYSTEM: {
    color: "#3b82f6",
    icon: "⚡"
  },

  SECURITY: {
    color: "#ec4899",
    icon: "🔒"
  },

  PAYMENT: {
    color: "#22c55e",
    icon: "💰"
  },

  DEFAULT: {
    color: "#94a3b8",
    icon: "📡"
  }
};

/* =========================
   🧠 EVENT STYLE ENGINE
========================= */
const getEventMeta = (type = "") => {

  return (
    EVENT_CONFIG[type?.toUpperCase?.()] ||
    EVENT_CONFIG.DEFAULT
  );
};

/* =========================
   🕒 FORMAT TIME
========================= */
const formatTimestamp = (timestamp) => {

  if (!timestamp) return "--:--:--";

  try {

    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(timestamp));

  } catch {

    return "--:--:--";
  }
};

/* =========================
   🧠 LOG LEVEL DETECTION
========================= */
const getSeverity = (type = "") => {

  switch (type?.toUpperCase?.()) {

    case "ERROR":
      return "HIGH";

    case "WARNING":
      return "MEDIUM";

    default:
      return "LOW";
  }
};

/* =========================
   ⚡ CONSOLE ITEM
========================= */
const ConsoleItem = memo(({ item, onPress }) => {

  const meta = useMemo(
    () => getEventMeta(item?.type),
    [item?.type]
  );

  const severity = useMemo(
    () => getSeverity(item?.type),
    [item?.type]
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.logRow,
        pressed && styles.logPressed
      ]}
      onPress={() => onPress?.(item)}
    >

      {/* TOP ROW */}
      <View style={styles.topRow}>

        {/* TYPE */}
        <View style={styles.typeContainer}>

          <Text style={styles.icon}>
            {meta.icon}
          </Text>

          <Text
            style={[
              styles.type,
              { color: meta.color }
            ]}
          >
            {item?.type || "EVENT"}
          </Text>

        </View>

        {/* TIME */}
        <Text style={styles.time}>
          {formatTimestamp(item?.timestamp)}
        </Text>

      </View>

      {/* MESSAGE */}
      <Text style={styles.message}>
        {item?.message || "No event message"}
      </Text>

      {/* FOOTER */}
      <View style={styles.footer}>

        <Text style={styles.meta}>
          Severity: {severity}
        </Text>

        {!!item?.source && (
          <Text style={styles.meta}>
            Source: {item.source}
          </Text>
        )}

      </View>

    </Pressable>
  );
});

/* =========================
   🚀 MAIN CONSOLE
========================= */
function LiveConsole({

  logs = [],
  maxLogs = 150,
  onSelectEvent

}) {

  /* =========================
     🧠 MEMORY SAFE STREAM
  ========================= */
  const safeLogs = useMemo(() => {

    if (!Array.isArray(logs)) return [];

    return [...logs]
      .sort((a, b) =>
        (b?.timestamp || 0) - (a?.timestamp || 0)
      )
      .slice(0, maxLogs);

  }, [logs, maxLogs]);

  /* =========================
     📊 STREAM METRICS
  ========================= */
  const metrics = useMemo(() => {

    const total = safeLogs.length;

    const errors = safeLogs.filter(
      l => l?.type === "ERROR"
    ).length;

    const warnings = safeLogs.filter(
      l => l?.type === "WARNING"
    ).length;

    return {
      total,
      errors,
      warnings
    };

  }, [safeLogs]);

  /* =========================
     📭 EMPTY STATE
  ========================= */
  if (!safeLogs.length) {

    return (
      <View style={styles.emptyContainer}>

        <Text style={styles.emptyIcon}>
          📡
        </Text>

        <Text style={styles.emptyTitle}>
          No live events detected
        </Text>

        <Text style={styles.emptyText}>
          Waiting for realtime system activity...
        </Text>

      </View>
    );
  }

  /* =========================
     📡 LIVE STREAM UI
  ========================= */
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <View>
          <Text style={styles.title}>
            ⚡ LIVE OPS STREAM
          </Text>

          <Text style={styles.subtitle}>
            Realtime infrastructure monitoring
          </Text>
        </View>

        <View style={styles.statsContainer}>

          <Text style={styles.stat}>
            📡 {metrics.total}
          </Text>

          <Text style={styles.statError}>
            🚨 {metrics.errors}
          </Text>

          <Text style={styles.statWarning}>
            ⚠️ {metrics.warnings}
          </Text>

        </View>

      </View>

      {/* STREAM */}
      <FlatList
        data={safeLogs}
        keyExtractor={(item, index) =>
          item?.id?.toString?.() ||
          `event-${index}`
        }
        renderItem={({ item }) => (
          <ConsoleItem
            item={item}
            onPress={onSelectEvent}
          />
        )}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        contentContainerStyle={{
          paddingBottom: 20
        }}
      />

    </View>
  );
}

export default memo(LiveConsole);

/* =========================
   🎨 DESIGN SYSTEM
========================= */
const styles = StyleSheet.create({

  container: {
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#0f172a",
    minHeight: 420
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },

  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },

  subtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 3
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  stat: {
    color: "#94a3b8",
    fontSize: 12
  },

  statError: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "700"
  },

  statWarning: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "700"
  },

  logRow: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e293b"
  },

  logPressed: {
    opacity: 0.85
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },

  typeContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  icon: {
    marginRight: 6
  },

  type: {
    fontSize: 12,
    fontWeight: "800"
  },

  time: {
    color: "#64748b",
    fontSize: 11
  },

  message: {
    color: "#e2e8f0",
    fontSize: 13,
    lineHeight: 20
  },

  footer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12
  },

  meta: {
    color: "#64748b",
    fontSize: 11
  },

  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 10
  },

  emptyTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6
  },

  emptyText: {
    color: "#64748b",
    fontSize: 13
  }
});
