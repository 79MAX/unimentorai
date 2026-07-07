/**
 * 💰 PAYMENT FLOW UI — UNIMENTORAI (SILICON VALLEY GRADE)
 * Netflix + Stripe UX + SaaS monetization engine
 */

import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";

import { KkiapayService } from "../../core/payment/kkiapay.service";
import { OfflineStorage } from "../../core/offline/offline_storage";

export default function PaymentFlowScreen({ navigation }) {

  // 👤 USER (SAFE LOAD)
  const user = useMemo(() => {
    return OfflineStorage?.get?.("user") || { id: "guest" };
  }, []);

  // ⚡ STATE MANAGEMENT
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // 💰 PLANS (MEMOIZED = PERF OPTIMIZED)
  const plans = useMemo(() => ([
    {
      id: "FREE",
      title: "Free",
      price: 0,
      badge: "Starter",
      features: ["Basic courses", "Limited AI access"]
    },
    {
      id: "STANDARD",
      title: "Standard",
      price: 5000,
      badge: "Most Popular",
      features: ["Full courses", "AI tutor", "Progress tracking"]
    },
    {
      id: "PREMIUM",
      title: "Premium",
      price: 15000,
      badge: "Pro",
      features: ["Everything", "Certificates", "Offline mode"]
    }
  ]), []);

  // 🧠 SELECT PLAN (SAFE)
  const selectPlan = useCallback((plan) => {

    if (loading) return; // prevent interaction during payment

    setSelectedPlan(plan);

  }, [loading]);

  // 🔐 CHECK SUBSCRIPTION (ANTI DUPLICATE PAYMENT)
  const hasActiveSubscription = useCallback(() => {

    const sub = OfflineStorage.get("subscription");

    return sub?.status === "ACTIVE" &&
           Date.now() < sub?.expiry;

  }, []);

  // 🚀 PAYMENT ENGINE
  const payNow = useCallback(async () => {

    if (!selectedPlan) {
      Alert.alert("⚠️ Please select a plan");
      return;
    }

    // 🧠 FREE PLAN HANDLING
    if (selectedPlan.id === "FREE") {

      OfflineStorage.set("subscription", {
        plan: "FREE",
        status: "ACTIVE",
        expiry: null
      });

      Alert.alert("🎉 Free plan activated");

      navigation?.goBack?.();

      return;
    }

    // 🚨 BLOCK IF ALREADY ACTIVE
    if (hasActiveSubscription()) {
      Alert.alert("ℹ️ Subscription already active");
      return;
    }

    try {

      setLoading(true);
      setProcessingPlan(selectedPlan.id);

      // 💳 PAYMENT REQUEST
      const payment = await KkiapayService.pay(
        selectedPlan.price,
        user
      );

      // 📦 SUBSCRIPTION OBJECT (PRODUCTION SAFE)
      const subscription = {
        plan: selectedPlan.id,
        status: "ACTIVE",
        startDate: Date.now(),
        expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        provider: "KKIAPAY",
        transactionId: payment?.reference || null
      };

      // 💾 SAVE STATE
      OfflineStorage.set("subscription", subscription);
      OfflineStorage.set("last_payment", payment);

      Alert.alert(
        "✅ Success",
        `${selectedPlan.title} activated successfully`
      );

      navigation?.goBack?.();

    } catch (error) {

      console.error("PAYMENT_ERROR:", error);

      Alert.alert(
        "❌ Payment Failed",
        error?.message || "Try again later"
      );

    } finally {

      setLoading(false);
      setProcessingPlan(null);
    }

  }, [selectedPlan, user]);

  // 📱 LOADING UI (PAYMENT BLOCK STATE)
  if (loading) {

    return (
      <View style={styles.center}>

        <ActivityIndicator size="large" color="#3b82f6" />

        <Text style={styles.loadingText}>
          💳 Processing payment...
        </Text>

        <Text style={styles.subText}>
          Please do not close the app
        </Text>

      </View>
    );
  }

  // 📱 MAIN UI
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>
        💰 Choose Your Plan
      </Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>
        Unlock your full learning potential
      </Text>

      {/* PLANS */}
      {plans.map((plan) => (

        <TouchableOpacity
          key={plan.id}
          onPress={() => selectPlan(plan)}
          style={[
            styles.card,
            selectedPlan?.id === plan.id && styles.selected
          ]}
        >

          {/* BADGE */}
          <Text style={styles.badge}>
            {plan.badge}
          </Text>

          {/* TITLE */}
          <Text style={styles.planTitle}>
            {plan.title}
          </Text>

          {/* PRICE */}
          <Text style={styles.price}>
            {plan.price === 0 ? "FREE" : `${plan.price} FCFA / month`}
          </Text>

          {/* FEATURES */}
          {plan.features.map((f, i) => (
            <Text key={i} style={styles.feature}>
              ✓ {f}
            </Text>
          ))}

          {/* LOADING STATE PER PLAN */}
          {processingPlan === plan.id && (
            <Text style={styles.processing}>
              Processing...
            </Text>
          )}

        </TouchableOpacity>

      ))}

      {/* CTA BUTTON */}
      <TouchableOpacity
        onPress={payNow}
        disabled={loading || !selectedPlan}
        style={[
          styles.button,
          (!selectedPlan || loading) && styles.buttonDisabled
        ]}
      >

        <Text style={styles.buttonText}>
          🚀 Continue
        </Text>

      </TouchableOpacity>

    </View>
  );
}

/* =========================
   🎨 SILICON VALLEY STYLES
========================= */
const styles = {

  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a"
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff"
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 6,
    marginBottom: 20
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },

  selected: {
    borderWidth: 2,
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3
  },

  badge: {
    color: "#10b981",
    fontSize: 12,
    marginBottom: 5
  },

  planTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff"
  },

  price: {
    color: "#38bdf8",
    marginTop: 6,
    fontWeight: "600"
  },

  feature: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4
  },

  processing: {
    marginTop: 10,
    color: "#f59e0b"
  },

  button: {
    marginTop: 20,
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },

  buttonDisabled: {
    backgroundColor: "#1e40af"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },

  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontWeight: "600"
  },

  subText: {
    color: "#94a3b8",
    marginTop: 5,
    fontSize: 12
  }
};
