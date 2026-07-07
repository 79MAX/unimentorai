import { useState, useCallback, useRef } from "react";
import { TutorPipeline } from "../pipeline/tutor.pipeline.js";

export function useTutorLoop() {

  /* =========================
     🧠 GLOBAL STATE (OPTIMIZED)
  ========================= */
  const [state, setState] = useState({
    status: "IDLE", // IDLE | LOADING | SUCCESS | ERROR
    reply: null,
    memory: null,
    recommendations: [],
    error: null,
    traceId: null
  });

  /* =========================
     🚨 REQUEST CONTROL (RACE SAFE)
  ========================= */
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  /* =========================
     🚀 RUN TUTOR LOOP
  ========================= */
  const run = useCallback(async (input) => {

    /* =========================
       🔢 REQUEST ID (RACE CONTROL)
    ========================= */
    const requestId = ++requestIdRef.current;

    /* =========================
       🚫 CANCEL PREVIOUS REQUEST
    ========================= */
    if (abortRef.current) {
      abortRef.current.abort?.();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setState(prev => ({
      ...prev,
      status: "LOADING",
      error: null
    }));

    try {

      /* =========================
         🤖 CALL BACKEND PIPELINE
      ========================= */
      const result = await TutorPipeline.handle({
        ...input,
        signal: controller.signal
      });

      /* =========================
         🚨 IGNORE OLD RESPONSES
      ========================= */
      if (requestId !== requestIdRef.current) return;

      /* =========================
         📊 UPDATE STATE (BATCHED)
      ========================= */
      setState({
        status: "SUCCESS",
        reply: result?.reply || null,
        memory: result?.memory || null,
        recommendations: result?.recommendations || [],
        traceId: result?.traceId || null,
        error: null
      });

      return result;

    } catch (err) {

      /* =========================
         🚨 ABORT HANDLING
      ========================= */
      if (err.name === "AbortError") return;

      console.error("[USE_TUTOR_LOOP_ERROR]", err);

      setState(prev => ({
        ...prev,
        status: "ERROR",
        error: "Une erreur est survenue pendant l'apprentissage."
      }));

      return null;

    }
  }, []);

  /* =========================
     🔁 RESET STATE
  ========================= */
  const reset = useCallback(() => {

    requestIdRef.current++;

    if (abortRef.current) {
      abortRef.current.abort?.();
    }

    setState({
      status: "IDLE",
      reply: null,
      memory: null,
      recommendations: [],
      error: null,
      traceId: null
    });

  }, []);

  /* =========================
     📦 RETURN API
  ========================= */
  return {
    run,
    reset,

    ...state,

    isLoading: state.status === "LOADING",
    isError: state.status === "ERROR",
    isSuccess: state.status === "SUCCESS"
  };
}

