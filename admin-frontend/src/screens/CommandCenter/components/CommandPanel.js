/**
 * 🧠 COMMAND PANEL — UNIMENTORAI COMMAND CENTER (SILICON VALLEY CTO EDITION)
 * Autonomous AI Operations Interface
 * OpenAI / Stripe / Linear / Vercel-grade architecture
 *
 * Features:
 * - Command orchestration layer
 * - Real-time execution states
 * - AI-safe execution queue
 * - Optimistic UI
 * - Scalable command registry
 * - Production-grade UX
 */

import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useRef
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView
} from "react-native";

/* =====================================================
   🧠 COMMAND REGISTRY
===================================================== */

const COMMANDS = Object.freeze([

  {
    id: "AI_TRAINING",
    label: "Trigger AI Training",
    icon: "🧠",
    type: "AI",
    priority: "HIGH",
    description: "Launch autonomous retraining cycle"
  },

  {
    id: "OPTIMIZE_REVENUE",
    label: "Optimize Revenue",
    icon: "💰",
    type: "BUSINESS",
    priority: "HIGH",
    description: "Run pricing & monetization optimization"
  },

  {
    id: "DETECT_CHURN",
    label: "Detect Churn",
    icon: "⚠️",
    type: "ANALYTICS",
    priority: "CRITICAL",
    description: "Analyze retention & churn anomalies"
  },

  {
    id: "BOOST_COURSES",
    label: "Boost Courses",
    icon: "📚",
    type: "LEARNING",
    priority: "MEDIUM",
    description: "Optimize visibility & engagement ranking"
  },

  {
    id: "SCAN_SECURITY",
    label: "Security Scan",
    icon: "🔒",
    type: "SECURITY",
    priority: "CRITICAL",
    description: "Run infrastructure threat analysis"
  },

  {
    id: "RESTART_AI_BRAIN",
    label: "Restart AI Brain",
    icon: "⚡",
    type: "SYSTEM",
    priority: "HIGH",
    description: "Reinitialize autonomous intelligence engine"
  }

]);

/* =====================================================
   🎨 DESIGN TOKENS
===================================================== */

const COLORS = Object.freeze({

  background: "#020617",
  surface: "#0f172a",
  border: "#1e293b",

  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",

  AI: "#8b5cf6",
  BUSINESS: "#22c55e",
  ANALYTICS: "#3b82f6",
  LEARNING: "#f59e0b",
  SECURITY: "#ef4444",
  SYSTEM: "#94a3b8",

  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444"
});

/* =====================================================
   🧠 HELPERS
===================================================== */

const getTypeColor = (type) => {
  return COLORS[type] || COLORS.SYSTEM;
};

const getPriorityBadge = (priority) => {

  switch (priority) {

    case "CRITICAL":
      return {
        label: "CRITICAL",
        color: COLORS.danger
      };

    case "HIGH":
      return {
        label: "HIGH",
        color: COLORS.warning
      };

    default:
      return {
        label: "NORMAL",
        color: COLORS.textMuted
      };
  }
};

/* =====================================================
   ⚡ COMMAND CARD
===================================================== */

