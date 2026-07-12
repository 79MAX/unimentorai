import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

/* =========================
   CONFIG
========================= */

const API = "http://127.0.0.1:3001";
const WS_URL = "ws://127.0.0.1:3001";

export default function useDashboardData() {

    /* =========================
       STATE
    ========================= */

    const [health, setHealth] = useState(null);
    const [ai, setAi] = useState(null);
    const [live, setLive] = useState(null);
    const [status, setStatus] = useState("initializing");

    /* =========================
       REFS (STABILITY ENGINE)
    ========================= */

    const wsRef = useRef(null);
    const retryRef = useRef(0);
    const reconnectLock = useRef(false);

    /* =========================
       API LOADER
    ========================= */

    const loadAPI = useCallback(async () => {

        try {

            const [h, a] = await Promise.all([
                axios.get(`${API}/api/health`),
                axios.get(`${API}/api/ai-status`)
            ]);

            setHealth(h.data);
            setAi(a.data);

            setStatus("api loaded");

        } catch (err) {

            setStatus("api error ❌");

        }

    }, []);

    /* =========================
       WS ENGINE (SMART RECONNECT)
    ========================= */

    const connectWS = useCallback(() => {

        if (reconnectLock.current) return;
        reconnectLock.current = true;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        setStatus("connecting...");

        /* -------------------------
           OPEN
        ------------------------- */
        ws.onopen = () => {

            setStatus("connected 🚀");
            retryRef.current = 0;
            reconnectLock.current = false;

        };

        /* -------------------------
           MESSAGE STREAM
        ------------------------- */
        ws.onmessage = (event) => {

            try {
                setLive(JSON.parse(event.data));
            } catch {
                setLive({ raw: event.data });
            }

        };

        /* -------------------------
           ERROR
        ------------------------- */
        ws.onerror = () => {

            setStatus("ws error ⚠️");

        };

        /* -------------------------
           CLOSE + BACKOFF RECONNECT
        ------------------------- */
        ws.onclose = () => {

            setStatus("disconnected ❌");
            reconnectLock.current = false;

            const retry = retryRef.current++;
            const delay = Math.min(1000 * retry, 8000);

            setTimeout(connectWS, delay);

        };

    }, []);

    /* =========================
       INIT ENGINE
    ========================= */

    useEffect(() => {

        loadAPI();
        connectWS();

        return () => {
            wsRef.current?.close();
        };

    }, [loadAPI, connectWS]);

    /* =========================
       RETURN API
    ========================= */

    return {
        health,
        ai,
        live,
        status,
        reload: loadAPI
    };

}