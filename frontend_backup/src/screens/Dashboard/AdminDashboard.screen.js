/**
 * 📊 ADMIN DASHBOARD — UNIMENTORAI (PRO LEVEL UI)
 * Stripe-style analytics interface (AI-ready)
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { AdminAPI } from "../../api/admin.api";

export default function AdminDashboard() {

  /* =========================
     🧠 STATE MANAGEMENT
  ========================= */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     📡 DATA FETCHER (SAFE)
  ========================= */
  const fetchDashboard = useCallback(async () => {

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

  /* =========================
     🚀 INIT LOAD
  ========================= */
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* =========================
     ⏳ LOADING STATE
  ========================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>Loading Admin Intelligence...</Text>
      </View>
    );
  }

  /* =========================
     ⚠️ ERROR STATE
  ========================= */
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>⚠️ {error}</Text>
        <Text style={styles.retry} onPress={fetchDashboard}>
          Tap to retry
        </Text>
      </View>
    );
  }

  /* =========================
     🧠 SAFE DATA ACCESS
  ========================= */
  const users = data?.users || {};
  const revenue = data?.revenue || {};
  const ai = data?.ai || {};

  /* =========================
     📊 DASHBOARD UI
  ========================= */
  return (
    <View style={styles.container}>

      <Text style={styles.title}>📊 Admin Dashboard</Text>

      {/* USERS */}
      <View style={styles.card}>
        <Text style={styles.label}>👤 Users Growth</Text>
        <Text style={styles.value}>
          {users.growthRate || 0}%
        </Text>
      </View>

      {/* REVENUE */}
      <View style={styles.card}>
        <Text style={styles.label}>💰 Revenue</Text>
        <Text style={styles.value}>
          {revenue.totalRevenue || 0}
        </Text>
      </View>

      {/* AI */}
      <View style={styles.card}>
        <Text style={styles.label}>🤖 AI Usage</Text>
        <Text style={styles.value}>
          {ai.aiUsage || 0}
        </Text>
      </View>

    </View>
  );
}

/* =========================
   🎨 STYLES (CLEAN SAAS UI)
========================= */
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a"
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
    marginBottom: 20
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 16,
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
    fontSize: 16
  },

  retry: {
    color: "#3b82f6",
    marginTop: 10
  }
});