const CommandCard = memo(({
  command,
  loading,
  disabled,
  onExecute
}) => {

  const typeColor = useMemo(
    () => getTypeColor(command.type),
    [command.type]
  );

  const priority = useMemo(
    () => getPriorityBadge(command.priority),
    [command.priority]
  );

  return (

    <Pressable
      disabled={loading || disabled}
      onPress={() => onExecute(command)}
      style={({ pressed }) => [

        styles.card,

        pressed && !disabled && styles.cardPressed,

        disabled && styles.cardDisabled
      ]}
    >

      {/* HEADER */}
      <View style={styles.cardHeader}>

        <View style={styles.leftSection}>

          {/* ICON */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${typeColor}20`
              }
            ]}
          >
            <Text style={styles.icon}>
              {command.icon}
            </Text>
          </View>

          {/* META */}
          <View style={styles.metaContainer}>

            <Text style={styles.cardTitle}>
              {command.label}
            </Text>

            <View style={styles.badgesRow}>

              <Text
                style={[
                  styles.typeText,
                  { color: typeColor }
                ]}
              >
                {command.type}
              </Text>

              <View
                style={[
                  styles.priorityBadge,
                  {
                    borderColor: priority.color
                  }
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: priority.color
                    }
                  ]}
                >
                  {priority.label}
                </Text>
              </View>

            </View>

          </View>

        </View>

        {/* STATUS */}
        <View style={styles.statusContainer}>

          {loading ? (

            <ActivityIndicator
              size="small"
              color={typeColor}
            />

          ) : (

            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: typeColor
                }
              ]}
            />

          )}

        </View>

      </View>

      {/* DESCRIPTION */}
      <Text style={styles.description}>
        {command.description}
      </Text>

    </Pressable>
  );
});

/* =====================================================
   🚀 MAIN COMMAND PANEL
===================================================== */

function CommandPanel({

  onExecuteCommand,
  disabled = false

}) {

  const [activeCommand, setActiveCommand] = useState(null);

  const executionLock = useRef(false);

  /* =====================================================
     ⚡ EXECUTION ENGINE
  ===================================================== */

  const executeCommand = useCallback(async (command) => {

    if (
      disabled ||
      executionLock.current
    ) {
      return;
    }

    try {

      executionLock.current = true;

      setActiveCommand(command.id);

      await Promise.resolve(
        onExecuteCommand?.({
          ...command,
          executedAt: Date.now()
        })
      );

    } catch (error) {

      console.error(
        "COMMAND_EXECUTION_FAILED",
        {
          commandId: command.id,
          error: error?.message
        }
      );

    } finally {

      setTimeout(() => {

        setActiveCommand(null);

        executionLock.current = false;

      }, 600);
    }

  }, [disabled, onExecuteCommand]);

  /* =====================================================
     📊 ANALYTICS
  ===================================================== */

  const analytics = useMemo(() => {

    return {

      total: COMMANDS.length,

      critical: COMMANDS.filter(
        c => c.priority === "CRITICAL"
      ).length,

      ai: COMMANDS.filter(
        c => c.type === "AI"
      ).length,

      system: COMMANDS.filter(
        c => c.type === "SYSTEM"
      ).length
    };

  }, []);

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (

    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <View>

          <Text style={styles.headerTitle}>
            🧠 EXECUTIVE COMMAND CENTER
          </Text>

          <Text style={styles.headerSubtitle}>
            Autonomous AI Operations Layer
          </Text>

        </View>

        {/* ANALYTICS */}
        <View style={styles.analyticsContainer}>

          <View style={styles.metricPill}>
            <Text style={styles.metricText}>
              ⚡ {analytics.total}
            </Text>
          </View>

          <View style={styles.metricPill}>
            <Text style={styles.metricText}>
              🚨 {analytics.critical}
            </Text>
          </View>

          <View style={styles.metricPill}>
            <Text style={styles.metricText}>
              🧠 {analytics.ai}
            </Text>
          </View>

        </View>

      </View>

      {/* COMMANDS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {COMMANDS.map((command) => (

          <CommandCard
            key={command.id}
            command={command}
            disabled={disabled}
            loading={activeCommand === command.id}
            onExecute={executeCommand}
          />

        ))}

      </ScrollView>

    </View>
  );
}

export default memo(CommandPanel);

/* =====================================================
   🎨 DESIGN SYSTEM
===================================================== */

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 580
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22
  },

  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2
  },

  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 5
  },

  analyticsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  metricPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },

  metricText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700"
  },

  scrollContent: {
    paddingBottom: 40
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }]
  },

  cardDisabled: {
    opacity: 0.5
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },

  icon: {
    fontSize: 24
  },

  metaContainer: {
    flex: 1
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800"
  },

  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },

  typeText: {
    fontSize: 11,
    fontWeight: "700",
    marginRight: 8
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1
  },

  priorityText: {
    fontSize: 10,
    fontWeight: "800"
  },

  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30
  },

  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 999
  },

  description: {
    color: COLORS.textSecondary,
    marginTop: 16,
    lineHeight: 20,
    fontSize: 13
  }

});
