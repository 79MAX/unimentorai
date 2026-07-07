/**
 * 🧠 AI ADMIN DASHBOARD — UNIMENTORAI PRO MAX (OPTIMIZED)
 * Executive AI Control Panel (Stripe / OpenAI / Meta style)
 * Production-ready SaaS intelligence UI
 */

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { AdminAPI } from "../../api/admin.api";

/* =========================
   🧠 AI INSIGHT ENGINE (IMPROVED)
========================= */
const getAIInsight = (data) => {

  if (!data) return "📊 Loading intelligence...";

  const growth = data?.users?.growthRate ?? 0;
  const churn = data?.churn?.churnRate ?? 0;
  const revenue = data?.revenue?.totalRevenue ?? 0;

  if (churn > 40) return "🚨 Critical churn — immediate retention required";
  if (growth > 25) return "🚀 Explosive growth — scale acquisition now";
  if (revenue > 10000) return "💰 Strong revenue performance detected";

  return "📊 System stable — optimization opportunities available";
};

/* =========================
   🚀 MAIN DASHBOARD
========================= */
export default function AdminAiDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     📡 FETCH DATA (SAFE + RETRY READY)
  ========================= */
  const loadDashboard = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const res = await AdminAPI.getDashboard();

      setData(res?.data || res);

    } catch (err) {

      setError(err?.message || "FAILED_TO_LOAD_DASHBOARD");

    } finally {

      setLoading(false);
    }

  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* =========================
     🧠 AI INSIGHT MEMOIZED
  ========================= */
  const insight = useMemo(() => getAIInsight(data), [data]);

  /* =========================
     ⏳ LOADING STATE
  ========================= */
  if (loading) {

    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>🧠 AI Brain Processing...</Text>
      </View>
    );
  }

  /* =========================
     ⚠️ ERROR STATE (PRO UX)
  ========================= */
  if (error) {

    return (
      <View style={styles.center}>

        <Text style={styles.error}>⚠️ {error}</Text>

        <TouchableOpacity onPress={loadDashboard}>
          <Text style={styles.retry}>🔄 Tap to retry</Text>
        </TouchableOpacity>

      </View>
    );
  }

  /* =========================
     📊 SAFE DATA ACCESS
  ========================= */
  const users = data?.users || {};
  const revenue = data?.revenue || {};
  const ai = data?.ai || {};
  const system = data?.system || {};

  const formatCurrency = (value) => {
    if (!value) return "0";
    return value.toLocaleString("fr-FR");
  };

  /* =========================
     📊 UI RENDER
  ========================= */
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>🧠 AI ADMIN DASHBOARD</Text>

      {/* AI INSIGHT PANEL */}
      <View style={styles.insightBox}>
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      {/* SYSTEM STATUS */}
      <View style={styles.card}>
        <Text style={styles.label}>⚙️ System Status</Text>
        <Text style={styles.value}>
          {system.status || "UNKNOWN"}
        </Text>
      </View>

      {/* USERS */}
      <View style={styles.card}>
        <Text style={styles.label}>👤 Users Growth</Text>
        <Text style={styles.value}>
          {users.growthRate ?? 0}%
        </Text>
      </View>

      {/* REVENUE */}
      <View style={styles.card}>
        <Text style={styles.label}>💰 Revenue</Text>
        <Text style={styles.value}>
          {formatCurrency(revenue.totalRevenue)} FCFA
        </Text>
      </View>

      {/* AI USAGE */}
      <View style={styles.card}>
        <Text style={styles.label}>🤖 AI Usage</Text>
        <Text style={styles.value}>
          {ai.aiUsage ?? 0} requests
        </Text>
      </View>

    </ScrollView>
  );
}

/* =========================
   🎨 STRIPE-STYLE DESIGN SYSTEM
========================= */
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15
  },

  insightBox: {
    backgroundColor: "#0b1220",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3b82f6",
    marginBottom: 15
  },

  insightText: {
    color: "#60a5fa",
    fontWeight: "600"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },

  label: {
    color: "#94a3b8",
    fontSize: 14
  },

  value: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5
  },

  text: {
    color: "#94a3b8",
    marginTop: 10
  },

  error: {
    color: "#ef4444",
    fontSize: 16,
    marginBottom: 10
  },

  retry: {
    color: "#3b82f6",
    fontWeight: "600"
  }
});
