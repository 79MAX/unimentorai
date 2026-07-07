"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// =========================
// 🧠 UNIMENTORAI BADGE SYSTEM
// ENTERPRISE DESIGN SYSTEM
// =========================

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "ai"
  | "premium"

export type BadgeSize =
  | "xs"
  | "sm"
  | "md"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  pulse?: boolean
}

// =========================
// 🎨 VARIANTS
// =========================

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-slate-100 text-slate-800 border-slate-200",

  primary:
    "bg-indigo-100 text-indigo-700 border-indigo-200",

  secondary:
    "bg-slate-200 text-slate-700 border-slate-300",

  success:
    "bg-emerald-100 text-emerald-700 border-emerald-200",

  warning:
    "bg-amber-100 text-amber-800 border-amber-200",

  danger:
    "bg-red-100 text-red-700 border-red-200",

  outline:
    "bg-transparent text-foreground border-border",

  ai:
    "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-700 border-indigo-300 dark:text-indigo-300",

  premium:
    "bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-700 border-amber-300 dark:text-amber-300"
}

// =========================
// 📏 SIZES
// =========================

const sizeStyles: Record<BadgeSize, string> = {
  xs: "text-[10px] px-1.5 py-0.5",
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1"
}

// =========================
// 🟢 DOT COLORS
// =========================

const dotStyles: Partial<Record<BadgeVariant, string>> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  primary: "bg-indigo-500",
  ai: "bg-purple-500",
  premium: "bg-amber-500"
}

// =========================
// 🧩 COMPONENT
// =========================

export const Badge = React.memo(function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        "transition-all duration-200",
        "select-none whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            dotStyles[variant] ?? "bg-slate-500",
            pulse && "animate-pulse"
          )}
        />
      )}

      {children}
    </span>
  )
})

Badge.displayName = "Badge"