import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* =========================
   ROOT BOOT (SAFE V10)
========================= */

const container = document.getElementById("root");

if (!container) {
  throw new Error("ROOT ELEMENT NOT FOUND (#root)");
}

const root = createRoot(container);

/* =========================
   RENDER STABLE
========================= */

function renderApp() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

/* =========================
   SAFE INIT HOOK
========================= */

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    root.unmount();
  });
}

/* =========================
   START
========================= */

renderApp();