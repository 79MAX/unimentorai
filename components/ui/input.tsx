"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// =========================
// 🧠 UNI MENTOR AI INPUT SYSTEM
// SHADCN + STRIPE LEVEL FORM PRIMITIVE
// =========================

type InputVariant = "default" | "outline" | "ghost" | "ai"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
  error?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      error = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">

        {/* LEFT ICON */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled || loading}
          aria-busy={loading}
          className={cn(
            // =========================
            // BASE STYLE
            // =========================
            "flex w-full rounded-md border px-3 py-2 text-sm transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",

            // spacing for icons
            leftIcon && "pl-10",
            rightIcon && "pr-10",

            // =========================
            // VARIANTS
            // =========================
            variant === "default" &&
              "bg-white border-gray-300 focus:ring-black",

            variant === "outline" &&
              "bg-transparent border-gray-400 focus:ring-gray-600",

            variant === "ghost" &&
              "bg-gray-100 border-transparent focus:bg-white",

            variant === "ai" &&
              "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 focus:ring-indigo-500 ai-glow",

            // =========================
            // ERROR STATE
            // =========================
            error &&
              "border-red-500 focus:ring-red-500",

            // =========================
            // DISABLED STATE
            // =========================
            disabled &&
              "opacity-50 cursor-not-allowed",

            className
          )}
          {...props}
        />

        {/* RIGHT ICON / LOADING */}
        {rightIcon && !loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"