"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/ios-spinner"

// =========================
// 🧠 UNI MENTOR AI BUTTON
// SHADCN + STRIPE-LEVEL UI PRIMITIVE
// =========================

type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "ai"

type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          // =========================
          // BASE STYLES
          // =========================
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",

          // =========================
          // VARIANTS
          // =========================
          variant === "default" &&
            "bg-black text-white hover:bg-black/80",

          variant === "secondary" &&
            "bg-gray-200 text-black hover:bg-gray-300",

          variant === "outline" &&
            "border border-gray-300 hover:bg-gray-50",

          variant === "ghost" &&
            "hover:bg-gray-100",

          variant === "destructive" &&
            "bg-red-500 text-white hover:bg-red-600",

          // 🤖 AI PREMIUM VARIANT
          variant === "ai" &&
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:opacity-90 ai-glow",

          // =========================
          // SIZES
          // =========================
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",

          className
        )}
        {...props}
      >
        {/* LEFT ICON OR LOADING */}
        {loading ? (
          <Spinner size="sm" />
        ) : (
          leftIcon && <span className="flex items-center">{leftIcon}</span>
        )}

        {/* CONTENT */}
        <span>{children}</span>

        {/* RIGHT ICON */}
        {!loading && rightIcon && (
          <span className="flex items-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"