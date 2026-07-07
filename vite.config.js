import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"

// 🔥 FIX Windows / ESM safe (__dirname fix)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({

  // 🚨 ISOLATION FRONTEND (CRITICAL FIX)
  root: "frontend",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src"),
    }
  },

  server: {
    port: 5173,
    host: true,
    open: false,

    // 🔥 empêche accès filesystem dangereux
    fs: {
      strict: true,
      allow: [".."]
    }
  },

  preview: {
    port: 4173,
    host: true
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,

    // 🔥 meilleure compatibilité navigateurs
    target: "es2020",

    // 🔥 stable production
    minify: "esbuild",
    sourcemap: false,

    // 🔥 évite bugs chunk CSS JS
    cssCodeSplit: true,

    // 🔥 évite crash build logs
    reportCompressedSize: false
  },

  optimizeDeps: {
    include: ["react", "react-dom"]
  },

  // 🔥 empêche Vite de cacher les erreurs critiques
  logLevel: "info",
  clearScreen: false
})
