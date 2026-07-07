
// =========================
// 🧠 UNIMENTORAI CORE UTILITIES
// SHADCN + TAILWIND DESIGN SYSTEM LAYER
// =========================

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// =========================
// 🎨 CLASS MERGE ENGINE (SHADCN STANDARD)
// =========================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =========================
// ⚡ DESIGN SYSTEM HELPERS
// =========================

/**
 * Safely joins class names for UI components
 * Prevents Tailwind conflicts (critical for SaaS scale)
 */
export function cx(...inputs: ClassValue[]) {
  return cn(...inputs)
}

// =========================
// 🧠 STRING HELPERS (UI LEVEL ONLY)
// =========================

/**
 * Capitalize first letter (UI labels, buttons, titles)
 */
export function capitalize(str: string) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncate text for UI cards / previews
 */
export function truncate(str: string, length: number) {
  if (!str) return ""
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

// =========================
// 🎯 UI STATE HELPERS
// =========================

/**
 * Conditional class helper for active states
 */
export function isActive(condition: boolean, activeClass: string, defaultClass = "") {
  return condition ? activeClass : defaultClass
}

// =========================
// 🚀 FUTURE AI UI SYSTEM HOOKS
// =========================

/**
 * Reserved for AI UI state formatting
 * (thinking, loading, success, error states)
 */
export const UIState = {
  idle: "ui-idle",
  loading: "ui-loading",
  success: "ui-success",
  error: "ui-error",
}